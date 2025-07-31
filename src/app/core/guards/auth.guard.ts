import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Check if user has the required role for the route
          const requiredRole = route.data?.['role'];
          if (requiredRole) {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser && currentUser.role === requiredRole) {
              return true;
            } else {
              console.warn('⚠️ Access denied. Required role:', requiredRole, 'User role:', currentUser?.role);
              this.redirectToAppropriateRoute(currentUser?.role);
              return false;
            }
          }
          return true;
        } else {
          console.warn('⚠️ User not authenticated, redirecting to login');
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      })
    );
  }

  private redirectToAppropriateRoute(userRole?: string): void {
    switch (userRole) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'MANAGER':
        this.router.navigate(['/manager/dashboard']);
        break;
      case 'TECHNICIEN':
        this.router.navigate(['/technician/dashboard']);
        break;
      case 'UTILISATEUR':
        this.router.navigate(['/user/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
