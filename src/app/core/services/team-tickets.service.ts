import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

// Interface for Team Ticket Response
export interface TeamTicketResponse {
  id: string;
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  categorie: string;
  utilisateurId: string;
  technicienId?: string;
  teamId?: string;
  dateCreation: string;
  dateModification?: string;
  dateResolution?: string;
  dateFermeture?: string;
  solution?: string;
  commentaireResolution?: string;
  // Technician information
  technicienNom?: string;
  technicienPrenom?: string;
  technicienEmail?: string;
  technicienSpecialite?: string;
}

// Interface for Team Dashboard Response
export interface TeamDashboardResponse {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  averageResolutionTime: number;
  technicianStats: TechnicianStats[];
}

// Interface for Technician Statistics
export interface TechnicianStats {
  technicianId: string;
  technicianName: string;
  assignedTickets: number;
  resolvedTickets: number;
  resolutionRate: number;
}

// Interface for Team Tickets Query Parameters
export interface TeamTicketsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  status?: string;
  priority?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamTicketsService {
  private readonly API_URL = 'http://localhost:8083/api/manager';

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
   * Get all team tickets with optional filtering and pagination
   */
  getTeamTickets(params: TeamTicketsParams = {}): Observable<TeamTicketResponse[]> {
    console.log('🎫 Getting team tickets with params:', params);

    let httpParams = new HttpParams();
    
    // Add pagination parameters
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDir) httpParams = httpParams.set('sortDir', params.sortDir);
    
    // Add filter parameters
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.priority) httpParams = httpParams.set('priority', params.priority);

    return this.http.get<TeamTicketResponse[]>(`${this.API_URL}/team/tickets`, {
      headers: this.getHeaders(),
      params: httpParams
    }).pipe(
      tap(tickets => console.log('✅ Team tickets loaded:', tickets.length)),
      catchError(this.handleError('getTeamTickets'))
    );
  }

  /**
   * Get team tickets by status
   */
  getTeamTicketsByStatus(status: string): Observable<TeamTicketResponse[]> {
    console.log('🎫 Getting team tickets by status:', status);

    return this.http.get<TeamTicketResponse[]>(`${this.API_URL}/team/tickets/status/${status}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(tickets => console.log(`✅ Team tickets with status ${status} loaded:`, tickets.length)),
      catchError(this.handleError('getTeamTicketsByStatus'))
    );
  }

  /**
   * Get ticket details (for team tickets only)
   */
  getTicketDetails(ticketId: string): Observable<TeamTicketResponse> {
    console.log('🎫 Getting ticket details:', ticketId);

    return this.http.get<TeamTicketResponse>(`${this.API_URL}/tickets/${ticketId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(ticket => console.log('✅ Ticket details loaded:', ticket.titre)),
      catchError(this.handleError('getTicketDetails'))
    );
  }

  /**
   * Get team dashboard statistics
   */
  getTeamDashboard(): Observable<TeamDashboardResponse> {
    console.log('📊 Getting team dashboard');

    return this.http.get<TeamDashboardResponse>(`${this.API_URL}/team/dashboard`, {
      headers: this.getHeaders()
    }).pipe(
      tap(dashboard => console.log('✅ Team dashboard loaded:', dashboard)),
      catchError(this.handleError('getTeamDashboard'))
    );
  }

  /**
   * Get status label in French
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'OUVERT':
        return 'Ouvert';
      case 'EN_COURS':
        return 'En cours';
      case 'RESOLU':
        return 'Résolu';
      case 'FERME':
        return 'Fermé';
      default:
        return status;
    }
  }

  /**
   * Get priority label in French
   */
  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'FAIBLE':
        return 'Faible';
      case 'NORMALE':
        return 'Normale';
      case 'ELEVEE':
        return 'Élevée';
      case 'CRITIQUE':
        return 'Critique';
      default:
        return priority;
    }
  }

  /**
   * Get status color class
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'OUVERT':
        return 'bg-blue-500 text-white';
      case 'EN_COURS':
        return 'bg-yellow-500 text-white';
      case 'RESOLU':
        return 'bg-green-500 text-white';
      case 'FERME':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  }

  /**
   * Get priority color class
   */
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'FAIBLE':
        return 'text-green-400';
      case 'NORMALE':
        return 'text-blue-400';
      case 'ELEVEE':
        return 'text-yellow-400';
      case 'CRITIQUE':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get relative time (e.g., "Il y a 2 heures")
   */
  getRelativeTime(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    
    return this.formatDate(dateString);
  }
}
