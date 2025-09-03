import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/auth.interface';
import { CrudManagersComponent } from './crud-managers.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CrudManagersComponent],
  template: `
    <div class="min-h-screen bg-slate-900 flex">
      <!-- Sidebar Navigation -->
      <nav class="w-80 bg-slate-800 border-r border-slate-700 shadow-xl flex flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-slate-700">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">ITSM Admin</h1>
              <p class="text-xs text-slate-400">Administration</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div class="flex-1 overflow-y-auto py-4">
          <!-- Dashboard -->
          <div class="px-4 mb-2">
            <button
              (click)="setActiveSection('dashboard')"
              [class]="getMenuItemClass('dashboard')"
              class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              🧭 Tableau de bord
            </button>
          </div>

          <!-- Gestion des équipes -->
          <div class="px-4 mb-2">
            <button
              (click)="toggleSection('teams')"
              class="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                👥 Gestion des équipes
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                [class.rotate-180]="expandedSections.has('teams')"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Submenu -->
            <div *ngIf="expandedSections.has('teams')" class="ml-8 mt-2 space-y-1">
              <button
                (click)="setActiveSection('crud-managers')"
                [class]="getSubmenuItemClass('crud-managers')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                CRUD Managers
              </button>
              <button
                (click)="setActiveSection('manage-teams')"
                [class]="getSubmenuItemClass('manage-teams')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Lire / Supprimer équipes
              </button>
              <button
                (click)="setActiveSection('manage-techs')"
                [class]="getSubmenuItemClass('manage-techs')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Lire / Supprimer techs
              </button>
              <button
                (click)="setActiveSection('modify-specialties')"
                [class]="getSubmenuItemClass('modify-specialties')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Modifier spécialités et membres
              </button>
            </div>
          </div>

          <!-- Supervision des tickets -->
          <div class="px-4 mb-2">
            <button
              (click)="toggleSection('tickets')"
              class="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                </svg>
                🎫 Supervision des tickets
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                [class.rotate-180]="expandedSections.has('tickets')"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div *ngIf="expandedSections.has('tickets')" class="ml-8 mt-2 space-y-1">
              <button
                (click)="setActiveSection('all-tickets')"
                [class]="getSubmenuItemClass('all-tickets')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Consulter tous les tickets
              </button>
              <button
                (click)="setActiveSection('multi-team-filters')"
                [class]="getSubmenuItemClass('multi-team-filters')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Filtres multi-équipes
              </button>
              <button
                (click)="setActiveSection('blocked-tickets')"
                [class]="getSubmenuItemClass('blocked-tickets')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Intervention tickets bloqués
              </button>
            </div>
          </div>

          <!-- Supervision des SLA -->
          <div class="px-4 mb-2">
            <button
              (click)="toggleSection('sla')"
              class="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                ⏱ Supervision des SLA
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                [class.rotate-180]="expandedSections.has('sla')"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div *ngIf="expandedSections.has('sla')" class="ml-8 mt-2 space-y-1">
              <button
                (click)="setActiveSection('overdue-tickets')"
                [class]="getSubmenuItemClass('overdue-tickets')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Tickets en retard
              </button>
              <button
                (click)="setActiveSection('update-sla')"
                [class]="getSubmenuItemClass('update-sla')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Mettre à jour les SLA
              </button>
            </div>
          </div>

          <!-- Suivi des KPI -->
          <div class="px-4 mb-2">
            <button
              (click)="toggleSection('kpi')"
              class="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                📊 Suivi des KPI
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                [class.rotate-180]="expandedSections.has('kpi')"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div *ngIf="expandedSections.has('kpi')" class="ml-8 mt-2 space-y-1">
              <button
                (click)="setActiveSection('ticket-volume')"
                [class]="getSubmenuItemClass('ticket-volume')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Volume de tickets (mois)
              </button>
              <button
                (click)="setActiveSection('satisfaction-rate')"
                [class]="getSubmenuItemClass('satisfaction-rate')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Taux de satisfaction
              </button>
              <button
                (click)="setActiveSection('sla-compliance')"
                [class]="getSubmenuItemClass('sla-compliance')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                % résolu dans les SLA
              </button>
              <button
                (click)="setActiveSection('team-workload')"
                [class]="getSubmenuItemClass('team-workload')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Charge équipes/techs
              </button>
            </div>
          </div>

          <!-- Annonces -->
          <div class="px-4 mb-2">
            <button
              (click)="toggleSection('announcements')"
              class="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                📢 Annonces
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                [class.rotate-180]="expandedSections.has('announcements')"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div *ngIf="expandedSections.has('announcements')" class="ml-8 mt-2 space-y-1">
              <button
                (click)="setActiveSection('publish-announcement')"
                [class]="getSubmenuItemClass('publish-announcement')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Publier une annonce
              </button>
              <button
                (click)="setActiveSection('announcement-history')"
                [class]="getSubmenuItemClass('announcement-history')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Historique des annonces
              </button>
            </div>
          </div>

          <!-- Configuration système -->
          <div class="px-4 mb-2">
            <button
              (click)="toggleSection('system-config')"
              class="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                ⚙️ Configuration système
              </div>
              <svg
                class="w-4 h-4 transition-transform duration-200"
                [class.rotate-180]="expandedSections.has('system-config')"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div *ngIf="expandedSections.has('system-config')" class="ml-8 mt-2 space-y-1">
              <button
                (click)="setActiveSection('manage-categories')"
                [class]="getSubmenuItemClass('manage-categories')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Gérer catégories de tickets
              </button>
              <button
                (click)="setActiveSection('manage-priorities')"
                [class]="getSubmenuItemClass('manage-priorities')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Gérer les priorités
              </button>
              <button
                (click)="setActiveSection('configure-notifications')"
                [class]="getSubmenuItemClass('configure-notifications')"
                class="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200"
              >
                Configurer les notifications
              </button>
            </div>
          </div>
        </div>

        <!-- User Profile & Logout -->
        <div class="p-4 border-t border-slate-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span class="text-white font-semibold text-sm">{{ getUserInitials() }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-white">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
                <p class="text-xs text-red-400 font-semibold">{{ currentUser?.role }}</p>
              </div>
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
      </nav>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto">
        <!-- Header Bar -->
        <header class="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-white">{{ getPageTitle() }}</h1>
              <p class="text-slate-400 text-sm">{{ getPageDescription() }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 text-slate-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v5"></path>
                </svg>
                <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
              <!-- Search -->
              <div class="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  class="bg-slate-700 text-white placeholder-slate-400 px-4 py-2 pr-10 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                />
                <svg class="absolute right-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <div class="p-6">
          <!-- Dashboard Content -->
          <div *ngIf="activeSection === 'dashboard'">
            <!-- Welcome Section -->
            <div class="mb-8">
              <h2 class="text-3xl font-bold text-white mb-2">Bienvenue, {{ currentUser?.prenom }}!</h2>
              <p class="text-slate-400">Gérez votre système ITSM depuis ce tableau de bord administrateur.</p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-slate-400">Total Utilisateurs</p>
                    <p class="text-2xl font-bold text-white">1,234</p>
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
                    <p class="text-sm font-medium text-slate-400">Tickets Actifs</p>
                    <p class="text-2xl font-bold text-white">89</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-slate-400">En Attente</p>
                    <p class="text-2xl font-bold text-white">23</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-slate-400">Santé Système</p>
                    <p class="text-2xl font-bold text-green-400">98%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-red-500/50 transition-colors cursor-pointer">
                <div class="flex items-center mb-4">
                  <div class="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-white ml-3">Gestion Équipes</h3>
                </div>
                <p class="text-slate-400 text-sm mb-4">Gérer les équipes, managers et techniciens du système.</p>
                <button (click)="setActiveSection('crud-managers')" class="text-red-400 hover:text-red-300 text-sm font-medium">Accéder →</button>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-red-500/50 transition-colors cursor-pointer">
                <div class="flex items-center mb-4">
                  <div class="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-white ml-3">Supervision Tickets</h3>
                </div>
                <p class="text-slate-400 text-sm mb-4">Superviser tous les tickets et interventions.</p>
                <button (click)="setActiveSection('all-tickets')" class="text-red-400 hover:text-red-300 text-sm font-medium">Accéder →</button>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-red-500/50 transition-colors cursor-pointer">
                <div class="flex items-center mb-4">
                  <div class="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-white ml-3">Suivi KPI</h3>
                </div>
                <p class="text-slate-400 text-sm mb-4">Analyser les performances et indicateurs clés.</p>
                <button (click)="setActiveSection('ticket-volume')" class="text-red-400 hover:text-red-300 text-sm font-medium">Accéder →</button>
              </div>
            </div>
          </div>

          <!-- CRUD Managers Section -->
          <div *ngIf="activeSection === 'crud-managers'">
            <app-crud-managers></app-crud-managers>
          </div>

          <!-- Overdue Tickets Section -->
          <div *ngIf="activeSection === 'overdue-tickets'">
            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-slate-400">Total en Retard</p>
                    <p class="text-2xl font-bold text-red-400">24</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-slate-400">Critique</p>
                    <p class="text-2xl font-bold text-orange-400">8</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-slate-400">Retard Moyen</p>
                    <p class="text-2xl font-bold text-yellow-400">2.5h</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-slate-400">Équipes Impactées</p>
                    <p class="text-2xl font-bold text-purple-400">5</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filters and Actions -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
              <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div class="flex flex-col sm:flex-row gap-3 flex-1">
                  <div class="relative flex-1 max-w-xs">
                    <input type="text" placeholder="Rechercher un ticket..." 
                           class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full">
                    <svg class="absolute right-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  
                  <select class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm min-w-0 flex-shrink-0">
                    <option value="">Toutes priorités</option>
                    <option value="critique">Critique</option>
                    <option value="haute">Haute</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="basse">Basse</option>
                  </select>

                  <select class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm min-w-0 flex-shrink-0">
                    <option value="">Toutes équipes</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="applications">Applications</option>
                    <option value="securite">Sécurité</option>
                    <option value="reseaux">Réseaux</option>
                  </select>
                </div>

                <div class="flex gap-2 flex-shrink-0">
                  <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Exporter
                  </button>
                  <button class="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Actualiser
                  </button>
                </div>
              </div>
            </div>

            <!-- Overdue Tickets Table -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-slate-700/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ticket</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Priorité</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Équipe</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Technicien</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">SLA</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Retard</th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-700">
                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div>
                          <div class="text-sm font-medium text-white">#TK-2024-001</div>
                          <div class="text-sm text-slate-400 line-clamp-1">Serveur de base de données inaccessible</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          Critique
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-slate-300">Infrastructure</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-xs font-medium text-blue-400">JD</span>
                          </div>
                          <span class="text-sm text-slate-300">Jean Dupont</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-slate-300">2h</div>
                        <div class="text-xs text-slate-500">Résolution</div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          +4h 23min
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <button class="text-red-400 hover:text-red-300 text-sm font-medium">Escalader</button>
                          <button class="text-slate-400 hover:text-slate-300 text-sm font-medium">Voir</button>
                        </div>
                      </td>
                    </tr>

                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div>
                          <div class="text-sm font-medium text-white">#TK-2024-002</div>
                          <div class="text-sm text-slate-400 line-clamp-1">Application métier ne répond plus</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          Haute
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-slate-300">Applications</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-xs font-medium text-green-400">ML</span>
                          </div>
                          <span class="text-sm text-slate-300">Marie Leroy</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-slate-300">4h</div>
                        <div class="text-xs text-slate-500">Résolution</div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                          +1h 45min
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <button class="text-red-400 hover:text-red-300 text-sm font-medium">Escalader</button>
                          <button class="text-slate-400 hover:text-slate-300 text-sm font-medium">Voir</button>
                        </div>
                      </td>
                    </tr>

                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div>
                          <div class="text-sm font-medium text-white">#TK-2024-003</div>
                          <div class="text-sm text-slate-400 line-clamp-1">Problème de connectivité réseau</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          Critique
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-slate-300">Réseaux</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-8 w-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-xs font-medium text-purple-400">PM</span>
                          </div>
                          <span class="text-sm text-slate-300">Pierre Martin</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-slate-300">1h</div>
                        <div class="text-xs text-slate-500">Première réponse</div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          +6h 12min
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <button class="text-red-400 hover:text-red-300 text-sm font-medium">Escalader</button>
                          <button class="text-slate-400 hover:text-slate-300 text-sm font-medium">Voir</button>
                        </div>
                      </td>
                    </tr>

                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div>
                          <div class="text-sm font-medium text-white">#TK-2024-004</div>
                          <div class="text-sm text-slate-400 line-clamp-1">Faille de sécurité détectée</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          Critique
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-slate-300">Sécurité</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-8 w-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-xs font-medium text-yellow-400">AB</span>
                          </div>
                          <span class="text-sm text-slate-300">Alice Bernard</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-slate-300">30min</div>
                        <div class="text-xs text-slate-500">Première réponse</div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          +2h 15min
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <button class="text-red-400 hover:text-red-300 text-sm font-medium">Escalader</button>
                          <button class="text-slate-400 hover:text-slate-300 text-sm font-medium">Voir</button>
                        </div>
                      </td>
                    </tr>

                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div>
                          <div class="text-sm font-medium text-white">#TK-2024-005</div>
                          <div class="text-sm text-slate-400 line-clamp-1">Sauvegarde automatique échouée</div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          Moyenne
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-slate-300">Infrastructure</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-8 w-8 bg-indigo-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-xs font-medium text-indigo-400">TC</span>
                          </div>
                          <span class="text-sm text-slate-300">Thomas Caron</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-slate-300">8h</div>
                        <div class="text-xs text-slate-500">Résolution</div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                          +3h 30min
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <button class="text-red-400 hover:text-red-300 text-sm font-medium">Escalader</button>
                          <button class="text-slate-400 hover:text-slate-300 text-sm font-medium">Voir</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="bg-slate-700/30 px-6 py-4 border-t border-slate-700">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-slate-400">
                    Affichage de <span class="font-medium text-white">1</span> à <span class="font-medium text-white">5</span> sur <span class="font-medium text-white">24</span> tickets
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="px-3 py-1 text-sm text-slate-400 hover:text-white border border-slate-600 rounded hover:border-slate-500 transition-colors">
                      Précédent
                    </button>
                    <button class="px-3 py-1 text-sm bg-red-600 text-white rounded">
                      1
                    </button>
                    <button class="px-3 py-1 text-sm text-slate-400 hover:text-white border border-slate-600 rounded hover:border-slate-500 transition-colors">
                      2
                    </button>
                    <button class="px-3 py-1 text-sm text-slate-400 hover:text-white border border-slate-600 rounded hover:border-slate-500 transition-colors">
                      3
                    </button>
                    <button class="px-3 py-1 text-sm text-slate-400 hover:text-white border border-slate-600 rounded hover:border-slate-500 transition-colors">
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SLA Update Section -->
          <div *ngIf="activeSection === 'update-sla'" class="space-y-6">
            <!-- SLA Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-400">SLA Respectés</p>
                    <p class="text-2xl font-bold text-green-400">87%</p>
                  </div>
                  <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-400">SLA Dépassés</p>
                    <p class="text-2xl font-bold text-red-400">13%</p>
                  </div>
                  <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-400">Temps Moyen</p>
                    <p class="text-2xl font-bold text-blue-400">2.4h</p>
                  </div>
                  <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-400">Configurations</p>
                    <p class="text-2xl font-bold text-purple-400">24</p>
                  </div>
                  <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- SLA Configuration Panel -->
            <div class="bg-slate-800 rounded-xl border border-slate-700">
              <div class="px-6 py-4 border-b border-slate-700">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 class="text-lg font-semibold text-white">Configuration des SLA</h3>
                  <div class="flex flex-wrap gap-2">
                    <button class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Nouveau SLA
                    </button>
                    <button class="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      Importer
                    </button>
                    <button class="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                      <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                      </svg>
                      Exporter
                    </button>
                  </div>
                </div>
              </div>

              <!-- SLA Categories Tabs -->
              <div class="px-6 py-4 border-b border-slate-700">
                <div class="flex flex-wrap gap-2">
                  <button class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg border border-red-500">
                    Critique
                  </button>
                  <button class="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                    Élevée
                  </button>
                  <button class="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                    Moyenne
                  </button>
                  <button class="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                    Faible
                  </button>
                  <button class="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">
                    Par Catégorie
                  </button>
                </div>
              </div>

              <!-- SLA Configuration Table -->
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-slate-700/50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type de Ticket</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Priorité</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Temps de Réponse</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Temps de Résolution</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-slate-800 divide-y divide-slate-700">
                    <tr class="hover:bg-slate-700/50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Incident Système</div>
                            <div class="text-sm text-slate-400">Panne critique</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400">
                          Critique
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">15 min</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">2 heures</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                          Actif
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-red-400 hover:text-red-300 mr-3">Modifier</button>
                        <button class="text-slate-400 hover:text-slate-300">Historique</button>
                      </td>
                    </tr>
                    <tr class="hover:bg-slate-700/50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Demande de Service</div>
                            <div class="text-sm text-slate-400">Installation logiciel</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-500/20 text-orange-400">
                          Élevée
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">1 heure</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">4 heures</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                          Actif
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-red-400 hover:text-red-300 mr-3">Modifier</button>
                        <button class="text-slate-400 hover:text-slate-300">Historique</button>
                      </td>
                    </tr>
                    <tr class="hover:bg-slate-700/50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Support Utilisateur</div>
                            <div class="text-sm text-slate-400">Question générale</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                          Moyenne
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">4 heures</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">1 jour</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                          Actif
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-red-400 hover:text-red-300 mr-3">Modifier</button>
                        <button class="text-slate-400 hover:text-slate-300">Historique</button>
                      </td>
                    </tr>
                    <tr class="hover:bg-slate-700/50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Demande d'Information</div>
                            <div class="text-sm text-slate-400">Documentation</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                          Faible
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">8 heures</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">3 jours</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                          Actif
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-red-400 hover:text-red-300 mr-3">Modifier</button>
                        <button class="text-slate-400 hover:text-slate-300">Historique</button>
                      </td>
                    </tr>
                    <tr class="hover:bg-slate-700/50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                            <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                            </svg>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Changement Planifié</div>
                            <div class="text-sm text-slate-400">Mise à jour système</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                          Moyenne
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">2 heures</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">8 heures</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                          En révision
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button class="text-red-400 hover:text-red-300 mr-3">Modifier</button>
                        <button class="text-slate-400 hover:text-slate-300">Historique</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="px-6 py-4 border-t border-slate-700">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-slate-400">
                    Affichage de <span class="font-medium text-white">1</span> à <span class="font-medium text-white">5</span> sur <span class="font-medium text-white">24</span> configurations
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="px-3 py-1 text-sm text-slate-400 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600 disabled:opacity-50" disabled>
                      Précédent
                    </button>
                    <button class="px-3 py-1 text-sm text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700">
                      1
                    </button>
                    <button class="px-3 py-1 text-sm text-slate-300 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600">
                      2
                    </button>
                    <button class="px-3 py-1 text-sm text-slate-300 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600">
                      3
                    </button>
                    <button class="px-3 py-1 text-sm text-slate-300 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600">
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Volume de tickets Section -->
          <div *ngIf="activeSection === 'ticket-volume'" class="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-white mb-2">📊 Volume de tickets par mois</h2>
              <p class="text-slate-400">Analyse de l'évolution du volume de tickets sur les 12 derniers mois</p>
            </div>

            <!-- KPI Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <span class="text-green-400 text-sm font-medium">+12%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">1,247</h3>
                <p class="text-slate-400 text-sm">Total ce mois</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <span class="text-green-400 text-sm font-medium">+8%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">104</h3>
                <p class="text-slate-400 text-sm">Moyenne/jour</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="text-red-400 text-sm font-medium">-5%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">2.4h</h3>
                <p class="text-slate-400 text-sm">Temps moyen</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="text-green-400 text-sm font-medium">+15%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">94.2%</h3>
                <p class="text-slate-400 text-sm">Taux résolution</p>
              </div>
            </div>

            <!-- Interactive Bar Chart -->
            <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600 mb-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-white">Évolution mensuelle</h3>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors">12 mois</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 text-sm rounded-md hover:bg-slate-500 transition-colors">6 mois</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 text-sm rounded-md hover:bg-slate-500 transition-colors">3 mois</button>
                </div>
              </div>

              <!-- Chart Container -->
              <div class="relative h-80 bg-slate-800/50 rounded-lg p-4">
                <div class="absolute inset-4 flex items-end justify-between">
                  <!-- Chart Bars -->
                  <div class="flex items-end space-x-2 w-full h-full">
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 45%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Jan</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">892</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 52%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Fév</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1024</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 68%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Mar</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1356</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 41%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Avr</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">823</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 75%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Mai</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1489</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 58%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Juin</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1156</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 63%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Juil</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1267</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 71%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Août</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1423</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 49%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Sep</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">978</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 84%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Oct</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1678</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-md transition-all duration-300 hover:from-red-500 hover:to-red-300 min-h-[20px]" style="height: 77%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-slate-400 mt-2 group-hover:text-white transition-colors">Nov</span>
                      <span class="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">1534</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center group cursor-pointer h-full">
                      <div class="w-full bg-gradient-to-t from-red-500 to-red-300 rounded-t-md transition-all duration-300 hover:from-red-400 hover:to-red-200 shadow-lg shadow-red-500/20 min-h-[20px]" style="height: 100%; max-height: calc(100% - 40px);"></div>
                      <span class="text-xs text-white mt-2 font-medium">Déc</span>
                      <span class="text-xs text-red-300">1247</span>
                    </div>
                  </div>
                </div>

                <!-- Y-axis labels -->
                <div class="absolute left-0 top-0 h-full flex flex-col justify-between py-4 text-xs text-slate-500">
                  <span>2000</span>
                  <span>1500</span>
                  <span>1000</span>
                  <span>500</span>
                  <span>0</span>
                </div>
              </div>
            </div>

            <!-- Detailed Analytics -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Trend Analysis -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-4">Analyse des tendances</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-300">Croissance mensuelle</span>
                    <span class="text-green-400 font-medium">+12.3%</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-300">Pic saisonnier</span>
                    <span class="text-yellow-400 font-medium">Octobre</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-300">Période creuse</span>
                    <span class="text-blue-400 font-medium">Avril</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-300">Prévision janvier</span>
                    <span class="text-red-400 font-medium">1,380 tickets</span>
                  </div>
                </div>
              </div>

              <!-- Category Breakdown -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-4">Répartition par catégorie</h3>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span class="text-slate-300 flex-1">Incidents</span>
                    <span class="text-white font-medium">45%</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span class="text-slate-300 flex-1">Demandes</span>
                    <span class="text-white font-medium">32%</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span class="text-slate-300 flex-1">Changements</span>
                    <span class="text-white font-medium">15%</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span class="text-slate-300 flex-1">Problèmes</span>
                    <span class="text-white font-medium">8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Satisfaction Rate Section -->
          <div *ngIf="activeSection === 'satisfaction-rate'" class="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-white mb-2">😊 Taux de satisfaction client</h2>
              <p class="text-slate-400">Analyse de la satisfaction client basée sur les évaluations et feedbacks</p>
            </div>

            <!-- Main Satisfaction Gauge -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <!-- Circular Gauge -->
              <div class="bg-slate-700/30 rounded-lg p-8 border border-slate-600 flex flex-col items-center">
                <h3 class="text-lg font-semibold text-white mb-6">Score global</h3>
                <div class="relative w-48 h-48">
                  <!-- SVG Circular Progress -->
                  <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                    <!-- Background circle -->
                    <circle cx="100" cy="100" r="80" stroke="#374151" stroke-width="12" fill="none" opacity="0.3"></circle>
                    <!-- Progress circle -->
                    <circle cx="100" cy="100" r="80" stroke="url(#satisfactionGradient)" stroke-width="12" fill="none" 
                            stroke-dasharray="502.4" stroke-dashoffset="125.6" stroke-linecap="round"
                            class="transition-all duration-1000 ease-out"></circle>
                    <!-- Gradient definition -->
                    <defs>
                      <linearGradient id="satisfactionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#f59e0b;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <!-- Center content -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-bold text-white mb-1">87.5%</span>
                    <span class="text-sm text-slate-400">Très satisfait</span>
                    <div class="flex items-center mt-2">
                      <span class="text-green-400 text-sm font-medium">+3.2%</span>
                      <svg class="w-4 h-4 text-green-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Satisfaction Breakdown -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-6">Répartition des évaluations</h3>
                <div class="space-y-4">
                  <!-- 5 stars -->
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-3">
                      <span class="text-sm">★★★★★</span>
                    </div>
                    <div class="flex-1 bg-slate-600 rounded-full h-3 mr-3">
                      <div class="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full" style="width: 65%;"></div>
                    </div>
                    <span class="text-white font-medium text-sm w-12">65%</span>
                  </div>
                  <!-- 4 stars -->
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-3">
                      <span class="text-sm">★★★★☆</span>
                    </div>
                    <div class="flex-1 bg-slate-600 rounded-full h-3 mr-3">
                      <div class="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" style="width: 22%;"></div>
                    </div>
                    <span class="text-white font-medium text-sm w-12">22%</span>
                  </div>
                  <!-- 3 stars -->
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-3">
                      <span class="text-sm">★★★☆☆</span>
                    </div>
                    <div class="flex-1 bg-slate-600 rounded-full h-3 mr-3">
                      <div class="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full" style="width: 8%;"></div>
                    </div>
                    <span class="text-white font-medium text-sm w-12">8%</span>
                  </div>
                  <!-- 2 stars -->
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-3">
                      <span class="text-sm">★★☆☆☆</span>
                    </div>
                    <div class="flex-1 bg-slate-600 rounded-full h-3 mr-3">
                      <div class="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full" style="width: 3%;"></div>
                    </div>
                    <span class="text-white font-medium text-sm w-12">3%</span>
                  </div>
                  <!-- 1 star -->
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-3">
                      <span class="text-sm">★☆☆☆☆</span>
                    </div>
                    <div class="flex-1 bg-slate-600 rounded-full h-3 mr-3">
                      <div class="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full" style="width: 2%;"></div>
                    </div>
                    <span class="text-white font-medium text-sm w-12">2%</span>
                  </div>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-600">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Total évaluations</span>
                    <span class="text-white font-medium">2,847</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Satisfaction Trend Chart -->
            <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600 mb-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-white">Évolution de la satisfaction</h3>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors">6 mois</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 text-sm rounded-md hover:bg-slate-500 transition-colors">3 mois</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 text-sm rounded-md hover:bg-slate-500 transition-colors">1 mois</button>
                </div>
              </div>

              <!-- Line Chart -->
              <div class="relative h-64">
                <svg class="w-full h-full" viewBox="0 0 800 200">
                  <!-- Grid lines -->
                  <defs>
                    <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#374151" stroke-width="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  <!-- Satisfaction line -->
                  <polyline fill="none" stroke="url(#satisfactionLineGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                           points="40,120 120,110 200,95 280,105 360,85 440,80 520,75 600,70 680,65 760,60" 
                           class="drop-shadow-lg">
                  </polyline>
                  
                  <!-- Data points -->
                  <circle cx="40" cy="120" r="4" fill="#ef4444" class="drop-shadow-md"/>
                  <circle cx="120" cy="110" r="4" fill="#f59e0b" class="drop-shadow-md"/>
                  <circle cx="200" cy="95" r="4" fill="#eab308" class="drop-shadow-md"/>
                  <circle cx="280" cy="105" r="4" fill="#84cc16" class="drop-shadow-md"/>
                  <circle cx="360" cy="85" r="4" fill="#22c55e" class="drop-shadow-md"/>
                  <circle cx="440" cy="80" r="4" fill="#10b981" class="drop-shadow-md"/>
                  <circle cx="520" cy="75" r="4" fill="#059669" class="drop-shadow-md"/>
                  <circle cx="600" cy="70" r="4" fill="#047857" class="drop-shadow-md"/>
                  <circle cx="680" cy="65" r="4" fill="#065f46" class="drop-shadow-md"/>
                  <circle cx="760" cy="60" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" class="drop-shadow-lg"/>
                  
                  <!-- Gradient for line -->
                  <defs>
                    <linearGradient id="satisfactionLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
                      <stop offset="50%" style="stop-color:#f59e0b;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <!-- X-axis labels -->
                <div class="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-slate-400">
                  <span>Juil</span>
                  <span>Août</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Déc</span>
                </div>
                
                <!-- Y-axis labels -->
                <div class="absolute left-0 top-0 h-full flex flex-col justify-between py-4 text-xs text-slate-500">
                  <span>100%</span>
                  <span>80%</span>
                  <span>60%</span>
                  <span>40%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>

            <!-- Detailed Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Response Time Impact -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-4">Impact temps de réponse</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">< 1h</span>
                    <span class="text-green-400 font-medium">95.2%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">1-4h</span>
                    <span class="text-yellow-400 font-medium">87.8%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">4-24h</span>
                    <span class="text-orange-400 font-medium">72.1%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">> 24h</span>
                    <span class="text-red-400 font-medium">45.3%</span>
                  </div>
                </div>
              </div>

              <!-- Department Satisfaction -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-4">Par département</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">IT</span>
                    <span class="text-green-400 font-medium">92.1%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">RH</span>
                    <span class="text-green-400 font-medium">89.7%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">Finance</span>
                    <span class="text-yellow-400 font-medium">85.4%</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">Marketing</span>
                    <span class="text-yellow-400 font-medium">83.2%</span>
                  </div>
                </div>
              </div>

              <!-- Recent Feedback -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-4">Commentaires récents</h3>
                <div class="space-y-3">
                  <div class="bg-slate-600/50 rounded-lg p-3">
                    <div class="flex items-center mb-2">
                      <div class="flex text-yellow-400 text-xs mr-2">★★★★★</div>
                      <span class="text-slate-400 text-xs">Il y a 2h</span>
                    </div>
                    <p class="text-slate-300 text-sm">"Résolution très rapide, équipe réactive"</p>
                  </div>
                  <div class="bg-slate-600/50 rounded-lg p-3">
                    <div class="flex items-center mb-2">
                      <div class="flex text-yellow-400 text-xs mr-2">★★★★☆</div>
                      <span class="text-slate-400 text-xs">Il y a 5h</span>
                    </div>
                    <p class="text-slate-300 text-sm">"Bon suivi, communication claire"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SLA Compliance Section -->
          <div *ngIf="activeSection === 'sla-compliance'" class="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-white mb-2">⏱️ Conformité SLA</h2>
              <p class="text-slate-400">Analyse du respect des accords de niveau de service par priorité et catégorie</p>
            </div>

            <!-- SLA Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="text-green-400 text-sm font-medium">+2.1%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">94.2%</h3>
                <p class="text-slate-400 text-sm">SLA Respectés</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="text-red-400 text-sm font-medium">-0.8%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">5.8%</h3>
                <p class="text-slate-400 text-sm">SLA Dépassés</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="text-green-400 text-sm font-medium">-15min</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">2.1h</h3>
                <p class="text-slate-400 text-sm">Temps moyen</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <span class="text-yellow-400 text-sm font-medium">23</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">156</h3>
                <p class="text-slate-400 text-sm">Tickets critiques</p>
              </div>
            </div>

            <!-- SLA Performance by Priority -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <!-- Priority Performance -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-6">Performance par priorité</h3>
                <div class="space-y-6">
                  <!-- Critical -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span class="text-slate-300">Critique</span>
                      </div>
                      <span class="text-white font-medium">89.2%</span>
                    </div>
                    <div class="w-full bg-slate-600 rounded-full h-3">
                      <div class="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full relative" style="width: 89.2%;">
                        <div class="absolute right-0 top-0 h-full w-1 bg-white rounded-full opacity-80"></div>
                      </div>
                    </div>
                    <div class="flex justify-between text-xs text-slate-400 mt-1">
                      <span>SLA: 1h</span>
                      <span>Moyenne: 52min</span>
                    </div>
                  </div>

                  <!-- High -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                        <span class="text-slate-300">Élevée</span>
                      </div>
                      <span class="text-white font-medium">95.7%</span>
                    </div>
                    <div class="w-full bg-slate-600 rounded-full h-3">
                      <div class="bg-gradient-to-r from-orange-600 to-orange-400 h-3 rounded-full relative" style="width: 95.7%;">
                        <div class="absolute right-0 top-0 h-full w-1 bg-white rounded-full opacity-80"></div>
                      </div>
                    </div>
                    <div class="flex justify-between text-xs text-slate-400 mt-1">
                      <span>SLA: 4h</span>
                      <span>Moyenne: 3.2h</span>
                    </div>
                  </div>

                  <!-- Medium -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span class="text-slate-300">Moyenne</span>
                      </div>
                      <span class="text-white font-medium">97.1%</span>
                    </div>
                    <div class="w-full bg-slate-600 rounded-full h-3">
                      <div class="bg-gradient-to-r from-yellow-600 to-yellow-400 h-3 rounded-full relative" style="width: 97.1%;">
                        <div class="absolute right-0 top-0 h-full w-1 bg-white rounded-full opacity-80"></div>
                      </div>
                    </div>
                    <div class="flex justify-between text-xs text-slate-400 mt-1">
                      <span>SLA: 24h</span>
                      <span>Moyenne: 18.5h</span>
                    </div>
                  </div>

                  <!-- Low -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <div class="flex items-center">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span class="text-slate-300">Faible</span>
                      </div>
                      <span class="text-white font-medium">98.9%</span>
                    </div>
                    <div class="w-full bg-slate-600 rounded-full h-3">
                      <div class="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full relative" style="width: 98.9%;">
                        <div class="absolute right-0 top-0 h-full w-1 bg-white rounded-full opacity-80"></div>
                      </div>
                    </div>
                    <div class="flex justify-between text-xs text-slate-400 mt-1">
                      <span>SLA: 72h</span>
                      <span>Moyenne: 45.2h</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SLA Trend Chart -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-6">Évolution SLA (6 mois)</h3>
                <div class="relative h-64">
                  <svg class="w-full h-full" viewBox="0 0 400 200">
                    <!-- Grid -->
                    <defs>
                      <pattern id="slaGrid" width="40" height="33.33" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 33.33" fill="none" stroke="#374151" stroke-width="0.5" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#slaGrid)" />
                    
                    <!-- SLA Target Line -->
                    <line x1="20" y1="40" x2="380" y2="40" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5" opacity="0.7"/>
                    <text x="385" y="45" fill="#ef4444" font-size="10">Objectif 95%</text>
                    
                    <!-- Performance Line -->
                    <polyline fill="none" stroke="url(#slaPerformanceGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                             points="20,60 80,55 140,45 200,42 260,38 320,35 380,32" 
                             class="drop-shadow-lg">
                    </polyline>
                    
                    <!-- Data Points -->
                    <circle cx="20" cy="60" r="4" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="80" cy="55" r="4" fill="#eab308" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="140" cy="45" r="4" fill="#84cc16" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="200" cy="42" r="4" fill="#22c55e" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="260" cy="38" r="4" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="320" cy="35" r="4" fill="#059669" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="380" cy="32" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" class="drop-shadow-lg"/>
                    
                    <!-- Gradient -->
                    <defs>
                      <linearGradient id="slaPerformanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <!-- Labels -->
                  <div class="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-400">
                    <span>Juil</span>
                    <span>Août</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Déc</span>
                  </div>
                  
                  <div class="absolute left-0 top-0 h-full flex flex-col justify-between py-4 text-xs text-slate-500">
                    <span>100%</span>
                    <span>95%</span>
                    <span>90%</span>
                    <span>85%</span>
                    <span>80%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed SLA Analysis -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Breach Analysis -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-4">Analyse des dépassements</h3>
                <div class="space-y-4">
                  <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-red-400 font-medium">Tickets critiques</span>
                      <span class="text-red-300">17</span>
                    </div>
                    <p class="text-slate-400 text-sm">Dépassement moyen: 2.3h</p>
                  </div>
                  <div class="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-orange-400 font-medium">Tickets élevés</span>
                      <span class="text-orange-300">8</span>
                    </div>
                    <p class="text-slate-400 text-sm">Dépassement moyen: 1.8h</p>
                  </div>
                  <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-yellow-400 font-medium">Autres priorités</span>
                      <span class="text-yellow-300">3</span>
                    </div>
                    <p class="text-slate-400 text-sm">Dépassement moyen: 4.2h</p>
                  </div>
                </div>
              </div>

              <!-- Team Performance -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-4">Performance par équipe</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">Équipe Infrastructure</span>
                    <div class="flex items-center">
                      <div class="w-16 bg-slate-600 rounded-full h-2 mr-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 96%;"></div>
                      </div>
                      <span class="text-green-400 font-medium text-sm">96%</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">Équipe Applications</span>
                    <div class="flex items-center">
                      <div class="w-16 bg-slate-600 rounded-full h-2 mr-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 94%;"></div>
                      </div>
                      <span class="text-green-400 font-medium text-sm">94%</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">Équipe Réseau</span>
                    <div class="flex items-center">
                      <div class="w-16 bg-slate-600 rounded-full h-2 mr-2">
                        <div class="bg-yellow-500 h-2 rounded-full" style="width: 91%;"></div>
                      </div>
                      <span class="text-yellow-400 font-medium text-sm">91%</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-300">Support Utilisateur</span>
                    <div class="flex items-center">
                      <div class="w-16 bg-slate-600 rounded-full h-2 mr-2">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: 88%;"></div>
                      </div>
                      <span class="text-orange-400 font-medium text-sm">88%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Improvement Actions -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-4">Actions d'amélioration</h3>
                <div class="space-y-3">
                  <div class="bg-slate-600/50 rounded-lg p-3">
                    <div class="flex items-center mb-2">
                      <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span class="text-white text-sm font-medium">Priorité haute</span>
                    </div>
                    <p class="text-slate-300 text-sm">Renforcer l'équipe critique (2 techniciens)</p>
                  </div>
                  <div class="bg-slate-600/50 rounded-lg p-3">
                    <div class="flex items-center mb-2">
                      <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      <span class="text-white text-sm font-medium">En cours</span>
                    </div>
                    <p class="text-slate-300 text-sm">Automatisation des tâches répétitives</p>
                  </div>
                  <div class="bg-slate-600/50 rounded-lg p-3">
                    <div class="flex items-center mb-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span class="text-white text-sm font-medium">Planifié</span>
                    </div>
                    <p class="text-slate-300 text-sm">Formation équipe réseau</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Workload Section -->
          <div *ngIf="activeSection === 'team-workload'" class="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-white mb-2">👥 Charge Équipes/Techniciens</h2>
              <p class="text-slate-400">Analyse de la répartition de charge et performance des équipes techniques</p>
            </div>

            <!-- Workload Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <span class="text-green-400 text-sm font-medium">+3</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">24</h3>
                <p class="text-slate-400 text-sm">Techniciens actifs</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <span class="text-orange-400 text-sm font-medium">78%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">18.2</h3>
                <p class="text-slate-400 text-sm">Tickets/jour moyen</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span class="text-red-400 text-sm font-medium">+12%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">6</h3>
                <p class="text-slate-400 text-sm">Techniciens surchargés</p>
              </div>

              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <span class="text-green-400 text-sm font-medium">+5.2%</span>
                </div>
                <h3 class="text-2xl font-bold text-white mb-1">92.1%</h3>
                <p class="text-slate-400 text-sm">Efficacité moyenne</p>
              </div>
            </div>

            <!-- Team Workload Heatmap and Distribution -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <!-- Workload Heatmap -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-6">Heatmap de charge (7 derniers jours)</h3>
                <div class="space-y-3">
                  <!-- Days Header -->
                  <div class="grid grid-cols-8 gap-1 text-xs text-slate-400 mb-2">
                    <div></div>
                    <div class="text-center">Lun</div>
                    <div class="text-center">Mar</div>
                    <div class="text-center">Mer</div>
                    <div class="text-center">Jeu</div>
                    <div class="text-center">Ven</div>
                    <div class="text-center">Sam</div>
                    <div class="text-center">Dim</div>
                  </div>
                  
                  <!-- Team Infrastructure -->
                  <div class="grid grid-cols-8 gap-1 items-center">
                    <div class="text-xs text-slate-300 pr-2">Infra</div>
                    <div class="h-8 bg-red-500/80 rounded flex items-center justify-center text-xs text-white font-medium">95%</div>
                    <div class="h-8 bg-orange-500/70 rounded flex items-center justify-center text-xs text-white font-medium">82%</div>
                    <div class="h-8 bg-yellow-500/60 rounded flex items-center justify-center text-xs text-white font-medium">76%</div>
                    <div class="h-8 bg-green-500/50 rounded flex items-center justify-center text-xs text-white font-medium">65%</div>
                    <div class="h-8 bg-orange-500/70 rounded flex items-center justify-center text-xs text-white font-medium">88%</div>
                    <div class="h-8 bg-green-500/40 rounded flex items-center justify-center text-xs text-white font-medium">45%</div>
                    <div class="h-8 bg-green-500/30 rounded flex items-center justify-center text-xs text-white font-medium">32%</div>
                  </div>
                  
                  <!-- Team Applications -->
                  <div class="grid grid-cols-8 gap-1 items-center">
                    <div class="text-xs text-slate-300 pr-2">Apps</div>
                    <div class="h-8 bg-orange-500/70 rounded flex items-center justify-center text-xs text-white font-medium">78%</div>
                    <div class="h-8 bg-red-500/80 rounded flex items-center justify-center text-xs text-white font-medium">92%</div>
                    <div class="h-8 bg-orange-500/70 rounded flex items-center justify-center text-xs text-white font-medium">85%</div>
                    <div class="h-8 bg-yellow-500/60 rounded flex items-center justify-center text-xs text-white font-medium">71%</div>
                    <div class="h-8 bg-green-500/50 rounded flex items-center justify-center text-xs text-white font-medium">68%</div>
                    <div class="h-8 bg-green-500/40 rounded flex items-center justify-center text-xs text-white font-medium">42%</div>
                    <div class="h-8 bg-green-500/30 rounded flex items-center justify-center text-xs text-white font-medium">28%</div>
                  </div>
                  
                  <!-- Team Network -->
                  <div class="grid grid-cols-8 gap-1 items-center">
                    <div class="text-xs text-slate-300 pr-2">Réseau</div>
                    <div class="h-8 bg-yellow-500/60 rounded flex items-center justify-center text-xs text-white font-medium">72%</div>
                    <div class="h-8 bg-green-500/50 rounded flex items-center justify-center text-xs text-white font-medium">58%</div>
                    <div class="h-8 bg-red-500/80 rounded flex items-center justify-center text-xs text-white font-medium">96%</div>
                    <div class="h-8 bg-orange-500/70 rounded flex items-center justify-center text-xs text-white font-medium">83%</div>
                    <div class="h-8 bg-yellow-500/60 rounded flex items-center justify-center text-xs text-white font-medium">74%</div>
                    <div class="h-8 bg-green-500/40 rounded flex items-center justify-center text-xs text-white font-medium">38%</div>
                    <div class="h-8 bg-green-500/30 rounded flex items-center justify-center text-xs text-white font-medium">25%</div>
                  </div>
                  
                  <!-- Team Support -->
                  <div class="grid grid-cols-8 gap-1 items-center">
                    <div class="text-xs text-slate-300 pr-2">Support</div>
                    <div class="h-8 bg-orange-500/70 rounded flex items-center justify-center text-xs text-white font-medium">89%</div>
                    <div class="h-8 bg-orange-500/70 rounded flex items-center justify-center text-xs text-white font-medium">87%</div>
                    <div class="h-8 bg-yellow-500/60 rounded flex items-center justify-center text-xs text-white font-medium">79%</div>
                    <div class="h-8 bg-red-500/80 rounded flex items-center justify-center text-xs text-white font-medium">94%</div>
                    <div class="h-8 bg-orange-500/70 rounded flex items-center justify-center text-xs text-white font-medium">81%</div>
                    <div class="h-8 bg-green-500/40 rounded flex items-center justify-center text-xs text-white font-medium">48%</div>
                    <div class="h-8 bg-green-500/30 rounded flex items-center justify-center text-xs text-white font-medium">35%</div>
                  </div>
                </div>
                
                <!-- Legend -->
                <div class="flex items-center justify-center mt-4 space-x-4 text-xs">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-green-500/40 rounded mr-1"></div>
                    <span class="text-slate-400">Faible (0-60%)</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-yellow-500/60 rounded mr-1"></div>
                    <span class="text-slate-400">Modérée (60-80%)</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-orange-500/70 rounded mr-1"></div>
                    <span class="text-slate-400">Élevée (80-90%)</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-red-500/80 rounded mr-1"></div>
                    <span class="text-slate-400">Critique (90%+)</span>
                  </div>
                </div>
              </div>

              <!-- Workload Distribution Chart -->
              <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 class="text-lg font-semibold text-white mb-6">Répartition de charge par équipe</h3>
                <div class="relative h-64">
                  <!-- Donut Chart SVG -->
                  <svg class="w-full h-full" viewBox="0 0 200 200">
                    <defs>
                      <filter id="workloadShadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                      </filter>
                    </defs>
                    
                    <!-- Infrastructure (35%) -->
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#ef4444" stroke-width="20" 
                            stroke-dasharray="77 143" stroke-dashoffset="0" filter="url(#workloadShadow)"/>
                    
                    <!-- Applications (28%) -->
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#f97316" stroke-width="20" 
                            stroke-dasharray="62 158" stroke-dashoffset="-77" filter="url(#workloadShadow)"/>
                    
                    <!-- Network (22%) -->
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#eab308" stroke-width="20" 
                            stroke-dasharray="49 171" stroke-dashoffset="-139" filter="url(#workloadShadow)"/>
                    
                    <!-- Support (15%) -->
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#22c55e" stroke-width="20" 
                            stroke-dasharray="33 187" stroke-dashoffset="-188" filter="url(#workloadShadow)"/>
                    
                    <!-- Center Text -->
                    <text x="100" y="95" text-anchor="middle" fill="#ffffff" font-size="24" font-weight="bold">438</text>
                    <text x="100" y="115" text-anchor="middle" fill="#94a3b8" font-size="12">Tickets actifs</text>
                  </svg>
                  
                  <!-- Legend -->
                  <div class="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-2">
                    <div class="flex items-center text-sm">
                      <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span class="text-slate-300">Infrastructure</span>
                      <span class="text-white ml-2 font-medium">35%</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <div class="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      <span class="text-slate-300">Applications</span>
                      <span class="text-white ml-2 font-medium">28%</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span class="text-slate-300">Réseau</span>
                      <span class="text-white ml-2 font-medium">22%</span>
                    </div>
                    <div class="flex items-center text-sm">
                      <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span class="text-slate-300">Support</span>
                      <span class="text-white ml-2 font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual Technician Performance -->
            <div class="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-white">Performance individuelle des techniciens</h3>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm border border-red-500/30 hover:bg-red-500/30 transition-colors">Infrastructure</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">Applications</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">Réseau</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">Support</button>
                </div>
              </div>
              
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-slate-600">
                      <th class="text-left py-3 px-4 text-slate-300 font-medium">Technicien</th>
                      <th class="text-center py-3 px-4 text-slate-300 font-medium">Tickets assignés</th>
                      <th class="text-center py-3 px-4 text-slate-300 font-medium">Tickets résolus</th>
                      <th class="text-center py-3 px-4 text-slate-300 font-medium">Temps moyen</th>
                      <th class="text-center py-3 px-4 text-slate-300 font-medium">Charge</th>
                      <th class="text-center py-3 px-4 text-slate-300 font-medium">Performance</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-600">
                    <tr class="hover:bg-slate-600/30 transition-colors">
                      <td class="py-3 px-4">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-red-400 font-medium text-sm">AM</span>
                          </div>
                          <div>
                            <div class="text-white font-medium">Ahmed Mansouri</div>
                            <div class="text-slate-400 text-sm">Senior Infrastructure</div>
                          </div>
                        </div>
                      </td>
                      <td class="text-center py-3 px-4 text-white">28</td>
                      <td class="text-center py-3 px-4 text-green-400">24</td>
                      <td class="text-center py-3 px-4 text-slate-300">2.3h</td>
                      <td class="text-center py-3 px-4">
                        <div class="flex items-center justify-center">
                          <div class="w-16 bg-slate-600 rounded-full h-2 mr-2">
                            <div class="bg-red-500 h-2 rounded-full" style="width: 95%;"></div>
                          </div>
                          <span class="text-red-400 font-medium text-sm">95%</span>
                        </div>
                      </td>
                      <td class="text-center py-3 px-4">
                        <span class="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-sm font-medium">Excellent</span>
                      </td>
                    </tr>
                    <tr class="hover:bg-slate-600/30 transition-colors">
                      <td class="py-3 px-4">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-red-400 font-medium text-sm">SB</span>
                          </div>
                          <div>
                            <div class="text-white font-medium">Sarah Benali</div>
                            <div class="text-slate-400 text-sm">Infrastructure</div>
                          </div>
                        </div>
                      </td>
                      <td class="text-center py-3 px-4 text-white">22</td>
                      <td class="text-center py-3 px-4 text-green-400">20</td>
                      <td class="text-center py-3 px-4 text-slate-300">1.8h</td>
                      <td class="text-center py-3 px-4">
                        <div class="flex items-center justify-center">
                          <div class="w-16 bg-slate-600 rounded-full h-2 mr-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: 88%;"></div>
                          </div>
                          <span class="text-orange-400 font-medium text-sm">88%</span>
                        </div>
                      </td>
                      <td class="text-center py-3 px-4">
                        <span class="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-sm font-medium">Très bien</span>
                      </td>
                    </tr>
                    <tr class="hover:bg-slate-600/30 transition-colors">
                      <td class="py-3 px-4">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-red-400 font-medium text-sm">KA</span>
                          </div>
                          <div>
                            <div class="text-white font-medium">Karim Alaoui</div>
                            <div class="text-slate-400 text-sm">Infrastructure</div>
                          </div>
                        </div>
                      </td>
                      <td class="text-center py-3 px-4 text-white">31</td>
                      <td class="text-center py-3 px-4 text-yellow-400">25</td>
                      <td class="text-center py-3 px-4 text-slate-300">3.1h</td>
                      <td class="text-center py-3 px-4">
                        <div class="flex items-center justify-center">
                          <div class="w-16 bg-slate-600 rounded-full h-2 mr-2">
                            <div class="bg-red-500 h-2 rounded-full" style="width: 98%;"></div>
                          </div>
                          <span class="text-red-400 font-medium text-sm">98%</span>
                        </div>
                      </td>
                      <td class="text-center py-3 px-4">
                        <span class="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg text-sm font-medium">Surchargé</span>
                      </td>
                    </tr>
                    <tr class="hover:bg-slate-600/30 transition-colors">
                      <td class="py-3 px-4">
                        <div class="flex items-center">
                          <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                            <span class="text-red-400 font-medium text-sm">LH</span>
                          </div>
                          <div>
                            <div class="text-white font-medium">Laila Hajji</div>
                            <div class="text-slate-400 text-sm">Junior Infrastructure</div>
                          </div>
                        </div>
                      </td>
                      <td class="text-center py-3 px-4 text-white">15</td>
                      <td class="text-center py-3 px-4 text-green-400">14</td>
                      <td class="text-center py-3 px-4 text-slate-300">2.7h</td>
                      <td class="text-center py-3 px-4">
                        <div class="flex items-center justify-center">
                          <div class="w-16 bg-slate-600 rounded-full h-2 mr-2">
                            <div class="bg-green-500 h-2 rounded-full" style="width: 65%;"></div>
                          </div>
                          <span class="text-green-400 font-medium text-sm">65%</span>
                        </div>
                      </td>
                      <td class="text-center py-3 px-4">
                        <span class="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-sm font-medium">Bien</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              <div class="flex items-center justify-between mt-6 pt-4 border-t border-slate-600">
                <div class="text-sm text-slate-400">
                  Affichage de 1 à 4 sur 24 techniciens
                </div>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 bg-slate-600 text-slate-400 rounded-lg text-sm border border-slate-500 cursor-not-allowed">Précédent</button>
                  <button class="px-3 py-1 bg-red-500 text-white rounded-lg text-sm border border-red-400">1</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">2</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">3</button>
                  <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">Suivant</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Publier une annonce Section -->
          <div *ngIf="activeSection === 'publish-announcement'" class="space-y-6">
            <!-- Header -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">📢 Publier une annonce</h2>
                  <p class="text-slate-400">Créer et publier une nouvelle annonce pour tous les utilisateurs</p>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulaire de création d'annonce -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <form class="space-y-6">
                <!-- Titre de l'annonce -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Titre de l'annonce *
                  </label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Entrez le titre de l'annonce"
                    maxlength="100"
                  >
                  <div class="flex justify-between mt-1">
                    <span class="text-xs text-slate-500">Maximum 100 caractères</span>
                    <span class="text-xs text-slate-500">0/100</span>
                  </div>
                </div>

                <!-- Type d'annonce -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Type d'annonce *
                  </label>
                  <select class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                    <option value="">Sélectionnez un type</option>
                    <option value="info">ℹ️ Information</option>
                    <option value="warning">⚠️ Avertissement</option>
                    <option value="maintenance">🔧 Maintenance</option>
                    <option value="update">🆕 Mise à jour</option>
                    <option value="urgent">🚨 Urgent</option>
                  </select>
                </div>

                <!-- Priorité -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Priorité *
                  </label>
                  <div class="grid grid-cols-3 gap-3">
                    <label class="relative">
                      <input type="radio" name="priority" value="low" class="sr-only peer">
                      <div class="p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer transition-all peer-checked:bg-green-500/20 peer-checked:border-green-500 peer-checked:text-green-300 hover:bg-slate-600">
                        <div class="text-center">
                          <div class="text-2xl mb-1">🟢</div>
                          <div class="text-sm font-medium">Faible</div>
                        </div>
                      </div>
                    </label>
                    <label class="relative">
                      <input type="radio" name="priority" value="medium" class="sr-only peer">
                      <div class="p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer transition-all peer-checked:bg-yellow-500/20 peer-checked:border-yellow-500 peer-checked:text-yellow-300 hover:bg-slate-600">
                        <div class="text-center">
                          <div class="text-2xl mb-1">🟡</div>
                          <div class="text-sm font-medium">Moyenne</div>
                        </div>
                      </div>
                    </label>
                    <label class="relative">
                      <input type="radio" name="priority" value="high" class="sr-only peer">
                      <div class="p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer transition-all peer-checked:bg-red-500/20 peer-checked:border-red-500 peer-checked:text-red-300 hover:bg-slate-600">
                        <div class="text-center">
                          <div class="text-2xl mb-1">🔴</div>
                          <div class="text-sm font-medium">Élevée</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Contenu de l'annonce -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Contenu de l'annonce *
                  </label>
                  <textarea
                    rows="6"
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    placeholder="Rédigez le contenu de votre annonce..."
                    maxlength="1000"
                  ></textarea>
                  <div class="flex justify-between mt-1">
                    <span class="text-xs text-slate-500">Maximum 1000 caractères</span>
                    <span class="text-xs text-slate-500">0/1000</span>
                  </div>
                </div>

                <!-- Destinataires -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">
                    Destinataires *
                  </label>
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input type="checkbox" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2">
                      <span class="ml-3 text-slate-300">👥 Tous les utilisateurs</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2">
                      <span class="ml-3 text-slate-300">👨‍💼 Managers uniquement</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2">
                      <span class="ml-3 text-slate-300">🔧 Techniciens uniquement</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2">
                      <span class="ml-3 text-slate-300">👤 Utilisateurs finaux uniquement</span>
                    </label>
                  </div>
                </div>

                <!-- Paramètres de publication -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Date de début -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">
                      Date de début
                    </label>
                    <input
                      type="datetime-local"
                      class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                    <span class="text-xs text-slate-500 mt-1 block">Laisser vide pour publication immédiate</span>
                  </div>

                  <!-- Date de fin -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">
                      Date de fin
                    </label>
                    <input
                      type="datetime-local"
                      class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                    <span class="text-xs text-slate-500 mt-1 block">Laisser vide pour annonce permanente</span>
                  </div>
                </div>

                <!-- Options avancées -->
                <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <h4 class="text-sm font-medium text-slate-300 mb-3">Options avancées</h4>
                  <div class="space-y-3">
                    <label class="flex items-center">
                      <input type="checkbox" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2">
                      <span class="ml-3 text-slate-300">📧 Envoyer par email</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2">
                      <span class="ml-3 text-slate-300">🔔 Notification push</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2">
                      <span class="ml-3 text-slate-300">📌 Épingler en haut</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 focus:ring-2">
                      <span class="ml-3 text-slate-300">✅ Demander accusé de réception</span>
                    </label>
                  </div>
                </div>

                <!-- Aperçu -->
                <div class="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <h4 class="text-sm font-medium text-slate-300 mb-3">Aperçu de l'annonce</h4>
                  <div class="bg-slate-800 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-start space-x-3">
                      <div class="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="text-xl">ℹ️</span>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                          <h5 class="font-medium text-white">Titre de l'annonce</h5>
                          <span class="text-xs text-slate-400">Maintenant</span>
                        </div>
                        <p class="text-slate-300 text-sm mb-2">Contenu de l'annonce...</p>
                        <div class="flex items-center space-x-2">
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                            Information
                          </span>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                            Priorité faible
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    class="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
                  >
                    💾 Enregistrer comme brouillon
                  </button>
                  <div class="flex space-x-3">
                    <button
                      type="button"
                      class="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
                    >
                      👁️ Prévisualiser
                    </button>
                    <button
                      type="submit"
                      class="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      📢 Publier l'annonce
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Historique des annonces Section -->
          <div *ngIf="activeSection === 'announcement-history'" class="space-y-6">
            <!-- Header -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">📋 Historique des annonces</h2>
                  <p class="text-slate-400">Gérer et consulter toutes les annonces publiées</p>
                </div>
                <div class="flex items-center space-x-3">
                  <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    ➕ Nouvelle annonce
                  </button>
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Statistiques rapides -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Total annonces</p>
                    <p class="text-2xl font-bold text-white mt-1">24</p>
                  </div>
                  <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Actives</p>
                    <p class="text-2xl font-bold text-green-400 mt-1">8</p>
                  </div>
                  <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Brouillons</p>
                    <p class="text-2xl font-bold text-yellow-400 mt-1">3</p>
                  </div>
                  <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Expirées</p>
                    <p class="text-2xl font-bold text-slate-400 mt-1">13</p>
                  </div>
                  <div class="h-12 w-12 bg-slate-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtres et recherche -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <!-- Recherche -->
                <div class="flex-1 lg:max-w-md">
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="Rechercher une annonce..."
                      class="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                  </div>
                </div>

                <!-- Filtres -->
                <div class="flex flex-wrap items-center space-x-3">
                  <select class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Tous les statuts</option>
                    <option value="active">✅ Actives</option>
                    <option value="draft">📝 Brouillons</option>
                    <option value="expired">⏰ Expirées</option>
                    <option value="scheduled">📅 Programmées</option>
                  </select>

                  <select class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Tous les types</option>
                    <option value="info">ℹ️ Information</option>
                    <option value="warning">⚠️ Avertissement</option>
                    <option value="maintenance">🔧 Maintenance</option>
                    <option value="update">🆕 Mise à jour</option>
                    <option value="urgent">🚨 Urgent</option>
                  </select>

                  <select class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Toutes priorités</option>
                    <option value="high">🔴 Élevée</option>
                    <option value="medium">🟡 Moyenne</option>
                    <option value="low">🟢 Faible</option>
                  </select>

                  <button class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600">
                    🔄 Actualiser
                  </button>
                </div>
              </div>
            </div>

            <!-- Liste des annonces -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-700">
                <h3 class="text-lg font-semibold text-white">Annonces récentes</h3>
              </div>

              <div class="divide-y divide-slate-700">
                <!-- Annonce 1 -->
                <div class="p-6 hover:bg-slate-700/30 transition-colors">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4 flex-1">
                      <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="text-xl">🚨</span>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                          <h4 class="text-lg font-medium text-white">Maintenance programmée du serveur</h4>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                            🚨 Urgent
                          </span>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                            ✅ Active
                          </span>
                        </div>
                        <p class="text-slate-300 mb-3">Une maintenance programmée aura lieu ce weekend. Tous les services seront temporairement indisponibles...</p>
                        <div class="flex items-center space-x-4 text-sm text-slate-400">
                          <span>📅 Publié le 15 Jan 2024</span>
                          <span>👥 Tous les utilisateurs</span>
                          <span>👁️ 1,234 vues</span>
                          <span>📧 Envoyé par email</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                      <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                      <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Annonce 2 -->
                <div class="p-6 hover:bg-slate-700/30 transition-colors">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4 flex-1">
                      <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="text-xl">ℹ️</span>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                          <h4 class="text-lg font-medium text-white">Nouvelle fonctionnalité disponible</h4>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                            ℹ️ Information
                          </span>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                            ✅ Active
                          </span>
                        </div>
                        <p class="text-slate-300 mb-3">Nous avons le plaisir de vous annoncer la disponibilité d'une nouvelle fonctionnalité de reporting avancé...</p>
                        <div class="flex items-center space-x-4 text-sm text-slate-400">
                          <span>📅 Publié le 12 Jan 2024</span>
                          <span>👨‍💼 Managers uniquement</span>
                          <span>👁️ 89 vues</span>
                          <span>🔔 Notification push</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                      <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                      <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Annonce 3 -->
                <div class="p-6 hover:bg-slate-700/30 transition-colors">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4 flex-1">
                      <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="text-xl">📝</span>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                          <h4 class="text-lg font-medium text-white">Mise à jour des procédures</h4>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                            🆕 Mise à jour
                          </span>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                            📝 Brouillon
                          </span>
                        </div>
                        <p class="text-slate-300 mb-3">Les procédures de gestion des incidents ont été mises à jour. Veuillez consulter la nouvelle documentation...</p>
                        <div class="flex items-center space-x-4 text-sm text-slate-400">
                          <span>📅 Créé le 10 Jan 2024</span>
                          <span>🔧 Techniciens uniquement</span>
                          <span>👁️ - vues</span>
                          <span>📝 En cours de rédaction</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                      <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                      <button class="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                      </button>
                      <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div class="p-6 border-t border-slate-700">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-slate-400">
                    Affichage de 1 à 10 sur 24 annonces
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">Précédent</button>
                    <button class="px-3 py-1 bg-red-600 text-white rounded-lg text-sm border border-red-500">1</button>
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">2</button>
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">3</button>
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">Suivant</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gérer catégories de tickets Section -->
          <div *ngIf="activeSection === 'manage-categories'" class="space-y-6">
            <!-- Header -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">🏷️ Gérer catégories de tickets</h2>
                  <p class="text-slate-400">Créer, modifier et supprimer les catégories de tickets du système</p>
                </div>
                <div class="flex items-center space-x-3">
                  <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    ➕ Nouvelle catégorie
                  </button>
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Statistiques rapides -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Total catégories</p>
                    <p class="text-2xl font-bold text-white mt-1">12</p>
                  </div>
                  <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Actives</p>
                    <p class="text-2xl font-bold text-green-400 mt-1">10</p>
                  </div>
                  <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Inactives</p>
                    <p class="text-2xl font-bold text-yellow-400 mt-1">2</p>
                  </div>
                  <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Tickets associés</p>
                    <p class="text-2xl font-bold text-slate-300 mt-1">1,847</p>
                  </div>
                  <div class="h-12 w-12 bg-slate-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filtres et actions -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <!-- Recherche -->
                <div class="flex-1 lg:max-w-md">
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="Rechercher une catégorie..."
                      class="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                  </div>
                </div>

                <!-- Filtres -->
                <div class="flex flex-wrap items-center space-x-3">
                  <select class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Tous les statuts</option>
                    <option value="active">✅ Actives</option>
                    <option value="inactive">⚠️ Inactives</option>
                  </select>

                  <select class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Tous les types</option>
                    <option value="hardware">🖥️ Matériel</option>
                    <option value="software">💻 Logiciel</option>
                    <option value="network">🌐 Réseau</option>
                    <option value="security">🔒 Sécurité</option>
                    <option value="access">🔑 Accès</option>
                  </select>

                  <button class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600">
                    🔄 Actualiser
                  </button>
                </div>
              </div>
            </div>

            <!-- Liste des catégories -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-700">
                <h3 class="text-lg font-semibold text-white">Catégories de tickets</h3>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-slate-700/50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Catégorie</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Statut</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Tickets</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">SLA par défaut</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Créé le</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-700">
                    <!-- Catégorie 1 -->
                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                            <span class="text-lg">🖥️</span>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Problème matériel</div>
                            <div class="text-sm text-slate-400">Pannes et dysfonctionnements matériels</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                          🖥️ Matériel
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          ✅ Active
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-white">342</td>
                      <td class="px-6 py-4 text-sm text-slate-300">4h</td>
                      <td class="px-6 py-4 text-sm text-slate-400">15 Jan 2024</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- Catégorie 2 -->
                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                            <span class="text-lg">💻</span>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Problème logiciel</div>
                            <div class="text-sm text-slate-400">Bugs et dysfonctionnements logiciels</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                          💻 Logiciel
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          ✅ Active
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-white">567</td>
                      <td class="px-6 py-4 text-sm text-slate-300">2h</td>
                      <td class="px-6 py-4 text-sm text-slate-400">10 Jan 2024</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- Catégorie 3 -->
                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                            <span class="text-lg">🌐</span>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Problème réseau</div>
                            <div class="text-sm text-slate-400">Connectivité et infrastructure réseau</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          🌐 Réseau
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          ✅ Active
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-white">234</td>
                      <td class="px-6 py-4 text-sm text-slate-300">1h</td>
                      <td class="px-6 py-4 text-sm text-slate-400">08 Jan 2024</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- Catégorie 4 -->
                    <tr class="hover:bg-slate-700/30 transition-colors">
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                            <span class="text-lg">🔑</span>
                          </div>
                          <div>
                            <div class="text-sm font-medium text-white">Demande d'accès</div>
                            <div class="text-sm text-slate-400">Permissions et droits d'accès</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                          🔑 Accès
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                          ⚠️ Inactive
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-white">89</td>
                      <td class="px-6 py-4 text-sm text-slate-300">24h</td>
                      <td class="px-6 py-4 text-sm text-slate-400">05 Jan 2024</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div class="p-6 border-t border-slate-700">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-slate-400">
                    Affichage de 1 à 4 sur 12 catégories
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">Précédent</button>
                    <button class="px-3 py-1 bg-red-600 text-white rounded-lg text-sm border border-red-500">1</button>
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">2</button>
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">3</button>
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm border border-slate-500 hover:bg-slate-500 transition-colors">Suivant</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulaire de création/modification (modal) -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 class="text-lg font-semibold text-white mb-6">Créer une nouvelle catégorie</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nom de la catégorie -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Nom de la catégorie *</label>
                  <input
                    type="text"
                    placeholder="Ex: Problème matériel"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                </div>

                <!-- Type -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Type *</label>
                  <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Sélectionner un type</option>
                    <option value="hardware">🖥️ Matériel</option>
                    <option value="software">💻 Logiciel</option>
                    <option value="network">🌐 Réseau</option>
                    <option value="security">🔒 Sécurité</option>
                    <option value="access">🔑 Accès</option>
                    <option value="other">📋 Autre</option>
                  </select>
                </div>

                <!-- Description -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Description détaillée de la catégorie..."
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>

                <!-- SLA par défaut -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">SLA par défaut *</label>
                  <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Sélectionner un SLA</option>
                    <option value="1h">1 heure</option>
                    <option value="2h">2 heures</option>
                    <option value="4h">4 heures</option>
                    <option value="8h">8 heures</option>
                    <option value="24h">24 heures</option>
                    <option value="48h">48 heures</option>
                  </select>
                </div>

                <!-- Statut -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Statut</label>
                  <div class="flex items-center space-x-4 mt-3">
                    <label class="flex items-center">
                      <input type="radio" name="status" value="active" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 focus:ring-red-500 focus:ring-2" checked>
                      <span class="ml-2 text-slate-300">✅ Active</span>
                    </label>
                    <label class="flex items-center">
                      <input type="radio" name="status" value="inactive" class="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 focus:ring-red-500 focus:ring-2">
                      <span class="ml-2 text-slate-300">⚠️ Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-700">
                <button class="px-6 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors font-medium">
                  Annuler
                </button>
                <button class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  💾 Créer la catégorie
                </button>
              </div>
            </div>
          </div>

          <!-- Gérer les priorités Section -->
          <div *ngIf="activeSection === 'manage-priorities'" class="space-y-6">
            <!-- Header -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">⚡ Gérer les priorités</h2>
                  <p class="text-slate-400">Configurer les niveaux de priorité et leurs paramètres</p>
                </div>
                <div class="flex items-center space-x-3">
                  <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    ➕ Nouvelle priorité
                  </button>
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Statistiques rapides -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Total priorités</p>
                    <p class="text-2xl font-bold text-white mt-1">5</p>
                  </div>
                  <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Critique</p>
                    <p class="text-2xl font-bold text-red-400 mt-1">47</p>
                  </div>
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Haute</p>
                    <p class="text-2xl font-bold text-orange-400 mt-1">156</p>
                  </div>
                  <div class="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Normale/Basse</p>
                    <p class="text-2xl font-bold text-green-400 mt-1">1,644</p>
                  </div>
                  <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration des priorités -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white">Niveaux de priorité</h3>
                  <div class="flex items-center space-x-3">
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm hover:bg-slate-500 transition-colors">
                      🔄 Réorganiser
                    </button>
                    <button class="px-3 py-1 bg-slate-600 text-slate-300 rounded-lg text-sm hover:bg-slate-500 transition-colors">
                      📊 Statistiques
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <div class="space-y-4">
                  <!-- Priorité Critique -->
                  <div class="bg-slate-700/50 rounded-xl p-6 border border-red-500/30">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                          <div class="h-8 w-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <span class="text-red-400 font-bold text-sm">1</span>
                          </div>
                          <div>
                            <h4 class="text-lg font-semibold text-white">🚨 Critique</h4>
                            <p class="text-sm text-slate-400">Incidents majeurs affectant la production</p>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center space-x-6">
                        <div class="text-center">
                          <p class="text-sm text-slate-400">SLA</p>
                          <p class="text-lg font-semibold text-red-400">15 min</p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm text-slate-400">Tickets</p>
                          <p class="text-lg font-semibold text-white">47</p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm text-slate-400">Escalade</p>
                          <p class="text-lg font-semibold text-yellow-400">5 min</p>
                        </div>
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 flex items-center space-x-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Couleur:</span>
                        <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-red-400"></div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Notification:</span>
                        <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">✅ Immédiate</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Auto-assignation:</span>
                        <span class="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">👥 Manager senior</span>
                      </div>
                    </div>
                  </div>

                  <!-- Priorité Haute -->
                  <div class="bg-slate-700/50 rounded-xl p-6 border border-orange-500/30">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                          <div class="h-8 w-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <span class="text-orange-400 font-bold text-sm">2</span>
                          </div>
                          <div>
                            <h4 class="text-lg font-semibold text-white">🔥 Haute</h4>
                            <p class="text-sm text-slate-400">Problèmes importants nécessitant une attention rapide</p>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center space-x-6">
                        <div class="text-center">
                          <p class="text-sm text-slate-400">SLA</p>
                          <p class="text-lg font-semibold text-orange-400">2h</p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm text-slate-400">Tickets</p>
                          <p class="text-lg font-semibold text-white">156</p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm text-slate-400">Escalade</p>
                          <p class="text-lg font-semibold text-yellow-400">30 min</p>
                        </div>
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 flex items-center space-x-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Couleur:</span>
                        <div class="w-6 h-6 bg-orange-500 rounded-full border-2 border-orange-400"></div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Notification:</span>
                        <span class="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">⚡ Rapide</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Auto-assignation:</span>
                        <span class="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">👤 Technicien senior</span>
                      </div>
                    </div>
                  </div>

                  <!-- Priorité Normale -->
                  <div class="bg-slate-700/50 rounded-xl p-6 border border-blue-500/30">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                          <div class="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span class="text-blue-400 font-bold text-sm">3</span>
                          </div>
                          <div>
                            <h4 class="text-lg font-semibold text-white">📋 Normale</h4>
                            <p class="text-sm text-slate-400">Demandes standards avec délai normal</p>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center space-x-6">
                        <div class="text-center">
                          <p class="text-sm text-slate-400">SLA</p>
                          <p class="text-lg font-semibold text-blue-400">8h</p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm text-slate-400">Tickets</p>
                          <p class="text-lg font-semibold text-white">892</p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm text-slate-400">Escalade</p>
                          <p class="text-lg font-semibold text-yellow-400">2h</p>
                        </div>
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 flex items-center space-x-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Couleur:</span>
                        <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-400"></div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Notification:</span>
                        <span class="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">📧 Standard</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Auto-assignation:</span>
                        <span class="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">🎯 Round-robin</span>
                      </div>
                    </div>
                  </div>

                  <!-- Priorité Basse -->
                  <div class="bg-slate-700/50 rounded-xl p-6 border border-green-500/30">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                          <div class="h-8 w-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <span class="text-green-400 font-bold text-sm">4</span>
                          </div>
                          <div>
                            <h4 class="text-lg font-semibold text-white">📉 Basse</h4>
                            <p class="text-sm text-slate-400">Demandes non urgentes et améliorations</p>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center space-x-6">
                        <div class="text-center">
                          <p class="text-sm text-slate-400">SLA</p>
                          <p class="text-lg font-semibold text-green-400">24h</p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm text-slate-400">Tickets</p>
                          <p class="text-lg font-semibold text-white">752</p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm text-slate-400">Escalade</p>
                          <p class="text-lg font-semibold text-yellow-400">8h</p>
                        </div>
                        <div class="flex items-center space-x-2">
                          <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="mt-4 flex items-center space-x-4">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Couleur:</span>
                        <div class="w-6 h-6 bg-green-500 rounded-full border-2 border-green-400"></div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Notification:</span>
                        <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">🔔 Différée</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">Auto-assignation:</span>
                        <span class="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">⏰ Planifiée</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulaire de création/modification -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 class="text-lg font-semibold text-white mb-6">Créer/Modifier une priorité</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nom de la priorité -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Nom de la priorité *</label>
                  <input
                    type="text"
                    placeholder="Ex: Très haute"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                </div>

                <!-- Niveau (ordre) -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Niveau (ordre) *</label>
                  <input
                    type="number"
                    placeholder="1 = plus haute priorité"
                    min="1"
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                </div>

                <!-- Description -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Description de cette priorité..."
                    class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>

                <!-- SLA par défaut -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">SLA par défaut *</label>
                  <div class="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Durée"
                      min="1"
                      class="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                    <select class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="minutes">Minutes</option>
                      <option value="hours">Heures</option>
                      <option value="days">Jours</option>
                    </select>
                  </div>
                </div>

                <!-- Délai d'escalade -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Délai d'escalade</label>
                  <div class="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Durée"
                      min="1"
                      class="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                    <select class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="minutes">Minutes</option>
                      <option value="hours">Heures</option>
                      <option value="days">Jours</option>
                    </select>
                  </div>
                </div>

                <!-- Couleur -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Couleur *</label>
                  <div class="flex items-center space-x-3">
                    <input
                      type="color"
                      value="#ef4444"
                      class="w-12 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                    >
                    <input
                      type="text"
                      placeholder="#ef4444"
                      class="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                  </div>
                </div>

                <!-- Type de notification -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Type de notification</label>
                  <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="immediate">✅ Immédiate</option>
                    <option value="fast">⚡ Rapide (5 min)</option>
                    <option value="standard">📧 Standard (15 min)</option>
                    <option value="delayed">🔔 Différée (1h)</option>
                  </select>
                </div>

                <!-- Auto-assignation -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-slate-300 mb-2">Règle d'auto-assignation</label>
                  <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="none">❌ Aucune</option>
                    <option value="senior-manager">👥 Manager senior</option>
                    <option value="senior-tech">👤 Technicien senior</option>
                    <option value="round-robin">🎯 Round-robin</option>
                    <option value="scheduled">⏰ Planifiée</option>
                    <option value="skill-based">🎯 Basée sur les compétences</option>
                  </select>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-700">
                <button class="px-6 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 transition-colors font-medium">
                  Annuler
                </button>
                <button class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  💾 Enregistrer
                </button>
              </div>
            </div>
          </div>

          <!-- Configurer les notifications Section -->
          <div *ngIf="activeSection === 'configure-notifications'" class="space-y-6">
            <!-- Header -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">🔔 Configurer les notifications</h2>
                  <p class="text-slate-400">Gérer les paramètres de notification et d'alerte du système</p>
                </div>
                <div class="flex items-center space-x-3">
                  <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    💾 Sauvegarder
                  </button>
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-15 0v-5h5l-5-5-5 5h5v5a7.5 7.5 0 0015 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Statistiques des notifications -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Notifications/jour</p>
                    <p class="text-2xl font-bold text-white mt-1">1,247</p>
                  </div>
                  <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-15 0v-5h5l-5-5-5 5h5v5a7.5 7.5 0 0015 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Emails envoyés</p>
                    <p class="text-2xl font-bold text-green-400 mt-1">892</p>
                  </div>
                  <div class="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">SMS envoyés</p>
                    <p class="text-2xl font-bold text-yellow-400 mt-1">156</p>
                  </div>
                  <div class="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">Échecs</p>
                    <p class="text-2xl font-bold text-red-400 mt-1">23</p>
                  </div>
                  <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration générale -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-700">
                <h3 class="text-lg font-semibold text-white">⚙️ Configuration générale</h3>
              </div>

              <div class="p-6 space-y-6">
                <!-- Activation globale -->
                <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                  <div>
                    <h4 class="text-white font-medium">Notifications activées</h4>
                    <p class="text-sm text-slate-400">Activer/désactiver toutes les notifications système</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <!-- Fréquence de vérification -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Fréquence de vérification</label>
                    <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="30">30 secondes</option>
                      <option value="60" selected>1 minute</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Limite d'envoi par heure</label>
                    <input
                      type="number"
                      value="100"
                      min="1"
                      max="1000"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration Email -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white">📧 Configuration Email</h3>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>

              <div class="p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Serveur SMTP</label>
                    <input
                      type="text"
                      placeholder="smtp.gmail.com"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Port</label>
                    <input
                      type="number"
                      placeholder="587"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Email expéditeur</label>
                    <input
                      type="email"
                      placeholder="noreply@company.com"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Nom expéditeur</label>
                    <input
                      type="text"
                      placeholder="ITSM System"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Nom d'utilisateur</label>
                    <input
                      type="text"
                      placeholder="username"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>
                </div>

                <!-- Options avancées -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div>
                      <h4 class="text-white font-medium">Utiliser TLS/SSL</h4>
                      <p class="text-sm text-slate-400">Chiffrement de la connexion SMTP</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div class="flex justify-end">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      🧪 Tester la connexion
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration SMS -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white">📱 Configuration SMS</h3>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>

              <div class="p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Fournisseur SMS</label>
                    <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="twilio">Twilio</option>
                      <option value="nexmo">Vonage (Nexmo)</option>
                      <option value="aws-sns">AWS SNS</option>
                      <option value="custom">Personnalisé</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Numéro expéditeur</label>
                    <input
                      type="text"
                      placeholder="+33123456789"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Clé API</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Secret API</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                  </div>
                </div>

                <div class="flex justify-end">
                  <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    🧪 Tester SMS
                  </button>
                </div>
              </div>
            </div>

            <!-- Règles de notification -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white">📋 Règles de notification</h3>
                  <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    ➕ Nouvelle règle
                  </button>
                </div>
              </div>

              <div class="p-6">
                <div class="space-y-4">
                  <!-- Règle 1: Nouveau ticket -->
                  <div class="bg-slate-700/50 rounded-xl p-6 border border-blue-500/30">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span class="text-blue-400 text-sm font-bold">📝</span>
                        </div>
                        <div>
                          <h4 class="text-lg font-semibold text-white">Nouveau ticket créé</h4>
                          <p class="text-sm text-slate-400">Notification lors de la création d'un nouveau ticket</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                        <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Destinataires:</span>
                        <span class="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">👥 Managers</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Canaux:</span>
                        <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">📧 Email</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Délai:</span>
                        <span class="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">⚡ Immédiat</span>
                      </div>
                    </div>
                  </div>

                  <!-- Règle 2: Ticket critique -->
                  <div class="bg-slate-700/50 rounded-xl p-6 border border-red-500/30">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <span class="text-red-400 text-sm font-bold">🚨</span>
                        </div>
                        <div>
                          <h4 class="text-lg font-semibold text-white">Ticket critique</h4>
                          <p class="text-sm text-slate-400">Notification pour les tickets de priorité critique</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                        <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Destinataires:</span>
                        <span class="px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-xs">👑 Direction</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Canaux:</span>
                        <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">📧 Email</span>
                        <span class="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs">📱 SMS</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Délai:</span>
                        <span class="px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-xs">🚨 Immédiat</span>
                      </div>
                    </div>
                  </div>

                  <!-- Règle 3: SLA dépassé -->
                  <div class="bg-slate-700/50 rounded-xl p-6 border border-orange-500/30">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <span class="text-orange-400 text-sm font-bold">⏰</span>
                        </div>
                        <div>
                          <h4 class="text-lg font-semibold text-white">SLA dépassé</h4>
                          <p class="text-sm text-slate-400">Notification quand un SLA est dépassé</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                        <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Destinataires:</span>
                        <span class="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs">👤 Assigné + Manager</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Canaux:</span>
                        <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">📧 Email</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Délai:</span>
                        <span class="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs">⚡ Immédiat</span>
                      </div>
                    </div>
                  </div>

                  <!-- Règle 4: Ticket résolu -->
                  <div class="bg-slate-700/50 rounded-xl p-6 border border-green-500/30">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <span class="text-green-400 text-sm font-bold">✅</span>
                        </div>
                        <div>
                          <h4 class="text-lg font-semibold text-white">Ticket résolu</h4>
                          <p class="text-sm text-slate-400">Notification quand un ticket est résolu</p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked class="sr-only peer">
                          <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                        <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Destinataires:</span>
                        <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">👤 Demandeur</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Canaux:</span>
                        <span class="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">📧 Email</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-slate-400">Délai:</span>
                        <span class="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">📧 Standard</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modèles de notification -->
            <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-white">📝 Modèles de notification</h3>
                  <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                    ➕ Nouveau modèle
                  </button>
                </div>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Modèle Email -->
                  <div class="bg-slate-700/50 rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-lg font-semibold text-white">📧 Modèle Email</h4>
                      <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                    </div>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Objet</label>
                        <input
                          type="text"
                          value="[ITSM] Nouveau ticket #{{ '{' }}ticket_id{{ '}' }} - {{ '{' }}title{{ '}' }}"
                          class="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Corps du message</label>
                        <textarea
                          rows="6"
                          class="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        >Bonjour {{ '{' }}user_name{{ '}' }},

Un nouveau ticket a été créé :

Ticket ID: #{{ '{' }}ticket_id{{ '}' }}
Titre: {{ '{' }}title{{ '}' }}
Priorité: {{ '{' }}priority{{ '}' }}
Demandeur: {{ '{' }}requester{{ '}' }}

Cordialement,
Équipe ITSM</textarea>
                      </div>
                    </div>
                  </div>

                  <!-- Modèle SMS -->
                  <div class="bg-slate-700/50 rounded-xl p-6">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-lg font-semibold text-white">📱 Modèle SMS</h4>
                      <button class="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                    </div>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Message (160 caractères max)</label>
                        <textarea
                          rows="4"
                          maxlength="160"
                          class="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        >ITSM: Nouveau ticket #{{ '{' }}ticket_id{{ '}' }} - {{ '{' }}priority{{ '}' }} - {{ '{' }}title{{ '}' }}</textarea>
                        <p class="text-xs text-slate-400 mt-1">Caractères restants: 95</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Variables disponibles -->
                <div class="mt-6 p-4 bg-slate-700/30 rounded-xl">
                  <h5 class="text-sm font-semibold text-white mb-3">Variables disponibles :</h5>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">{{ '{' }}ticket_id{{ '}' }}</span>
                    <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">{{ '{' }}title{{ '}' }}</span>
                    <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">{{ '{' }}priority{{ '}' }}</span>
                    <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">{{ '{' }}status{{ '}' }}</span>
                    <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">{{ '{' }}requester{{ '}' }}</span>
                    <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">{{ '{' }}assignee{{ '}' }}</span>
                    <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">{{ '{' }}category{{ '}' }}</span>
                    <span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">{{ '{' }}user_name{{ '}' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Sections Content -->
          <div *ngIf="activeSection !== 'dashboard' && activeSection !== 'crud-managers' && activeSection !== 'overdue-tickets' && activeSection !== 'update-sla' && activeSection !== 'ticket-volume' && activeSection !== 'satisfaction-rate' && activeSection !== 'sla-compliance' && activeSection !== 'team-workload' && activeSection !== 'publish-announcement' && activeSection !== 'announcement-history' && activeSection !== 'manage-categories' && activeSection !== 'manage-priorities' && activeSection !== 'configure-notifications'" class="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div class="text-center">
              <div class="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">{{ getPageTitle() }}</h3>
              <p class="text-slate-400 mb-6">{{ getPageDescription() }}</p>
              <div class="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                <p class="text-slate-300">Cette section est en cours de développement.</p>
                <p class="text-slate-400 text-sm mt-2">Les fonctionnalités seront bientôt disponibles.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeSection: string = 'dashboard';
  expandedSections: Set<string> = new Set();

  // Section titles and descriptions
  private sectionInfo: { [key: string]: { title: string; description: string } } = {
    'dashboard': { title: 'Tableau de bord', description: 'Vue d\'ensemble du système ITSM' },
    'crud-managers': { title: 'CRUD Managers', description: 'Créer, lire, modifier et supprimer les managers' },
    'manage-teams': { title: 'Gestion des équipes', description: 'Lire et supprimer les équipes' },
    'manage-techs': { title: 'Gestion des techniciens', description: 'Lire et supprimer les techniciens' },
    'modify-specialties': { title: 'Modifier spécialités', description: 'Modifier spécialités et membres des équipes' },
    'all-tickets': { title: 'Tous les tickets', description: 'Consulter tous les tickets du système' },
    'multi-team-filters': { title: 'Filtres multi-équipes', description: 'Filtres avancés pour plusieurs équipes' },
    'blocked-tickets': { title: 'Tickets bloqués', description: 'Intervention sur tickets bloqués ou problématiques' },
    'overdue-tickets': { title: 'Tickets en retard', description: 'Voir les tickets en retard sur les SLA' },
    'update-sla': { title: 'Mise à jour SLA', description: 'Mettre à jour les SLA par catégorie/priorité' },
    'ticket-volume': { title: 'Volume de tickets', description: 'Volume de tickets par mois' },
    'satisfaction-rate': { title: 'Taux de satisfaction', description: 'Taux de satisfaction client' },
    'sla-compliance': { title: 'Conformité SLA', description: 'Pourcentage résolu dans les SLA' },
    'team-workload': { title: 'Charge des équipes', description: 'Charge de travail des équipes et techniciens' },
    'publish-announcement': { title: 'Publier annonce', description: 'Publier une nouvelle annonce' },
    'announcement-history': { title: 'Historique annonces', description: 'Historique des annonces publiées' },
    'manage-categories': { title: 'Catégories tickets', description: 'Gérer les catégories de tickets' },
    'manage-priorities': { title: 'Priorités', description: 'Gérer les niveaux de priorité' },
    'configure-notifications': { title: 'Notifications', description: 'Configurer les notifications système' }
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Verify user has admin role
    if (!this.currentUser || this.currentUser.role !== 'ADMIN') {
      console.warn('⚠️ Unauthorized access attempt to admin dashboard');
      this.router.navigate(['/login']);
      return;
    }

    console.log('✅ Admin dashboard loaded for:', this.currentUser.email);
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'A';
    return `${this.currentUser.prenom.charAt(0)}${this.currentUser.nom.charAt(0)}`.toUpperCase();
  }

  toggleSection(section: string): void {
    if (this.expandedSections.has(section)) {
      this.expandedSections.delete(section);
    } else {
      this.expandedSections.add(section);
    }
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    console.log('🔄 Active section changed to:', section);
  }

  getMenuItemClass(section: string): string {
    return this.activeSection === section
      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
      : 'text-slate-300 hover:text-white hover:bg-slate-700';
  }

  getSubmenuItemClass(section: string): string {
    return this.activeSection === section
      ? 'bg-red-500/20 text-red-300'
      : 'text-slate-400 hover:text-white hover:bg-slate-700';
  }

  getPageTitle(): string {
    return this.sectionInfo[this.activeSection]?.title || 'Section inconnue';
  }

  getPageDescription(): string {
    return this.sectionInfo[this.activeSection]?.description || 'Description non disponible';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
