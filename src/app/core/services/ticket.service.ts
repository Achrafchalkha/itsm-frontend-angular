import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

// Interfaces pour les tickets
export interface CreateTicketRequest {
  titre: string;
  description: string;
  priorite?: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  categorie?: string;
  localisation?: string;
  equipementConcerne?: string;
  enableNlp?: boolean;
  fichiersAttaches?: string; // JSON string of attached files
}

export interface TicketResponse {
  id: string;
  titre: string;
  description: string;
  priorite: string;
  categorie: string;
  statut: 'OUVERT' | 'EN_COURS' | 'FERME' | 'ANNULE';
  utilisateurId: string;
  technicienId?: string;
  dateCreation: string;
  dateModification: string;
  dateFermeture?: string;
  solution?: string;
  notesInternes?: string;
  localisation?: string;
  equipementConcerne?: string;
  fichiersAttaches?: string; // JSON string of attached files
  actif: boolean;
}

export interface AddCommentRequest {
  ticketId: string;
  commentaire: string;
}

export interface CommentResponse {
  id: string;
  ticketId: string;
  utilisateurId: string;
  commentaire: string;
  dateCreation: string;
  auteur: string;
}

export interface EvaluationRequest {
  ticketId: string;
  note: number; // 1-5
  commentaire?: string;
}

export interface EvaluationResponse {
  id: string;
  ticketId: string;
  utilisateurId: string;
  note: number;
  commentaire?: string;
  dateEvaluation: string;
}

