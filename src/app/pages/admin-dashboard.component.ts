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

          <!-- Other Sections Content -->
          <div *ngIf="activeSection !== 'dashboard' && activeSection !== 'crud-managers'" class="bg-slate-800 rounded-xl p-8 border border-slate-700">
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
