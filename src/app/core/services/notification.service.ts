import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface NotificationDTO {
  id: string;
  userId?: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  readStatus: boolean;
  isRead?: boolean; // Alias for readStatus
  createdAt: string;
  readAt?: string;
  data?: any;
  channel: string;
  ticketId?: string;
  assignmentId?: string;
  relatedUserId?: string;
  expiresAt?: string;
}

export interface UnreadCountDTO {
  count: number;
}

export interface NotificationPageDTO {
  notifications: NotificationDTO[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly NOTIFICATION_API_URL = 'http://localhost:8085/api/notifications';
  private readonly WS_URL = 'http://localhost:8085/ws/notifications';

  // Subjects for real-time updates
  private notificationsSubject = new BehaviorSubject<NotificationDTO[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private newNotificationSubject = new Subject<NotificationDTO>();

  // WebSocket connection
  private stompClient: any = null;
  private isConnected = false;

  // Observables
  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();
  public newNotification$ = this.newNotificationSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.initializeWebSocket();
  }

  /**
   * Get HTTP headers with authorization
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('🔑 Token from authService:', token ? 'Token exists' : 'No token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log('🔑 Headers created:', headers.get('Authorization'));
    return headers;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(operation = 'operation') {
    return (error: any): Observable<any> => {
      console.error(`${operation} failed:`, error);
      throw error;
    };
  }

  /**
   * Get notifications for current user
   */
  getNotifications(unreadOnly: boolean = false, limit: number = 50): Observable<NotificationDTO[]> {
    console.log('🔔 Getting notifications - unreadOnly:', unreadOnly, 'limit:', limit);
    console.log('🔔 API URL:', this.NOTIFICATION_API_URL);

    const params = new URLSearchParams();
    params.set('unreadOnly', unreadOnly.toString());
    params.set('limit', limit.toString());

    const url = `${this.NOTIFICATION_API_URL}?${params}`;
    console.log('🔔 Full URL:', url);
    console.log('🔔 Headers:', this.getHeaders());

    return this.http.get<NotificationDTO[]>(url, {
      headers: this.getHeaders()
    }).pipe(
      tap(notifications => {
        console.log('📬 Retrieved notifications:', notifications);
        this.notificationsSubject.next(notifications);
      }),
      catchError((error) => {
        console.error('❌ Error getting notifications:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        return this.handleError('getNotifications')(error);
      })
    );
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<UnreadCountDTO> {
    return this.http.get<UnreadCountDTO>(`${this.NOTIFICATION_API_URL}/count/unread`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => {
        console.log('🔢 Unread count:', response.count);
        this.unreadCountSubject.next(response.count);
      }),
      catchError(this.handleError('getUnreadCount'))
    );
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Observable<void> {
    return this.http.put<void>(`${this.NOTIFICATION_API_URL}/${notificationId}/read`, {}, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        console.log('✅ Marked notification as read:', notificationId);
        // Don't refresh all notifications - let the component handle local state update
        // Only update the unread count
        this.getUnreadCount().subscribe();
      }),
      catchError(this.handleError('markAsRead'))
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.NOTIFICATION_API_URL}/read-all`, {}, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        console.log('✅ Marked all notifications as read');
        // Don't refresh all notifications - let the component handle local state update
        // Only update the unread count
        this.getUnreadCount().subscribe();
      }),
      catchError(this.handleError('markAllAsRead'))
    );
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: string, limit: number = 20): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.NOTIFICATION_API_URL}/type/${type}?limit=${limit}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(notifications => console.log(`📬 Retrieved ${type} notifications:`, notifications)),
      catchError(this.handleError('getNotificationsByType'))
    );
  }

  /**
   * Update notification read status in local state
   */
  updateNotificationReadStatus(notificationId: string, readStatus: boolean): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, readStatus }
        : notification
    );
    this.notificationsSubject.next(updatedNotifications);
    console.log('🔄 Updated notification read status locally:', notificationId, readStatus);
  }

  /**
   * Refresh notifications and unread count
   */
  refreshNotifications(): void {
    this.getNotifications().subscribe();
    this.getUnreadCount().subscribe();
  }

  /**
   * Test if notifications service is accessible
   */
  testNotificationService(): Observable<any> {
    console.log('🧪 Testing notification service health...');
    return this.http.get(`http://localhost:8085/actuator/health`).pipe(
      tap(response => {
        console.log('✅ Notification service is accessible:', response);
      }),
      catchError(error => {
        console.error('❌ Notification service is not accessible:', error);
        throw error;
      })
    );
  }

  /**
   * Initialize WebSocket connection for real-time notifications
   */
  private initializeWebSocket(): void {
    // Note: This would require SockJS and STOMP libraries
    // For now, we'll implement polling as fallback
    console.log('🔌 WebSocket initialization would go here');
    
    // Start polling for notifications every 30 seconds
    setInterval(() => {
      if (this.authService.isAuthenticated()) {
        this.refreshNotifications();
      }
    }, 30000);
  }

  /**
   * Connect to WebSocket (placeholder for future implementation)
   */
  connectWebSocket(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    console.log('🔌 Connecting to WebSocket for user:', currentUser.userId);
    // WebSocket connection logic would go here
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.stompClient && this.isConnected) {
      this.stompClient.disconnect();
      this.isConnected = false;
      console.log('🔌 WebSocket disconnected');
    }
  }

  /**
   * Get current notifications value
   */
  getCurrentNotifications(): NotificationDTO[] {
    return this.notificationsSubject.value;
  }

  /**
   * Get current unread count value
   */
  getCurrentUnreadCount(): number {
    return this.unreadCountSubject.value;
  }
}
