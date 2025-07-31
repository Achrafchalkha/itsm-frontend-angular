import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/auth.interface';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-900">
      <!-- Header -->
      <header class="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo & Title -->
            <div class="flex items-center">
              <div class="h-10 w-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-white">ITSM User Portal</h1>
                <p class="text-sm text-slate-400">Service Requests & Support</p>
              </div>
            </div>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm font-medium text-white">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
                <p class="text-xs text-emerald-400 font-semibold">{{ currentUser?.role }}</p>
              </div>
              <div class="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">{{ getUserInitials() }}</span>
              </div>
              <button
                (click)="logout()"
                class="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
                title="Logout"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">Welcome, {{ currentUser?.prenom }}!</h2>
          <p class="text-slate-400">Submit requests, track tickets, and access IT services.</p>
        </div>

        <!-- Quick Actions -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="flex items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors">
              <div class="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="text-white font-medium">New Request</p>
                <p class="text-slate-400 text-sm">Submit a service request</p>
              </div>
            </button>

            <button class="flex items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
              <div class="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="text-white font-medium">Get Support</p>
                <p class="text-slate-400 text-sm">Contact IT support</p>
              </div>
            </button>

            <button class="flex items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
              <div class="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="text-white font-medium">Knowledge Base</p>
                <p class="text-slate-400 text-sm">Browse help articles</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">My Requests</p>
                <p class="text-2xl font-bold text-white">5</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">In Progress</p>
                <p class="text-2xl font-bold text-white">2</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Completed</p>
                <p class="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Satisfaction</p>
                <p class="text-2xl font-bold text-white">4.8</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- IT Support -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">IT Support</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Get help with technical issues and troubleshooting.</p>
            <button class="text-blue-400 hover:text-blue-300 text-sm font-medium">Request Support →</button>
          </div>

          <!-- Software Requests -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Software Requests</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Request new software installations or updates.</p>
            <button class="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Request Software →</button>
          </div>

          <!-- Hardware Requests -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Hardware Requests</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Request new equipment or hardware repairs.</p>
            <button class="text-purple-400 hover:text-purple-300 text-sm font-medium">Request Hardware →</button>
          </div>

          <!-- Access Requests -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2m0 0H9a2 2 0 00-2 2v0a2 2 0 002 2h2m-4 4v6a2 2 0 002 2h2a2 2 0 002-2v-6m-4 0a2 2 0 012-2h2a2 2 0 012 2m-4 0h4"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Access Requests</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Request access to systems, applications, or resources.</p>
            <button class="text-yellow-400 hover:text-yellow-300 text-sm font-medium">Request Access →</button>
          </div>

          <!-- My Profile -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">My Profile</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Update your profile information and preferences.</p>
            <button class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Edit Profile →</button>
          </div>

          <!-- Service Catalog -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Service Catalog</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Browse available IT services and offerings.</p>
            <button class="text-pink-400 hover:text-pink-300 text-sm font-medium">Browse Catalog →</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verify user has user role
    if (!this.currentUser || this.currentUser.role !== 'UTILISATEUR') {
      console.warn('⚠️ Unauthorized access attempt to user dashboard');
      this.router.navigate(['/login']);
      return;
    }

    console.log('✅ User dashboard loaded for:', this.currentUser.email);
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    return `${this.currentUser.prenom.charAt(0)}${this.currentUser.nom.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
