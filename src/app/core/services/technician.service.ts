import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

export interface TechnicianTicketResponse {
  id: string;
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  categorie: string;
  utilisateurId: string;
  technicienId: string;
  teamId?: string;
  enableNlp: boolean;
  dateCreation: string;
  dateModification: string;
  fichiersAttaches?: string;
  dateLimiteSla?: string;
  datePremiereReponse?: string;
  dateFermeture?: string;
  commentaireResolution?: string;
  tempsPremiereReponseMinutes?: number;
  tempsResolutionMinutes?: number;
  slaRespecte?: boolean;
  statutSla?: string;
  nombreReassignations?: number;
}

export interface ResolveTicketRequest {
  solution: string;
}

export interface RequestReassignmentRequest {
  reason: string;
}

export interface AddNoteRequest {
  note: string;
}

export interface TechnicianProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  teamId: string;
  localisation: string;
  telephone: string;
  specialite: string;
  competencesJson: string;
  chargeActuelle: number;
  dateCreation: string;
  dateModification: string;
  actif: boolean;
}

export interface TechnicianDashboardStats {
  totalAssigned: number;
  openTickets: number;
  inProgress: number;
  resolved: number;
  highPriority: number;
  avgResolutionTime: number;
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
  private readonly API_URL = 'http://localhost:8082/api/technician';
  private readonly TICKET_API_URL = 'http://localhost:8083/api';
  private readonly USER_API_URL = 'http://localhost:8082/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Note: getTechnicians() removed - technicians should not list all other technicians
  // This functionality should be in a separate TechnicianManagementService for managers

  // Note: Management methods (getTechnicianById, createTechnician, updateTechnician,
  // deleteTechnician, toggleTechnicianStatus) removed - these should be in TechnicianManagementService for managers

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

  // ==================== TICKET MANAGEMENT METHODS ====================

  /**
   * Get all tickets assigned to current technician
   */
  getMyAssignedTickets(page: number = 0, size: number = 20, sortBy: string = 'assignedAt', sortDir: string = 'desc'): Observable<TechnicianTicketResponse[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<TechnicianTicketResponse[]>(`${this.TICKET_API_URL}/technician/my-tickets`, {
      params,
      headers: this.getHeaders()
    }).pipe(
      tap(tickets => console.log('🎫 Fetched assigned tickets:', tickets)),
      catchError(this.handleError('getMyAssignedTickets'))
    );
  }

