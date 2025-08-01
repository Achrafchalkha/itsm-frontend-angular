import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Competence {
  nom: string;
  description: string;
  categorie: 'SECURITE' | 'AUDIT' | 'CONFORMITE' | 'RESEAU' | 'SYSTEME' | 'DEVELOPPEMENT';
  niveau: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE' | 'EXPERT' | 'SENIOR';
}

export interface CreateTechnicianRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  localisation: string;
  telephone: string;
  specialite: string;
  competences: Competence[];
}

export interface UpdateTechnicianRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  localisation?: string;
  specialite?: string;
  competences?: Competence[];
}

export interface TechnicianResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  teamId: string;
  localisation: string;
  telephone: string;
  specialite: string;
  competencesJson: string;  // JSON string from backend
  competences?: Competence[];  // Optional parsed competences for forms
  chargeActuelle: number;
  dateCreation: string;
  dateModification: string;
  actif: boolean;
}

export interface CreateTechnicianResponse {
  technicianId: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  teamId: string;
  message: string;
}

export interface TechnicianStats {
  totalTechnicians: number;
  activeTechnicians: number;
  inactiveTechnicians: number;
  averageWorkload: number;
  teamId: string;
  managerName: string;
}

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private readonly API_URL = 'http://localhost:8082/api/manager/technicians';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get all technicians managed by current manager
   */
  getTechnicians(): Observable<TechnicianResponse[]> {
    const token = this.authService.getToken();
    console.log('🔍 Getting technicians with token:', token ? 'Present' : 'Missing');
    console.log('🔍 Current user:', this.authService.getCurrentUser());

    return this.http.get<TechnicianResponse[]>(this.API_URL, {
      headers: this.getHeaders()
    }).pipe(
      tap(technicians => console.log('✅ Technicians loaded:', technicians.length)),
      catchError(this.handleError('getTechnicians'))
    );
  }

  /**
   * Get technician by ID
   */
  getTechnicianById(id: string): Observable<TechnicianResponse> {
    return this.http.get<TechnicianResponse>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(technician => console.log('✅ Technician loaded:', technician.email)),
      catchError(this.handleError('getTechnicianById'))
    );
  }

  /**
   * Create new technician
   */
  createTechnician(request: CreateTechnicianRequest): Observable<CreateTechnicianResponse> {
    return this.http.post<CreateTechnicianResponse>(this.API_URL, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Technician created:', response.email)),
      catchError(this.handleError('createTechnician'))
    );
  }

  /**
   * Update technician
   */
  updateTechnician(id: string, request: UpdateTechnicianRequest): Observable<TechnicianResponse> {
    return this.http.put<TechnicianResponse>(`${this.API_URL}/${id}`, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(technician => console.log('✅ Technician updated:', technician.email)),
      catchError(this.handleError('updateTechnician'))
    );
  }

  /**
   * Delete technician
   */
  deleteTechnician(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('✅ Technician deleted:', id)),
      catchError(this.handleError('deleteTechnician'))
    );
  }

  /**
   * Toggle technician status (activate/deactivate)
   */
  toggleTechnicianStatus(id: string, active: boolean): Observable<any> {
    if (active) {
      // Reactivate technician
      return this.http.post<any>(`${this.API_URL}/${id}/reactivate`, {}, {
        headers: this.getHeaders()
      }).pipe(
        tap(() => console.log('✅ Technician reactivated:', id)),
        catchError(this.handleError('reactivateTechnician'))
      );
    } else {
      // Deactivate technician (soft delete)
      return this.http.delete<void>(`${this.API_URL}/${id}`, {
        headers: this.getHeaders()
      }).pipe(
        tap(() => console.log('✅ Technician deactivated:', id)),
        catchError(this.handleError('deactivateTechnician'))
      );
    }
  }

  /**
   * Get technician statistics (mock data for now)
   */
  getTechnicianStats(): Observable<TechnicianStats> {
    // Return mock stats since the endpoint doesn't exist yet
    const mockStats: TechnicianStats = {
      totalTechnicians: 0,
      activeTechnicians: 0,
      inactiveTechnicians: 0,
      averageWorkload: 0,
      teamId: '',
      managerName: 'Manager'
    };

    return new Observable(observer => {
      observer.next(mockStats);
      observer.complete();
    });
  }

  /**
   * Get HTTP headers with authorization
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(`❌ ${operation} failed:`, error);
      
      let errorMessage = 'Une erreur est survenue';
      
      if (error.status === 401) {
        errorMessage = 'Non autorisé - Veuillez vous reconnecter';
      } else if (error.status === 403) {
        errorMessage = 'Accès refusé - Permissions insuffisantes';
      } else if (error.status === 404) {
        errorMessage = 'Technicien non trouvé';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Données invalides';
      } else if (error.status === 0) {
        errorMessage = 'Impossible de contacter le serveur';
      }
      
      return throwError(() => new Error(errorMessage));
    };
  }

  /**
   * Get competence categories for forms
   */
  getCompetenceCategories(): string[] {
    return ['SECURITE', 'AUDIT', 'CONFORMITE', 'RESEAU', 'SYSTEME', 'DEVELOPPEMENT'];
  }

  /**
   * Get competence levels for forms
   */
  getCompetenceLevels(): string[] {
    return ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT', 'SENIOR'];
  }

  /**
   * Get category color for UI
   */
  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'SECURITE': 'bg-red-500/20 text-red-300',
      'AUDIT': 'bg-orange-500/20 text-orange-300',
      'CONFORMITE': 'bg-yellow-500/20 text-yellow-300',
      'RESEAU': 'bg-blue-500/20 text-blue-300',
      'SYSTEME': 'bg-green-500/20 text-green-300',
      'DEVELOPPEMENT': 'bg-purple-500/20 text-purple-300'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300';
  }

  /**
   * Get level color for UI
   */
  getLevelColor(niveau: string): string {
    const colors: { [key: string]: string } = {
      'DEBUTANT': 'bg-gray-500/20 text-gray-300',
      'INTERMEDIAIRE': 'bg-blue-500/20 text-blue-300',
      'AVANCE': 'bg-green-500/20 text-green-300',
      'EXPERT': 'bg-orange-500/20 text-orange-300',
      'SENIOR': 'bg-red-500/20 text-red-300'
    };
    return colors[niveau] || 'bg-gray-500/20 text-gray-300';
  }
}
