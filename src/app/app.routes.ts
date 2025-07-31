import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent)
  },
  // Role-based dashboard routes
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'manager/dashboard',
    loadComponent: () => import('./pages/manager-dashboard.component').then(m => m.ManagerDashboardComponent)
  },
  {
    path: 'technician/dashboard',
    loadComponent: () => import('./pages/technician-dashboard.component').then(m => m.TechnicianDashboardComponent)
  },
  {
    path: 'user/dashboard',
    loadComponent: () => import('./pages/user-dashboard.component').then(m => m.UserDashboardComponent)
  },
  // Fallback routes
  { path: 'dashboard', redirectTo: '/user/dashboard' },
  { path: '**', redirectTo: '/login' }
];
