import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Manager {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  role?: string;
  teamId?: string;
  teamName?: string;
  teamDescription?: string;
  teamCategories?: string[];
  localisation: string;
  telephone: string;
  specialite: string;
  competencesJson?: string;
  chargeActuelle?: number;
  dateCreation?: string;
  dateModification?: string;
  actif?: boolean;
}

export interface CreateManagerRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  localisation: string;
  telephone: string;
  specialite: string;
  teamName: string;
  teamDescription: string;
  teamCategories: string[];
}

export interface UpdateManagerRequest {
  nom: string;
  prenom: string;
  email: string;
  localisation: string;
  telephone: string;
  specialite: string;
  teamName: string;
  teamDescription: string;
  teamCategories: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private readonly API_URL = 'http://localhost:8082/api/admin/managers';
  private managersSubject = new BehaviorSubject<Manager[]>([]);
  public managers$ = this.managersSubject.asObservable();

  // Available categories for teams
  public readonly TEAM_CATEGORIES = [
    'DEVELOPPEMENT',
    'DEVOPS',
    'CLOUD',
    'INFRASTRUCTURE',
    'SECURITE',
    'RESEAU',
    'SUPPORT',
    'MAINTENANCE',
    'FORMATION',
    'QUALITE'
  ];

  // Available specialties
  public readonly SPECIALITES = [
    'Développement Logiciel',
    'Infrastructure IT',
    'Sécurité Informatique',
    'Réseaux et Télécoms',
    'Support Technique',
    'DevOps et Cloud',
    'Gestion de Projet IT',
    'Architecture Système',
    'Base de Données',
    'Cybersécurité'
  ];

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
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Get all managers with team information from API
   */
  getAllManagers(): Observable<Manager[]> {
    console.log('🔄 Fetching all managers with team info from API...');

    return this.http.get<Manager[]>(this.API_URL, {
      headers: this.getHeaders()
    }).pipe(
      tap(managers => {
        console.log('✅ Managers with team info fetched successfully:', managers.length);
        console.log('📥 Sample manager data:', managers[0]);
        this.managersSubject.next(managers);
      }),
      catchError(error => {
        console.error('❌ Error fetching managers from API:', error);
        this.managersSubject.next([]);
        throw error;
      })
    );
  }

  /**
   * Get manager by ID from real API
   */
  getManagerById(id: string): Observable<Manager> {
    console.log('🔄 Fetching manager by ID from API:', id);

    return this.http.get<Manager>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(manager => {
        console.log('✅ Manager fetched successfully:', manager.email || manager.id);
      }),
      catchError(error => {
        console.error('❌ Error fetching manager from API:', error);
        throw error;
      })
    );
  }

  /**
   * Create new manager via real API
   */
  createManager(managerData: CreateManagerRequest): Observable<Manager> {
    console.log('🔄 Creating new manager via API:', managerData.email);
    console.log('📤 Manager data being sent:', managerData);

    return this.http.post<Manager>(this.API_URL, managerData, {
      headers: this.getHeaders()
    }).pipe(
      tap(manager => {
        console.log('✅ Manager created successfully via API:', manager.email || manager.id);
        // Refresh the managers list
        this.getAllManagers().subscribe();
      }),
      catchError(error => {
        console.error('❌ Error creating manager via API:', error);
        console.error('📤 Failed request data:', managerData);
        throw error;
      })
    );
  }

  /**
   * Update existing manager via real API
   */
  updateManager(id: string, managerData: UpdateManagerRequest): Observable<Manager> {
    console.log('🔄 Updating manager via API:', id);
    console.log('📤 Update data being sent:', managerData);

    return this.http.put<Manager>(`${this.API_URL}/${id}`, managerData, {
      headers: this.getHeaders()
    }).pipe(
      tap(manager => {
        console.log('✅ Manager updated successfully via API:', manager.email || manager.id);
        // Refresh the managers list
        this.getAllManagers().subscribe();
      }),
      catchError(error => {
        console.error('❌ Error updating manager via API:', error);
        console.error('📤 Failed update data:', managerData);
        throw error;
      })
    );
  }

  /**
   * Delete manager via real API
   */
  deleteManager(id: string): Observable<any> {
    console.log('🔄 Deleting manager via API:', id);

    return this.http.delete(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        console.log('✅ Manager deleted successfully via API');
        // Refresh the managers list
        this.getAllManagers().subscribe();
      }),
      catchError(error => {
        console.error('❌ Error deleting manager via API:', error);
        throw error;
      })
    );
  }

  /**
   * Search managers by criteria (client-side filtering from real API data)
   */
  searchManagers(searchTerm: string): Observable<Manager[]> {
    console.log('🔍 Searching managers with term:', searchTerm);

    // Get all managers from API and filter client-side
    return this.getAllManagers().pipe(
      map(managers => {
        if (!searchTerm || searchTerm.trim() === '') {
          return managers;
        }

        const term = searchTerm.toLowerCase().trim();
        const filteredManagers = managers.filter(manager =>
          manager.nom.toLowerCase().includes(term) ||
          manager.prenom.toLowerCase().includes(term) ||
          manager.email.toLowerCase().includes(term) ||
          (manager.specialite && manager.specialite.toLowerCase().includes(term)) ||
          (manager.teamName && manager.teamName.toLowerCase().includes(term)) ||
          (manager.localisation && manager.localisation.toLowerCase().includes(term))
        );

        console.log('✅ Managers search completed:', filteredManagers.length, 'results');
        return filteredManagers;
      }),
      tap(filteredManagers => {
        this.managersSubject.next(filteredManagers);
      }),
      catchError(error => {
        console.error('❌ Error searching managers:', error);
        throw error;
      })
    );
  }

  /**
   * Get current managers from subject
   */
  getCurrentManagers(): Manager[] {
    return this.managersSubject.value;
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+33|0)[1-9](\s?\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Generate strong password
   */
  generatePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
