import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/auth.interface';

@Component({
  selector: 'app-manager-dashboard',
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
              <div class="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-white">ITSM Manager Portal</h1>
                <p class="text-sm text-slate-400">Team & Project Management</p>
              </div>
            </div>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm font-medium text-white">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
                <p class="text-xs text-blue-400 font-semibold">{{ currentUser?.role }}</p>
              </div>
              <div class="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
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
          <h2 class="text-3xl font-bold text-white mb-2">Manager Dashboard</h2>
          <p class="text-slate-400">Oversee team performance, manage tickets, and track project progress.</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Team Members</p>
                <p class="text-2xl font-bold text-white">24</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Assigned Tickets</p>
                <p class="text-2xl font-bold text-white">156</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Pending Review</p>
                <p class="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Team Performance</p>
                <p class="text-2xl font-bold text-green-400">94%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Manager Actions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Team Management -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Team Management</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Manage team members, assign tasks, and track performance.</p>
            <button class="text-blue-400 hover:text-blue-300 text-sm font-medium">Manage Team →</button>
          </div>

          <!-- Ticket Assignment -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Ticket Assignment</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Assign tickets to team members and monitor progress.</p>
            <button class="text-green-400 hover:text-green-300 text-sm font-medium">Assign Tickets →</button>
          </div>

          <!-- Performance Reports -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Performance Reports</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Generate team performance and productivity reports.</p>
            <button class="text-purple-400 hover:text-purple-300 text-sm font-medium">View Reports →</button>
          </div>

          <!-- Project Oversight -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Project Oversight</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Monitor project timelines, milestones, and deliverables.</p>
            <button class="text-indigo-400 hover:text-indigo-300 text-sm font-medium">View Projects →</button>
          </div>

          <!-- Resource Planning -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Resource Planning</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Plan resource allocation and manage team schedules.</p>
            <button class="text-yellow-400 hover:text-yellow-300 text-sm font-medium">Plan Resources →</button>
          </div>

          <!-- Quality Assurance -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
            <div class="flex items-center mb-4">
              <div class="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white ml-3">Quality Assurance</h3>
            </div>
            <p class="text-slate-400 text-sm mb-4">Review work quality and ensure service standards.</p>
            <button class="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Quality Review →</button>
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
export class ManagerDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verify user has manager role
    if (!this.currentUser || this.currentUser.role !== 'MANAGER') {
      console.warn('⚠️ Unauthorized access attempt to manager dashboard');
      this.router.navigate(['/login']);
      return;
    }

    console.log('✅ Manager dashboard loaded for:', this.currentUser.email);
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'M';
    return `${this.currentUser.prenom.charAt(0)}${this.currentUser.nom.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
