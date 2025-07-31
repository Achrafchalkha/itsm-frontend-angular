import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/auth.interface';

@Component({
  selector: 'app-technician-dashboard',
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
              <div class="h-10 w-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-white">ITSM Technician Portal</h1>
                <p class="text-sm text-slate-400">Technical Support & Maintenance</p>
              </div>
            </div>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm font-medium text-white">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
                <p class="text-xs text-orange-400 font-semibold">{{ currentUser?.role }}</p>
              </div>
              <div class="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
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
          <h2 class="text-3xl font-bold text-white mb-2">Technician Workbench</h2>
          <p class="text-slate-400">Resolve tickets, maintain systems, and provide technical support.</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Assigned Tickets</p>
                <p class="text-2xl font-bold text-white">18</p>
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
                <p class="text-sm font-medium text-slate-400">Resolved Today</p>
                <p class="text-2xl font-bold text-white">7</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">High Priority</p>
                <p class="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Avg Resolution</p>
                <p class="text-2xl font-bold text-white">2.4h</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Technician Actions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- My Tickets -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">My Tickets</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">View and manage tickets assigned to you.</p>
            <button class="text-orange-400 hover:text-orange-300 text-sm font-medium">View Tickets →</button>
          </div>

          <!-- Knowledge Base -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Knowledge Base</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Access technical documentation and solutions.</p>
            <button class="text-blue-400 hover:text-blue-300 text-sm font-medium">Browse KB →</button>
          </div>

          <!-- System Monitoring -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">System Monitoring</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Monitor system health and performance metrics.</p>
            <button class="text-green-400 hover:text-green-300 text-sm font-medium">View Systems →</button>
          </div>

          <!-- Remote Support -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Remote Support</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Provide remote assistance and troubleshooting.</p>
            <button class="text-purple-400 hover:text-purple-300 text-sm font-medium">Start Session →</button>
          </div>

          <!-- Asset Management -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Asset Management</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Track and maintain IT assets and equipment.</p>
            <button class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Manage Assets →</button>
          </div>

          <!-- Time Tracking -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Time Tracking</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Log work hours and track time spent on tickets.</p>
            <button class="text-yellow-400 hover:text-yellow-300 text-sm font-medium">Track Time →</button>
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
export class TechnicianDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verify user has technician role
    if (!this.currentUser || this.currentUser.role !== 'TECHNICIEN') {
      console.warn('⚠️ Unauthorized access attempt to technician dashboard');
      this.router.navigate(['/login']);
      return;
    }

    console.log('✅ Technician dashboard loaded for:', this.currentUser.email);
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'T';
    return `${this.currentUser.prenom.charAt(0)}${this.currentUser.nom.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
