import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/auth.interface';
import { TicketService, TicketResponse, CreateTicketRequest, UserTicketStats } from '../core/services/ticket.service';
import { FileUploadService, AttachedFile, FileUploadResponse } from '../core/services/file-upload.service';
import { NotificationService, NotificationDTO } from '../core/services/notification.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-900 text-white flex">
      <!-- Sidebar Navigation -->
      <aside class="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-slate-700">
          <div class="flex items-center space-x-3">
            <div class="h-10 w-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">ITSM Portal</h1>
              <p class="text-sm text-slate-400">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4">
          <div class="space-y-2">
            <!-- Dashboard -->
            <button
              (click)="setActiveSection('dashboard')"
              [class]="getMenuItemClass('dashboard')"
              class="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0M8 5a2 2 0 012 2h2a2 2 0 012-2M8 5v4h8V5"></path>
              </svg>
              <span class="font-medium">Tableau de bord</span>
            </button>

            <!-- My Tickets -->
            <button
              (click)="setActiveSection('my-tickets')"
              [class]="getMenuItemClass('my-tickets')"
              class="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span class="font-medium">Mes Tickets</span>
            </button>

            <!-- Create Ticket -->
            <button
              (click)="setActiveSection('create-ticket')"
              [class]="getMenuItemClass('create-ticket')"
              class="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="font-medium">Créer un Ticket</span>
            </button>

            <!-- Comments -->
            <button
              (click)="setActiveSection('comments')"
              [class]="getMenuItemClass('comments')"
              class="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span class="font-medium">Commentaires</span>
            </button>

            <!-- Evaluations -->
            <button
              (click)="setActiveSection('evaluations')"
              [class]="getMenuItemClass('evaluations')"
              class="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              <span class="font-medium">Évaluations</span>
            </button>

            <!-- Profile -->
            <button
              (click)="setActiveSection('profile')"
              [class]="getMenuItemClass('profile')"
              class="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="font-medium">Mon Profil</span>
            </button>
          </div>
        </nav>

        <!-- Logout Button -->
        <div class="p-4 border-t border-slate-700">
          <button
            (click)="logout()"
            class="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-hidden">
        <!-- Header -->
        <header class="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white">{{ getSectionTitle() }}</h2>
              <p class="text-sm text-slate-400">{{ getSectionDescription() }}</p>
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

              <!-- User Info -->
              <div class="flex items-center space-x-3">
                <div class="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">{{ getUserInitials() }}</span>
                </div>
                <span class="text-sm text-slate-300">{{ currentUser?.email }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Content -->
        <div class="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          <!-- Dashboard Content -->
          <div *ngIf="activeSection === 'dashboard'">
            <ng-container *ngTemplateOutlet="dashboardTemplate"></ng-container>
          </div>

          <!-- My Tickets Content -->
          <div *ngIf="activeSection === 'my-tickets'">
            <ng-container *ngTemplateOutlet="myTicketsTemplate"></ng-container>
          </div>

          <!-- Create Ticket Content -->
          <div *ngIf="activeSection === 'create-ticket'">
            <ng-container *ngTemplateOutlet="createTicketTemplate"></ng-container>
          </div>

          <!-- Comments Content -->
          <div *ngIf="activeSection === 'comments'">
            <ng-container *ngTemplateOutlet="commentsTemplate"></ng-container>
          </div>

          <!-- Evaluations Content -->
          <div *ngIf="activeSection === 'evaluations'">
            <ng-container *ngTemplateOutlet="evaluationsTemplate"></ng-container>
          </div>

          <!-- Profile Content -->
          <div *ngIf="activeSection === 'profile'">
            <ng-container *ngTemplateOutlet="profileTemplate"></ng-container>
          </div>
        </div>
      </main>
    </div>

    <!-- Dashboard Template -->
    <ng-template #dashboardTemplate>
      <div class="space-y-6">
        <!-- Welcome Section -->
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
          <h3 class="text-2xl font-bold mb-2">Bienvenue, {{ currentUser?.prenom }}!</h3>
          <p class="text-emerald-100">Gérez vos tickets et demandes de service IT</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">Total Tickets</p>
                <p class="text-2xl font-bold text-white">{{ userStats.totalTickets }}</p>
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
                <p class="text-sm font-medium text-slate-400">Tickets Ouverts</p>
                <p class="text-2xl font-bold text-white">{{ userStats.openTickets }}</p>
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
                <p class="text-sm font-medium text-slate-400">Tickets Fermés</p>
                <p class="text-2xl font-bold text-white">{{ userStats.closedTickets }}</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="flex items-center">
              <div class="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-slate-400">À Évaluer</p>
                <p class="text-2xl font-bold text-white">{{ userStats.pendingEvaluations }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h4 class="text-lg font-semibold text-white mb-4">Actions Rapides</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              (click)="setActiveSection('create-ticket')"
              class="flex items-center space-x-3 p-4 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="text-white font-medium">Nouveau Ticket</span>
            </button>

            <button
              (click)="setActiveSection('my-tickets')"
              class="flex items-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span class="text-white font-medium">Mes Tickets</span>
            </button>

            <button
              (click)="setActiveSection('evaluations')"
              class="flex items-center space-x-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              <span class="text-white font-medium">Évaluations</span>
            </button>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- My Tickets Template -->
    <ng-template #myTicketsTemplate>
      <div class="space-y-6">
        <!-- Header with Stats -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-xl font-bold text-white mb-4">Mes Tickets</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-slate-700 rounded-lg p-4">
              <div class="text-2xl font-bold text-white">{{ userTickets.length }}</div>
              <div class="text-sm text-slate-400">Total</div>
            </div>
            <div class="bg-slate-700 rounded-lg p-4">
              <div class="text-2xl font-bold text-yellow-400">{{ getTicketsByStatus('EN_COURS').length }}</div>
              <div class="text-sm text-slate-400">En cours</div>
            </div>
            <div class="bg-slate-700 rounded-lg p-4">
              <div class="text-2xl font-bold text-green-400">{{ getTicketsByStatus('FERME').length }}</div>
              <div class="text-sm text-slate-400">Fermés</div>
            </div>
            <div class="bg-slate-700 rounded-lg p-4">
              <div class="text-2xl font-bold text-blue-400">{{ getTicketsByStatus('OUVERT').length }}</div>
              <div class="text-sm text-slate-400">Ouverts</div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterTickets()"
                placeholder="Rechercher un ticket..."
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
            </div>
            <select
              [(ngModel)]="statusFilter"
              (change)="filterTickets()"
              class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Tous les statuts</option>
              <option value="OUVERT">Ouvert</option>
              <option value="EN_COURS">En cours</option>
              <option value="FERME">Fermé</option>
              <option value="ANNULE">Annulé</option>
            </select>
            <select
              [(ngModel)]="priorityFilter"
              (change)="filterTickets()"
              class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Toutes les priorités</option>
              <option value="BASSE">Basse</option>
              <option value="MOYENNE">Moyenne</option>
              <option value="HAUTE">Haute</option>
              <option value="CRITIQUE">Critique</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p class="text-slate-400">Chargement de vos tickets...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !loading" class="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-red-400 font-medium">Erreur de chargement</h3>
              <p class="text-red-300 text-sm">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Tickets List -->
        <div *ngIf="!loading && !error" class="space-y-6">
          <div *ngFor="let ticket of filteredTickets; trackBy: trackByTicketId" class="bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-200 overflow-hidden shadow-lg">

            <!-- Ticket Header -->
            <div class="p-6 border-b border-slate-700">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <!-- Title and Badges -->
                  <div class="flex items-center space-x-3 mb-4">
                    <h3 class="text-xl font-bold text-white">
                      <span class="text-emerald-400">#{{ ticket.id.substring(0, 8) }}</span> - {{ ticket.titre }}
                    </h3>
                    <span [class]="getStatusBadgeClass(ticket.statut)" class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {{ getStatusLabel(ticket.statut) }}
                    </span>
                    <span [class]="getPriorityBadgeClass(ticket.priorite)" class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {{ getPriorityLabel(ticket.priorite) }}
                    </span>
                  </div>

                  <!-- Description Preview -->
                  <p class="text-slate-300 mb-4 leading-relaxed">{{ ticket.description | slice:0:150 }}{{ ticket.description.length > 150 ? '...' : '' }}</p>

                  <!-- Key Information Grid -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <!-- Creation Date -->
                    <div class="bg-slate-700/50 rounded-lg p-3">
                      <div class="flex items-center space-x-2 mb-1">
                        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-xs font-medium text-slate-400 uppercase tracking-wide">Créé le</span>
                      </div>
                      <p class="text-sm font-semibold text-white">{{ formatDate(ticket.dateCreation) }}</p>
                      <p class="text-xs text-slate-400">{{ formatTime(ticket.dateCreation) }}</p>
                    </div>

                    <!-- Category -->
                    <div class="bg-slate-700/50 rounded-lg p-3">
                      <div class="flex items-center space-x-2 mb-1">
                        <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                        <span class="text-xs font-medium text-slate-400 uppercase tracking-wide">Catégorie</span>
                      </div>
                      <p class="text-sm font-semibold text-white">{{ ticket.categorie || 'Non classé' }}</p>
                    </div>

                    <!-- Last Modified -->
                    <div class="bg-slate-700/50 rounded-lg p-3">
                      <div class="flex items-center space-x-2 mb-1">
                        <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-xs font-medium text-slate-400 uppercase tracking-wide">Modifié le</span>
                      </div>
                      <p class="text-sm font-semibold text-white">{{ formatDate(ticket.dateModification) }}</p>
                      <p class="text-xs text-slate-400">{{ formatTime(ticket.dateModification) }}</p>
                    </div>

                    <!-- Attachments -->
                    <div class="bg-slate-700/50 rounded-lg p-3">
                      <div class="flex items-center space-x-2 mb-1">
                        <svg class="w-4 h-4" [class]="hasAttachedFiles(ticket) ? 'text-orange-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                        <span class="text-xs font-medium text-slate-400 uppercase tracking-wide">Fichiers</span>
                      </div>
                      <p class="text-sm font-semibold" [class]="hasAttachedFiles(ticket) ? 'text-white' : 'text-slate-500'">{{ getAttachedFiles(ticket).length }}</p>
                      <p class="text-xs" [class]="hasAttachedFiles(ticket) ? 'text-slate-400' : 'text-slate-500'">{{ getAttachedFiles(ticket).length === 1 ? 'fichier' : 'fichiers' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col space-y-2 ml-6">
                  <button
                    (click)="toggleTicketDetails(ticket)"
                    [class]="selectedTicket?.id === ticket.id ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'"
                    class="px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                    [title]="selectedTicket?.id === ticket.id ? 'Masquer détails' : 'Voir détails'"
                  >
                    {{ selectedTicket?.id === ticket.id ? 'Masquer' : 'Détails' }}
                  </button>

                  <button
                    (click)="deleteTicket(ticket)"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                    title="Supprimer le ticket"
                  >
                    Supprimer
                  </button>

                  <button
                    *ngIf="ticket.statut === 'FERME'"
                    (click)="evaluateTicket(ticket)"
                    class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium text-sm"
                    title="Évaluer"
                  >
                    Évaluer
                  </button>
                </div>
              </div>
            </div>

            <!-- Expanded Details Section -->
            <div *ngIf="selectedTicket?.id === ticket.id" class="bg-slate-900/50">
              <div class="p-6 space-y-6">

                <!-- Complete Information Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  <!-- Left Column: Description & Timeline -->
                  <div class="space-y-6">
                    <!-- Full Description -->
                    <div>
                      <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg class="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Description complète
                      </h4>
                      <div class="bg-slate-800 rounded-lg p-4 border border-slate-600">
                        <p class="text-slate-200 leading-relaxed whitespace-pre-wrap">{{ ticket.description }}</p>
                      </div>
                    </div>

                    <!-- Timeline -->
                    <div>
                      <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg class="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Chronologie
                      </h4>
                      <div class="space-y-4">
                        <!-- Creation -->
                        <div class="flex items-start space-x-4">
                          <div class="w-3 h-3 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div class="flex-1">
                            <div class="flex items-center justify-between">
                              <h5 class="font-medium text-white">Ticket créé</h5>
                              <span class="text-sm text-slate-400">{{ formatDateTime(ticket.dateCreation) }}</span>
                            </div>
                            <p class="text-sm text-slate-400">Demande soumise par l'utilisateur</p>
                          </div>
                        </div>

                        <!-- Last Modification -->
                        <div *ngIf="ticket.dateModification !== ticket.dateCreation" class="flex items-start space-x-4">
                          <div class="w-3 h-3 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div class="flex-1">
                            <div class="flex items-center justify-between">
                              <h5 class="font-medium text-white">Dernière modification</h5>
                              <span class="text-sm text-slate-400">{{ formatDateTime(ticket.dateModification) }}</span>
                            </div>
                            <p class="text-sm text-slate-400">Ticket mis à jour</p>
                          </div>
                        </div>

                        <!-- Closure -->
                        <div *ngIf="ticket.dateFermeture" class="flex items-start space-x-4">
                          <div class="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div class="flex-1">
                            <div class="flex items-center justify-between">
                              <h5 class="font-medium text-white">Ticket fermé</h5>
                              <span class="text-sm text-slate-400">{{ formatDateTime(ticket.dateFermeture) }}</span>
                            </div>
                            <p class="text-sm text-slate-400">Demande résolue et fermée</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column: Technical Details & Files -->
                  <div class="space-y-6">
                    <!-- Ticket Summary -->
                    <div>
                      <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg class="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                        </svg>
                        Résumé du ticket
                      </h4>
                      <div class="bg-slate-800 rounded-lg p-4 border border-slate-600 space-y-3">
                        <div class="grid grid-cols-1 gap-4">
                          <div class="flex justify-between items-center">
                            <span class="text-slate-400 font-medium">Statut:</span>
                            <span [class]="getStatusBadgeClass(ticket.statut)" class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                              {{ getStatusLabel(ticket.statut) }}
                            </span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-slate-400 font-medium">Priorité:</span>
                            <span [class]="getPriorityBadgeClass(ticket.priorite)" class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                              {{ getPriorityLabel(ticket.priorite) }}
                            </span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-slate-400 font-medium">Catégorie:</span>
                            <span class="text-slate-200 font-medium">{{ ticket.categorie || 'Non classé' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- File Attachments - Only show if there are files -->
                    <div *ngIf="hasAttachedFiles(ticket)">
                      <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                        <svg class="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                        </svg>
                        Fichiers attachés ({{ getAttachedFiles(ticket).length }})
                      </h4>

                      <div class="space-y-3">
                        <div *ngFor="let file of getAttachedFiles(ticket)"
                             class="bg-slate-800 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all duration-200 cursor-pointer group"
                             (click)="downloadFile(file)">
                          <div class="flex items-center space-x-4">
                            <!-- File Icon -->
                            <div class="flex-shrink-0">
                              <div class="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                                <svg *ngIf="isImageFile(file)" class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <svg *ngIf="!isImageFile(file)" class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                              </div>
                            </div>

                            <!-- File Info -->
                            <div class="flex-1 min-w-0">
                              <h5 class="font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                                {{ getFileDisplayName(file) }}
                              </h5>
                              <div class="flex items-center space-x-4 mt-1">
                                <span class="text-sm text-slate-400">{{ formatFileSize(file.size) }}</span>
                                <span *ngIf="file.mimeType" class="text-sm text-slate-400">{{ file.mimeType }}</span>
                                <span *ngIf="file.uploadDate" class="text-sm text-slate-400">{{ formatDate(file.uploadDate) }}</span>
                              </div>
                            </div>

                            <!-- Download Icon -->
                            <div class="flex-shrink-0">
                              <div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- No Files Message - Only show when expanded and no files -->
                    <div *ngIf="!hasAttachedFiles(ticket)" class="bg-slate-800 rounded-lg p-6 border border-slate-600 text-center">
                      <svg class="w-12 h-12 mx-auto text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                      <p class="text-slate-400 font-medium">Aucun fichier attaché</p>
                      <p class="text-slate-500 text-sm mt-1">Ce ticket ne contient pas de fichiers joints</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredTickets.length === 0" class="text-center py-12 text-slate-400">
            <svg class="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <h3 class="text-lg font-medium text-slate-300 mb-2">
              {{ userTickets.length === 0 ? 'Aucun ticket trouvé' : 'Aucun ticket ne correspond aux filtres' }}
            </h3>
            <p class="text-slate-400">
              {{ userTickets.length === 0 ? 'Vous n\'avez pas encore créé de tickets' : 'Essayez de modifier vos critères de recherche' }}
            </p>
            <button
              *ngIf="userTickets.length === 0"
              (click)="setActiveSection('create-ticket')"
              class="mt-4 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            >
              Créer votre premier ticket
            </button>
            <button
              *ngIf="userTickets.length > 0"
              (click)="clearFilters()"
              class="mt-4 bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Create Ticket Template -->
    <ng-template #createTicketTemplate>
      <div class="max-w-4xl mx-auto">
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-white">Créer un Nouveau Ticket</h3>
            <div class="flex items-center space-x-2 text-emerald-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <span class="text-sm font-medium">IA Activée</span>
            </div>
          </div>

          <!-- Info Banner -->
          <div class="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="text-sm text-emerald-300 font-medium">Analyse intelligente automatique</p>
                <p class="text-xs text-emerald-400/80 mt-1">
                  Notre IA analysera automatiquement votre description pour déterminer la catégorie, la priorité et assigner le bon technicien.
                  Il vous suffit de décrire votre problème en détail !
                </p>
              </div>
            </div>
          </div>

          <form [formGroup]="createTicketForm" (ngSubmit)="createTicket()" class="space-y-6">
            <!-- Titre du ticket -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Titre du ticket *</label>
              <input
                type="text"
                formControlName="titre"
                placeholder="Décrivez brièvement votre problème (ex: VPN ne fonctionne pas)"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
              <div *ngIf="createTicketForm.get('titre')?.invalid && createTicketForm.get('titre')?.touched" class="text-red-400 text-sm mt-1">
                Le titre est requis
              </div>
            </div>

            <!-- Description détaillée -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Description détaillée *</label>
              <textarea
                formControlName="description"
                rows="8"
                placeholder="Décrivez votre problème en détail :
• Que s'est-il passé exactement ?
• Quand le problème a-t-il commencé ?
• Quelles étapes avez-vous déjà essayées ?
• Y a-t-il des messages d'erreur ?

Plus vous donnez de détails, plus notre équipe pourra vous aider rapidement !"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              ></textarea>
              <div *ngIf="createTicketForm.get('description')?.invalid && createTicketForm.get('description')?.touched" class="text-red-400 text-sm mt-1">
                La description est requise
              </div>
              <p class="text-xs text-slate-500 mt-2">
                💡 Notre IA analysera automatiquement votre description pour déterminer la catégorie et la priorité optimales
              </p>
            </div>

            <!-- File Upload -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Pièces jointes</label>



              <!-- Drop Zone -->
              <div
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
                (drop)="onFileDrop($event)"
                [class]="dragOver ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600'"
                class="border-2 border-dashed rounded-lg p-6 text-center hover:border-slate-500 transition-colors cursor-pointer"
                (click)="fileInput.click()"
              >
                <input
                  #fileInput
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.json,.xml,.html,.rtf"
                  (change)="onFileSelected($event)"
                  class="hidden"
                >

                <div *ngIf="!uploadingFiles">
                  <svg class="w-8 h-8 mx-auto mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-slate-400 mb-2">Glissez-déposez vos fichiers ici ou</p>
                  <span class="text-emerald-400 hover:text-emerald-300 font-medium">
                    cliquez pour parcourir
                  </span>
                  <p class="text-xs text-slate-500 mt-2">Images, PDF, Documents Office, Archives, Texte jusqu'à 100MB</p>
                </div>

                <div *ngIf="uploadingFiles" class="flex items-center justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  <span class="ml-2 text-slate-400">Téléchargement en cours...</span>
                </div>
              </div>

              <!-- Attached Files List -->
              <div *ngIf="attachedFiles.length > 0" class="mt-4 space-y-2">
                <h4 class="text-sm font-medium text-slate-300">Fichiers joints ({{ attachedFiles.length }})</h4>
                <div class="space-y-2">
                  <div
                    *ngFor="let file of attachedFiles; let i = index"
                    class="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="text-slate-400" [innerHTML]="getFileIcon(file.mimeType)"></div>
                      <div>
                        <p class="text-sm font-medium text-white">{{ file.originalName }}</p>
                        <p class="text-xs text-slate-400">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="removeAttachedFile(i)"
                      class="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                      title="Supprimer ce fichier"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>



            <!-- Error Display -->
            <div *ngIf="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p class="text-red-400 text-sm">{{ error }}</p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-slate-700">
              <button
                type="button"
                (click)="resetCreateTicketForm()"
                class="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                [disabled]="loading || createTicketForm.invalid"
                class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <div *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <svg *ngIf="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                {{ loading ? 'Création en cours...' : 'Créer le Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ng-template>

    <!-- Comments Template -->
    <ng-template #commentsTemplate>
      <div class="space-y-6">
        <!-- Ticket Selection -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-lg font-semibold text-white mb-4">Ajouter un Commentaire</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Sélectionnez un ticket</option>
              <option value="TICK-001">#TICK-001 - Problème de connexion réseau</option>
              <option value="TICK-002">#TICK-002 - Demande d'installation logiciel</option>
            </select>
          </div>
          <textarea
            rows="4"
            placeholder="Ajoutez votre commentaire..."
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none mb-4"
          ></textarea>
          <button class="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg text-white font-medium transition-colors">
            Ajouter le Commentaire
          </button>
        </div>

        <!-- Recent Comments -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-lg font-semibold text-white mb-4">Commentaires Récents</h3>
          <div class="space-y-4">
            <div class="border-l-4 border-emerald-500 pl-4 py-2">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-emerald-400">#TICK-001</span>
                <span class="text-xs text-slate-500">Il y a 2 heures</span>
              </div>
              <p class="text-slate-300">Le problème persiste après le redémarrage. Pouvez-vous vérifier la configuration réseau ?</p>
            </div>
            <div class="border-l-4 border-blue-500 pl-4 py-2">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-blue-400">#TICK-002</span>
                <span class="text-xs text-slate-500">Hier</span>
              </div>
              <p class="text-slate-300">Merci pour l'installation rapide. Tout fonctionne parfaitement maintenant.</p>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Evaluations Template -->
    <ng-template #evaluationsTemplate>
      <div class="space-y-6">
        <!-- Pending Evaluations -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-lg font-semibold text-white mb-4">Tickets à Évaluer</h3>
          <div class="space-y-4">
            <div class="bg-slate-700 rounded-lg p-4">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h4 class="font-medium text-white">#TICK-002 - Demande d'installation logiciel</h4>
                  <p class="text-sm text-slate-400">Résolu par Marie Martin le 14/01/2025</p>
                </div>
                <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">FERME</span>
              </div>

              <!-- Rating -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-slate-300 mb-2">Évaluation de la résolution</label>
                <div class="flex space-x-1">
                  <button class="text-yellow-400 hover:text-yellow-300 text-2xl">★</button>
                  <button class="text-yellow-400 hover:text-yellow-300 text-2xl">★</button>
                  <button class="text-yellow-400 hover:text-yellow-300 text-2xl">★</button>
                  <button class="text-yellow-400 hover:text-yellow-300 text-2xl">★</button>
                  <button class="text-slate-500 hover:text-yellow-300 text-2xl">★</button>
                </div>
              </div>

              <!-- Feedback -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-slate-300 mb-2">Commentaire (optionnel)</label>
                <textarea
                  rows="3"
                  placeholder="Partagez votre expérience..."
                  class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                ></textarea>
              </div>

              <button class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">
                Soumettre l'Évaluation
              </button>
            </div>
          </div>
        </div>

        <!-- Evaluation History -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-lg font-semibold text-white mb-4">Historique des Évaluations</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div>
                <h4 class="font-medium text-white">#TICK-001 - Problème de connexion réseau</h4>
                <p class="text-sm text-slate-400">Évalué le 10/01/2025</p>
              </div>
              <div class="text-right">
                <div class="flex text-yellow-400 mb-1">★★★★★</div>
                <p class="text-xs text-slate-500">Excellent service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Profile Template -->
    <ng-template #profileTemplate>
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Profile Information -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center space-x-4 mb-6">
            <div class="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ getUserInitials() }}</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">{{ currentUser?.prenom }} {{ currentUser?.nom }}</h3>
              <p class="text-slate-400">{{ currentUser?.email }}</p>
              <span class="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium mt-1">
                {{ currentUser?.role }}
              </span>
            </div>
          </div>

          <form [formGroup]="profileForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Prénom *</label>
                <input
                  type="text"
                  formControlName="prenom"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Nom *</label>
                <input
                  type="text"
                  formControlName="nom"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  formControlName="email"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Téléphone</label>
                <input
                  type="tel"
                  formControlName="telephone"
                  placeholder="+33 1 23 45 67 89"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-300 mb-2">Localisation</label>
                <input
                  type="text"
                  formControlName="localisation"
                  placeholder="Bureau, étage, ville..."
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>
            </div>

            <!-- Error Display -->
            <div *ngIf="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p class="text-red-400 text-sm">{{ error }}</p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-slate-700">
              <button
                type="button"
                class="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                [disabled]="loading || profileForm.invalid"
                class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <div *ngIf="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ loading ? 'Enregistrement...' : 'Enregistrer les Modifications' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-lg font-semibold text-white mb-4">Changer le Mot de Passe</h3>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Mot de passe actuel</label>
              <input
                type="password"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>
            </div>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium transition-colors"
            >
              Changer le Mot de Passe
            </button>
          </form>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeSection = 'dashboard';
  profileForm!: FormGroup;
  createTicketForm!: FormGroup;
  loading = false;
  error: string | null = null;

  // Data properties
  userStats: UserTicketStats = {
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
    pendingEvaluations: 0
  };
  userTickets: TicketResponse[] = [];
  filteredTickets: TicketResponse[] = [];

  // Filter properties
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';

  // File upload properties
  attachedFiles: AttachedFile[] = [];
  uploadingFiles = false;
  dragOver = false;

  // Notifications
  notifications: NotificationDTO[] = [];
  unreadNotificationCount = 0;
  showNotifications = false;
  isLoadingNotifications = false;
  expandedNotifications = new Set<string>();

  // Ticket details
  selectedTicket: TicketResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private fileUploadService: FileUploadService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verify user has user role
    if (!this.currentUser || this.currentUser.role !== 'UTILISATEUR') {
      console.warn('⚠️ Unauthorized access attempt to user dashboard');
      this.router.navigate(['/login']);
      return;
    }

    this.initializeForms();
    this.loadUserData();
    this.initializeNotifications();
    console.log('✅ User dashboard loaded for:', this.currentUser.email);
  }

  /**
   * Initialize all forms
   */
  private initializeForms(): void {
    this.initializeProfileForm();
    this.initializeCreateTicketForm();
  }

  /**
   * Initialize profile form
   */
  private initializeProfileForm(): void {
    this.profileForm = this.fb.group({
      nom: [this.currentUser?.nom || '', Validators.required],
      prenom: [this.currentUser?.prenom || '', Validators.required],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      telephone: [this.currentUser?.telephone || ''],
      localisation: [this.currentUser?.localisation || '']
    });
  }

  /**
   * Initialize create ticket form
   */
  private initializeCreateTicketForm(): void {
    this.createTicketForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  /**
   * Load user data (tickets, stats, etc.)
   */
  private loadUserData(): void {
    this.loadUserTickets();
    this.loadUserStats();
  }

  /**
   * Load user tickets
   */
  private loadUserTickets(): void {
    this.loading = true;
    this.ticketService.getUserTickets().subscribe({
      next: (tickets) => {
        this.userTickets = tickets;
        this.filteredTickets = [...tickets];
        this.loading = false;
        console.log('✅ User tickets loaded:', tickets.length);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error loading user tickets:', error);
      }
    });
  }

  /**
   * Load user statistics
   */
  private loadUserStats(): void {
    this.ticketService.getUserTicketStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
        console.log('✅ User stats loaded:', stats);
      },
      error: (error) => {
        console.error('❌ Error loading user stats:', error);
        // Keep default stats if API fails
      }
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  getMenuItemClass(section: string): string {
    return this.activeSection === section
      ? 'bg-emerald-600 text-white'
      : 'text-slate-300 hover:text-white hover:bg-slate-700';
  }

  getSectionTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Tableau de bord',
      'my-tickets': 'Mes Tickets',
      'create-ticket': 'Créer un Ticket',
      'comments': 'Commentaires',
      'evaluations': 'Évaluations',
      'profile': 'Mon Profil'
    };
    return titles[this.activeSection] || 'Dashboard';
  }

  getSectionDescription(): string {
    const descriptions: { [key: string]: string } = {
      'dashboard': 'Vue d\'ensemble de vos tickets et services',
      'my-tickets': 'Gérez et suivez vos demandes de service',
      'create-ticket': 'Créez une nouvelle demande de service',
      'comments': 'Ajoutez des commentaires à vos tickets',
      'evaluations': 'Évaluez la résolution de vos tickets fermés',
      'profile': 'Modifiez vos informations personnelles'
    };
    return descriptions[this.activeSection] || '';
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    return `${this.currentUser.prenom.charAt(0)}${this.currentUser.nom.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ==================== FILE UPLOAD METHODS ====================

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    console.log('📁 File selection event triggered');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('📁 Files selected via input:', input.files.length);
      this.handleFiles(Array.from(input.files));
    } else {
      console.log('⚠️ No files selected via input');
    }
  }

  /**
   * Handle drag over event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  /**
   * Handle drag leave event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  /**
   * Handle file drop
   */
  onFileDrop(event: DragEvent): void {
    console.log('📁 File drop event triggered');
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      console.log('📁 Files dropped:', event.dataTransfer.files.length);
      this.handleFiles(Array.from(event.dataTransfer.files));
    } else {
      console.log('⚠️ No files in drop event');
    }
  }

  /**
   * Handle multiple files
   */
  private handleFiles(files: File[]): void {
    console.log('📎 Handling files:', files.length);

    if (files.length === 0) {
      console.log('⚠️ No files selected');
      return;
    }

    files.forEach((file, index) => {
      console.log(`📎 Processing file ${index + 1}/${files.length}:`, file.name, 'Type:', file.type, 'Size:', this.formatFileSize(file.size));

      const validation = this.fileUploadService.validateFile(file);
      if (!validation.valid) {
        console.error('❌ File validation failed:', file.name, validation.error);
        this.error = `${file.name}: ${validation.error}`;
        return;
      }

      this.uploadFile(file);
    });
  }

  /**
   * Upload a single file
   */
  private uploadFile(file: File): void {
    console.log('📤 Starting upload for:', file.name);
    this.uploadingFiles = true;
    this.error = null;

    this.fileUploadService.uploadFile(file).subscribe({
      next: (response: FileUploadResponse) => {
        console.log('✅ Upload response received:', response);

        const attachedFile: AttachedFile = {
          fileName: response.fileName,
          originalName: response.originalName,
          size: response.size,
          mimeType: response.mimeType,
          uploadDate: response.uploadDate,
          url: response.url
        };

        this.attachedFiles.push(attachedFile);
        this.uploadingFiles = false;
        console.log('✅ File added to attachedFiles. Total files:', this.attachedFiles.length);
        console.log('📎 Current attached files:', this.attachedFiles.map(f => f.originalName));
      },
      error: (error) => {
        console.error('❌ Upload error:', error);
        this.error = `Erreur lors du téléchargement de ${file.name}: ${error.message}`;
        this.uploadingFiles = false;
      }
    });
  }

  /**
   * Remove attached file
   */
  removeAttachedFile(index: number): void {
    const file = this.attachedFiles[index];

    // Delete from server
    this.fileUploadService.deleteFile(file.fileName).subscribe({
      next: () => {
        this.attachedFiles.splice(index, 1);
        console.log('✅ File removed:', file.originalName);
      },
      error: (error) => {
        console.error('❌ Error removing file:', error);
        // Remove from UI anyway
        this.attachedFiles.splice(index, 1);
      }
    });
  }

  /**
   * Get file icon HTML
   */
  getFileIcon(mimeType: string): string {
    return this.fileUploadService.getFileIcon(mimeType);
  }



  /**
   * Temporary method to avoid compilation error
   */
  testFileSelection(): void {
    console.log('Test method - should not be called');
  }



  // ==================== TICKET CREATION METHODS ====================

  /**
   * Create a new ticket
   */
  createTicket(): void {
    if (!this.createTicketForm.valid) {
      this.markFormGroupTouched(this.createTicketForm);
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.createTicketForm.value;

    const createRequest: CreateTicketRequest = {
      titre: formValue.titre,
      description: formValue.description,
      enableNlp: true, // Toujours activé par défaut
      // Convert attached files to JSON
      fichiersAttaches: this.attachedFiles.length > 0
        ? this.fileUploadService.filesToJson(this.attachedFiles)
        : undefined
    };

    console.log('🎫 Creating ticket with request:', createRequest);

    this.ticketService.createTicket(createRequest).subscribe({
      next: (ticket) => {
        this.loading = false;
        console.log('✅ Ticket created successfully:', ticket);

        // Reset form and files
        this.createTicketForm.reset();
        this.attachedFiles = [];

        // Switch to tickets view
        this.setActiveSection('my-tickets');

        // Reload tickets
        this.loadUserTickets();
        this.loadUserStats();

        // Show success message (you could add a toast service here)
        alert('Ticket créé avec succès!');
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error creating ticket:', error);
      }
    });
  }

  /**
   * Reset create ticket form
   */
  resetCreateTicketForm(): void {
    this.createTicketForm.reset();

    // Clear attached files
    while (this.attachedFiles.length > 0) {
      this.removeAttachedFile(0);
    }

    this.error = null;
  }

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // ==================== TICKET DISPLAY METHODS ====================

  /**
   * Filter tickets based on search and filter criteria
   */
  filterTickets(): void {
    this.filteredTickets = this.userTickets.filter(ticket => {
      const matchesSearch = !this.searchTerm ||
        ticket.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || ticket.statut === this.statusFilter;
      const matchesPriority = !this.priorityFilter || ticket.priorite === this.priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.filterTickets();
  }

  /**
   * Get tickets by status
   */
  getTicketsByStatus(status: string): TicketResponse[] {
    return this.userTickets.filter(ticket => ticket.statut === status);
  }

  /**
   * Toggle ticket details view
   */
  toggleTicketDetails(ticket: TicketResponse): void {
    if (this.selectedTicket?.id === ticket.id) {
      this.selectedTicket = null;
    } else {
      this.selectedTicket = ticket;
    }
  }

  /**
   * Track by function for ngFor
   */
  trackByTicketId(index: number, ticket: TicketResponse): string {
    return ticket.id;
  }

  /**
   * Get status badge CSS class
   */
  getStatusBadgeClass(status: string): string {
    const classes = {
      'OUVERT': 'bg-blue-500/20 text-blue-400',
      'EN_COURS': 'bg-yellow-500/20 text-yellow-400',
      'FERME': 'bg-green-500/20 text-green-400',
      'ANNULE': 'bg-red-500/20 text-red-400'
    };
    return classes[status as keyof typeof classes] || 'bg-slate-500/20 text-slate-400';
  }

  /**
   * Get priority badge CSS class
   */
  getPriorityBadgeClass(priority: string): string {
    const classes = {
      'BASSE': 'bg-slate-500/20 text-slate-400',
      'MOYENNE': 'bg-blue-500/20 text-blue-400',
      'HAUTE': 'bg-orange-500/20 text-orange-400',
      'CRITIQUE': 'bg-red-500/20 text-red-400'
    };
    return classes[priority as keyof typeof classes] || 'bg-slate-500/20 text-slate-400';
  }

  /**
   * Get status label
   */
  getStatusLabel(status: string): string {
    const labels = {
      'OUVERT': 'Ouvert',
      'EN_COURS': 'En cours',
      'FERME': 'Fermé',
      'ANNULE': 'Annulé'
    };
    return labels[status as keyof typeof labels] || status;
  }

  /**
   * Get priority label
   */
  getPriorityLabel(priority: string): string {
    const labels = {
      'BASSE': 'Basse',
      'MOYENNE': 'Moyenne',
      'HAUTE': 'Haute',
      'CRITIQUE': 'Critique'
    };
    return labels[priority as keyof typeof labels] || priority;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Format date and time for display
   */
  formatDateTime(dateString: string): string {
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
   * Format time only for display
   */
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // ==================== FILE ATTACHMENT METHODS ====================

  /**
   * Check if ticket has attached files
   */
  hasAttachedFiles(ticket: TicketResponse): boolean {
    return this.getAttachedFiles(ticket).length > 0;
  }

  /**
   * Get attached files from ticket
   */
  getAttachedFiles(ticket: TicketResponse): any[] {
    if (!ticket.fichiersAttaches) {
      console.log('📎 No fichiersAttaches field in ticket:', ticket.id);
      return [];
    }

    console.log('📎 Raw fichiersAttaches data for ticket', ticket.id, ':', ticket.fichiersAttaches);
    console.log('📎 Type of fichiersAttaches:', typeof ticket.fichiersAttaches);

    try {
      const files = JSON.parse(ticket.fichiersAttaches);
      console.log('📎 Parsed files:', files);
      console.log('📎 Number of files:', Array.isArray(files) ? files.length : 'Not an array');

      if (Array.isArray(files)) {
        files.forEach((file, index) => {
          console.log(`📎 File ${index}:`, {
            fileName: file.fileName,
            originalName: file.originalName,
            name: file.name,
            size: file.size,
            mimeType: file.mimeType,
            uploadDate: file.uploadDate,
            fullObject: file
          });
        });
      }

      return Array.isArray(files) ? files : [];
    } catch (error) {
      console.error('❌ Error parsing attached files:', error);
      console.log('📎 Raw data that failed to parse:', ticket.fichiersAttaches);
      return [];
    }
  }

  /**
   * Check if file is an image
   */
  isImageFile(file: any): boolean {
    const fileName = file.originalName || file.fileName || file.name;
    if (!fileName) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }

  /**
   * Get display name for file (what user sees)
   */
  getFileDisplayName(file: any): string {
    return file.originalName || file.fileName || file.name || 'Fichier sans nom';
  }

  /**
   * Get actual filename for download (from backend storage)
   */
  getActualFileName(file: any): string | null {
    if (file.filePath) {
      const pathParts = file.filePath.split('/');
      return pathParts[pathParts.length - 1];
    }
    return file.fileName || file.name || null;
  }

  /**
   * Download file attachment
   */
  downloadFile(file: any): void {
    console.log('📥 Downloading file - Full object:', file);

    // Debug: Log all possible filename properties
    console.log('📥 File properties:', {
      fileName: file.fileName,
      originalName: file.originalName,
      name: file.name,
      url: file.url,
      size: file.size,
      mimeType: file.mimeType,
      filePath: file.filePath
    });

    // Get the actual filename for download (from backend storage path)
    const fileName = this.getActualFileName(file);
    if (!fileName) {
      console.error('❌ No filename found in file object:', file);
      alert('Erreur: Nom de fichier introuvable dans les données du fichier');
      return;
    }

    console.log('📥 Using filename for download:', fileName);

    console.log('📥 Attempting to download file with filename:', fileName);

    // Get the JWT token for authentication
    const token = this.authService.getToken();
    if (!token) {
      console.error('❌ No authentication token found');
      alert('Erreur: Vous devez être connecté pour télécharger des fichiers');
      return;
    }

    // Create download URL for the file
    const downloadUrl = `http://localhost:8083/api/tickets/files/${encodeURIComponent(fileName)}`;
    console.log('📥 Download URL:', downloadUrl);

    // Show loading indicator
    const originalText = 'Téléchargement en cours...';
    console.log('📥', originalText);

    // Use fetch with proper authentication headers
    fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
        // Remove Content-Type header for file downloads
      }
    })
    .then(response => {
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);
      console.log('📥 Response statusText:', response.statusText);

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 404) {
          throw new Error(`Fichier non trouvé sur le serveur. Le fichier "${fileName}" n'existe peut-être plus.`);
        } else if (response.status === 403) {
          throw new Error(`Accès refusé. Vous n'avez pas les permissions pour télécharger ce fichier.`);
        } else if (response.status === 401) {
          throw new Error(`Session expirée. Veuillez vous reconnecter.`);
        } else {
          // Get more detailed error information
          return response.text().then(errorText => {
            console.error('❌ Server response:', errorText);
            throw new Error(`Erreur serveur (${response.status}): ${response.statusText}`);
          });
        }
      }
      return response.blob();
    })
    .then(blob => {
      console.log('📥 Blob received, size:', blob.size, 'type:', blob.type);

      if (blob.size === 0) {
        throw new Error('Le fichier téléchargé est vide');
      }

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = this.getFileDisplayName(file); // Use display name for download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ File downloaded successfully:', this.getFileDisplayName(file));
    })
    .catch(error => {
      console.error('❌ Error downloading file:', error);
      alert(`Erreur lors du téléchargement du fichier:\n${error.message}`);
    });
  }

  // ==================== TICKET ACTION METHODS ====================

  /**
   * Delete ticket with confirmation
   */
  deleteTicket(ticket: TicketResponse): void {
    console.log('🗑️ Attempting to delete ticket:', ticket.id);

    // Show confirmation dialog
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer le ticket "${ticket.titre}" ?\n\nCette action est irréversible.`;

    if (confirm(confirmMessage)) {
      console.log('🗑️ User confirmed deletion for ticket:', ticket.id);

      // Show loading state
      this.loading = true;

      // Call the ticket service to delete
      this.ticketService.deleteTicket(ticket.id).subscribe({
        next: () => {
          console.log('✅ Ticket deleted successfully:', ticket.id);

          // Remove the ticket from the local arrays
          this.userTickets = this.userTickets.filter(t => t.id !== ticket.id);
          this.filteredTickets = this.filteredTickets.filter(t => t.id !== ticket.id);

          // Close expanded details if this ticket was selected
          if (this.selectedTicket?.id === ticket.id) {
            this.selectedTicket = null;
          }

          // Show success message
          alert('Ticket supprimé avec succès !');

          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error deleting ticket:', error);

          let errorMessage = 'Erreur lors de la suppression du ticket.';

          if (error.status === 403) {
            errorMessage = 'Vous n\'avez pas les permissions pour supprimer ce ticket.';
          } else if (error.status === 404) {
            errorMessage = 'Ticket non trouvé.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          alert(`Erreur: ${errorMessage}`);
          this.loading = false;
        }
      });
    } else {
      console.log('🚫 User cancelled ticket deletion');
    }
  }

  /**
   * Evaluate ticket
   */
  evaluateTicket(ticket: TicketResponse): void {
    console.log('⭐ Evaluating ticket:', ticket.id);
    // Switch to evaluations section and pre-select the ticket
    this.setActiveSection('evaluations');
    // You could add logic here to pre-select the ticket in the evaluation form
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Initialize notifications system
   */
  initializeNotifications(): void {
    console.log('🔔 User: Initializing notifications...');
    console.log('🔔 User: Current user:', this.currentUser);

    // Subscribe to notifications
    this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
        console.log('📬 User: Notifications updated:', notifications.length, notifications);
      }
    );

    // Subscribe to unread count
    this.notificationService.unreadCount$.subscribe(
      count => {
        this.unreadNotificationCount = count;
        console.log('🔢 User: Unread count updated:', count);
      }
    );

    // Subscribe to new notifications
    this.notificationService.newNotification$.subscribe(
      notification => {
        console.log('🆕 User: New notification received:', notification);
        this.showNotificationToast(notification);
      }
    );

    // Test notification service first
    this.notificationService.testNotificationService().subscribe({
      next: () => {
        console.log('✅ User: Notification service test passed, loading notifications...');
        this.loadNotifications();
      },
      error: (error) => {
        console.error('❌ User: Notification service test failed:', error);
      }
    });
  }

  /**
   * Load notifications
   */
  loadNotifications(): void {
    console.log('🔔 User: Loading notifications...');
    this.isLoadingNotifications = true;

    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        console.log('✅ User: Notifications loaded successfully:', notifications);
        this.notifications = notifications;
        this.isLoadingNotifications = false;
      },
      error: (error) => {
        console.error('❌ User: Error loading notifications:', error);
        this.isLoadingNotifications = false;
      }
    });

    // Load unread count
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        console.log('✅ User: Unread count loaded:', count);
      },
      error: (error) => {
        console.error('❌ User: Error loading unread count:', error);
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
      console.log('🔔 User: Marking notification as read:', notification.id);
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          console.log('✅ User: Notification marked as read, updating local state');
          // Update local state immediately - notification stays visible but marked as read
          notification.readStatus = true;
          this.unreadNotificationCount = Math.max(0, this.unreadNotificationCount - 1);

          // Update the notifications subject to reflect the change
          this.notificationService.updateNotificationReadStatus(notification.id, true);
        },
        error: (error) => {
          console.error('❌ User: Error marking notification as read:', error);
        }
      });
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead(): void {
    console.log('🔔 User: Marking all notifications as read');
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        console.log('✅ User: All notifications marked as read, updating local state');
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
        console.error('❌ User: Error marking all notifications as read:', error);
      }
    });
  }

  /**
   * Show notification toast (for new notifications)
   */
  showNotificationToast(notification: NotificationDTO): void {
    console.log('🔔 User: New notification toast:', notification.title);

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
