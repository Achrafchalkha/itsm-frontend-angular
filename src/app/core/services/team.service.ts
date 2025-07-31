import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Team {
  id: string;
  nom: string;
  description: string;
  managerId: string;
  dateCreation: string;
  dateModification: string;
  actif: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly API_URL = 'http://localhost:8082/api/assignment/teams';
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  public teams$ = this.teamsSubject.asObservable();

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
   * Get team by ID
   */
  getTeamById(teamId: string): Observable<Team> {
    console.log('🔄 Fetching team by ID:', teamId);
    
    return this.http.get<Team>(`${this.API_URL}/${teamId}`, { 
      headers: this.getHeaders() 
    }).pipe(
      tap(team => {
        console.log('✅ Team fetched successfully:', team.nom);
      }),
      catchError(error => {
        console.error('❌ Error fetching team:', error);
        throw error;
      })
    );
  }

  /**
   * Get all teams
   */
  getAllTeams(): Observable<Team[]> {
    console.log('🔄 Fetching all teams...');
    
    return this.http.get<Team[]>(this.API_URL, { 
      headers: this.getHeaders() 
    }).pipe(
      tap(teams => {
        console.log('✅ Teams fetched successfully:', teams.length);
        this.teamsSubject.next(teams);
      }),
      catchError(error => {
        console.error('❌ Error fetching teams:', error);
        throw error;
      })
    );
  }

  /**
   * Get team name by ID (cached lookup)
   */
  getTeamName(teamId: string | null): string {
    if (!teamId) return 'Aucune équipe';
    
    const teams = this.teamsSubject.value;
    const team = teams.find(t => t.id === teamId);
    return team ? team.nom : 'Équipe inconnue';
  }

  /**
   * Get current teams from subject
   */
  getCurrentTeams(): Team[] {
    return this.teamsSubject.value;
  }
}
