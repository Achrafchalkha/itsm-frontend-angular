import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TechnicianService, Competence, TechnicianStats } from '../core/services/technician.service';
import { TechnicianManagementService, TechnicianResponse, CreateTechnicianRequest, CreateTechnicianResponse, UpdateTechnicianRequest } from '../core/services/technician-management.service';
import { TeamTicketsService, TeamTicketResponse, TeamTicketsParams } from '../core/services/team-tickets.service';
import { NotificationService, NotificationDTO } from '../core/services/notification.service';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  expanded?: boolean;
  children?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-900 text-white flex">
      <!-- Sidebar Navigation -->
      <aside class="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-slate-700">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold">IT</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">ITSM Manager</h1>
              <p class="text-sm text-slate-400">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2">
          <!-- Dashboard -->
          <div class="mb-6">
            <button
              (click)="setActiveView('dashboard')"
              [class]="getMenuItemClass('dashboard')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
              </svg>
              <span>Tableau de bord</span>
            </button>
          </div>

          <!-- Menu Items -->
          <div *ngFor="let item of menuItems" class="mb-2">
            <!-- Main Menu Item -->
            <button
              (click)="toggleMenuItem(item.id)"
              class="w-full flex items-center justify-between px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 group"
            >
              <div class="flex items-center space-x-3">
                <div [innerHTML]="item.icon" class="w-5 h-5 text-slate-400 group-hover:text-white"></div>
                <span class="font-medium">{{ item.title }}</span>
              </div>
              <svg 
                class="w-4 h-4 transition-transform duration-200"
                [class.rotate-180]="item.expanded"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Submenu -->
            <div 
              *ngIf="item.expanded && item.children" 
              class="ml-4 mt-2 space-y-1 border-l-2 border-slate-600 pl-4"
            >
              <button
                *ngFor="let child of item.children"
                (click)="setActiveView(child.id)"
                [class]="getSubMenuItemClass(child.id)"
              >
                <div [innerHTML]="child.icon" class="w-4 h-4"></div>
                <span class="flex-1 text-left">{{ child.title }}</span>
                <span 
                  *ngIf="child.badge" 
                  [class]="getBadgeClass(child.badgeColor || 'blue')"
                >
                  {{ child.badge }}
                </span>
              </button>
            </div>
          </div>
        </nav>

        <!-- User Actions -->
        <div class="p-4 border-t border-slate-700">
          <button
            (click)="logout()"
            class="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col">
        <!-- Top Header -->
        <header class="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white">{{ getActiveViewTitle() }}</h2>
              <p class="text-slate-400 text-sm">{{ getActiveViewDescription() }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <div class="relative">
                <button
                  (click)="toggleNotifications()"
                  class="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                  [class.text-blue-400]="showNotifications">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19c-5 0-8-3-8-6s4-6 9-6 9 3 9 6c0 1-1 3-2 3h-1l-1 1z"></path>
                  </svg>
                  <span *ngIf="unreadNotificationCount > 0"
                        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {{ unreadNotificationCount > 99 ? '99+' : unreadNotificationCount }}
                  </span>
                </button>

                <!-- Notifications Dropdown -->
                <div *ngIf="showNotifications"
                     class="absolute right-0 top-12 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 max-h-96 overflow-hidden">

                  <!-- Header -->
                  <div class="p-4 border-b border-slate-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-semibold text-white">Notifications</h3>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-slate-400">{{ notifications.length }} total</span>
                        <button
                          *ngIf="unreadNotificationCount > 0"
                          (click)="markAllNotificationsAsRead()"
                          class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          Tout marquer lu
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Loading State -->
                  <div *ngIf="isLoadingNotifications" class="p-6 text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p class="text-slate-400 mt-2 text-sm">Chargement des notifications...</p>
                  </div>

                  <!-- Notifications List -->
                  <div *ngIf="!isLoadingNotifications" class="max-h-80 overflow-y-auto">
                    <!-- Empty State -->
                    <div *ngIf="notifications.length === 0" class="p-6 text-center">
                      <svg class="w-12 h-12 text-slate-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19c-5 0-8-3-8-6s4-6 9-6 9 3 9 6c0 1-1 3-2 3h-1l-1 1z"></path>
                      </svg>
                      <p class="text-slate-400 text-sm">Aucune notification</p>
                      <p class="text-slate-500 text-xs mt-1">Les nouvelles notifications apparaîtront ici</p>
                    </div>

                    <!-- Notifications Items -->
                    <div *ngFor="let notification of notifications; trackBy: trackNotification"
                         class="p-4 border-b border-slate-700/30 hover:bg-slate-700/30 transition-all duration-200 group relative"
                         [class]="!notification.readStatus ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-l-4 border-l-blue-500' : ''">

                      <div class="flex items-start space-x-3">
                        <!-- Icon -->
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                             [class]="getNotificationColor(notification.priority)">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getNotificationIcon(notification.type)"></path>
                          </svg>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                          <div class="flex items-start justify-between mb-1">
                            <h4 class="text-sm font-medium text-white cursor-pointer hover:text-blue-300 transition-colors"
                                [title]="getCleanNotificationTitle(notification.title)"
                                (click)="toggleNotificationExpanded(notification.id)">
                              {{ getCleanNotificationTitle(notification.title) }}
                            </h4>
                            <div class="flex items-center space-x-2 ml-2">
                              <button *ngIf="!notification.readStatus"
                                      (click)="markNotificationAsRead(notification)"
                                      class="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20"
                                      title="Marquer comme lu">
                                Lue
                              </button>
                              <span class="text-xs text-slate-400">{{ getNotificationTime(notification.createdAt) }}</span>
                              <div *ngIf="!notification.readStatus" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>

                          <div class="text-sm text-slate-300 leading-relaxed cursor-pointer"
                               (click)="toggleNotificationExpanded(notification.id)"
                               [title]="getCleanNotificationMessage(notification.message)">
                            <p [class]="isNotificationExpanded(notification.id) ? '' : 'line-clamp-2'">
                              {{ getCleanNotificationMessage(notification.message) }}
                            </p>
                            <span *ngIf="!isNotificationExpanded(notification.id) && getCleanNotificationMessage(notification.message).length > 100"
                                  class="text-blue-400 text-xs hover:text-blue-300 transition-colors">
                              ... Cliquer pour voir plus
                            </span>
                          </div>

                          <!-- Priority Badge -->
                          <div class="mt-2">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                  [class]="notification.priority === 'HIGH' ? 'bg-red-500/10 text-red-400' :
                                           notification.priority === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400' :
                                           'bg-blue-500/10 text-blue-400'">
                              {{ notification.priority === 'HIGH' ? 'Haute' :
                                 notification.priority === 'MEDIUM' ? 'Moyenne' : 'Normale' }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <div class="flex-1 p-6 overflow-auto">
          <div [ngSwitch]="activeView">
            <!-- Dashboard View -->
            <div *ngSwitchCase="'dashboard'">
              <ng-container [ngTemplateOutlet]="dashboardTemplate"></ng-container>
            </div>

            <!-- Technicians Management -->
            <div *ngSwitchCase="'technicians-crud'">
              <ng-container [ngTemplateOutlet]="techniciansTemplate"></ng-container>
            </div>

            <div *ngSwitchCase="'skills-management'">
              <ng-container [ngTemplateOutlet]="skillsTemplate"></ng-container>
            </div>

            <div *ngSwitchCase="'technician-status'">
              <ng-container [ngTemplateOutlet]="technicianStatusTemplate"></ng-container>
            </div>

            <!-- Team Tickets -->
            <div *ngSwitchCase="'all-tickets'">
              <ng-container [ngTemplateOutlet]="allTicketsTemplate"></ng-container>
            </div>

            <div *ngSwitchCase="'filter-technician'">
              <ng-container [ngTemplateOutlet]="filterTechnicianTemplate"></ng-container>
            </div>

            <div *ngSwitchCase="'filter-status'">
              <ng-container [ngTemplateOutlet]="filterStatusTemplate"></ng-container>
            </div>

            <!-- Ticket Reassignment -->
            <div *ngSwitchCase="'reassign-tickets'">
              <ng-container [ngTemplateOutlet]="reassignTemplate"></ng-container>
            </div>

            <!-- SLA Supervision -->
            <div *ngSwitchCase="'sla-expiring'">
              <ng-container [ngTemplateOutlet]="slaExpiringTemplate"></ng-container>
            </div>

            <div *ngSwitchCase="'sla-alerts'">
              <ng-container [ngTemplateOutlet]="slaAlertsTemplate"></ng-container>
            </div>

            <!-- KPI Tracking -->
            <div *ngSwitchCase="'mttr'">
              <ng-container [ngTemplateOutlet]="mttrTemplate"></ng-container>
            </div>

            <div *ngSwitchCase="'sla-percentage'">
              <ng-container [ngTemplateOutlet]="slaPercentageTemplate"></ng-container>
            </div>

            <div *ngSwitchCase="'category-distribution'">
              <ng-container [ngTemplateOutlet]="categoryDistributionTemplate"></ng-container>
            </div>

            <div *ngSwitchCase="'workload-distribution'">
              <ng-container [ngTemplateOutlet]="workloadTemplate"></ng-container>
            </div>

            <!-- Default -->
            <div *ngSwitchDefault>
              <div class="text-center py-12">
                <div class="text-slate-400 text-lg">Sélectionnez une option dans le menu</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Templates -->

    <!-- Dashboard Template -->
    <ng-template #dashboardTemplate>
      <div class="space-y-6">
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Techniciens</p>
                <p class="text-2xl font-bold text-white">8</p>
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
                <p class="text-sm font-medium text-slate-400">Tickets Résolus</p>
                <p class="text-2xl font-bold text-white">24</p>
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
                <p class="text-sm font-medium text-slate-400">En Cours</p>
                <p class="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Urgents</p>
                <p class="text-2xl font-bold text-white">3</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-lg font-semibold text-white mb-4">Activités Récentes de l'Équipe</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-medium">JD</span>
                </div>
                <div>
                  <p class="text-white font-medium">Jean Dupont</p>
                  <p class="text-slate-400 text-sm">A résolu le ticket #1234 - Problème réseau</p>
                </div>
              </div>
              <span class="text-slate-400 text-sm">Il y a 2h</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-medium">ML</span>
                </div>
                <div>
                  <p class="text-white font-medium">Marie Leroy</p>
                  <p class="text-slate-400 text-sm">A pris en charge le ticket #1235 - Installation logiciel</p>
                </div>
              </div>
              <span class="text-slate-400 text-sm">Il y a 4h</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-medium">PB</span>
                </div>
                <div>
                  <p class="text-white font-medium">Pierre Bernard</p>
                  <p class="text-slate-400 text-sm">Ticket #1236 en attente de validation - Mise à jour système</p>
                </div>
              </div>
              <span class="text-slate-400 text-sm">Il y a 6h</span>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Technicians CRUD Template -->
    <ng-template #techniciansTemplate>
      <div class="space-y-6">
        <!-- Header with Stats -->
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-white">Gestion des Techniciens</h3>
            <p class="text-slate-400 text-sm" *ngIf="technicianStats">
              {{ technicianStats.activeTechnicians }} actifs sur {{ technicianStats.totalTechnicians }} techniciens
            </p>
          </div>
          <button
            (click)="openCreateTechnicianModal()"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Ajouter un Technicien
          </button>
        </div>

        <!-- Error Message -->
        <div *ngIf="error" class="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span class="text-red-300">{{ error }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Technicians Table -->
        <div *ngIf="!loading" class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-700">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Technicien</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Compétences</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Charge</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr *ngFor="let technician of technicians" class="hover:bg-slate-700/50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span class="text-white font-medium text-sm">
                          {{ technician.prenom.charAt(0) }}{{ technician.nom.charAt(0) }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-white">{{ technician.prenom }} {{ technician.nom }}</div>
                        <div class="text-sm text-slate-400">{{ technician.specialite }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-slate-300">{{ technician.email }}</div>
                    <div class="text-sm text-slate-400">{{ technician.telephone }}</div>
                    <div class="text-sm text-slate-400">{{ technician.localisation }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-slate-300">
                      {{ getCompetenceNames(technician.competencesJson) }}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="w-16 bg-slate-700 rounded-full h-2 mr-2">
                        <div
                          [class]="getWorkloadColor(technician.chargeActuelle)"
                          class="h-2 rounded-full transition-all"
                          [style.width.%]="getWorkloadPercentage(technician.chargeActuelle)"
                        ></div>
                      </div>
                      <span class="text-sm text-slate-300">{{ technician.chargeActuelle }}/10</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      [class]="technician.actif ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ technician.actif ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex space-x-2">
                      <button
                        (click)="openEditTechnicianModal(technician)"
                        class="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                        title="Modifier"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        (click)="toggleTechnicianStatus(technician)"
                        [class]="technician.actif ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'"
                        class="p-1 rounded transition-colors"
                        [title]="technician.actif ? 'Désactiver' : 'Activer'"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </button>

                    </div>
                  </td>
                </tr>
                <tr *ngIf="technicians.length === 0">
                  <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                    Aucun technicien trouvé. Cliquez sur "Ajouter un Technicien" pour commencer.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Skills Management Template -->
    <ng-template #skillsTemplate>
      <div class="space-y-6">
        <!-- Header with Search and Filters -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 class="text-xl font-bold text-white">Gestion des Compétences</h3>

          <!-- Search and Filters -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="competenceSearchTerm"
                (input)="filterCompetences()"
                placeholder="Rechercher par compétence..."
                class="w-full sm:w-64 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- Category Filter -->
            <select
              [(ngModel)]="selectedCompetenceCategory"
              (change)="filterCompetences()"
              class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
              <option value="SECURITE">Sécurité</option>
              <option value="RESEAU">Réseau</option>
              <option value="SYSTEME">Système</option>
              <option value="DEVELOPPEMENT">Développement</option>
              <option value="BASE_DE_DONNEES">Base de données</option>
              <option value="CLOUD">Cloud</option>
              <option value="AUDIT">Audit</option>
            </select>

            <!-- Level Filter -->
            <select
              [(ngModel)]="selectedCompetenceLevel"
              (change)="filterCompetences()"
              class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les niveaux</option>
              <option value="DEBUTANT">Débutant</option>
              <option value="INTERMEDIAIRE">Intermédiaire</option>
              <option value="AVANCE">Avancé</option>
              <option value="EXPERT">Expert</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <!-- Competences Overview Cards -->
        <div *ngIf="!loading && !error" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            *ngFor="let technician of filteredTechniciansForCompetences"
            class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors"
          >
            <!-- Technician Header -->
            <div class="p-4 border-b border-slate-700">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-lg font-semibold text-white">
                    {{ technician.prenom }} {{ technician.nom }}
                  </h4>
                  <p class="text-sm text-slate-400">{{ technician.specialite }}</p>
                  <p class="text-xs text-slate-500">{{ technician.email }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    [class]="technician.actif ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ technician.actif ? 'Actif' : 'Inactif' }}
                  </span>
                  <button
                    (click)="openCompetenceModal(technician)"
                    class="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                    title="Gérer les compétences"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Competences List -->
            <div class="p-4">
              <div class="space-y-3">
                <div
                  *ngFor="let competence of parseCompetences(technician.competencesJson)"
                  class="bg-slate-700 rounded-lg p-3 border border-slate-600"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h5 class="font-medium text-white">{{ competence.nom }}</h5>
                      <p class="text-sm text-slate-400 mt-1">{{ competence.description }}</p>
                      <div class="flex items-center space-x-2 mt-2">
                        <span
                          [class]="getCategoryColor(competence.categorie)"
                          class="px-2 py-1 rounded text-xs font-medium"
                        >
                          {{ competence.categorie }}
                        </span>
                        <span
                          [class]="getLevelColor(competence.niveau)"
                          class="px-2 py-1 rounded text-xs font-medium"
                        >
                          {{ competence.niveau }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No competences message -->
                <div
                  *ngIf="parseCompetences(technician.competencesJson).length === 0"
                  class="text-center py-4 text-slate-400"
                >
                  <svg class="w-8 h-8 mx-auto mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  <p class="text-sm">Aucune compétence définie</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          *ngIf="!loading && !error && filteredTechniciansForCompetences.length === 0"
          class="text-center py-12"
        >
          <svg class="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h3 class="text-lg font-medium text-slate-300 mb-2">Aucun technicien trouvé</h3>
          <p class="text-slate-400">Essayez de modifier vos critères de recherche</p>
        </div>
      </div>
    </ng-template>

    <!-- Technician Status Template -->
    <ng-template #technicianStatusTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Activer / Désactiver Techniciens</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p class="text-slate-400">Interface de gestion du statut des techniciens...</p>
        </div>
      </div>
    </ng-template>

    <!-- All Tickets Template -->
    <ng-template #allTicketsTemplate>
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-2xl font-bold text-white mb-2">Tous les Tickets de l'Équipe</h3>
            <div *ngIf="!teamTicketsLoading && teamTickets.length > 0" class="flex items-center space-x-6 text-sm">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-slate-300">{{ teamTickets.length }} tickets au total</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-slate-300">{{ getTicketCountByStatus('OUVERT') }} ouverts</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-slate-300">{{ getTicketCountByStatus('EN_COURS') }} en cours</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span class="text-slate-300">{{ getUnassignedTicketsCount() }} non assignés</span>
              </div>
            </div>
          </div>
          <button
            (click)="loadTeamTickets()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
            [disabled]="teamTicketsLoading">
            <svg *ngIf="!teamTicketsLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg *ngIf="teamTicketsLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span *ngIf="teamTicketsLoading">Chargement...</span>
            <span *ngIf="!teamTicketsLoading">Actualiser</span>
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <div class="flex items-center mb-4">
            <svg class="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
            </svg>
            <h4 class="text-lg font-semibold text-white">Filtres</h4>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="flex items-center text-sm font-medium text-slate-300 mb-3">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Statut
              </label>
              <select
                [(ngModel)]="selectedTicketStatusFilter"
                (change)="filterTeamTickets()"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option value="">Tous les statuts</option>
                <option value="OUVERT">🟢 Ouvert</option>
                <option value="EN_COURS">🔵 En cours</option>
                <option value="RESOLU">🟡 Résolu</option>
                <option value="FERME">⚫ Fermé</option>
              </select>
            </div>

            <div>
              <label class="flex items-center text-sm font-medium text-slate-300 mb-3">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Priorité
              </label>
              <select
                [(ngModel)]="selectedTicketPriorityFilter"
                (change)="filterTeamTickets()"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option value="">Toutes les priorités</option>
                <option value="FAIBLE">⬇️ Faible</option>
                <option value="NORMALE">➡️ Normale</option>
                <option value="HAUTE">⬆️ Haute</option>
                <option value="CRITIQUE">🔴 Critique</option>
              </select>
            </div>

            <div>
              <label class="flex items-center text-sm font-medium text-slate-300 mb-3">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Recherche
              </label>
              <div class="relative">
                <input
                  type="text"
                  [(ngModel)]="ticketSearchTerm"
                  (input)="filterTeamTickets()"
                  placeholder="Rechercher par titre, description..."
                  class="w-full px-4 py-3 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <svg class="absolute left-3 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Filter Summary -->
          <div *ngIf="selectedTicketStatusFilter || selectedTicketPriorityFilter || ticketSearchTerm"
               class="mt-4 pt-4 border-t border-slate-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 text-sm text-slate-300">
                <span>Filtres actifs:</span>
                <span *ngIf="selectedTicketStatusFilter" class="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">
                  Statut: {{ getStatusLabel(selectedTicketStatusFilter) }}
                </span>
                <span *ngIf="selectedTicketPriorityFilter" class="px-2 py-1 bg-orange-900 text-orange-200 rounded text-xs">
                  Priorité: {{ getPriorityLabel(selectedTicketPriorityFilter) }}
                </span>
                <span *ngIf="ticketSearchTerm" class="px-2 py-1 bg-green-900 text-green-200 rounded text-xs">
                  Recherche: "{{ ticketSearchTerm }}"
                </span>
              </div>
              <button
                (click)="clearAllFilters()"
                class="text-xs text-slate-400 hover:text-white transition-colors">
                Effacer tous les filtres
              </button>
            </div>
          </div>
        </div>

        <!-- Tickets List -->
        <div class="bg-slate-800 rounded-xl border border-slate-700">
          <div *ngIf="teamTicketsLoading" class="p-12 text-center">
            <div class="flex flex-col items-center space-y-4">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <div>
                <p class="text-white font-medium">Chargement des tickets de l'équipe...</p>
                <p class="text-slate-400 text-sm mt-1">Récupération des données depuis le serveur</p>
              </div>
            </div>
          </div>

          <div *ngIf="teamTicketsError" class="p-12 text-center">
            <div class="flex flex-col items-center space-y-4">
              <svg class="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <p class="text-red-400 font-medium">{{ teamTicketsError }}</p>
                <p class="text-slate-400 text-sm mt-1">Une erreur s'est produite lors du chargement</p>
              </div>
              <button
                (click)="loadTeamTickets()"
                class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Réessayer</span>
              </button>
            </div>
          </div>

          <div *ngIf="!teamTicketsLoading && !teamTicketsError">
            <div *ngIf="filteredTeamTickets.length === 0 && teamTickets.length === 0" class="p-12 text-center">
              <div class="flex flex-col items-center space-y-4">
                <svg class="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div>
                  <p class="text-slate-300 font-medium">Aucun ticket trouvé</p>
                  <p class="text-slate-400 text-sm mt-1">Votre équipe n'a pas encore de tickets assignés</p>
                </div>
              </div>
            </div>

            <div *ngIf="filteredTeamTickets.length === 0 && teamTickets.length > 0" class="p-12 text-center">
              <div class="flex flex-col items-center space-y-4">
                <svg class="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <div>
                  <p class="text-slate-300 font-medium">Aucun ticket ne correspond aux filtres</p>
                  <p class="text-slate-400 text-sm mt-1">{{ teamTickets.length }} tickets au total, mais aucun ne correspond à vos critères</p>
                </div>
                <button
                  (click)="clearAllFilters()"
                  class="mt-4 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors">
                  Effacer les filtres
                </button>
              </div>
            </div>

            <div *ngIf="filteredTeamTickets.length > 0" class="space-y-4">
              <div
                *ngFor="let ticket of filteredTeamTickets | slice:(currentTicketsPage * ticketsPageSize):(currentTicketsPage * ticketsPageSize + ticketsPageSize)"
                class="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:shadow-lg">

                <!-- Header with Title and Status/Priority Badges -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-white mb-2 leading-tight">{{ ticket.titre }}</h4>
                    <div class="flex items-center space-x-2">
                      <span
                        class="px-3 py-1 text-xs font-medium rounded-full border"
                        [ngClass]="{
                          'bg-green-900 text-green-200 border-green-700': ticket.statut === 'OUVERT',
                          'bg-blue-900 text-blue-200 border-blue-700': ticket.statut === 'EN_COURS',
                          'bg-yellow-900 text-yellow-200 border-yellow-700': ticket.statut === 'RESOLU',
                          'bg-gray-900 text-gray-200 border-gray-700': ticket.statut === 'FERME'
                        }">
                        {{ getStatusLabel(ticket.statut) }}
                      </span>
                      <span
                        class="px-3 py-1 text-xs font-medium rounded-full border"
                        [ngClass]="{
                          'bg-gray-800 text-gray-300 border-gray-600': ticket.priorite === 'FAIBLE',
                          'bg-blue-800 text-blue-200 border-blue-600': ticket.priorite === 'NORMALE',
                          'bg-orange-800 text-orange-200 border-orange-600': ticket.priorite === 'HAUTE',
                          'bg-red-800 text-red-200 border-red-600': ticket.priorite === 'CRITIQUE'
                        }">
                        {{ getPriorityLabel(ticket.priorite) }}
                      </span>
                      <span class="px-3 py-1 text-xs font-medium rounded-full bg-slate-600 text-slate-200 border border-slate-500">
                        {{ ticket.categorie }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right text-xs text-slate-400">
                    <div>ID: {{ ticket.id | slice:0:8 }}...</div>
                  </div>
                </div>

                <!-- Description -->
                <div class="mb-4">
                  <p class="text-slate-300 text-sm leading-relaxed">
                    {{ ticket.description | slice:0:200 }}
                    <span *ngIf="ticket.description.length > 200" class="text-slate-500">...</span>
                  </p>
                </div>

                <!-- Assignment Information -->
                <div class="mb-4 p-3 bg-slate-800 rounded-lg border border-slate-600">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-2 h-2 rounded-full"
                           [ngClass]="{
                             'bg-green-400': ticket.technicienId,
                             'bg-orange-400': !ticket.technicienId
                           }"></div>
                      <div>
                        <div *ngIf="ticket.technicienId && ticket.technicienPrenom && ticket.technicienNom" class="text-sm">
                          <span class="text-white font-medium">{{ ticket.technicienPrenom }} {{ ticket.technicienNom }}</span>
                          <span *ngIf="ticket.technicienSpecialite" class="text-slate-400 ml-2">
                            • {{ ticket.technicienSpecialite }}
                          </span>
                          <div *ngIf="ticket.technicienEmail" class="text-xs text-slate-500 mt-1">
                            {{ ticket.technicienEmail }}
                          </div>
                        </div>
                        <div *ngIf="ticket.technicienId && (!ticket.technicienPrenom || !ticket.technicienNom)" class="text-sm">
                          <span class="text-blue-300">Assigné</span>
                          <span class="text-slate-500 ml-2">ID: {{ ticket.technicienId | slice:0:8 }}...</span>
                        </div>
                        <div *ngIf="!ticket.technicienId" class="text-sm">
                          <span class="text-orange-300 font-medium">Non assigné</span>
                          <span class="text-slate-500 ml-2">En attente d'attribution</span>
                        </div>
                      </div>
                    </div>
                    <div *ngIf="ticket.technicienId" class="text-xs text-slate-500">
                      Assigné
                    </div>
                  </div>
                </div>

                <!-- Timestamps and Metadata -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <div class="text-slate-400">Créé le</div>
                      <div class="text-white font-medium">{{ ticket.dateCreation | date:'dd/MM/yyyy à HH:mm' }}</div>
                    </div>
                  </div>

                  <div *ngIf="ticket.dateModification" class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <div>
                      <div class="text-slate-400">Modifié le</div>
                      <div class="text-white font-medium">{{ ticket.dateModification | date:'dd/MM/yyyy à HH:mm' }}</div>
                    </div>
                  </div>

                  <div *ngIf="ticket.dateFermeture" class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <div class="text-slate-400">Fermé le</div>
                      <div class="text-white font-medium">{{ ticket.dateFermeture | date:'dd/MM/yyyy à HH:mm' }}</div>
                    </div>
                  </div>
                </div>

                <!-- Resolution Comment (if exists) -->
                <div *ngIf="ticket.commentaireResolution" class="mt-4 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                  <div class="flex items-start space-x-2">
                    <svg class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <div class="text-green-300 text-xs font-medium mb-1">Commentaire de résolution</div>
                      <div class="text-green-100 text-sm">{{ ticket.commentaireResolution }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div *ngIf="filteredTeamTickets.length > ticketsPageSize" class="mt-6">
              <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="text-sm text-slate-300">
                      <span class="font-medium text-white">
                        {{ currentTicketsPage * ticketsPageSize + 1 }} -
                        {{ Math.min((currentTicketsPage + 1) * ticketsPageSize, filteredTeamTickets.length) }}
                      </span>
                      <span class="text-slate-400">sur {{ filteredTeamTickets.length }} tickets</span>
                    </div>
                    <div class="text-xs text-slate-500">
                      Page {{ currentTicketsPage + 1 }} sur {{ Math.ceil(filteredTeamTickets.length / ticketsPageSize) }}
                    </div>
                  </div>

                  <div class="flex items-center space-x-2">
                    <button
                      (click)="currentTicketsPage = 0"
                      [disabled]="currentTicketsPage === 0"
                      class="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Première page">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                      </svg>
                    </button>

                    <button
                      (click)="currentTicketsPage = currentTicketsPage - 1"
                      [disabled]="currentTicketsPage === 0"
                      class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                      <span>Précédent</span>
                    </button>

                    <button
                      (click)="currentTicketsPage = currentTicketsPage + 1"
                      [disabled]="(currentTicketsPage + 1) * ticketsPageSize >= filteredTeamTickets.length"
                      class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2">
                      <span>Suivant</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>

                    <button
                      (click)="currentTicketsPage = Math.ceil(filteredTeamTickets.length / ticketsPageSize) - 1"
                      [disabled]="(currentTicketsPage + 1) * ticketsPageSize >= filteredTeamTickets.length"
                      class="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Dernière page">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Filter Technician Template -->
    <ng-template #filterTechnicianTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Filtrer par Technicien / Priorité</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p class="text-slate-400">Filtres avancés pour les tickets...</p>
        </div>
      </div>
    </ng-template>

    <!-- Filter Status Template -->
    <ng-template #filterStatusTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Filtrer par Statut</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p class="text-slate-400">Filtrage des tickets par statut...</p>
        </div>
      </div>
    </ng-template>

    <!-- Reassign Template -->
    <ng-template #reassignTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Réassigner un Ticket</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p class="text-slate-400">Interface de réassignation des tickets...</p>
        </div>
      </div>
    </ng-template>

    <!-- SLA Expiring Template -->
    <ng-template #slaExpiringTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Tickets Proches de l'Échéance</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-medium text-white">Alertes SLA</h4>
            <span class="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm font-medium">5 tickets</span>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div>
                <p class="text-white font-medium">Ticket #1240 - Panne serveur critique</p>
                <p class="text-red-300 text-sm">Expire dans 2h 15min</p>
              </div>
              <span class="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">CRITIQUE</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div>
                <p class="text-white font-medium">Ticket #1238 - Problème réseau</p>
                <p class="text-yellow-300 text-sm">Expire dans 4h 30min</p>
              </div>
              <span class="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">URGENT</span>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- SLA Alerts Template -->
    <ng-template #slaAlertsTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Alertes de Dépassement SLA</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p class="text-slate-400">Gestion des alertes en cas de dépassement...</p>
        </div>
      </div>
    </ng-template>

    <!-- MTTR Template -->
    <ng-template #mttrTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Temps Moyen de Résolution (MTTR)</h3>
        
        <!-- MTTR Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors">
            <div class="text-center">
              <div class="flex items-center justify-center mb-3">
                <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-blue-400 mb-2">2h 45min</div>
              <div class="text-slate-400 text-sm">MTTR Global</div>
              <div class="mt-2 text-xs text-green-400">↓ 15% vs mois dernier</div>
            </div>
          </div>
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-green-500 transition-colors">
            <div class="text-center">
              <div class="flex items-center justify-center mb-3">
                <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-green-400 mb-2">1h 30min</div>
              <div class="text-slate-400 text-sm">MTTR Cette Semaine</div>
              <div class="mt-2 text-xs text-green-400">↓ 25% amélioration</div>
            </div>
          </div>
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-yellow-500 transition-colors">
            <div class="text-center">
              <div class="flex items-center justify-center mb-3">
                <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-yellow-400 mb-2">3h 15min</div>
              <div class="text-slate-400 text-sm">MTTR Mois Dernier</div>
              <div class="mt-2 text-xs text-slate-400">Référence</div>
            </div>
          </div>
        </div>
        
        <!-- MTTR Trend Chart -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 class="text-lg font-semibold text-white mb-4">Évolution du MTTR (7 derniers jours)</h4>
          <div class="relative h-48">
            <!-- Chart Background -->
            <div class="absolute inset-0 flex items-end justify-between px-4 pb-8">
              <!-- Bar Chart -->
              <div class="flex items-end space-x-2 w-full">
                <div class="flex-1 flex flex-col items-center">
                  <div class="bg-blue-500 rounded-t" style="height: 60px; width: 20px;"></div>
                  <div class="text-xs text-slate-400 mt-2">Lun</div>
                  <div class="text-xs text-blue-400">2h</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="bg-blue-500 rounded-t" style="height: 45px; width: 20px;"></div>
                  <div class="text-xs text-slate-400 mt-2">Mar</div>
                  <div class="text-xs text-blue-400">1h30</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="bg-blue-500 rounded-t" style="height: 75px; width: 20px;"></div>
                  <div class="text-xs text-slate-400 mt-2">Mer</div>
                  <div class="text-xs text-blue-400">2h30</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="bg-green-500 rounded-t" style="height: 40px; width: 20px;"></div>
                  <div class="text-xs text-slate-400 mt-2">Jeu</div>
                  <div class="text-xs text-green-400">1h20</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="bg-green-500 rounded-t" style="height: 35px; width: 20px;"></div>
                  <div class="text-xs text-slate-400 mt-2">Ven</div>
                  <div class="text-xs text-green-400">1h10</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="bg-yellow-500 rounded-t" style="height: 50px; width: 20px;"></div>
                  <div class="text-xs text-slate-400 mt-2">Sam</div>
                  <div class="text-xs text-yellow-400">1h40</div>
                </div>
                <div class="flex-1 flex flex-col items-center">
                  <div class="bg-green-500 rounded-t" style="height: 30px; width: 20px;"></div>
                  <div class="text-xs text-slate-400 mt-2">Dim</div>
                  <div class="text-xs text-green-400">1h</div>
                </div>
              </div>
            </div>
            <!-- Y-axis labels -->
            <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 py-2">
              <span>3h</span>
              <span>2h</span>
              <span>1h</span>
              <span>0h</span>
            </div>
          </div>
        </div>
        
        <!-- MTTR by Priority -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 class="text-lg font-semibold text-white mb-4">MTTR par Priorité</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-white">Critique</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-32 bg-slate-600 rounded-full h-2">
                  <div class="bg-red-500 h-2 rounded-full" style="width: 25%"></div>
                </div>
                <span class="text-red-400 font-medium w-16 text-right">45min</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span class="text-white">Élevée</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-32 bg-slate-600 rounded-full h-2">
                  <div class="bg-orange-500 h-2 rounded-full" style="width: 45%"></div>
                </div>
                <span class="text-orange-400 font-medium w-16 text-right">1h20</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-white">Moyenne</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-32 bg-slate-600 rounded-full h-2">
                  <div class="bg-yellow-500 h-2 rounded-full" style="width: 70%"></div>
                </div>
                <span class="text-yellow-400 font-medium w-16 text-right">2h30</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-white">Faible</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-32 bg-slate-600 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 90%"></div>
                </div>
                <span class="text-green-400 font-medium w-16 text-right">4h15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- SLA Percentage Template -->
    <ng-template #slaPercentageTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">% de Tickets dans les Délais SLA</h3>
        
        <!-- SLA Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- SLA Gauge Chart -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 class="text-lg font-semibold text-white mb-4">Performance SLA Globale</h4>
            <div class="relative flex items-center justify-center h-48">
              <!-- Circular Progress -->
              <svg class="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#374151" stroke-width="8"></circle>
                <!-- Progress circle -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" stroke-width="8" 
                        stroke-dasharray="251.2" stroke-dashoffset="14.6" 
                        class="transition-all duration-1000 ease-out" stroke-linecap="round"></circle>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl font-bold text-green-400">94.2%</div>
                  <div class="text-slate-400 text-sm">SLA Respecté</div>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <div class="text-sm text-slate-400">Objectif: 95%</div>
              <div class="text-xs text-yellow-400 mt-1">↑ 2.1% vs mois dernier</div>
            </div>
          </div>
          
          <!-- SLA Details -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 class="text-lg font-semibold text-white mb-4">Détails SLA</h4>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div class="text-white font-medium">Dans les délais</div>
                    <div class="text-slate-400 text-sm">Tickets résolus à temps</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-green-400">156</div>
                  <div class="text-slate-400 text-sm">tickets</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <div class="text-white font-medium">Hors délais</div>
                    <div class="text-slate-400 text-sm">Tickets en retard</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-red-400">10</div>
                  <div class="text-slate-400 text-sm">tickets</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div class="text-white font-medium">À risque</div>
                    <div class="text-slate-400 text-sm">Tickets proches de l'échéance</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-yellow-400">8</div>
                  <div class="text-slate-400 text-sm">tickets</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- SLA by Priority -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 class="text-lg font-semibold text-white mb-4">Performance SLA par Priorité</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-white font-medium">Critique</span>
                <span class="text-slate-400 text-sm">(SLA: 2h)</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-32 bg-slate-600 rounded-full h-3">
                  <div class="bg-green-500 h-3 rounded-full" style="width: 98%"></div>
                </div>
                <span class="text-green-400 font-bold w-16 text-right">98%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span class="text-white font-medium">Élevée</span>
                <span class="text-slate-400 text-sm">(SLA: 4h)</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-32 bg-slate-600 rounded-full h-3">
                  <div class="bg-green-500 h-3 rounded-full" style="width: 96%"></div>
                </div>
                <span class="text-green-400 font-bold w-16 text-right">96%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-white font-medium">Moyenne</span>
                <span class="text-slate-400 text-sm">(SLA: 8h)</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-32 bg-slate-600 rounded-full h-3">
                  <div class="bg-green-500 h-3 rounded-full" style="width: 94%"></div>
                </div>
                <span class="text-green-400 font-bold w-16 text-right">94%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-white font-medium">Faible</span>
                <span class="text-slate-400 text-sm">(SLA: 24h)</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-32 bg-slate-600 rounded-full h-3">
                  <div class="bg-yellow-500 h-3 rounded-full" style="width: 89%"></div>
                </div>
                <span class="text-yellow-400 font-bold w-16 text-right">89%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- SLA Trend -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 class="text-lg font-semibold text-white mb-4">Évolution SLA (30 derniers jours)</h4>
          <div class="relative h-32">
            <!-- Line Chart Simulation -->
            <div class="absolute inset-0 flex items-end justify-between px-4 pb-4">
              <div class="flex items-end space-x-1 w-full h-full">
                <!-- Data points -->
                <div class="flex-1 flex flex-col justify-end">
                  <div class="w-1 bg-green-500 rounded-t" style="height: 85%"></div>
                </div>
                <div class="flex-1 flex flex-col justify-end">
                  <div class="w-1 bg-green-500 rounded-t" style="height: 88%"></div>
                </div>
                <div class="flex-1 flex flex-col justify-end">
                  <div class="w-1 bg-green-500 rounded-t" style="height: 92%"></div>
                </div>
                <div class="flex-1 flex flex-col justify-end">
                  <div class="w-1 bg-green-500 rounded-t" style="height: 90%"></div>
                </div>
                <div class="flex-1 flex flex-col justify-end">
                  <div class="w-1 bg-green-500 rounded-t" style="height: 94%"></div>
                </div>
                <div class="flex-1 flex flex-col justify-end">
                  <div class="w-1 bg-green-500 rounded-t" style="height: 96%"></div>
                </div>
                <div class="flex-1 flex flex-col justify-end">
                  <div class="w-1 bg-green-500 rounded-t" style="height: 94%"></div>
                </div>
              </div>
            </div>
            <!-- Y-axis labels -->
            <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 py-1">
              <span>100%</span>
              <span>95%</span>
              <span>90%</span>
              <span>85%</span>
            </div>
          </div>
          <div class="flex justify-between text-xs text-slate-400 mt-2 px-4">
            <span>Il y a 30j</span>
            <span>Il y a 20j</span>
            <span>Il y a 10j</span>
            <span>Aujourd'hui</span>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Category Distribution Template -->
    <ng-template #categoryDistributionTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Répartition par Catégorie</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Pie Chart Visualization -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 class="text-lg font-semibold text-white mb-4">Distribution Visuelle</h4>
            <div class="relative h-64 flex items-center justify-center">
              <!-- SVG Pie Chart -->
              <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <!-- Hardware - 35% -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" stroke-width="20" 
                        stroke-dasharray="35 65" stroke-dashoffset="0" class="transition-all duration-500"></circle>
                <!-- Software - 25% -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" stroke-width="20" 
                        stroke-dasharray="25 75" stroke-dashoffset="-35" class="transition-all duration-500"></circle>
                <!-- Réseau - 20% -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" stroke-width="20" 
                        stroke-dasharray="20 80" stroke-dashoffset="-60" class="transition-all duration-500"></circle>
                <!-- Accès - 15% -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" stroke-width="20" 
                        stroke-dasharray="15 85" stroke-dashoffset="-80" class="transition-all duration-500"></circle>
                <!-- Autre - 5% -->
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8B5CF6" stroke-width="20" 
                        stroke-dasharray="5 95" stroke-dashoffset="-95" class="transition-all duration-500"></circle>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-2xl font-bold text-white">{{ teamTickets.length }}</div>
                  <div class="text-slate-400 text-sm">Total</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Category Details -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 class="text-lg font-semibold text-white mb-4">Détails par Catégorie</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span class="text-white font-medium">Hardware</span>
                </div>
                <div class="text-right">
                  <div class="text-white font-bold">{{ getTicketCountByCategory('Hardware') }}</div>
                  <div class="text-slate-400 text-sm">35%</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span class="text-white font-medium">Software</span>
                </div>
                <div class="text-right">
                  <div class="text-white font-bold">{{ getTicketCountByCategory('Software') }}</div>
                  <div class="text-slate-400 text-sm">25%</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span class="text-white font-medium">Réseau</span>
                </div>
                <div class="text-right">
                  <div class="text-white font-bold">{{ getTicketCountByCategory('Réseau') }}</div>
                  <div class="text-slate-400 text-sm">20%</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span class="text-white font-medium">Accès</span>
                </div>
                <div class="text-right">
                  <div class="text-white font-bold">{{ getTicketCountByCategory('Accès') }}</div>
                  <div class="text-slate-400 text-sm">15%</div>
                </div>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span class="text-white font-medium">Autre</span>
                </div>
                <div class="text-right">
                  <div class="text-white font-bold">{{ getTicketCountByCategory('Autre') }}</div>
                  <div class="text-slate-400 text-sm">5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Workload Template -->
    <ng-template #workloadTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Charge Actuelle par Technicien</h3>
        
        <!-- Workload Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="text-center">
              <div class="flex items-center justify-center mb-3">
                <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-blue-400 mb-2">{{ technicians.length }}</div>
              <div class="text-slate-400 text-sm">Techniciens Actifs</div>
            </div>
          </div>
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="text-center">
              <div class="flex items-center justify-center mb-3">
                <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-yellow-400 mb-2">68%</div>
              <div class="text-slate-400 text-sm">Charge Moyenne</div>
            </div>
          </div>
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="text-center">
              <div class="flex items-center justify-center mb-3">
                <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-green-400 mb-2">{{ getUnassignedTicketsCount() }}</div>
              <div class="text-slate-400 text-sm">Tickets Non Assignés</div>
            </div>
          </div>
        </div>
        
        <!-- Technician Workload Details -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 class="text-lg font-semibold text-white mb-4">Détail de la Charge par Technicien</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium">JD</span>
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">Jean Dupont</div>
                  <div class="text-slate-400 text-sm">Spécialiste Hardware • En ligne</div>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-xs text-slate-400">8 tickets assignés</span>
                    <span class="text-xs text-blue-400">• 3 en cours</span>
                    <span class="text-xs text-green-400">• 5 résolus aujourd'hui</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-sm text-slate-400">Charge</div>
                  <div class="w-32 bg-slate-600 rounded-full h-3 mt-1">
                    <div class="bg-yellow-500 h-3 rounded-full transition-all duration-500" style="width: 80%"></div>
                  </div>
                </div>
                <span class="text-yellow-400 font-bold text-lg w-12 text-right">80%</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium">ML</span>
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">Marie Leroy</div>
                  <div class="text-slate-400 text-sm">Spécialiste Software • En ligne</div>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-xs text-slate-400">5 tickets assignés</span>
                    <span class="text-xs text-blue-400">• 2 en cours</span>
                    <span class="text-xs text-green-400">• 3 résolus aujourd'hui</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-sm text-slate-400">Charge</div>
                  <div class="w-32 bg-slate-600 rounded-full h-3 mt-1">
                    <div class="bg-green-500 h-3 rounded-full transition-all duration-500" style="width: 50%"></div>
                  </div>
                </div>
                <span class="text-green-400 font-bold text-lg w-12 text-right">50%</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium">PM</span>
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">Pierre Martin</div>
                  <div class="text-slate-400 text-sm">Spécialiste Réseau • En ligne</div>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-xs text-slate-400">12 tickets assignés</span>
                    <span class="text-xs text-blue-400">• 6 en cours</span>
                    <span class="text-xs text-green-400">• 2 résolus aujourd'hui</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-sm text-slate-400">Charge</div>
                  <div class="w-32 bg-slate-600 rounded-full h-3 mt-1">
                    <div class="bg-red-500 h-3 rounded-full transition-all duration-500" style="width: 95%"></div>
                  </div>
                </div>
                <span class="text-red-400 font-bold text-lg w-12 text-right">95%</span>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium">SB</span>
                </div>
                <div class="flex-1">
                  <div class="text-white font-medium">Sophie Bernard</div>
                  <div class="text-slate-400 text-sm">Support Général • Absent</div>
                  <div class="flex items-center space-x-4 mt-1">
                    <span class="text-xs text-slate-400">3 tickets assignés</span>
                    <span class="text-xs text-blue-400">• 1 en cours</span>
                    <span class="text-xs text-green-400">• 1 résolu aujourd'hui</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-sm text-slate-400">Charge</div>
                  <div class="w-32 bg-slate-600 rounded-full h-3 mt-1">
                    <div class="bg-blue-500 h-3 rounded-full transition-all duration-500" style="width: 30%"></div>
                  </div>
                </div>
                <span class="text-blue-400 font-bold text-lg w-12 text-right">30%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Workload Distribution Chart -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 class="text-lg font-semibold text-white mb-4">Distribution de la Charge</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Bar Chart -->
            <div class="relative h-48">
              <div class="absolute inset-0 flex items-end justify-between px-4 pb-8">
                <div class="flex items-end space-x-3 w-full">
                  <div class="flex-1 flex flex-col items-center">
                    <div class="bg-yellow-500 rounded-t" style="height: 80px; width: 30px;"></div>
                    <div class="text-xs text-slate-400 mt-2 text-center">Jean D.</div>
                    <div class="text-xs text-yellow-400">80%</div>
                  </div>
                  <div class="flex-1 flex flex-col items-center">
                    <div class="bg-green-500 rounded-t" style="height: 50px; width: 30px;"></div>
                    <div class="text-xs text-slate-400 mt-2 text-center">Marie L.</div>
                    <div class="text-xs text-green-400">50%</div>
                  </div>
                  <div class="flex-1 flex flex-col items-center">
                    <div class="bg-red-500 rounded-t" style="height: 95px; width: 30px;"></div>
                    <div class="text-xs text-slate-400 mt-2 text-center">Pierre M.</div>
                    <div class="text-xs text-red-400">95%</div>
                  </div>
                  <div class="flex-1 flex flex-col items-center">
                    <div class="bg-blue-500 rounded-t" style="height: 30px; width: 30px;"></div>
                    <div class="text-xs text-slate-400 mt-2 text-center">Sophie B.</div>
                    <div class="text-xs text-blue-400">30%</div>
                  </div>
                </div>
              </div>
              <!-- Y-axis labels -->
              <div class="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 py-2">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
            </div>
            
            <!-- Workload Status -->
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-white">Charge Optimale (< 70%)</span>
                </div>
                <span class="text-green-400 font-medium">1 technicien</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span class="text-white">Charge Élevée (70-90%)</span>
                </div>
                <span class="text-yellow-400 font-medium">1 technicien</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span class="text-white">Surcharge (> 90%)</span>
                </div>
                <span class="text-red-400 font-medium">1 technicien</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="text-white">Disponible (< 50%)</span>
                </div>
                <span class="text-blue-400 font-medium">1 technicien</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Technician Modal (Create/Edit) -->
    <div *ngIf="showTechnicianModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-slate-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">
            {{ isEditMode ? 'Modifier le Technicien' : 'Ajouter un Technicien' }}
          </h3>
          <button (click)="closeTechnicianModal()" class="text-slate-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form [formGroup]="technicianForm" (ngSubmit)="saveTechnician()" class="space-y-6">
          <!-- Personal Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Nom *</label>
              <input
                type="text"
                formControlName="nom"
                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Nom du technicien"
              >
              <div *ngIf="technicianForm.get('nom')?.invalid && technicianForm.get('nom')?.touched" class="text-red-400 text-sm mt-1">
                Le nom est requis (minimum 2 caractères)
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Prénom *</label>
              <input
                type="text"
                formControlName="prenom"
                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Prénom du technicien"
              >
              <div *ngIf="technicianForm.get('prenom')?.invalid && technicianForm.get('prenom')?.touched" class="text-red-400 text-sm mt-1">
                Le prénom est requis (minimum 2 caractères)
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="email@itsm.com"
              >
              <div *ngIf="technicianForm.get('email')?.invalid && technicianForm.get('email')?.touched" class="text-red-400 text-sm mt-1">
                Email valide requis
              </div>
            </div>

            <div *ngIf="!isEditMode">
              <label class="block text-sm font-medium text-slate-300 mb-2">Mot de passe *</label>
              <input
                type="password"
                formControlName="motDePasse"
                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Mot de passe (min. 8 caractères)"
              >
              <div *ngIf="technicianForm.get('motDePasse')?.invalid && technicianForm.get('motDePasse')?.touched" class="text-red-400 text-sm mt-1">
                Mot de passe requis (minimum 8 caractères)
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Téléphone *</label>
              <input
                type="tel"
                formControlName="telephone"
                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="+33 6 12 34 56 78"
              >
              <div *ngIf="technicianForm.get('telephone')?.invalid && technicianForm.get('telephone')?.touched" class="text-red-400 text-sm mt-1">
                Numéro de téléphone valide requis
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Localisation *</label>
              <input
                type="text"
                formControlName="localisation"
                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Paris, Lyon, Marseille..."
              >
              <div *ngIf="technicianForm.get('localisation')?.invalid && technicianForm.get('localisation')?.touched" class="text-red-400 text-sm mt-1">
                La localisation est requise
              </div>
            </div>
          </div>

          <!-- Speciality -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Spécialité *</label>
            <input
              type="text"
              formControlName="specialite"
              class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Sécurité Applicative, Administration Système..."
            >
            <div *ngIf="technicianForm.get('specialite')?.invalid && technicianForm.get('specialite')?.touched" class="text-red-400 text-sm mt-1">
              La spécialité est requise
            </div>
          </div>

          <!-- Competences -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <label class="block text-sm font-medium text-slate-300">Compétences</label>
              <button
                type="button"
                (click)="addCompetence()"
                class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm transition-colors"
              >
                + Ajouter une compétence
              </button>
            </div>

            <div formArrayName="competences" class="space-y-4">
              <div *ngFor="let competence of competencesArray.controls; let i = index" [formGroupName]="i"
                   class="bg-slate-700 p-4 rounded-lg border border-slate-600">
                <div class="flex justify-between items-start mb-3">
                  <h4 class="text-white font-medium">Compétence {{ i + 1 }}</h4>
                  <button
                    type="button"
                    (click)="removeCompetence(i)"
                    class="text-red-400 hover:text-red-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm text-slate-400 mb-1">Nom *</label>
                    <input
                      type="text"
                      formControlName="nom"
                      class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:border-blue-500"
                      placeholder="OWASP ZAP, Kali Linux..."
                    >
                  </div>

                  <div>
                    <label class="block text-sm text-slate-400 mb-1">Catégorie *</label>
                    <select
                      formControlName="categorie"
                      class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:border-blue-500"
                    >
                      <option *ngFor="let category of getCompetenceCategories()" [value]="category">
                        {{ category }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm text-slate-400 mb-1">Niveau *</label>
                    <select
                      formControlName="niveau"
                      class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:border-blue-500"
                    >
                      <option *ngFor="let level of getCompetenceLevels()" [value]="level">
                        {{ level }}
                      </option>
                    </select>
                  </div>

                  <div class="md:col-span-1">
                    <label class="block text-sm text-slate-400 mb-1">Description *</label>
                    <textarea
                      formControlName="description"
                      rows="2"
                      class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:border-blue-500"
                      placeholder="Description de la compétence..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <span class="text-red-300">{{ error }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-slate-600">
            <button
              type="button"
              (click)="closeTechnicianModal()"
              class="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="loading || technicianForm.invalid"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
            >
              <div *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ isEditMode ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Competence Management Modal -->
    <div *ngIf="showCompetenceModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h3 class="text-xl font-bold text-white">Gestion des Compétences</h3>
            <p class="text-slate-400" *ngIf="selectedTechnicianForCompetences">
              {{ selectedTechnicianForCompetences.prenom }} {{ selectedTechnicianForCompetences.nom }} - {{ selectedTechnicianForCompetences.specialite }}
            </p>
          </div>
          <button
            (click)="closeCompetenceModal()"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form [formGroup]="competenceForm" (ngSubmit)="saveCompetences()">
            <!-- Competences Section -->
            <div>
              <div class="flex justify-between items-center mb-4">
                <label class="block text-lg font-medium text-slate-300">Compétences Techniques</label>
                <button
                  type="button"
                  (click)="addCompetenceToModal()"
                  class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Ajouter une Compétence
                </button>
              </div>

              <div formArrayName="competences" class="space-y-4">
                <div *ngFor="let competence of competenceFormArray.controls; let i = index" [formGroupName]="i"
                     class="bg-slate-700 p-4 rounded-lg border border-slate-600">
                  <div class="flex justify-between items-start mb-3">
                    <h4 class="text-white font-medium">Compétence {{ i + 1 }}</h4>
                    <button
                      type="button"
                      (click)="removeCompetenceFromModal(i)"
                      class="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                      title="Supprimer cette compétence"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Nom de la compétence -->
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Nom de la compétence *</label>
                      <input
                        type="text"
                        formControlName="nom"
                        placeholder="Ex: Firewall Fortinet"
                        class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                      <div *ngIf="competence.get('nom')?.invalid && competence.get('nom')?.touched" class="text-red-400 text-sm mt-1">
                        Le nom de la compétence est requis
                      </div>
                    </div>

                    <!-- Catégorie -->
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Catégorie *</label>
                      <select
                        formControlName="categorie"
                        class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SECURITE">Sécurité</option>
                        <option value="RESEAU">Réseau</option>
                        <option value="SYSTEME">Système</option>
                        <option value="DEVELOPPEMENT">Développement</option>
                        <option value="BASE_DE_DONNEES">Base de données</option>
                        <option value="CLOUD">Cloud</option>
                        <option value="AUDIT">Audit</option>
                      </select>
                    </div>

                    <!-- Niveau -->
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Niveau *</label>
                      <select
                        formControlName="niveau"
                        class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="DEBUTANT">Débutant</option>
                        <option value="INTERMEDIAIRE">Intermédiaire</option>
                        <option value="AVANCE">Avancé</option>
                        <option value="EXPERT">Expert</option>
                        <option value="SENIOR">Senior</option>
                      </select>
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                      <textarea
                        formControlName="description"
                        rows="3"
                        placeholder="Décrivez cette compétence..."
                        class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      ></textarea>
                      <div *ngIf="competence.get('description')?.invalid && competence.get('description')?.touched" class="text-red-400 text-sm mt-1">
                        La description est requise
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty state -->
                <div *ngIf="competenceFormArray.length === 0" class="text-center py-8 text-slate-400">
                  <svg class="w-12 h-12 mx-auto mb-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  <p>Aucune compétence définie</p>
                  <p class="text-sm">Cliquez sur "Ajouter une Compétence" pour commencer</p>
                </div>
              </div>
            </div>

            <!-- Error Display -->
            <div *ngIf="error" class="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p class="text-red-400 text-sm">{{ error }}</p>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-700">
              <button
                type="button"
                (click)="closeCompetenceModal()"
                class="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                [disabled]="loading || !competenceForm.valid"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
              >
                <div *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ loading ? 'Enregistrement...' : 'Enregistrer les Compétences' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  `,
  styles: [`
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  currentUser: any = null;
  activeView: string = 'dashboard';

  // Technician management
  technicians: TechnicianResponse[] = [];
  technicianStats: TechnicianStats | null = null;
  selectedTechnician: TechnicianResponse | null = null;
  showTechnicianModal = false;

  isEditMode = false;
  loading = false;
  error: string | null = null;

  // Competences management properties
  competenceSearchTerm = '';
  selectedCompetenceCategory = '';
  selectedCompetenceLevel = '';
  filteredTechniciansForCompetences: TechnicianResponse[] = [];
  showCompetenceModal = false;
  selectedTechnicianForCompetences: TechnicianResponse | null = null;
  competenceForm!: FormGroup;

  // Team tickets management
  teamTickets: TeamTicketResponse[] = [];
  filteredTeamTickets: TeamTicketResponse[] = [];
  teamTicketsLoading = false;
  teamTicketsError = '';
  selectedTicketStatusFilter = '';
  selectedTicketPriorityFilter = '';
  ticketSearchTerm = '';
  currentTicketsPage = 0;
  ticketsPageSize = 10;
  totalTickets = 0;

  // Notifications
  notifications: NotificationDTO[] = [];
  unreadNotificationCount = 0;
  showNotifications = false;
  isLoadingNotifications = false;
  expandedNotifications = new Set<string>();

  // Forms
  technicianForm!: FormGroup;

  menuItems: MenuItem[] = [
    {
      id: 'technicians',
      title: 'Gestion des techniciens',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>`,
      expanded: false,
      children: [
        {
          id: 'technicians-crud',
          title: 'Lire / Ajouter / Modifier / Activer-Désactiver un tech',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>`
        },
        {
          id: 'skills-management',
          title: 'Gérer les compétences',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>`
        },
        {
          id: 'technician-status',
          title: 'Activer / Désactiver un technicien',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>`
        }
      ]
    },
    {
      id: 'team-tickets',
      title: 'Tickets de l\'équipe',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
      </svg>`,
      expanded: false,
      children: [
        {
          id: 'all-tickets',
          title: 'Voir tous les tickets (ouverts, etc.)',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>`,
          badge: '24',
          badgeColor: 'blue'
        },
        {
          id: 'filter-technician',
          title: 'Filtrer par technicien / priorité',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>`
        },
        {
          id: 'filter-status',
          title: 'Filtrer par statut',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 3v1h6V3H9zm0 5a1 1 0 112 0v8a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v8a1 1 0 11-2 0V8z"></path>
          </svg>`
        }
      ]
    },
    {
      id: 'reassignment',
      title: 'Réaffectation de tickets',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
      </svg>`,
      expanded: false,
      children: [
        {
          id: 'reassign-tickets',
          title: 'Réassigner un ticket à un autre tech',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>`
        }
      ]
    },
    {
      id: 'sla-supervision',
      title: 'Supervision des SLA',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`,
      expanded: false,
      children: [
        {
          id: 'sla-expiring',
          title: 'Tickets proches de l\'échéance',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>`,
          badge: '5',
          badgeColor: 'red'
        },
        {
          id: 'sla-alerts',
          title: 'Alertes en cas de dépassement',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19c-5 0-8-3-8-6s4-6 9-6 9 3 9 6c0 1-1 3-2 3h-1l-1 1z"></path>
          </svg>`,
          badge: '2',
          badgeColor: 'orange'
        }
      ]
    },
    {
      id: 'kpi-tracking',
      title: 'Suivi des KPI de l\'équipe',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>`,
      expanded: false,
      children: [
        {
          id: 'mttr',
          title: 'Temps moyen de résolution (MTTR)',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>`
        },
        {
          id: 'sla-percentage',
          title: '% de tickets dans les délais SLA',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>`
        },
        {
          id: 'category-distribution',
          title: 'Répartition par catégorie',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
          </svg>`
        },
        {
          id: 'workload-distribution',
          title: 'Charge actuelle par technicien',
          icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>`
        }
      ]
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private technicianService: TechnicianService,
    private technicianManagementService: TechnicianManagementService,
    private teamTicketsService: TeamTicketsService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.initializeTechnicianForm();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeForms();
    this.loadTechnicians();
    this.loadTechnicianStats();
    this.initializeNotifications();
  }

  /**
   * Initialize all forms
   */
  private initializeForms(): void {
    this.initializeTechnicianForm();
    this.initializeCompetenceForm();
  }

  /**
   * Initialize competence form (separate from technician form)
   */
  private initializeCompetenceForm(): void {
    this.competenceForm = this.fb.group({
      competences: this.fb.array([])
    });
  }

  toggleMenuItem(itemId: string): void {
    const item = this.menuItems.find(i => i.id === itemId);
    if (item) {
      item.expanded = !item.expanded;
      // Close other expanded items
      this.menuItems.forEach(i => {
        if (i.id !== itemId) {
          i.expanded = false;
        }
      });
    }
  }

  setActiveView(viewId: string): void {
    this.activeView = viewId;

    // Load team tickets when switching to all-tickets view
    if (viewId === 'all-tickets') {
      this.loadTeamTickets();
    }
  }

  getMenuItemClass(itemId: string): string {
    const baseClass = 'w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors font-medium';
    return this.activeView === itemId
      ? `${baseClass} bg-red-600 text-white`
      : `${baseClass} text-slate-300 hover:text-white hover:bg-slate-700`;
  }

  getSubMenuItemClass(itemId: string): string {
    const baseClass = 'w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors text-sm';
    return this.activeView === itemId
      ? `${baseClass} bg-red-500/20 text-red-300 border border-red-500/30`
      : `${baseClass} text-slate-400 hover:text-white hover:bg-slate-700`;
  }

  getBadgeClass(color: string): string {
    const baseClass = 'px-2 py-1 rounded-full text-xs font-medium';
    const colorClasses = {
      'blue': 'bg-blue-500/20 text-blue-300',
      'red': 'bg-red-500/20 text-red-300',
      'orange': 'bg-orange-500/20 text-orange-300',
      'green': 'bg-green-500/20 text-green-300',
      'yellow': 'bg-yellow-500/20 text-yellow-300'
    };
    return `${baseClass} ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`;
  }

  getActiveViewTitle(): string {
    const viewTitles: { [key: string]: string } = {
      'dashboard': 'Tableau de bord',
      'technicians-crud': 'Gestion des Techniciens',
      'skills-management': 'Gestion des Compétences',
      'technician-status': 'Statut des Techniciens',
      'all-tickets': 'Tous les Tickets',
      'filter-technician': 'Filtrer par Technicien',
      'filter-status': 'Filtrer par Statut',
      'reassign-tickets': 'Réassignation de Tickets',
      'sla-expiring': 'Tickets Proches de l\'Échéance',
      'sla-alerts': 'Alertes SLA',
      'mttr': 'Temps Moyen de Résolution',
      'sla-percentage': 'Performance SLA',
      'category-distribution': 'Répartition par Catégorie',
      'workload-distribution': 'Charge de Travail'
    };
    return viewTitles[this.activeView] || 'Vue Inconnue';
  }

  getActiveViewDescription(): string {
    const viewDescriptions: { [key: string]: string } = {
      'dashboard': 'Vue d\'ensemble des activités de votre équipe',
      'technicians-crud': 'Gérer les techniciens de votre équipe',
      'skills-management': 'Administrer les compétences techniques',
      'technician-status': 'Activer ou désactiver les techniciens',
      'all-tickets': 'Consulter tous les tickets de l\'équipe',
      'filter-technician': 'Filtrer les tickets par technicien ou priorité',
      'filter-status': 'Filtrer les tickets par statut',
      'reassign-tickets': 'Réassigner des tickets entre techniciens',
      'sla-expiring': 'Surveiller les tickets proches de l\'échéance',
      'sla-alerts': 'Gérer les alertes de dépassement SLA',
      'mttr': 'Analyser les temps de résolution',
      'sla-percentage': 'Suivre le respect des SLA',
      'category-distribution': 'Analyser la répartition des tickets',
      'workload-distribution': 'Équilibrer la charge de travail'
    };
    return viewDescriptions[this.activeView] || 'Description non disponible';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ==================== TECHNICIAN MANAGEMENT METHODS ====================

  /**
   * Initialize technician form
   */
  private initializeTechnicianForm(): void {
    this.technicianForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{10,}$/)]],
      localisation: ['', [Validators.required]],
      specialite: ['', [Validators.required]],
      competences: this.fb.array([])
    });
  }

  /**
   * Get competences form array
   */
  get competencesArray(): FormArray {
    return this.technicianForm.get('competences') as FormArray;
  }

  /**
   * Get competences form array for competence modal
   */
  get competenceFormArray(): FormArray {
    return this.competenceForm.get('competences') as FormArray;
  }



  /**
   * Parse competences JSON and return array of competences
   */
  parseCompetences(competencesJson: string | undefined): any[] {
    if (!competencesJson) {
      return [];
    }

    try {
      const competences = JSON.parse(competencesJson);
      return Array.isArray(competences) ? competences : [];
    } catch (error) {
      console.warn('Error parsing competences JSON:', error);
      return [];
    }
  }

  /**
   * Get competence names as comma-separated string
   */
  getCompetenceNames(competencesJson: string | undefined): string {
    const competences = this.parseCompetences(competencesJson);
    if (competences.length === 0) {
      return 'Aucune compétence';
    }
    return competences.map(c => c.nom).join(', ');
  }

  /**
   * Get workload color based on charge
   */
  getWorkloadColor(chargeActuelle: number | undefined): string {
    const charge = chargeActuelle || 0;
    if (charge >= 90) return 'text-red-400';
    if (charge >= 70) return 'text-yellow-400';
    if (charge >= 50) return 'text-blue-400';
    return 'text-green-400';
  }

  /**
   * Get workload percentage for progress bar
   */
  getWorkloadPercentage(chargeActuelle: number | undefined): number {
    return Math.min(chargeActuelle || 0, 100);
  }

  /**
   * Load technicians from API
   */
  loadTechnicians(): void {
    this.loading = true;
    this.error = null;

    this.technicianManagementService.getTechnicians().subscribe({
      next: (technicians: TechnicianResponse[]) => {
        this.technicians = technicians;
        this.filteredTechniciansForCompetences = [...technicians]; // Initialize filtered list
        this.loading = false;
        console.log('✅ Technicians loaded:', technicians.length);
      },
      error: (error: any) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error loading technicians:', error);
      }
    });
  }

  /**
   * Load technician statistics
   */
  loadTechnicianStats(): void {
    this.technicianService.getTechnicianStats().subscribe({
      next: (stats) => {
        this.technicianStats = stats;
        console.log('✅ Technician stats loaded:', stats);
      },
      error: (error) => {
        console.error('❌ Error loading technician stats:', error);
      }
    });
  }

  /**
   * Open modal to create new technician
   */
  openCreateTechnicianModal(): void {
    this.isEditMode = false;
    this.selectedTechnician = null;
    this.resetTechnicianForm();
    this.showTechnicianModal = true;
  }

  /**
   * Open modal to edit technician
   */
  openEditTechnicianModal(technician: TechnicianResponse): void {
    this.isEditMode = true;
    this.selectedTechnician = technician;
    this.populateTechnicianForm(technician);
    this.showTechnicianModal = true;
  }

  /**
   * Close technician modal
   */
  closeTechnicianModal(): void {
    this.showTechnicianModal = false;
    this.selectedTechnician = null;
    this.resetTechnicianForm();
  }

  /**
   * Reset technician form
   */
  private resetTechnicianForm(): void {
    this.technicianForm.reset();
    this.competencesArray.clear();

    // Set password as required only for create mode
    if (!this.isEditMode) {
      this.technicianForm.get('motDePasse')?.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      this.technicianForm.get('motDePasse')?.clearValidators();
    }
    this.technicianForm.get('motDePasse')?.updateValueAndValidity();
  }

  /**
   * Populate form with technician data for editing
   */
  private populateTechnicianForm(technician: TechnicianResponse): void {
    this.technicianForm.patchValue({
      nom: technician.nom,
      prenom: technician.prenom,
      email: technician.email,
      telephone: technician.telephone,
      localisation: technician.localisation,
      specialite: technician.specialite
    });

    // Clear and populate competences
    this.competencesArray.clear();
    const competences = this.parseCompetences(technician.competencesJson);
    competences.forEach(competence => {
      this.competencesArray.push(this.fb.group({
        nom: [competence.nom, Validators.required],
        description: [competence.description, Validators.required],
        categorie: [competence.categorie, Validators.required],
        niveau: [competence.niveau, Validators.required]
      }));
    });

    // Remove password requirement for edit mode
    this.technicianForm.get('motDePasse')?.clearValidators();
    this.technicianForm.get('motDePasse')?.updateValueAndValidity();
  }

  /**
   * Add new competence to form
   */
  addCompetence(): void {
    const competenceGroup = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      categorie: ['SECURITE', Validators.required],
      niveau: ['INTERMEDIAIRE', Validators.required]
    });
    this.competencesArray.push(competenceGroup);
  }

  /**
   * Remove competence from form
   */
  removeCompetence(index: number): void {
    this.competencesArray.removeAt(index);
  }

  /**
   * Add new competence to modal form
   */
  addCompetenceToModal(): void {
    const competenceGroup = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      categorie: ['SECURITE', Validators.required],
      niveau: ['INTERMEDIAIRE', Validators.required]
    });
    this.competenceFormArray.push(competenceGroup);
  }

  /**
   * Remove competence from modal form
   */
  removeCompetenceFromModal(index: number): void {
    this.competenceFormArray.removeAt(index);
  }

  /**
   * Save technician (create or update)
   */
  saveTechnician(): void {
    if (this.technicianForm.invalid) {
      this.markFormGroupTouched(this.technicianForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.technicianForm.value;

    if (this.isEditMode && this.selectedTechnician) {
      // Update existing technician
      const updateRequest: UpdateTechnicianRequest = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        email: formValue.email,
        telephone: formValue.telephone,
        localisation: formValue.localisation,
        specialite: formValue.specialite,
        competencesJson: JSON.stringify(formValue.competences)
      };

      this.technicianManagementService.updateTechnician(this.selectedTechnician.id, updateRequest).subscribe({
        next: (updatedTechnician: TechnicianResponse) => {
          this.loading = false;
          this.closeTechnicianModal();
          this.loadTechnicians();
          console.log('✅ Technician updated successfully');
        },
        error: (error: any) => {
          this.error = error.message;
          this.loading = false;
          console.error('❌ Error updating technician:', error);
        }
      });
    } else {
      // Create new technician
      const createRequest: CreateTechnicianRequest = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        email: formValue.email,
        motDePasse: formValue.motDePasse,
        telephone: formValue.telephone,
        localisation: formValue.localisation,
        specialite: formValue.specialite,
        competencesJson: JSON.stringify(formValue.competences)
      };

      this.technicianManagementService.createTechnician(createRequest).subscribe({
        next: (response: CreateTechnicianResponse) => {
          this.loading = false;
          this.closeTechnicianModal();
          this.loadTechnicians();
          this.loadTechnicianStats();
          console.log('✅ Technician created successfully');
        },
        error: (error: any) => {
          this.error = error.message;
          this.loading = false;
          console.error('❌ Error creating technician:', error);
        }
      });
    }
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }



  /**
   * Toggle technician status
   */
  toggleTechnicianStatus(technician: TechnicianResponse): void {
    this.loading = true;
    this.error = null;

    this.technicianManagementService.toggleTechnicianStatus(technician.id, !technician.actif).subscribe({
      next: (updatedTechnician: any) => {
        this.loading = false;
        this.loadTechnicians();
        this.loadTechnicianStats();
        console.log('✅ Technician status toggled successfully');
      },
      error: (error: any) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error toggling technician status:', error);
      }
    });
  }

  /**
   * Get competence categories for dropdown
   */
  getCompetenceCategories(): string[] {
    return this.technicianService.getCompetenceCategories();
  }

  /**
   * Get competence levels for dropdown
   */
  getCompetenceLevels(): string[] {
    return this.technicianService.getCompetenceLevels();
  }

  // ==================== COMPETENCES MANAGEMENT METHODS ====================

  /**
   * Filter competences based on search and filters
   */
  filterCompetences(): void {
    this.filteredTechniciansForCompetences = this.technicians.filter(technician => {
      const competences = this.parseCompetences(technician.competencesJson);

      // Search term filter
      const searchMatch = !this.competenceSearchTerm ||
        technician.nom.toLowerCase().includes(this.competenceSearchTerm.toLowerCase()) ||
        technician.prenom.toLowerCase().includes(this.competenceSearchTerm.toLowerCase()) ||
        (technician.specialite && technician.specialite.toLowerCase().includes(this.competenceSearchTerm.toLowerCase())) ||
        competences.some(comp =>
          comp.nom.toLowerCase().includes(this.competenceSearchTerm.toLowerCase()) ||
          comp.description.toLowerCase().includes(this.competenceSearchTerm.toLowerCase())
        );

      // Category filter
      const categoryMatch = !this.selectedCompetenceCategory ||
        competences.some(comp => comp.categorie === this.selectedCompetenceCategory);

      // Level filter
      const levelMatch = !this.selectedCompetenceLevel ||
        competences.some(comp => comp.niveau === this.selectedCompetenceLevel);

      return searchMatch && categoryMatch && levelMatch;
    });
  }

  /**
   * Open competence management modal for a technician
   */
  openCompetenceModal(technician: TechnicianResponse): void {
    this.selectedTechnicianForCompetences = technician;
    this.showCompetenceModal = true;

    // Populate form with technician's competences
    this.populateCompetenceForm(technician);
  }

  /**
   * Close competence modal
   */
  closeCompetenceModal(): void {
    this.showCompetenceModal = false;
    this.selectedTechnicianForCompetences = null;
    this.resetCompetenceForm();
  }

  /**
   * Reset competence form
   */
  private resetCompetenceForm(): void {
    this.competenceForm.reset();
    this.competenceFormArray.clear();
  }

  /**
   * Populate competence form with technician data
   */
  private populateCompetenceForm(technician: TechnicianResponse): void {
    // Clear and populate competences
    this.competenceFormArray.clear();
    const competences = this.parseCompetences(technician.competencesJson);
    competences.forEach(competence => {
      this.competenceFormArray.push(this.fb.group({
        nom: [competence.nom, Validators.required],
        description: [competence.description, Validators.required],
        categorie: [competence.categorie, Validators.required],
        niveau: [competence.niveau, Validators.required]
      }));
    });
  }

  /**
   * Save competences for the selected technician
   */
  saveCompetences(): void {
    if (!this.selectedTechnicianForCompetences || !this.competenceForm.valid) {
      this.markFormGroupTouched(this.competenceForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.competenceForm.value;
    const updateRequest: UpdateTechnicianRequest = {
      competencesJson: JSON.stringify(formValue.competences)
    };

    this.technicianManagementService.updateTechnician(this.selectedTechnicianForCompetences.id, updateRequest).subscribe({
      next: (updatedTechnician: TechnicianResponse) => {
        this.loading = false;
        this.closeCompetenceModal();
        this.loadTechnicians(); // Refresh the list
        this.filterCompetences(); // Refresh filtered list
        console.log('✅ Competences updated successfully');
      },
      error: (error: any) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error updating competences:', error);
      }
    });
  }

  /**
   * Get category color class
   */
  getCategoryColor(category: string): string {
    return this.technicianService.getCategoryColor(category);
  }

  /**
   * Get level color class
   */
  getLevelColor(level: string): string {
    return this.technicianService.getLevelColor(level);
  }

  // ===== TEAM TICKETS METHODS =====

  /**
   * Load team tickets from backend
   */
  loadTeamTickets(): void {
    this.teamTicketsLoading = true;
    this.teamTicketsError = '';
    console.log('📥 Loading team tickets...');

    this.teamTicketsService.getTeamTickets().subscribe({
      next: (tickets) => {
        console.log('✅ Loaded team tickets:', tickets);
        this.teamTickets = tickets;
        this.filterTeamTickets();
        this.teamTicketsLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading team tickets:', error);
        this.teamTicketsError = 'Erreur lors du chargement des tickets de l\'équipe';
        this.teamTicketsLoading = false;
      }
    });
  }

  /**
   * Filter team tickets based on status, priority and search term
   */
  filterTeamTickets(): void {
    let filtered = [...this.teamTickets];

    // Filter by status
    if (this.selectedTicketStatusFilter) {
      filtered = filtered.filter(ticket => ticket.statut === this.selectedTicketStatusFilter);
    }

    // Filter by priority
    if (this.selectedTicketPriorityFilter) {
      filtered = filtered.filter(ticket => ticket.priorite === this.selectedTicketPriorityFilter);
    }

    // Filter by search term
    if (this.ticketSearchTerm) {
      const searchTerm = this.ticketSearchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.titre.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm) ||
        ticket.categorie.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredTeamTickets = filtered;
    this.currentTicketsPage = 0; // Reset to first page
    console.log(`🔍 Filtered ${filtered.length} tickets from ${this.teamTickets.length} total`);
  }

  /**
   * Clear all filters
   */
  clearAllFilters(): void {
    this.selectedTicketStatusFilter = '';
    this.selectedTicketPriorityFilter = '';
    this.ticketSearchTerm = '';
    this.filterTeamTickets();
  }

  /**
   * Get ticket count by status
   */
  getTicketCountByStatus(status: string): number {
    return this.teamTickets.filter(ticket => ticket.statut === status).length;
  }

  /**
   * Get unassigned tickets count
   */
  getUnassignedTicketsCount(): number {
    return this.teamTickets.filter(ticket => !ticket.technicienId).length;
  }

  /**
   * Get status label in French
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'OUVERT':
        return 'Ouvert';
      case 'EN_COURS':
        return 'En cours';
      case 'RESOLU':
        return 'Résolu';
      case 'FERME':
        return 'Fermé';
      default:
        return status;
    }
  }

  /**
   * Get priority label in French
   */
  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'FAIBLE':
        return 'Faible';
      case 'NORMALE':
        return 'Normale';
      case 'HAUTE':
        return 'Haute';
      case 'CRITIQUE':
        return 'Critique';
      default:
        return priority;
    }
  }

  /**
   * Math utility for template
   */
  Math = Math;

  // ==================== NOTIFICATIONS ====================

  /**
   * Initialize notifications system
   */
  initializeNotifications(): void {
    console.log('🔔 MANAGER INIT: Initializing notifications system...');
    console.log('🔔 MANAGER INIT: Current user:', this.currentUser);
    console.log('🔔 MANAGER INIT: User ID:', this.currentUser?.id);
    console.log('🔔 MANAGER INIT: User role:', this.currentUser?.role);

    // Subscribe to notifications
    this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
        console.log('📬 MANAGER NOTIFICATIONS: Received notifications update:', notifications.length);
        console.log('📬 MANAGER NOTIFICATIONS: Full notifications array:', notifications);

        // Log each notification for debugging
        notifications.forEach((notif, index) => {
          console.log(`📬 MANAGER NOTIFICATION ${index + 1}:`, {
            id: notif.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            priority: notif.priority,
            readStatus: notif.readStatus,
            createdAt: notif.createdAt
          });
        });
      }
    );

    // Subscribe to unread count
    this.notificationService.unreadCount$.subscribe(
      count => {
        this.unreadNotificationCount = count;
        console.log('🔢 Manager: Unread count updated:', count);
      }
    );

    // Subscribe to new notifications
    this.notificationService.newNotification$.subscribe(
      notification => {
        console.log('🆕 Manager: New notification received:', notification);
        this.showNotificationToast(notification);
      }
    );

    // Test notification service first
    this.notificationService.testNotificationService().subscribe({
      next: () => {
        console.log('✅ Manager: Notification service test passed, loading notifications...');
        this.loadNotifications();
      },
      error: (error) => {
        console.error('❌ Manager: Notification service test failed:', error);
      }
    });
  }

  /**
   * Load notifications
   */
  loadNotifications(): void {
    console.log('🔔 MANAGER LOAD: Loading notifications from server...');
    console.log('🔔 MANAGER LOAD: Current user ID:', this.currentUser?.id);
    this.isLoadingNotifications = true;

    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        console.log('✅ MANAGER LOAD: Notifications loaded successfully from server:', notifications.length);
        console.log('✅ MANAGER LOAD: Notifications data:', notifications);
        this.notifications = notifications;
        this.isLoadingNotifications = false;

        // Check if any notifications are for ticket assignments
        const assignmentNotifications = notifications.filter(n => n.type === 'TICKET_ASSIGNED');
        console.log('🎯 MANAGER LOAD: Assignment notifications found:', assignmentNotifications.length, assignmentNotifications);
      },
      error: (error) => {
        console.error('❌ MANAGER LOAD: Error loading notifications:', error);
        this.isLoadingNotifications = false;
      }
    });

    // Load unread count
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        console.log('✅ Manager: Unread count loaded:', count);
      },
      error: (error) => {
        console.error('❌ Manager: Error loading unread count:', error);
      }
    });
  }

  /**
   * Toggle notifications panel
   */
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.notifications.length === 0) {
      this.loadNotifications();
    }
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(notification: NotificationDTO): void {
    if (!notification.readStatus) {
      console.log('🔔 Manager: Marking notification as read:', notification.id);
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          console.log('✅ Manager: Notification marked as read, updating local state');
          // Update local state immediately - notification stays visible but marked as read
          notification.readStatus = true;
          this.unreadNotificationCount = Math.max(0, this.unreadNotificationCount - 1);

          // Update the notifications subject to reflect the change
          this.notificationService.updateNotificationReadStatus(notification.id, true);
        },
        error: (error) => {
          console.error('❌ Manager: Error marking notification as read:', error);
        }
      });
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead(): void {
    console.log('🔔 Manager: Marking all notifications as read');
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        console.log('✅ Manager: All notifications marked as read, updating local state');
        // Update local state - notifications stay visible but marked as read
        this.notifications.forEach(n => {
          if (!n.readStatus) {
            n.readStatus = true;
            this.notificationService.updateNotificationReadStatus(n.id, true);
          }
        });
        this.unreadNotificationCount = 0;
      },
      error: (error) => {
        console.error('❌ Manager: Error marking all notifications as read:', error);
      }
    });
  }

  /**
   * Show notification toast (for new notifications)
   */
  showNotificationToast(notification: NotificationDTO): void {
    console.log('🔔 Manager: New notification toast:', notification.title);

    // Simple browser notification (if permission granted)
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/notification-icon.png'
      });
    }
  }

  /**
   * Get notification icon based on type
   */
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'TICKET_ASSIGNED':
        return 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2';
      case 'TICKET_UPDATED':
        return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z';
      case 'SYSTEM':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z';
    }
  }

  /**
   * Get notification color based on priority
   */
  getNotificationColor(priority: string): string {
    switch (priority) {
      case 'HIGH':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  }

  /**
   * Get relative time for notification
   */
  getNotificationTime(dateString: string): string {
    return this.getRelativeTime(dateString);
  }

  /**
   * Get relative time (e.g., "Il y a 30 min")
   */
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'À l\'instant';
    } else if (diffMinutes < 60) {
      return `Il y a ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return this.getFormattedDate(dateString);
    }
  }

  /**
   * Get formatted date
   */
  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Track notifications for ngFor performance
   */
  trackNotification(index: number, notification: NotificationDTO): string {
    return notification.id;
  }

  /**
   * Get clean notification title (remove prefixes)
   */
  getCleanNotificationTitle(title: string): string {
    return title.replace(/^\[.*?\]\s*/, '');
  }

  /**
   * Get clean notification message (remove prefixes)
   */
  getCleanNotificationMessage(message: string): string {
    return message.replace(/^\[.*?\]\s*/, '');
  }

  /**
   * Toggle notification expanded state
   */
  toggleNotificationExpanded(notificationId: string): void {
    if (this.expandedNotifications.has(notificationId)) {
      this.expandedNotifications.delete(notificationId);
    } else {
      this.expandedNotifications.add(notificationId);
    }
  }

  /**
   * Check if notification is expanded
   */
  isNotificationExpanded(notificationId: string): boolean {
    return this.expandedNotifications.has(notificationId);
  }

}
