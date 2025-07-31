import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add headers
    let authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add authorization header if token exists
    const token = this.authService.getToken();
    if (token) {
      authReq = authReq.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    console.log('🌐 HTTP Request:', {
      method: authReq.method,
      url: authReq.url,
      headers: authReq.headers.keys().reduce((acc, key) => {
        acc[key] = authReq.headers.get(key);
        return acc;
      }, {} as any)
    });

    return next.handle(authReq);
  }
}