export interface UserTicketStats {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  pendingEvaluations: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly TICKET_API_URL = 'http://localhost:8083/api/tickets';
  private readonly TECHNICIAN_API_URL = 'http://localhost:8083/api/technician';

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
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`❌ ${operation} failed:`, error);
      
      let errorMessage = 'Une erreur est survenue';
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return throwError(() => new Error(errorMessage));
    };
  }

  // ==================== TICKET CRUD OPERATIONS ====================

  /**
   * Create a new ticket
   */
  createTicket(request: CreateTicketRequest): Observable<TicketResponse> {
    console.log('🎫 Creating ticket:', request);
    
    return this.http.post<TicketResponse>(this.TICKET_API_URL, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Ticket created:', response)),
      catchError(this.handleError('createTicket'))
    );
  }

  /**
   * Get tickets for current user
   */
  getUserTickets(): Observable<TicketResponse[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const url = `${this.TICKET_API_URL}/user/${currentUser.userId}`;
    console.log('🎫 Getting user tickets from:', url);
    
    return this.http.get<TicketResponse[]>(url, {
      headers: this.getHeaders()
    }).pipe(
      tap(tickets => console.log('✅ User tickets loaded:', tickets.length)),
      catchError(this.handleError('getUserTickets'))
    );
  }

  /**
   * Get ticket by ID
   */
  getTicketById(ticketId: string): Observable<TicketResponse> {
    console.log('🎫 Getting ticket:', ticketId);
    
    return this.http.get<TicketResponse>(`${this.TICKET_API_URL}/${ticketId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(ticket => console.log('✅ Ticket loaded:', ticket)),
      catchError(this.handleError('getTicketById'))
    );
  }

  /**
   * Delete ticket (soft delete)
   */
  deleteTicket(ticketId: string): Observable<void> {
    console.log('🗑️ Deleting ticket:', ticketId);
    
    return this.http.delete<void>(`${this.TICKET_API_URL}/${ticketId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('✅ Ticket deleted:', ticketId)),
      catchError(this.handleError('deleteTicket'))
    );
  }

  // ==================== COMMENTS ====================

  /**
   * Add comment to ticket
   */
  addComment(request: AddCommentRequest): Observable<CommentResponse> {
    console.log('💬 Adding comment to ticket:', request.ticketId);
    
    // Using technician endpoint for adding notes (comments)
    const url = `${this.TECHNICIAN_API_URL}/tickets/${request.ticketId}/notes`;
    const noteRequest = { note: request.commentaire };
    
    return this.http.post<CommentResponse>(url, noteRequest, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Comment added:', response)),
      catchError(this.handleError('addComment'))
    );
  }

  /**
   * Get comments for ticket
   */
  getTicketComments(ticketId: string): Observable<CommentResponse[]> {
    console.log('💬 Getting comments for ticket:', ticketId);
    
    // This endpoint might need to be implemented in the backend
    return this.http.get<CommentResponse[]>(`${this.TICKET_API_URL}/${ticketId}/comments`, {
      headers: this.getHeaders()
    }).pipe(
      tap(comments => console.log('✅ Comments loaded:', comments.length)),
      catchError(this.handleError('getTicketComments'))
    );
  }

  // ==================== EVALUATIONS ====================

  /**
   * Submit evaluation for closed ticket
   */
  submitEvaluation(request: EvaluationRequest): Observable<EvaluationResponse> {
    console.log('⭐ Submitting evaluation for ticket:', request.ticketId);
    
    // This endpoint might need to be implemented in the backend
    return this.http.post<EvaluationResponse>(`${this.TICKET_API_URL}/${request.ticketId}/evaluation`, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Evaluation submitted:', response)),
      catchError(this.handleError('submitEvaluation'))
    );
  }

  /**
   * Get user's evaluations
   */
  getUserEvaluations(): Observable<EvaluationResponse[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    console.log('⭐ Getting user evaluations');
    
    return this.http.get<EvaluationResponse[]>(`${this.TICKET_API_URL}/user/${currentUser.userId}/evaluations`, {
      headers: this.getHeaders()
    }).pipe(
      tap(evaluations => console.log('✅ Evaluations loaded:', evaluations.length)),
      catchError(this.handleError('getUserEvaluations'))
    );
  }

  /**
   * Get tickets pending evaluation
   */
  getTicketsPendingEvaluation(): Observable<TicketResponse[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    console.log('⭐ Getting tickets pending evaluation');
    
    return this.http.get<TicketResponse[]>(`${this.TICKET_API_URL}/user/${currentUser.userId}/pending-evaluation`, {
      headers: this.getHeaders()
    }).pipe(
      tap(tickets => console.log('✅ Pending evaluation tickets loaded:', tickets.length)),
      catchError(this.handleError('getTicketsPendingEvaluation'))
    );
  }

  // ==================== STATISTICS ====================

  /**
   * Get user ticket statistics
   */
  getUserTicketStats(): Observable<UserTicketStats> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    console.log('📊 Getting user ticket statistics');
    
    return this.http.get<UserTicketStats>(`${this.TICKET_API_URL}/user/${currentUser.userId}/stats`, {
      headers: this.getHeaders()
    }).pipe(
      tap(stats => console.log('✅ User stats loaded:', stats)),
      catchError(this.handleError('getUserTicketStats'))
    );
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get priority color class
   */
  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'BASSE': 'bg-green-500/20 text-green-400',
      'MOYENNE': 'bg-blue-500/20 text-blue-400',
      'HAUTE': 'bg-orange-500/20 text-orange-400',
      'CRITIQUE': 'bg-red-500/20 text-red-400'
    };
    return colors[priority] || 'bg-slate-500/20 text-slate-400';
  }

  /**
   * Get status color class
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'OUVERT': 'bg-blue-500/20 text-blue-400',
      'EN_COURS': 'bg-yellow-500/20 text-yellow-400',
      'FERME': 'bg-green-500/20 text-green-400',
      'ANNULE': 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
  }

  /**
   * Get category options
   */
  getCategoryOptions(): string[] {
    return [
      'MATERIEL',
      'LOGICIEL',
      'RESEAU',
      'ACCES',
      'SECURITE',
      'AUTRE'
    ];
  }

  /**
   * Get priority options
   */
  getPriorityOptions(): string[] {
    return [
      'BASSE',
      'MOYENNE',
      'HAUTE',
      'CRITIQUE'
    ];
  }
}
