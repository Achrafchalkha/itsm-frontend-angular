import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface FileUploadResponse {
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  url: string;
}

export interface AttachedFile {
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private readonly UPLOAD_API_URL = 'http://localhost:8083/api/files';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get HTTP headers with authorization
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`❌ ${operation} failed:`, error);
      
      let errorMessage = 'Une erreur est survenue lors du téléchargement';
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return throwError(() => new Error(errorMessage));
    };
  }

  /**
   * Upload a single file (convert to base64 for local storage)
   */
  uploadFile(file: File): Observable<FileUploadResponse> {
    console.log('📎 Processing file:', file.name, 'Size:', this.formatFileSize(file.size));

    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result as string;
        const response: FileUploadResponse = {
          fileName: `${Date.now()}_${file.name}`,
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          uploadDate: new Date().toISOString(),
          url: base64Data // Store base64 data as URL for now
        };

        console.log('✅ File processed:', response.fileName);
        observer.next(response);
        observer.complete();
      };

      reader.onerror = () => {
        console.error('❌ Error reading file:', file.name);
        observer.error(new Error('Erreur lors de la lecture du fichier'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload multiple files
   */
  uploadFiles(files: File[]): Observable<FileUploadResponse[]> {
    console.log('📎 Uploading multiple files:', files.length);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post<FileUploadResponse[]>(`${this.UPLOAD_API_URL}/multiple`, formData, {
      headers: this.getHeaders()
    }).pipe(
      tap(responses => console.log('✅ Files uploaded:', responses.length)),
      catchError(this.handleError('uploadFiles'))
    );
  }

  /**
   * Delete uploaded file (local storage - just return success)
   */
  deleteFile(fileName: string): Observable<void> {
    console.log('🗑️ Removing file from local storage:', fileName);

    return new Observable(observer => {
      // For local storage, we just simulate success
      setTimeout(() => {
        console.log('✅ File removed:', fileName);
        observer.next();
        observer.complete();
      }, 100);
    });
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (100MB max - increased from 10MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Le fichier est trop volumineux. Taille maximale: ${this.formatFileSize(maxSize)}`
      };
    }

    // Check file type - More permissive validation
    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      // Documents
      'application/pdf',
      'text/plain',
      'text/csv',
      // Microsoft Office
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Archives
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      // Other common types
      'application/json',
      'application/xml',
      'text/xml',
      'text/html',
      'application/rtf'
    ];

    // If file type is not in allowed list, check by extension as fallback
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg',
        '.pdf', '.txt', '.csv', '.doc', '.docx', '.xls', '.xlsx',
        '.ppt', '.pptx', '.zip', '.rar', '.7z', '.json', '.xml',
        '.html', '.rtf'
      ];

      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (!allowedExtensions.includes(fileExtension)) {
        return {
          valid: false,
          error: `Type de fichier non autorisé: ${file.type || 'inconnu'}. Types acceptés: Images, PDF, Documents Office, Archives, Texte`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file icon based on mime type
   */
  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) {
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>`;
    } else if (mimeType === 'application/pdf') {
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>`;
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>`;
    } else if (mimeType.includes('excel') || mimeType.includes('sheet')) {
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v14l11-7z"></path>
      </svg>`;
    } else {
      return `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>`;
    }
  }

  /**
   * Convert files to JSON format for backend storage
   */
  filesToJson(files: AttachedFile[]): string {
    return JSON.stringify(files);
  }

  /**
   * Parse JSON files from backend
   */
  parseFilesFromJson(jsonString: string): AttachedFile[] {
    if (!jsonString) return [];
    
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing files JSON:', error);
      return [];
    }
  }
}
