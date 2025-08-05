import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

// Interfaces for Technician Management
export interface TechnicianResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialite?: string;
  localisation?: string;
  competencesJson?: string;
  chargeActuelle?: number;
  actif: boolean;
  dateCreation: string;
  dateModification?: string;
  teamId?: string;
}

export interface CreateTechnicianRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  specialite?: string;
  localisation?: string;
  competencesJson?: string;
  teamId?: string;
}

export interface CreateTechnicianResponse {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialite?: string;
  localisation?: string;
  actif: boolean;
  dateCreation: string;
  teamId?: string;
}

export interface UpdateTechnicianRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  specialite?: string;
  localisation?: string;
  competencesJson?: string;
  chargeActuelle?: number;
  teamId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TechnicianManagementService {
  private readonly API_URL = 'http://localhost:8082/api/manager/technicians';

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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      console.error(`${operation} failed:`, error);
      return throwError(() => error);
    };
  }

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
   * Get technician statistics
   */
  getTechnicianStats(technicianId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${technicianId}/stats`, {
      headers: this.getHeaders()
    }).pipe(
      tap(stats => console.log('📊 Technician stats:', stats)),
      catchError(this.handleError('getTechnicianStats'))
    );
  }

  /**
   * Assign technician to team
   */
  assignToTeam(technicianId: string, teamId: string): Observable<TechnicianResponse> {
    return this.http.put<TechnicianResponse>(`${this.API_URL}/${technicianId}/team`, { teamId }, {
      headers: this.getHeaders()
    }).pipe(
      tap(technician => console.log('✅ Technician assigned to team:', technician.email)),
      catchError(this.handleError('assignToTeam'))
    );
  }

  /**
   * Update technician competences
   */
  updateCompetences(technicianId: string, competencesJson: string): Observable<TechnicianResponse> {
    return this.http.put<TechnicianResponse>(`${this.API_URL}/${technicianId}/competences`, 
      { competencesJson }, {
      headers: this.getHeaders()
    }).pipe(
      tap(technician => console.log('✅ Technician competences updated:', technician.email)),
      catchError(this.handleError('updateCompetences'))
    );
  }
}
