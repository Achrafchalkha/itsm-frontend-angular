import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8081/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private http: HttpClient) {
    this.loadStoredAuth();
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔐 Attempting login with:', credentials);
    console.log('🌐 Request URL:', `${this.API_URL}/login`);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        console.log('✅ Login successful:', response);
        this.setAuthData(response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('📝 Attempting registration with:', userData);
    console.log('🌐 Request URL:', `${this.API_URL}/register`);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        console.log('✅ Registration successful:', response);
        this.setAuthData(response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    console.log('🚪 Logging out user');

    // Check if we're in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('itsm_token');
      localStorage.removeItem('itsm_user');
    }

    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getToken();
  }

  /**
   * Set authentication data
   */
  private setAuthData(authResponse: AuthResponse): void {
    const { token, userId, email, nom, prenom, role } = authResponse;

    // Create user object from response
    const user: User = {
      userId,
      email,
      nom,
      prenom,
      role
    };

    // Check if we're in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('itsm_token', token);
      localStorage.setItem('itsm_user', JSON.stringify(user));
    }

    this.tokenSubject.next(token);
    this.currentUserSubject.next(user);

    console.log('✅ Authentication data set for user:', user.email, 'Role:', user.role);
  }

  /**
   * Load stored authentication data
   */
  private loadStoredAuth(): void {
    // Check if we're in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('itsm_token');
      const userStr = localStorage.getItem('itsm_user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          this.tokenSubject.next(token);
          this.currentUserSubject.next(user);
          console.log('🔄 Restored authentication for:', user.email);
        } catch (error) {
          console.error('❌ Error parsing stored user data:', error);
          this.logout();
        }
      }
    }
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('❌ Auth Service Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.status === 409) {
        errorMessage = 'Email already exists';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request data';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = error.error?.message || `Server error: ${error.status}`;
      }
    }
    
    return throwError(() => ({ message: errorMessage, status: error.status }));
  };
}