  /**
   * Get tickets by status for current technician
   */
  getMyTicketsByStatus(status: string): Observable<TechnicianTicketResponse[]> {
    return this.http.get<TechnicianTicketResponse[]>(`${this.TICKET_API_URL}/technician/my-tickets/status/${status}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(tickets => console.log(`🎫 Fetched tickets with status ${status}:`, tickets)),
      catchError(this.handleError('getMyTicketsByStatus'))
    );
  }

  /**
   * Start working on a ticket (change status to EN_COURS)
   */
  startWorkingOnTicket(ticketId: string): Observable<TechnicianTicketResponse> {
    return this.http.put<TechnicianTicketResponse>(`${this.TICKET_API_URL}/technician/tickets/${ticketId}/start`, {}, {
      headers: this.getHeaders()
    }).pipe(
      tap(ticket => console.log('🚀 Started working on ticket:', ticket)),
      catchError(this.handleError('startWorkingOnTicket'))
    );
  }

  /**
   * Resolve a ticket with solution
   */
  resolveTicket(ticketId: string, solution: string): Observable<TechnicianTicketResponse> {
    const request: ResolveTicketRequest = { solution };
    return this.http.put<TechnicianTicketResponse>(`${this.TICKET_API_URL}/technician/tickets/${ticketId}/resolve`, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(ticket => console.log('✅ Resolved ticket:', ticket)),
      catchError(this.handleError('resolveTicket'))
    );
  }

  /**
   * Request reassignment of a ticket
   */
  requestReassignment(ticketId: string, reason: string): Observable<void> {
    const request: RequestReassignmentRequest = { reason };
    return this.http.put<void>(`${this.TICKET_API_URL}/technician/tickets/${ticketId}/request-reassignment`, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('🔄 Requested reassignment for ticket:', ticketId)),
      catchError(this.handleError('requestReassignment'))
    );
  }

  /**
   * Add a technical note to a ticket
   */
  addTechnicalNote(ticketId: string, note: string): Observable<any> {
    const request: AddNoteRequest = { note };
    return this.http.post<any>(`${this.TICKET_API_URL}/technician/tickets/${ticketId}/notes`, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('📝 Added technical note to ticket:', ticketId, response)),
      catchError(this.handleError('addTechnicalNote'))
    );
  }

  /**
   * Get current technician's profile with competences
   */
  getMyProfile(): Observable<TechnicianProfile> {
    return this.http.get<TechnicianProfile>(`${this.USER_API_URL}/technician/profile`, {
      headers: this.getHeaders()
    }).pipe(
      tap(profile => console.log('👤 Retrieved technician profile:', profile)),
      catchError(this.handleError('getMyProfile'))
    );
  }

  /**
   * Get current technician's detailed profile (alternative endpoint)
   * Equivalent to manager's GET /technicians/{id} but for self-access
   */
  getMyDetailedProfile(): Observable<TechnicianProfile> {
    return this.http.get<TechnicianProfile>(`${this.USER_API_URL}/technician/me`, {
      headers: this.getHeaders()
    }).pipe(
      tap(profile => console.log('👤 Retrieved detailed technician profile:', profile)),
      catchError(this.handleError('getMyDetailedProfile'))
    );
  }

  /**
   * Get technician's own profile by ID (same pattern as manager endpoint)
   * Equivalent to GET /api/manager/technicians/{technicianId} but for technician's own access
   * URL: GET /api/technician/technicians/{technicianId}
   */
  getMyProfileById(technicianId: string): Observable<TechnicianProfile> {
    return this.http.get<TechnicianProfile>(`${this.USER_API_URL}/technician/technicians/${technicianId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(profile => console.log('👤 Retrieved technician profile by ID:', profile)),
      catchError(this.handleError('getMyProfileById'))
    );
  }

  /**
   * Get technician dashboard statistics
   */
  getDashboardStats(): Observable<TechnicianDashboardStats> {
    return this.http.get<TechnicianDashboardStats>(`${this.TICKET_API_URL}/technician/dashboard`, {
      headers: this.getHeaders()
    }).pipe(
      tap(stats => console.log('📊 Dashboard stats:', stats)),
      catchError(this.handleError('getDashboardStats'))
    );
  }

  /**
   * Debug endpoint to check all tickets
   */
  debugAllTickets(): Observable<string> {
    return this.http.get(`${this.TICKET_API_URL}/technician/debug/all-tickets`, {
      responseType: 'text',
      headers: this.getHeaders()
    }).pipe(
      tap(debug => console.log('🐛 Debug info:', debug)),
      catchError(this.handleError('debugAllTickets'))
    );
  }

  // ==================== UTILITY METHODS FOR TICKETS ====================

  /**
   * Format status for display
   */
  formatStatus(status: string): { label: string; color: string } {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      'NOUVEAU': { label: 'Nouveau', color: 'bg-gray-500/20 text-gray-400' },
      'OUVERT': { label: 'Ouvert', color: 'bg-blue-500/20 text-blue-400' },
      'EN_COURS': { label: 'En Cours', color: 'bg-orange-500/20 text-orange-400' },
      'EN_ATTENTE': { label: 'En Attente', color: 'bg-yellow-500/20 text-yellow-400' },
      'RESOLU': { label: 'Résolu', color: 'bg-green-500/20 text-green-400' },
      'FERME': { label: 'Fermé', color: 'bg-slate-500/20 text-slate-400' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-500/20 text-gray-400' };
  }

  /**
   * Format priority for display
   */
  formatPriority(priority: string): { label: string; color: string } {
    const priorityMap: { [key: string]: { label: string; color: string } } = {
      'BASSE': { label: 'Basse', color: 'bg-green-500/20 text-green-400' },
      'NORMALE': { label: 'Normale', color: 'bg-blue-500/20 text-blue-400' },
      'HAUTE': { label: 'Haute', color: 'bg-orange-500/20 text-orange-400' },
      'CRITIQUE': { label: 'Critique', color: 'bg-red-500/20 text-red-400' }
    };
    return priorityMap[priority] || { label: priority, color: 'bg-gray-500/20 text-gray-400' };
  }

  /**
   * Format date for display
   */
  formatTicketDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `Il y a ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  /**
   * Get ticket ID display format
   */
  getTicketDisplayId(ticket: TechnicianTicketResponse): string {
    return `#TK-${ticket.id.substring(0, 8).toUpperCase()}`;
  }
}
