import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/auth.interface';
import { TechnicianService, TechnicianTicketResponse } from '../core/services/technician.service';
import { TicketService } from '../core/services/ticket.service';
import { AttachedFile } from '../core/services/file-upload.service';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  badge?: number;
  color: string;
}

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex">
      <!-- Enhanced Vertical Sidebar -->
      <div class="w-80 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 border-r border-slate-700/50 flex flex-col shadow-2xl">
        <!-- Enhanced Header -->
        <div class="p-6 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <div class="flex items-center mb-6">
            <div class="relative">
              <div class="h-14 w-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/25">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <!-- Status indicator -->
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">ITSM Dashboard</h1>
              <p class="text-sm text-slate-400">Support Technique</p>
              <div class="flex items-center space-x-2 mt-1">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-xs text-green-400 font-medium">En ligne</span>
              </div>
            </div>
          </div>

          <!-- Enhanced User Info -->
          <div class="bg-gradient-to-r from-slate-700/60 to-slate-600/60 rounded-xl p-4 border border-slate-600/30 backdrop-blur-sm">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <span class="text-white text-sm font-bold">{{ getUserInitials() }}</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-white">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
                <p class="text-xs text-orange-400 font-semibold">{{ currentUser?.role }}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p class="text-xs text-green-400">Connecté</p>
                </div>
              </div>
            </div>
            <button (click)="logout()"
                    class="w-full bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600/30 hover:to-red-500/30 text-red-400 text-sm py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-red-600/20 hover:border-red-500/30">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 p-4 space-y-2">
          <div *ngFor="let item of menuItems" 
               (click)="setActiveSection(item.id)"
               class="group cursor-pointer rounded-lg p-4 transition-all duration-200 hover:bg-slate-700/50"
               [class]="activeSection === item.id ? 'bg-slate-700 border border-slate-600' : 'hover:bg-slate-700/30'">
            
            <div class="flex items-center space-x-3">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                     [class]="activeSection === item.id ? item.color + '/30' : 'bg-slate-700'">
                  <div [innerHTML]="item.icon" 
                       [class]="activeSection === item.id ? getIconColor(item.color) : 'text-slate-400'">
                  </div>
                </div>
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-medium transition-colors"
                      [class]="activeSection === item.id ? 'text-white' : 'text-slate-300 group-hover:text-white'">
                    {{ item.label }}
                  </h3>
                  <span *ngIf="item.badge" 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        [class]="activeSection === item.id ? 'bg-orange-500 text-white' : 'bg-slate-600 text-slate-300'">
                    {{ item.badge }}
                  </span>
                </div>
                <p class="text-xs mt-1 transition-colors"
                   [class]="activeSection === item.id ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <div class="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white">{{ getActiveMenuTitle() }}</h2>
              <p class="text-sm text-slate-400">{{ getActiveMenuDescription() }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3h5v5h-5V3zM4 3h6v6H4V3z"></path>
                </svg>
                <span class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              <!-- Refresh -->
              <button (click)="refreshData()" 
                      class="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
                      title="Actualiser">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 p-6 bg-slate-900 overflow-auto">
          
          <!-- Dashboard Overview -->
          <div *ngIf="activeSection === 'dashboard'">
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
                    <p class="text-sm font-medium text-slate-400">Tickets Assignés</p>
                    <p class="text-2xl font-bold text-white">{{ dashboardStats.assignedTickets }}</p>
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
                    <p class="text-sm font-medium text-slate-400">Résolus Aujourd'hui</p>
                    <p class="text-2xl font-bold text-white">{{ dashboardStats.resolvedToday }}</p>
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
                    <p class="text-sm font-medium text-slate-400">Haute Priorité</p>
                    <p class="text-2xl font-bold text-white">{{ dashboardStats.highPriority }}</p>
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
                    <p class="text-sm font-medium text-slate-400">Temps Moyen</p>
                    <p class="text-2xl font-bold text-white">{{ dashboardStats.avgResolution }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 class="text-lg font-semibold text-white mb-4">Actions Rapides</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button (click)="setActiveSection('tickets')" 
                        class="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-white">Voir Tickets</p>
                      <p class="text-xs text-slate-400">Gérer mes tickets</p>
                    </div>
                  </div>
                </button>

                <button (click)="setActiveSection('workload')" 
                        class="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-white">Charge de Travail</p>
                      <p class="text-xs text-slate-400">Voir mes indicateurs</p>
                    </div>
                  </div>
                </button>

                <button (click)="setActiveSection('skills')" 
                        class="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-white">Compétences</p>
                      <p class="text-xs text-slate-400">Mes expertises</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Tickets Section -->
          <div *ngIf="activeSection === 'tickets'">
            <div class="bg-slate-800 rounded-xl border border-slate-700">
              <div class="p-6 border-b border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-white">Mes Tickets Assignés</h3>
                    <p class="text-sm text-slate-400 mt-1">Gérez vos tickets en cours et à traiter ({{ assignedTickets.length }} tickets)</p>
                  </div>
                  <div class="flex space-x-2">
                    <button (click)="filterTicketsByStatus('ALL')"
                            [class]="currentFilter === 'ALL' ? 'px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium' : 'px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors'">
                      Tous
                    </button>
                    <button (click)="filterTicketsByStatus('EN_COURS')"
                            [class]="currentFilter === 'EN_COURS' ? 'px-4 py-2 bg-orange-600 text-white text-sm rounded-lg font-medium' : 'px-4 py-2 bg-slate-600 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors'">
                      Nouveaux
                    </button>
                    <button (click)="filterTicketsByStatus('OUVERT')"
                            [class]="currentFilter === 'OUVERT' ? 'px-4 py-2 bg-green-600 text-white text-sm rounded-lg font-medium' : 'px-4 py-2 bg-slate-600 hover:bg-green-600 text-white text-sm rounded-lg transition-colors'">
                      En Cours
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <!-- Loading State -->
                <div *ngIf="loading" class="text-center py-8">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p class="text-slate-400 mt-2">Chargement des tickets...</p>
                </div>

                <!-- No Tickets -->
                <div *ngIf="!loading && filteredTickets.length === 0" class="text-center py-8">
                  <svg class="w-16 h-16 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <p class="text-slate-400 font-medium">Aucun ticket assigné</p>
                  <p class="text-slate-500 text-sm mt-1">Vous n'avez actuellement aucun ticket à traiter</p>
                </div>

                <!-- Tickets List -->
                <div *ngIf="!loading && filteredTickets.length > 0" class="space-y-4">
                  <div *ngFor="let ticket of filteredTickets"
                       class="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all duration-200">

                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center space-x-3">
                        <span class="px-2 py-1 text-xs font-medium rounded"
                              [class]="getStatusDisplay(ticket.statut).color">
                          {{ getStatusDisplay(ticket.statut).label }}
                        </span>
                        <span class="px-2 py-1 text-xs font-medium rounded"
                              [class]="getPriorityDisplay(ticket.priorite).color">
                          {{ getPriorityDisplay(ticket.priorite).label }}
                        </span>
                        <span *ngIf="ticket.categorie" class="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded">
                          {{ ticket.categorie }}
                        </span>
                      </div>
                      <span class="text-xs text-slate-400">{{ getTicketDisplayId(ticket) }}</span>
                    </div>

                    <h4 class="font-medium text-white mb-2">{{ ticket.titre }}</h4>
                    <p class="text-sm text-slate-400 mb-3 line-clamp-2">{{ ticket.description }}</p>

                    <div class="flex items-center justify-between">
                      <span class="text-xs text-slate-500">Créé {{ getFormattedDate(ticket.dateCreation) }}</span>
                      <div class="flex space-x-2">
                        <button (click)="viewTicketDetails(ticket)"
                                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                          Ouvrir
                        </button>
                        <button *ngIf="ticket.statut === 'EN_COURS'"
                                (click)="startWorkingOnTicket(ticket)"
                                class="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors">
                          Démarrer
                        </button>
                        <button *ngIf="ticket.statut === 'OUVERT'"
                                (click)="openResolveModal(ticket)"
                                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors">
                          Résoudre
                        </button>
                        <button (click)="openCommentModal(ticket)"
                                class="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors">
                          Note
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Status Management Section -->
          <div *ngIf="activeSection === 'status'">
            <div class="bg-slate-800 rounded-xl border border-slate-700">
              <div class="p-6 border-b border-slate-700">
                <h3 class="text-lg font-semibold text-white">Gestion des Statuts</h3>
                <p class="text-sm text-slate-400 mt-1">Modifier le statut des tickets assignés</p>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <!-- Status Cards with Real Data -->
                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <h4 class="font-medium text-white">EN_COURS</h4>
                    </div>
                    <p class="text-sm text-slate-400 mb-3">Tickets nouvellement assignés</p>
                    <span class="text-2xl font-bold text-orange-400">{{ getStatusCount('EN_COURS') }}</span>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h4 class="font-medium text-white">OUVERT</h4>
                    </div>
                    <p class="text-sm text-slate-400 mb-3">Tickets en cours de traitement</p>
                    <span class="text-2xl font-bold text-blue-400">{{ getStatusCount('OUVERT') }}</span>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h4 class="font-medium text-white">RESOLU</h4>
                    </div>
                    <p class="text-sm text-slate-400 mb-3">Tickets résolus</p>
                    <span class="text-2xl font-bold text-green-400">{{ getStatusCount('RESOLU') }}</span>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <h4 class="font-medium text-white">EN_ATTENTE</h4>
                    </div>
                    <p class="text-sm text-slate-400 mb-3">Tickets en attente</p>
                    <span class="text-2xl font-bold text-yellow-400">{{ getStatusCount('EN_ATTENTE') }}</span>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                      <h4 class="font-medium text-white">HAUTE PRIORITÉ</h4>
                    </div>
                    <p class="text-sm text-slate-400 mb-3">Tickets haute priorité</p>
                    <span class="text-2xl font-bold text-red-400">{{ dashboardStats.highPriority }}</span>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-3 h-3 bg-slate-500 rounded-full"></div>
                      <h4 class="font-medium text-white">TOTAL</h4>
                    </div>
                    <p class="text-sm text-slate-400 mb-3">Total des tickets assignés</p>
                    <span class="text-2xl font-bold text-slate-400">{{ assignedTickets.length }}</span>
                  </div>
                </div>

                <!-- Quick Status Change -->
                <div class="mt-6 bg-slate-700/30 rounded-lg p-4">
                  <h4 class="font-medium text-white mb-3">Actions Rapides</h4>
                  <div class="flex flex-wrap gap-2">
                    <button (click)="filterTicketsByStatus('EN_COURS')"
                            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors">
                      Voir Nouveaux Tickets ({{ getStatusCount('EN_COURS') }})
                    </button>
                    <button (click)="filterTicketsByStatus('OUVERT')"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      Voir En Cours ({{ getStatusCount('OUVERT') }})
                    </button>
                    <button (click)="setActiveSection('tickets')"
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                      Gérer Tous les Tickets
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div *ngIf="activeSection === 'comments'">
            <div class="bg-slate-800 rounded-xl border border-slate-700">
              <div class="p-6 border-b border-slate-700">
                <h3 class="text-lg font-semibold text-white">Commentaires Techniques</h3>
                <p class="text-sm text-slate-400 mt-1">Ajouter des notes et commentaires sur les tickets</p>
              </div>
              <div class="p-6">
                <!-- Add Comment Form -->
                <div class="bg-slate-700/30 rounded-lg p-4 mb-6">
                  <h4 class="font-medium text-white mb-3">Ajouter un Commentaire</h4>
                  <div class="space-y-3">
                    <select [(ngModel)]="selectedTicketForComment"
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                      <option [ngValue]="null">Sélectionner un ticket assigné</option>
                      <option *ngFor="let ticket of assignedTickets" [ngValue]="ticket">
                        {{ getTicketDisplayId(ticket) }} - {{ ticket.titre }}
                      </option>
                    </select>
                    <textarea
                      [(ngModel)]="technicalNote"
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white h-24 resize-none"
                      placeholder="Saisir votre commentaire technique..."
                      [disabled]="!selectedTicketForComment"></textarea>
                    <div class="flex justify-end">
                      <button (click)="addCommentToSelectedTicket()"
                              [disabled]="!selectedTicketForComment || !technicalNote.trim() || isAddingNote"
                              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                        <svg *ngIf="isAddingNote" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ isAddingNote ? 'Ajout...' : 'Ajouter Commentaire' }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Selected Ticket Info -->
                  <div *ngIf="selectedTicketForComment" class="mt-4 p-3 bg-slate-600/50 rounded-lg">
                    <h5 class="font-medium text-white mb-2">Ticket sélectionné :</h5>
                    <div class="flex items-center space-x-3 mb-2">
                      <span class="px-2 py-1 text-xs font-medium rounded"
                            [class]="getStatusDisplay(selectedTicketForComment.statut).color">
                        {{ getStatusDisplay(selectedTicketForComment.statut).label }}
                      </span>
                      <span class="px-2 py-1 text-xs font-medium rounded"
                            [class]="getPriorityDisplay(selectedTicketForComment.priorite).color">
                        {{ getPriorityDisplay(selectedTicketForComment.priorite).label }}
                      </span>
                      <span *ngIf="selectedTicketForComment.categorie" class="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded">
                        {{ selectedTicketForComment.categorie }}
                      </span>
                    </div>
                    <p class="text-slate-300 text-sm">{{ selectedTicketForComment.description }}</p>
                    <p class="text-slate-400 text-xs mt-1">Créé {{ getFormattedDate(selectedTicketForComment.dateCreation) }}</p>
                  </div>
                </div>

                <!-- Recent Comments -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium text-white">Commentaires Récents</h4>
                    <div class="flex items-center space-x-2">
                      <span class="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full">
                        {{ recentComments.length }} commentaire{{ recentComments.length > 1 ? 's' : '' }}
                      </span>
                      <button (click)="loadRecentComments()"
                              class="p-2 text-slate-400 hover:text-white transition-colors"
                              title="Actualiser">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Loading State -->
                  <div *ngIf="isLoadingComments" class="text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <p class="text-slate-400 mt-2">Chargement des commentaires...</p>
                  </div>

                  <!-- Real Comments -->
                  <div *ngIf="!isLoadingComments && recentComments.length > 0" class="space-y-4">
                    <div *ngFor="let comment of recentComments"
                         class="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300">
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-3">
                          <span class="text-sm font-medium text-white">{{ getTicketDisplayId(comment) }} - {{ comment.ticketTitre }}</span>
                          <span class="px-2 py-1 text-xs font-medium rounded"
                                [class]="getStatusDisplay(comment.ticketStatut).color">
                            {{ getStatusDisplay(comment.ticketStatut).label }}
                          </span>
                          <span class="px-2 py-1 text-xs font-medium rounded"
                                [class]="getPriorityDisplay(comment.ticketPriorite).color">
                            {{ getPriorityDisplay(comment.ticketPriorite).label }}
                          </span>
                        </div>
                        <span class="text-xs text-slate-400">{{ getRelativeTime(comment.dateCreation) }}</span>
                      </div>

                      <p class="text-sm text-slate-300 mb-3 leading-relaxed">{{ comment.commentaire }}</p>

                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                          <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded font-medium">
                            RÉSOLUTION
                          </span>
                          <span class="text-xs text-slate-500">Par {{ comment.technicienNom }}</span>
                        </div>
                        <div class="text-xs text-slate-500">
                          {{ getFormattedDate(comment.dateCreation) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No Comments -->
                  <div *ngIf="!isLoadingComments && recentComments.length === 0" class="text-center py-8">
                    <div class="bg-slate-700/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                    </div>
                    <h4 class="font-medium text-white mb-2">Aucun commentaire récent</h4>
                    <p class="text-slate-400 text-sm">Vos commentaires de résolution apparaîtront ici une fois que vous aurez résolu des tickets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Section -->
          <div *ngIf="activeSection === 'skills'">
            <div class="bg-slate-800 rounded-xl border border-slate-700">
              <div class="p-6 border-b border-slate-700">
                <h3 class="text-lg font-semibold text-white">Mes Compétences</h3>
                <p class="text-sm text-slate-400 mt-1">Consultez et gérez vos domaines d'expertise</p>
              </div>

              <!-- Loading State -->
              <div *ngIf="isLoadingProfile" class="p-6 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p class="text-slate-400 mt-2">Chargement de vos compétences...</p>
              </div>

              <!-- Profile Info -->
              <div *ngIf="!isLoadingProfile && technicianProfile" class="p-6 border-b border-slate-700">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-lg">{{ technicianProfile.prenom?.charAt(0) }}{{ technicianProfile.nom?.charAt(0) }}</span>
                  </div>
                  <div>
                    <h4 class="font-medium text-white">{{ technicianProfile.prenom }} {{ technicianProfile.nom }}</h4>
                    <p class="text-sm text-slate-400">{{ technicianProfile.specialite || 'Technicien IT' }}</p>
                    <p class="text-xs text-slate-500">{{ technicianProfile.localisation || 'Localisation non définie' }}</p>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <!-- Real Competences -->
                <div *ngIf="!isLoadingProfile && competences.length > 0">
                  <div class="flex items-center justify-between mb-6">
                    <h4 class="font-medium text-white">Compétences Techniques</h4>
                    <div class="flex items-center space-x-2">
                      <span class="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full">
                        {{ competences.length }} compétence{{ competences.length > 1 ? 's' : '' }}
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div *ngFor="let competence of competences"
                         class="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-5 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">

                      <!-- Header with name and level -->
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                          <h5 class="text-lg font-semibold text-white mb-1">{{ competence.nom }}</h5>
                          <div class="flex items-center space-x-2">
                            <span class="px-2 py-1 text-xs font-medium rounded-full"
                                  [class]="getCategoryDisplay(competence.categorie).color">
                              {{ getCategoryDisplay(competence.categorie).label }}
                            </span>
                          </div>
                        </div>
                        <div class="flex flex-col items-end">
                          <span class="text-xs font-medium" [class]="getLevelDisplay(competence.niveau).color">
                            {{ getLevelDisplay(competence.niveau).label }}
                          </span>
                          <div class="flex items-center mt-1">
                            <div class="flex space-x-1">
                              <div *ngFor="let star of getLevelStars(competence.niveau); let i = index"
                                   class="w-2 h-2 rounded-full transition-all duration-300"
                                   [class]="star ? getLevelStarClass(competence.niveau) : 'bg-slate-600'">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Description -->
                      <p class="text-sm text-slate-300 mb-4 leading-relaxed">{{ competence.description }}</p>

                      <!-- Progress bar based on level -->
                      <div class="mb-3">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-xs text-slate-400">Niveau de maîtrise</span>
                          <span class="text-xs font-medium" [class]="getLevelDisplay(competence.niveau).color">
                            {{ getLevelPercentage(competence.niveau) }}%
                          </span>
                        </div>
                        <div class="w-full bg-slate-600/50 rounded-full h-2.5 overflow-hidden">
                          <div class="h-2.5 rounded-full transition-all duration-700 ease-out relative"
                               [class]="getLevelProgressBarClass(competence.niveau)"
                               [style.width.%]="getLevelPercentage(competence.niveau)">
                            <!-- Shine effect -->
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                        transform -skew-x-12 animate-pulse"></div>
                          </div>
                        </div>
                      </div>

                      <!-- Footer with category icon -->
                      <div class="flex items-center justify-between pt-3 border-t border-slate-600/30">
                        <div class="flex items-center space-x-2">
                          <div class="w-6 h-6 rounded-lg flex items-center justify-center"
                               [class]="getCategoryDisplay(competence.categorie).bgColor">
                            <svg class="w-3 h-3" [class]="getCategoryDisplay(competence.categorie).iconColor"
                                 fill="currentColor" viewBox="0 0 20 20">
                              <path [attr.d]="getCategoryIcon(competence.categorie)"></path>
                            </svg>
                          </div>
                          <span class="text-xs text-slate-400">{{ getCategoryDisplay(competence.categorie).label }}</span>
                        </div>
                        <div class="text-xs text-slate-500">
                          Expertise validée
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No Competences -->
                <div *ngIf="!isLoadingProfile && competences.length === 0" class="text-center py-12">
                  <div class="bg-slate-700/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <h4 class="text-xl font-semibold text-white mb-3">Aucune compétence enregistrée</h4>
                  <p class="text-slate-400 text-sm max-w-md mx-auto mb-6">
                    Vos compétences techniques seront affichées ici une fois qu'elles auront été ajoutées par votre manager.
                    Ces informations permettront une meilleure attribution des tickets selon votre expertise.
                  </p>
                  <div class="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 max-w-sm mx-auto">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div class="text-left">
                        <p class="text-sm font-medium text-blue-400">Information</p>
                        <p class="text-xs text-slate-400">Contactez votre manager pour ajouter vos compétences</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Competences by Category -->
                <div *ngIf="!isLoadingProfile && competences.length > 0" class="mt-8">
                  <h4 class="font-medium text-white mb-6">Répartition par Domaine d'Expertise</h4>
                  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div *ngFor="let category of ['SECURITE', 'RESEAU', 'DEVELOPPEMENT', 'SYSTEME', 'AUDIT', 'CONFORMITE']"
                         class="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-4 text-center border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg"
                         [class]="getCategoryDisplay(category).bgColor + '/10'">

                      <!-- Category Icon -->
                      <div class="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                           [class]="getCategoryDisplay(category).bgColor">
                        <svg class="w-6 h-6" [class]="getCategoryDisplay(category).iconColor"
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                [attr.d]="getCategoryIcon(category)"></path>
                        </svg>
                      </div>

                      <!-- Count -->
                      <div class="text-2xl font-bold mb-1" [class]="getCategoryDisplay(category).iconColor">
                        {{ getCompetencesByCategory(category).length }}
                      </div>

                      <!-- Category Name -->
                      <div class="text-xs font-medium text-slate-300 mb-2">
                        {{ getCategoryDisplay(category).label }}
                      </div>

                      <!-- Progress indicator -->
                      <div class="w-full bg-slate-600/30 rounded-full h-1.5 overflow-hidden">
                        <div class="h-1.5 rounded-full transition-all duration-700 ease-out relative"
                             [class]="getCategoryProgressBarClass(category)"
                             [style.width.%]="getCategoryProgress(category)">
                          <!-- Subtle shine effect -->
                          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                      transform -skew-x-12"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Summary Stats -->
                  <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                      <div class="text-lg font-bold text-green-400">{{ getExpertCompetences().length }}</div>
                      <div class="text-xs text-slate-400">Expertises Avancées</div>
                    </div>
                    <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                      <div class="text-lg font-bold text-blue-400">{{ getAverageLevel() }}%</div>
                      <div class="text-xs text-slate-400">Niveau Moyen</div>
                    </div>
                    <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                      <div class="text-lg font-bold text-purple-400">{{ getUniqueCategories().length }}</div>
                      <div class="text-xs text-slate-400">Domaines Couverts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Workload Section -->
          <div *ngIf="activeSection === 'workload'">
            <div class="bg-slate-800 rounded-xl border border-slate-700">
              <div class="p-6 border-b border-slate-700">
                <h3 class="text-lg font-semibold text-white">Charge de Travail</h3>
                <p class="text-sm text-slate-400 mt-1">Indicateurs de performance et charge de travail</p>
              </div>
              <div class="p-6">
                <!-- Real Workload Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <!-- Capacity Used -->
                  <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div class="text-right">
                        <p class="text-2xl font-bold text-white">{{ workloadMetrics.capacityUsed }}%</p>
                        <p class="text-xs text-blue-400 font-medium">Capacité Utilisée</p>
                      </div>
                    </div>
                    <div class="w-full bg-slate-600/30 rounded-full h-2">
                      <div class="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-700"
                           [style.width.%]="workloadMetrics.capacityUsed"></div>
                    </div>
                    <p class="text-xs text-slate-400 mt-2">{{ assignedTickets.length }} tickets assignés</p>
                  </div>

                  <!-- Resolution Rate -->
                  <div class="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div class="text-right">
                        <p class="text-2xl font-bold text-white">{{ workloadMetrics.resolutionRate }}%</p>
                        <p class="text-xs text-green-400 font-medium">Taux de Résolution</p>
                      </div>
                    </div>
                    <div class="w-full bg-slate-600/30 rounded-full h-2">
                      <div class="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-700"
                           [style.width.%]="workloadMetrics.resolutionRate"></div>
                    </div>
                    <p class="text-xs text-slate-400 mt-2">{{ getResolvedTicketsCount() }} tickets résolus</p>
                  </div>

                  <!-- Average Time -->
                  <div class="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-6 border border-orange-500/20">
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div class="text-right">
                        <p class="text-2xl font-bold text-white">{{ workloadMetrics.averageTime }}</p>
                        <p class="text-xs text-orange-400 font-medium">Temps Moyen</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <p class="text-xs text-slate-400">Résolution moyenne</p>
                    </div>
                  </div>

                  <!-- High Priority -->
                  <div class="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-6 border border-red-500/20">
                    <div class="flex items-center justify-between mb-4">
                      <div class="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                      </div>
                      <div class="text-right">
                        <p class="text-2xl font-bold text-white">{{ getHighPriorityCount() }}</p>
                        <p class="text-xs text-red-400 font-medium">Haute Priorité</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <p class="text-xs text-slate-400">Tickets urgents</p>
                    </div>
                  </div>
                </div>

                <!-- Real Weekly Performance Chart -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <!-- Weekly Performance -->
                  <div class="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/30">
                    <div class="flex items-center justify-between mb-6">
                      <h4 class="font-semibold text-white">Performance Hebdomadaire</h4>
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span class="text-xs text-slate-400">Résolution</span>
                      </div>
                    </div>
                    <div class="space-y-4">
                      <div *ngFor="let day of workloadMetrics.weeklyPerformance"
                           class="flex items-center justify-between p-3 rounded-lg"
                           [class]="day.isToday ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-slate-600/20'">
                        <div class="flex items-center space-x-3">
                          <span class="text-sm font-medium text-white min-w-[80px]">{{ day.day }}</span>
                          <div *ngIf="day.isToday" class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                        <div class="flex-1 mx-4 bg-slate-600/50 rounded-full h-3">
                          <div class="h-3 rounded-full transition-all duration-700"
                               [class]="getPerformanceBarClass(day.performance)"
                               [style.width.%]="day.performance"></div>
                        </div>
                        <div class="text-right min-w-[80px]">
                          <span class="text-sm font-medium text-white">{{ day.ticketsCount }} tickets</span>
                          <p class="text-xs text-slate-400">{{ day.performance }}% résolus</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tickets by Status -->
                  <div class="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/30">
                    <h4 class="font-semibold text-white mb-6">Répartition par Statut</h4>
                    <div class="space-y-4">
                      <div *ngFor="let status of getStatusList()"
                           class="flex items-center justify-between p-3 bg-slate-600/20 rounded-lg">
                        <div class="flex items-center space-x-3">
                          <div class="w-4 h-4 rounded-full" [class]="getStatusDisplay(status).color.replace('text-', 'bg-')"></div>
                          <span class="text-sm font-medium text-white">{{ getStatusDisplay(status).label }}</span>
                        </div>
                        <div class="flex items-center space-x-3">
                          <div class="w-20 bg-slate-600/50 rounded-full h-2">
                            <div class="h-2 rounded-full transition-all duration-500"
                                 [class]="getStatusDisplay(status).color.replace('text-', 'bg-')"
                                 [style.width.%]="getStatusPercentage(status)"></div>
                          </div>
                          <span class="text-sm font-bold text-white min-w-[30px]">{{ getStatusCount(status) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tickets by Priority -->
                <div class="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/30">
                  <h4 class="font-semibold text-white mb-6">Répartition par Priorité</h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div *ngFor="let priority of getPriorityList()"
                         class="text-center p-4 rounded-lg"
                         [class]="getPriorityDisplay(priority).color.replace('text-', 'bg-').replace('400', '500/10') + ' border ' + getPriorityDisplay(priority).color.replace('text-', 'border-').replace('400', '500/20')">
                      <div class="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                           [class]="getPriorityDisplay(priority).color.replace('text-', 'bg-').replace('400', '500/20')">
                        <svg class="w-6 h-6" [class]="getPriorityDisplay(priority).color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getPriorityIcon(priority)"></path>
                        </svg>
                      </div>
                      <p class="text-2xl font-bold text-white mb-1">{{ getPriorityCount(priority) }}</p>
                      <p class="text-xs font-medium" [class]="getPriorityDisplay(priority).color">{{ getPriorityDisplay(priority).label }}</p>
                      <div class="w-full bg-slate-600/30 rounded-full h-1 mt-2">
                        <div class="h-1 rounded-full transition-all duration-500"
                             [class]="getPriorityDisplay(priority).color.replace('text-', 'bg-')"
                             [style.width.%]="getPriorityPercentage(priority)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Section -->
          <div *ngIf="activeSection === 'profile'">
            <div class="bg-slate-800 rounded-xl border border-slate-700">
              <div class="p-6 border-b border-slate-700">
                <h3 class="text-lg font-semibold text-white">Mon Profil</h3>
                <p class="text-sm text-slate-400 mt-1">Informations personnelles et préférences</p>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Personal Info -->
                  <div>
                    <h4 class="font-medium text-white mb-4">Informations Personnelles</h4>
                    <div class="space-y-4">
                      <div class="flex items-center space-x-4">
                        <div class="h-16 w-16 bg-orange-500 rounded-full flex items-center justify-center">
                          <span class="text-white font-bold text-xl">{{ getUserInitials() }}</span>
                        </div>
                        <div>
                          <p class="font-medium text-white">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
                          <p class="text-sm text-slate-400">{{ currentUser?.email }}</p>
                          <p class="text-sm text-orange-400 font-medium">{{ currentUser?.role }}</p>
                        </div>
                      </div>

                      <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <div class="flex justify-between">
                          <span class="text-sm text-slate-400">Département</span>
                          <span class="text-sm text-white">Support Technique</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-slate-400">Équipe</span>
                          <span class="text-sm text-white">Infrastructure</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-slate-400">Niveau</span>
                          <span class="text-sm text-white">Senior</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-slate-400">Date d'embauche</span>
                          <span class="text-sm text-white">15/03/2022</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Preferences -->
                  <div>
                    <h4 class="font-medium text-white mb-4">Préférences</h4>
                    <div class="space-y-4">
                      <div class="bg-slate-700/50 rounded-lg p-4">
                        <h5 class="text-sm font-medium text-white mb-3">Notifications</h5>
                        <div class="space-y-2">
                          <label class="flex items-center">
                            <input type="checkbox" checked class="rounded bg-slate-600 border-slate-500 text-orange-500 focus:ring-orange-500">
                            <span class="ml-2 text-sm text-slate-300">Nouveaux tickets assignés</span>
                          </label>
                          <label class="flex items-center">
                            <input type="checkbox" checked class="rounded bg-slate-600 border-slate-500 text-orange-500 focus:ring-orange-500">
                            <span class="ml-2 text-sm text-slate-300">Tickets haute priorité</span>
                          </label>
                          <label class="flex items-center">
                            <input type="checkbox" class="rounded bg-slate-600 border-slate-500 text-orange-500 focus:ring-orange-500">
                            <span class="ml-2 text-sm text-slate-300">Rappels SLA</span>
                          </label>
                        </div>
                      </div>

                      <div class="bg-slate-700/50 rounded-lg p-4">
                        <h5 class="text-sm font-medium text-white mb-3">Disponibilité</h5>
                        <div class="space-y-2">
                          <div class="flex justify-between">
                            <span class="text-sm text-slate-400">Statut</span>
                            <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Disponible</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-sm text-slate-400">Horaires</span>
                            <span class="text-sm text-white">9h00 - 18h00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Ticket Details Modal -->
    <div *ngIf="showTicketDetails && selectedTicket"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        <!-- Modal Header -->
        <div class="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white">{{ getTicketDisplayId(selectedTicket) }} - {{ selectedTicket.titre }}</h2>
            <div class="flex items-center space-x-3 mt-2">
              <span class="px-2 py-1 text-xs font-medium rounded"
                    [class]="getStatusDisplay(selectedTicket.statut).color">
                {{ getStatusDisplay(selectedTicket.statut).label }}
              </span>
              <span class="px-2 py-1 text-xs font-medium rounded"
                    [class]="getPriorityDisplay(selectedTicket.priorite).color">
                {{ getPriorityDisplay(selectedTicket.priorite).label }}
              </span>
              <span *ngIf="selectedTicket.categorie" class="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded">
                {{ selectedTicket.categorie }}
              </span>
            </div>
          </div>
          <button (click)="closeTicketDetails()"
                  class="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Left Column - Ticket Information -->
            <div class="space-y-6">
              <!-- Description -->
              <div class="bg-slate-700/50 rounded-lg p-4">
                <h3 class="font-medium text-white mb-3">Description</h3>
                <p class="text-slate-300 whitespace-pre-wrap">{{ selectedTicket.description }}</p>
              </div>

              <!-- Ticket Details -->
              <div class="bg-slate-700/50 rounded-lg p-4">
                <h3 class="font-medium text-white mb-3">Informations du Ticket</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-slate-400">ID</span>
                    <span class="text-white">{{ getTicketDisplayId(selectedTicket) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Statut</span>
                    <span class="px-2 py-1 text-xs font-medium rounded"
                          [class]="getStatusDisplay(selectedTicket.statut).color">
                      {{ getStatusDisplay(selectedTicket.statut).label }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Priorité</span>
                    <span class="px-2 py-1 text-xs font-medium rounded"
                          [class]="getPriorityDisplay(selectedTicket.priorite).color">
                      {{ getPriorityDisplay(selectedTicket.priorite).label }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Catégorie</span>
                    <span class="text-white">{{ selectedTicket.categorie || 'Non spécifiée' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Date de création</span>
                    <span class="text-white">{{ getFormattedDate(selectedTicket.dateCreation) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Dernière modification</span>
                    <span class="text-white">{{ getFormattedDate(selectedTicket.dateModification) }}</span>
                  </div>
                  <div *ngIf="selectedTicket.dateLimiteSla" class="flex justify-between">
                    <span class="text-slate-400">Limite SLA</span>
                    <span class="text-white">{{ getFormattedDate(selectedTicket.dateLimiteSla) }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="bg-slate-700/50 rounded-lg p-4">
                <h3 class="font-medium text-white mb-3">Actions</h3>
                <div class="flex flex-wrap gap-2">
                  <button *ngIf="selectedTicket.statut === 'EN_COURS'"
                          (click)="startWorkingOnTicket(selectedTicket)"
                          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors">
                    Démarrer
                  </button>
                  <button *ngIf="selectedTicket.statut === 'OUVERT'"
                          (click)="openResolveModal(selectedTicket)"
                          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                    Marquer comme Résolu
                  </button>
                  <button class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors">
                    Demander Réassignation
                  </button>
                  <button (click)="openCommentModal(selectedTicket)"
                          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors">
                    Ajouter Note Technique
                  </button>
                </div>
              </div>
            </div>

            <!-- Right Column - Files and Upload -->
            <div class="space-y-6">

              <!-- Existing Files -->
              <div class="bg-slate-700/50 rounded-lg p-4">
                <h3 class="font-medium text-white mb-3">Fichiers Attachés ({{ getAttachedFiles(selectedTicket).length }})</h3>

                <div *ngIf="!hasAttachedFiles(selectedTicket)" class="text-center py-4">
                  <svg class="w-12 h-12 mx-auto text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="text-slate-400 text-sm">Aucun fichier attaché</p>
                </div>

                <div *ngIf="hasAttachedFiles(selectedTicket)" class="space-y-2">
                  <div *ngFor="let file of getAttachedFiles(selectedTicket)"
                       class="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg hover:bg-slate-600/70 transition-colors group cursor-pointer"
                       (click)="downloadFile(file)">

                    <!-- File Icon -->
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <svg *ngIf="isImageFile(file)" class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <svg *ngIf="!isImageFile(file)" class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>

                      <!-- File Info -->
                      <div class="flex-1 min-w-0">
                        <h5 class="font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                          {{ getFileDisplayName(file) }}
                        </h5>
                        <div class="flex items-center space-x-4 mt-1">
                          <span class="text-sm text-slate-400">{{ formatFileSize(file.size) }}</span>
                          <span *ngIf="file.mimeType" class="text-sm text-slate-400">{{ file.mimeType }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Download Icon -->
                    <div class="flex-shrink-0">
                      <svg class="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- File Upload Section -->
              <div class="bg-slate-700/50 rounded-lg p-4">
                <h3 class="font-medium text-white mb-3">Ajouter des Fichiers</h3>

                <!-- File Input -->
                <div class="mb-4">
                  <input type="file"
                         multiple
                         (change)="onFileSelected($event)"
                         class="hidden"
                         #fileInput
                         accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv">

                  <button (click)="fileInput.click()"
                          [disabled]="isUploading"
                          class="w-full p-4 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 transition-colors text-center"
                          [class]="isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600/20'">
                    <svg class="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="text-slate-300 font-medium">
                      {{ isUploading ? 'Upload en cours...' : 'Cliquez pour sélectionner des fichiers' }}
                    </p>
                    <p class="text-slate-500 text-sm mt-1">
                      Images, PDF, Documents (max 10MB par fichier)
                    </p>
                  </button>
                </div>

                <!-- Selected Files -->
                <div *ngIf="selectedFiles.length > 0" class="mb-4">
                  <h4 class="text-sm font-medium text-slate-300 mb-2">Fichiers sélectionnés ({{ selectedFiles.length }})</h4>
                  <div class="space-y-2">
                    <div *ngFor="let file of selectedFiles; let i = index"
                         class="flex items-center justify-between p-2 bg-slate-600/50 rounded">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span class="text-sm text-slate-300 truncate">{{ file.name }}</span>
                        <span class="text-xs text-slate-500">({{ formatFileSize(file.size) }})</span>
                      </div>
                      <button (click)="removeFile(i)"
                              [disabled]="isUploading"
                              class="text-red-400 hover:text-red-300 transition-colors p-1"
                              [class]="isUploading ? 'opacity-50 cursor-not-allowed' : ''">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Upload Progress -->
                <div *ngIf="isUploading" class="mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-slate-300">Upload en cours...</span>
                    <span class="text-sm text-slate-400">{{ uploadProgress }}%</span>
                  </div>
                  <div class="w-full bg-slate-600 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full transition-all duration-300"
                         [style.width.%]="uploadProgress"></div>
                  </div>
                </div>

                <!-- Upload Button -->
                <button *ngIf="selectedFiles.length > 0 && !isUploading"
                        (click)="uploadFiles()"
                        class="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors">
                  Uploader {{ selectedFiles.length }} fichier{{ selectedFiles.length > 1 ? 's' : '' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resolve Ticket Modal -->
    <div *ngIf="showResolveModal && selectedTicket"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        <!-- Modal Header -->
        <div class="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white">Résoudre le Ticket</h2>
            <p class="text-slate-400 mt-1">{{ getTicketDisplayId(selectedTicket) }} - {{ selectedTicket.titre }}</p>
          </div>
          <button (click)="closeResolveModal()"
                  class="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">

            <!-- Ticket Summary -->
            <div class="bg-slate-700/50 rounded-lg p-4">
              <h3 class="font-medium text-white mb-3">Résumé du Ticket</h3>
              <div class="space-y-2">
                <div class="flex items-center space-x-3">
                  <span class="px-2 py-1 text-xs font-medium rounded"
                        [class]="getStatusDisplay(selectedTicket.statut).color">
                    {{ getStatusDisplay(selectedTicket.statut).label }}
                  </span>
                  <span class="px-2 py-1 text-xs font-medium rounded"
                        [class]="getPriorityDisplay(selectedTicket.priorite).color">
                    {{ getPriorityDisplay(selectedTicket.priorite).label }}
                  </span>
                </div>
                <p class="text-slate-300 text-sm">{{ selectedTicket.description }}</p>
              </div>
            </div>

            <!-- Solution Input -->
            <div class="bg-slate-700/50 rounded-lg p-4">
              <h3 class="font-medium text-white mb-3">Solution Apportée</h3>
              <textarea
                [(ngModel)]="resolutionSolution"
                placeholder="Décrivez la solution apportée au problème..."
                class="w-full h-32 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                [disabled]="isResolving"></textarea>
              <p class="text-slate-400 text-xs mt-2">
                Décrivez en détail la solution mise en place, les actions effectuées et les recommandations pour éviter la récurrence du problème.
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3">
              <button (click)="closeResolveModal()"
                      [disabled]="isResolving"
                      class="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Annuler
              </button>
              <button (click)="resolveTicket()"
                      [disabled]="isResolving || !resolutionSolution.trim()"
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                <svg *ngIf="isResolving" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isResolving ? 'Résolution...' : 'Résoudre le Ticket' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Technical Note Modal -->
    <div *ngIf="showCommentModal && selectedTicket"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        <!-- Modal Header -->
        <div class="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white">Ajouter une Note Technique</h2>
            <p class="text-slate-400 mt-1">{{ getTicketDisplayId(selectedTicket) }} - {{ selectedTicket.titre }}</p>
          </div>
          <button (click)="closeCommentModal()"
                  class="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-6">

            <!-- Ticket Summary -->
            <div class="bg-slate-700/50 rounded-lg p-4">
              <h3 class="font-medium text-white mb-3">Informations du Ticket</h3>
              <div class="space-y-2">
                <div class="flex items-center space-x-3">
                  <span class="px-2 py-1 text-xs font-medium rounded"
                        [class]="getStatusDisplay(selectedTicket.statut).color">
                    {{ getStatusDisplay(selectedTicket.statut).label }}
                  </span>
                  <span class="px-2 py-1 text-xs font-medium rounded"
                        [class]="getPriorityDisplay(selectedTicket.priorite).color">
                    {{ getPriorityDisplay(selectedTicket.priorite).label }}
                  </span>
                  <span *ngIf="selectedTicket.categorie" class="px-2 py-1 bg-slate-600/50 text-slate-300 text-xs rounded">
                    {{ selectedTicket.categorie }}
                  </span>
                </div>
                <p class="text-slate-300 text-sm">{{ selectedTicket.description }}</p>
              </div>
            </div>

            <!-- Note Input -->
            <div class="bg-slate-700/50 rounded-lg p-4">
              <h3 class="font-medium text-white mb-3">Note Technique</h3>
              <textarea
                [(ngModel)]="technicalNote"
                placeholder="Ajoutez une note technique sur les actions effectuées, observations, ou prochaines étapes..."
                class="w-full h-32 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                [disabled]="isAddingNote"></textarea>
              <div class="mt-3 text-slate-400 text-xs">
                <p class="mb-2"><strong>Exemples de notes techniques :</strong></p>
                <ul class="list-disc list-inside space-y-1 text-slate-500">
                  <li>Actions effectuées : "Docker daemon redémarré. Tests de pipeline en cours."</li>
                  <li>Diagnostic : "Problème identifié au niveau du service réseau."</li>
                  <li>Prochaines étapes : "Attente validation utilisateur avant fermeture."</li>
                  <li>Recommandations : "Ajouter monitoring du service Docker."</li>
                </ul>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3">
              <button (click)="closeCommentModal()"
                      [disabled]="isAddingNote"
                      class="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Annuler
              </button>
              <button (click)="addTechnicalNote()"
                      [disabled]="isAddingNote || !technicalNote.trim()"
                      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                <svg *ngIf="isAddingNote" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isAddingNote ? 'Ajout...' : 'Ajouter la Note' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Selection Modal - Temporarily Disabled due to HTML structure issues -->
  `,
})
export class TechnicianDashboardComponent implements OnInit {
  currentUser: User | null = null;
  activeSection: string = 'dashboard';
  loading: boolean = false;

  // Tickets data
  assignedTickets: TechnicianTicketResponse[] = [];
  filteredTickets: TechnicianTicketResponse[] = [];
  selectedTicket: TechnicianTicketResponse | null = null;
  currentFilter: string = 'ALL';

  // Modal states
  showTicketDetails: boolean = false;
  showResolveModal: boolean = false;
  showCommentModal: boolean = false;

  // File upload
  selectedFiles: File[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;

  // Ticket resolution
  resolutionSolution: string = '';
  isResolving: boolean = false;

  // Technical notes
  technicalNote: string = '';
  isAddingNote: boolean = false;

  // Ticket selection for comments
  showTicketSelectionForComment: boolean = false;
  selectedTicketForComment: TechnicianTicketResponse | null = null;

  // Technician profile and competences
  technicianProfile: any = null;
  competences: any[] = [];
  isLoadingProfile: boolean = false;

  // Comments data
  recentComments: any[] = [];
  isLoadingComments: boolean = false;

  // Workload data
  workloadMetrics: any = {
    capacityUsed: 0,
    resolutionRate: 0,
    averageTime: '0h',
    weeklyPerformance: [],
    ticketsByPriority: {},
    ticketsByStatus: {},
    productivityTrend: []
  };

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path></svg>',
      description: 'Vue d\'ensemble de votre activité',
      color: 'bg-blue-500',
    },
    {
      id: 'tickets',
      label: 'Mes Tickets',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>',
      description: 'Gérer vos tickets assignés',
      badge: 0,
      color: 'bg-orange-500',
    },
    {
      id: 'comments',
      label: 'Commentaires',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>',
      description: 'Commentaires récents et notes techniques',
      color: 'bg-purple-500',
    },
    {
      id: 'skills',
      label: 'Compétences',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>',
      description: 'Consulter vos expertises techniques',
      color: 'bg-yellow-500',
    },
    {
      id: 'workload',
      label: 'Charge de Travail',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
      description: 'Indicateurs de performance et statistiques',
      color: 'bg-indigo-500',
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
      description: 'Informations personnelles et paramètres',
      color: 'bg-pink-500',
    }
  ];

  dashboardStats = {
    assignedTickets: 13,
    resolvedToday: 7,
    highPriority: 3,
    avgResolution: '2.4h'
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private technicianService: TechnicianService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      console.warn('⚠️ Unauthorized access attempt to technician dashboard');
      this.router.navigate(['/login']);
      return;
    }

    if (this.currentUser.role !== 'TECHNICIEN') {
      console.warn('⚠️ Non-technician user attempting to access technician dashboard:', this.currentUser.role);
      this.router.navigate(['/login']);
      return;
    }

    console.log('✅ Technician dashboard loaded for:', this.currentUser.email);

    // Load initial data
    this.loadAssignedTickets();
    this.updateDashboardStats();
    this.loadTechnicianProfile();
  }

  setActiveSection(sectionId: string): void {
    this.activeSection = sectionId;
    console.log('📍 Active section changed to:', sectionId);
  }

  getActiveMenuTitle(): string {
    const activeMenu = this.menuItems.find(item => item.id === this.activeSection);
    return activeMenu?.label || 'Tableau de Bord';
  }

  getActiveMenuDescription(): string {
    const activeMenu = this.menuItems.find(item => item.id === this.activeSection);
    return activeMenu?.description || 'Vue d\'ensemble de votre activité';
  }

  getIconColor(bgColor: string): string {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': 'text-blue-400',
      'bg-orange-500': 'text-orange-400',
      'bg-green-500': 'text-green-400',
      'bg-purple-500': 'text-purple-400',
      'bg-yellow-500': 'text-yellow-400',
      'bg-indigo-500': 'text-indigo-400',
      'bg-pink-500': 'text-pink-400'
    };
    return colorMap[bgColor] || 'text-slate-400';
  }

  refreshData(): void {
    console.log('🔄 Refreshing technician dashboard data...');
    this.loadAssignedTickets();
    this.updateDashboardStats();
  }

  // ==================== TICKET MANAGEMENT METHODS ====================

  /**
   * Load assigned tickets from backend
   */
  loadAssignedTickets(): void {
    this.loading = true;
    console.log('📥 Loading assigned tickets...');

    this.technicianService.getMyAssignedTickets().subscribe({
      next: (tickets) => {
        console.log('✅ Loaded assigned tickets:', tickets);
        this.assignedTickets = tickets;
        this.filteredTickets = tickets;
        this.updateDashboardStats();
        this.loadRecentComments(); // Load comments after tickets are loaded
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading assigned tickets:', error);
        this.loading = false;
        // Show user-friendly error message
        alert('Erreur lors du chargement des tickets assignés. Veuillez réessayer.');
      }
    });
  }

  /**
   * Update dashboard statistics based on loaded tickets
   */
  updateDashboardStats(): void {
    if (this.assignedTickets.length === 0) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.dashboardStats = {
      assignedTickets: this.assignedTickets.length,
      resolvedToday: this.assignedTickets.filter(ticket => {
        if (ticket.statut === 'RESOLU' && ticket.dateModification) {
          const ticketDate = new Date(ticket.dateModification);
          ticketDate.setHours(0, 0, 0, 0);
          return ticketDate.getTime() === today.getTime();
        }
        return false;
      }).length,
      highPriority: this.assignedTickets.filter(ticket =>
        ticket.priorite === 'HAUTE' || ticket.priorite === 'CRITIQUE'
      ).length,
      avgResolution: this.calculateAverageResolutionTime()
    };

    // Update badge count in menu
    const ticketsMenuItem = this.menuItems.find(item => item.id === 'tickets');
    if (ticketsMenuItem) {
      ticketsMenuItem.badge = this.assignedTickets.length;
    }

    // Recalculate workload metrics
    this.calculateWorkloadMetrics();
  }

  /**
   * Calculate average resolution time
   */
  calculateAverageResolutionTime(): string {
    const resolvedTickets = this.assignedTickets.filter(ticket =>
      ticket.statut === 'RESOLU' && ticket.tempsResolutionMinutes
    );

    if (resolvedTickets.length === 0) {
      return '0h';
    }

    const totalMinutes = resolvedTickets.reduce((sum, ticket) =>
      sum + (ticket.tempsResolutionMinutes || 0), 0
    );

    const avgMinutes = totalMinutes / resolvedTickets.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.floor(avgMinutes % 60);

    if (hours > 0) {
      return `${hours}h${minutes > 0 ? minutes + 'm' : ''}`;
    } else {
      return `${minutes}m`;
    }
  }

  /**
   * Filter tickets by status
   */
  filterTicketsByStatus(status: string): void {
    this.currentFilter = status;
    console.log('🔍 Filtering tickets by status:', status);

    if (status === 'ALL') {
      this.filteredTickets = this.assignedTickets;
    } else {
      this.filteredTickets = this.assignedTickets.filter(ticket => ticket.statut === status);
    }

    console.log('📊 Filtered tickets count:', this.filteredTickets.length);
  }

  /**
   * Start working on a ticket
   */
  startWorkingOnTicket(ticket: TechnicianTicketResponse): void {
    console.log('🚀 Starting work on ticket:', ticket.id);

    this.technicianService.startWorkingOnTicket(ticket.id).subscribe({
      next: (updatedTicket) => {
        console.log('✅ Started working on ticket:', updatedTicket);

        // Update the ticket in our local array
        const index = this.assignedTickets.findIndex(t => t.id === ticket.id);
        if (index !== -1) {
          this.assignedTickets[index] = updatedTicket;
          this.filteredTickets = [...this.assignedTickets];
          this.updateDashboardStats();
        }

        // Update selected ticket if modal is open
        if (this.selectedTicket && this.selectedTicket.id === ticket.id) {
          this.selectedTicket = updatedTicket;
        }

        alert('Travail démarré avec succès ! Le ticket est maintenant ouvert.');
      },
      error: (error) => {
        console.error('❌ Error starting work on ticket:', error);
        let errorMessage = 'Erreur lors du démarrage du travail sur le ticket.';
        if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions pour démarrer ce ticket.';
        } else if (error.status === 404) {
          errorMessage = 'Ticket non trouvé.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        alert(errorMessage);
      }
    });
  }

  /**
   * View ticket details
   */
  viewTicketDetails(ticket: TechnicianTicketResponse): void {
    console.log('👁️ Viewing ticket details:', ticket.id);
    this.selectedTicket = ticket;
    this.showTicketDetails = true;
    // Reset file upload state
    this.selectedFiles = [];
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  /**
   * Close ticket details modal
   */
  closeTicketDetails(): void {
    this.showTicketDetails = false;
    this.selectedTicket = null;
    this.selectedFiles = [];
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  /**
   * Open resolve ticket modal
   */
  openResolveModal(ticket: TechnicianTicketResponse): void {
    console.log('🔧 Opening resolve modal for ticket:', ticket.id);
    this.selectedTicket = ticket;
    this.showResolveModal = true;
    this.resolutionSolution = '';
    this.isResolving = false;
  }

  /**
   * Close resolve ticket modal
   */
  closeResolveModal(): void {
    this.showResolveModal = false;
    this.selectedTicket = null;
    this.resolutionSolution = '';
    this.isResolving = false;
  }

  /**
   * Resolve ticket with solution
   */
  resolveTicket(): void {
    if (!this.selectedTicket || !this.resolutionSolution.trim()) {
      alert('Veuillez saisir une solution pour résoudre le ticket.');
      return;
    }

    console.log('✅ Resolving ticket:', this.selectedTicket.id, 'with solution:', this.resolutionSolution);
    this.isResolving = true;

    this.technicianService.resolveTicket(this.selectedTicket.id, this.resolutionSolution.trim()).subscribe({
      next: (updatedTicket) => {
        console.log('✅ Ticket resolved successfully:', updatedTicket);

        // Update the ticket in our local array
        const index = this.assignedTickets.findIndex(t => t.id === this.selectedTicket!.id);
        if (index !== -1) {
          this.assignedTickets[index] = updatedTicket;
          this.filteredTickets = [...this.assignedTickets];
          this.updateDashboardStats();
        }

        // Close modals
        this.closeResolveModal();
        this.closeTicketDetails();

        alert('Ticket résolu avec succès !');
      },
      error: (error) => {
        console.error('❌ Error resolving ticket:', error);
        this.isResolving = false;

        let errorMessage = 'Erreur lors de la résolution du ticket.';
        if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions pour résoudre ce ticket.';
        } else if (error.status === 404) {
          errorMessage = 'Ticket non trouvé.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        alert(errorMessage);
      }
    });
  }

  /**
   * Open comment modal
   */
  openCommentModal(ticket: TechnicianTicketResponse): void {
    console.log('💬 Opening comment modal for ticket:', ticket.id);
    this.selectedTicket = ticket;
    this.showCommentModal = true;
    this.technicalNote = '';
    this.isAddingNote = false;
  }

  /**
   * Close comment modal
   */
  closeCommentModal(): void {
    this.showCommentModal = false;
    this.selectedTicket = null;
    this.technicalNote = '';
    this.isAddingNote = false;
  }

  /**
   * Add technical note to ticket
   */
  addTechnicalNote(): void {
    if (!this.selectedTicket || !this.technicalNote.trim()) {
      alert('Veuillez saisir une note technique.');
      return;
    }

    console.log('📝 Adding technical note to ticket:', this.selectedTicket.id, 'note:', this.technicalNote);
    this.isAddingNote = true;

    this.technicianService.addTechnicalNote(this.selectedTicket.id, this.technicalNote.trim()).subscribe({
      next: (response) => {
        console.log('✅ Technical note added successfully:', response);

        // Close modal
        this.closeCommentModal();

        alert('Note technique ajoutée avec succès !');
      },
      error: (error) => {
        console.error('❌ Error adding technical note:', error);
        this.isAddingNote = false;

        let errorMessage = 'Erreur lors de l\'ajout de la note technique.';
        if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions pour ajouter une note à ce ticket.';
        } else if (error.status === 404) {
          errorMessage = 'Ticket non trouvé.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        alert(errorMessage);
      }
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const firstInitial = this.currentUser.prenom?.charAt(0) || '';
    const lastInitial = this.currentUser.nom?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  logout(): void {
    console.log('🚪 Technician logging out');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ==================== PROFILE METHODS ====================

  /**
   * Load technician profile with competences
   */
  loadTechnicianProfile(): void {
    console.log('👤 Loading technician profile...');
    this.isLoadingProfile = true;

    // Try the detailed profile endpoint first (similar to manager endpoint)
    this.technicianService.getMyDetailedProfile().subscribe({
      next: (profile) => {
        console.log('✅ Technician detailed profile loaded:', profile);
        this.technicianProfile = profile;
        this.parseCompetences(profile.competencesJson);
        this.isLoadingProfile = false;
      },
      error: (error) => {
        console.error('❌ Error loading detailed profile, trying basic profile:', error);

        // Fallback to basic profile endpoint
        this.technicianService.getMyProfile().subscribe({
          next: (profile) => {
            console.log('✅ Technician basic profile loaded:', profile);
            this.technicianProfile = profile;
            this.parseCompetences(profile.competencesJson);
            this.isLoadingProfile = false;
          },
          error: (fallbackError) => {
            console.error('❌ Error loading technician profile:', fallbackError);
            this.isLoadingProfile = false;
            // Don't show alert for profile loading errors, just log them
          }
        });
      }
    });
  }

  /**
   * Parse competences JSON string into array
   */
  parseCompetences(competencesJson: string): void {
    try {
      if (competencesJson && competencesJson.trim() !== '' && competencesJson !== '[]') {
        this.competences = JSON.parse(competencesJson);
        console.log('📋 Parsed competences:', this.competences);
      } else {
        this.competences = [];
        console.log('📋 No competences found');
      }
    } catch (error) {
      console.error('❌ Error parsing competences JSON:', error);
      this.competences = [];
    }
  }

  /**
   * Get competences by category
   */
  getCompetencesByCategory(category: string): any[] {
    return this.competences.filter(comp => comp.categorie === category);
  }

  /**
   * Get level display for competence
   */
  getLevelDisplay(niveau: string): { label: string; color: string } {
    switch (niveau) {
      case 'DEBUTANT':
        return { label: 'Débutant', color: 'text-gray-400' };
      case 'INTERMEDIAIRE':
        return { label: 'Intermédiaire', color: 'text-blue-400' };
      case 'AVANCE':
        return { label: 'Avancé', color: 'text-green-400' };
      case 'EXPERT':
        return { label: 'Expert', color: 'text-purple-400' };
      case 'SENIOR':
        return { label: 'Senior', color: 'text-yellow-400' };
      default:
        return { label: niveau, color: 'text-gray-400' };
    }
  }

  /**
   * Get progress bar CSS class based on competence level
   */
  getLevelProgressBarClass(niveau: string): string {
    switch (niveau) {
      case 'DEBUTANT':
        return 'bg-gradient-to-r from-gray-500 to-gray-400';
      case 'INTERMEDIAIRE':
        return 'bg-gradient-to-r from-blue-500 to-blue-400';
      case 'AVANCE':
        return 'bg-gradient-to-r from-green-500 to-green-400';
      case 'EXPERT':
        return 'bg-gradient-to-r from-purple-500 to-purple-400';
      case 'SENIOR':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-400';
    }
  }

  /**
   * Get star CSS class based on competence level
   */
  getLevelStarClass(niveau: string): string {
    switch (niveau) {
      case 'DEBUTANT':
        return 'bg-gray-400 shadow-sm shadow-gray-400/50';
      case 'INTERMEDIAIRE':
        return 'bg-blue-400 shadow-sm shadow-blue-400/50';
      case 'AVANCE':
        return 'bg-green-400 shadow-sm shadow-green-400/50';
      case 'EXPERT':
        return 'bg-purple-400 shadow-sm shadow-purple-400/50';
      case 'SENIOR':
        return 'bg-yellow-400 shadow-sm shadow-yellow-400/50';
      default:
        return 'bg-gray-400 shadow-sm shadow-gray-400/50';
    }
  }

  /**
   * Get category progress bar CSS class
   */
  getCategoryProgressBarClass(category: string): string {
    switch (category) {
      case 'SECURITE':
        return 'bg-gradient-to-r from-red-500 to-red-400';
      case 'RESEAU':
        return 'bg-gradient-to-r from-blue-500 to-blue-400';
      case 'DEVELOPPEMENT':
        return 'bg-gradient-to-r from-green-500 to-green-400';
      case 'SYSTEME':
        return 'bg-gradient-to-r from-purple-500 to-purple-400';
      case 'AUDIT':
        return 'bg-gradient-to-r from-orange-500 to-orange-400';
      case 'CONFORMITE':
        return 'bg-gradient-to-r from-indigo-500 to-indigo-400';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-400';
    }
  }

  /**
   * Get category display information
   */
  getCategoryDisplay(categorie: string): { label: string; color: string; bgColor: string; iconColor: string } {
    switch (categorie) {
      case 'SECURITE':
        return {
          label: 'Sécurité',
          color: 'bg-red-600/20 text-red-400',
          bgColor: 'bg-red-600/20',
          iconColor: 'text-red-400'
        };
      case 'RESEAU':
        return {
          label: 'Réseau',
          color: 'bg-blue-600/20 text-blue-400',
          bgColor: 'bg-blue-600/20',
          iconColor: 'text-blue-400'
        };
      case 'DEVELOPPEMENT':
        return {
          label: 'Développement',
          color: 'bg-green-600/20 text-green-400',
          bgColor: 'bg-green-600/20',
          iconColor: 'text-green-400'
        };
      case 'SYSTEME':
        return {
          label: 'Système',
          color: 'bg-purple-600/20 text-purple-400',
          bgColor: 'bg-purple-600/20',
          iconColor: 'text-purple-400'
        };
      case 'AUDIT':
        return {
          label: 'Audit',
          color: 'bg-orange-600/20 text-orange-400',
          bgColor: 'bg-orange-600/20',
          iconColor: 'text-orange-400'
        };
      case 'CONFORMITE':
        return {
          label: 'Conformité',
          color: 'bg-indigo-600/20 text-indigo-400',
          bgColor: 'bg-indigo-600/20',
          iconColor: 'text-indigo-400'
        };
      default:
        return {
          label: categorie,
          color: 'bg-gray-600/20 text-gray-400',
          bgColor: 'bg-gray-600/20',
          iconColor: 'text-gray-400'
        };
    }
  }

  /**
   * Get level percentage for progress bar
   */
  getLevelPercentage(niveau: string): number {
    switch (niveau) {
      case 'DEBUTANT': return 20;
      case 'INTERMEDIAIRE': return 40;
      case 'AVANCE': return 70;
      case 'EXPERT': return 90;
      case 'SENIOR': return 100;
      default: return 0;
    }
  }

  /**
   * Get level stars array for visual representation
   */
  getLevelStars(niveau: string): boolean[] {
    const starCount = Math.ceil(this.getLevelPercentage(niveau) / 20);
    return Array(5).fill(false).map((_, index) => index < starCount);
  }

  /**
   * Get category icon path
   */
  getCategoryIcon(categorie: string): string {
    switch (categorie) {
      case 'SECURITE':
        return 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z';
      case 'RESEAU':
        return 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0';
      case 'DEVELOPPEMENT':
        return 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4';
      case 'SYSTEME':
        return 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z';
      case 'AUDIT':
        return 'M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8h6a2 2 0 012 2v6a2 2 0 01-2 2h-6m0-8v8m0-8h6v8';
      case 'CONFORMITE':
        return 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  /**
   * Get category progress percentage
   */
  getCategoryProgress(category: string): number {
    const categoryCompetences = this.getCompetencesByCategory(category);
    if (categoryCompetences.length === 0) return 0;

    const maxPossible = 5; // Assuming max 5 competences per category
    return Math.min((categoryCompetences.length / maxPossible) * 100, 100);
  }

  /**
   * Get expert level competences (AVANCE, EXPERT, SENIOR)
   */
  getExpertCompetences(): any[] {
    return this.competences.filter(comp =>
      ['AVANCE', 'EXPERT', 'SENIOR'].includes(comp.niveau)
    );
  }

  /**
   * Get average level percentage
   */
  getAverageLevel(): number {
    if (this.competences.length === 0) return 0;

    const totalPercentage = this.competences.reduce((sum, comp) =>
      sum + this.getLevelPercentage(comp.niveau), 0
    );

    return Math.round(totalPercentage / this.competences.length);
  }

  /**
   * Get unique categories
   */
  getUniqueCategories(): string[] {
    const categories = this.competences.map(comp => comp.categorie);
    return [...new Set(categories)];
  }

  /**
   * Load recent comments from tickets with commentaire_resolution
   */
  loadRecentComments(): void {
    console.log('💬 Loading recent comments...');
    this.isLoadingComments = true;

    // Extract comments from assigned tickets that have commentaire_resolution
    this.recentComments = this.assignedTickets
      .filter(ticket => ticket.commentaireResolution && ticket.commentaireResolution.trim() !== '')
      .map(ticket => ({
        id: ticket.id,
        ticketId: ticket.id,
        ticketTitre: ticket.titre,
        ticketStatut: ticket.statut,
        ticketPriorite: ticket.priorite,
        commentaire: ticket.commentaireResolution,
        dateCreation: ticket.dateModification || ticket.dateCreation,
        technicienNom: 'Vous', // Since these are the technician's own comments
        type: 'resolution'
      }))
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 10); // Limit to 10 most recent

    console.log('✅ Recent comments loaded:', this.recentComments);
    this.isLoadingComments = false;
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
   * Calculate workload metrics based on assigned tickets
   */
  calculateWorkloadMetrics(): void {
    console.log('📊 Calculating workload metrics...');

    if (this.assignedTickets.length === 0) {
      this.workloadMetrics = {
        capacityUsed: 0,
        resolutionRate: 0,
        averageTime: '0h',
        weeklyPerformance: [],
        ticketsByPriority: {},
        ticketsByStatus: {},
        productivityTrend: []
      };
      return;
    }

    // Calculate capacity used (based on ticket count vs typical workload)
    const maxCapacity = 20; // Assuming 20 tickets is 100% capacity
    const capacityUsed = Math.min((this.assignedTickets.length / maxCapacity) * 100, 100);

    // Calculate resolution rate
    const resolvedTickets = this.assignedTickets.filter(ticket => ticket.statut === 'RESOLU');
    const resolutionRate = this.assignedTickets.length > 0
      ? (resolvedTickets.length / this.assignedTickets.length) * 100
      : 0;

    // Calculate average resolution time
    const averageTime = this.calculateAverageResolutionTime();

    // Calculate tickets by priority
    const ticketsByPriority = this.assignedTickets.reduce((acc, ticket) => {
      acc[ticket.priorite] = (acc[ticket.priorite] || 0) + 1;
      return acc;
    }, {} as any);

    // Calculate tickets by status
    const ticketsByStatus = this.assignedTickets.reduce((acc, ticket) => {
      acc[ticket.statut] = (acc[ticket.statut] || 0) + 1;
      return acc;
    }, {} as any);

    // Calculate weekly performance (last 7 days)
    const weeklyPerformance = this.calculateWeeklyPerformance();

    // Calculate productivity trend (last 30 days)
    const productivityTrend = this.calculateProductivityTrend();

    this.workloadMetrics = {
      capacityUsed: Math.round(capacityUsed),
      resolutionRate: Math.round(resolutionRate),
      averageTime,
      weeklyPerformance,
      ticketsByPriority,
      ticketsByStatus,
      productivityTrend
    };

    console.log('📊 Workload metrics calculated:', this.workloadMetrics);
  }

  /**
   * Calculate weekly performance for the last 7 days
   */
  calculateWeeklyPerformance(): any[] {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const today = new Date();
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayTickets = this.assignedTickets.filter(ticket => {
        const ticketDate = new Date(ticket.dateCreation);
        return ticketDate >= date && ticketDate < nextDate;
      });

      const resolvedTickets = dayTickets.filter(ticket => ticket.statut === 'RESOLU');
      const performance = dayTickets.length > 0 ? (resolvedTickets.length / dayTickets.length) * 100 : 0;

      weeklyData.push({
        day: days[date.getDay()],
        date: date.toISOString().split('T')[0],
        ticketsCount: dayTickets.length,
        resolvedCount: resolvedTickets.length,
        performance: Math.round(performance),
        isToday: date.toDateString() === today.toDateString()
      });
    }

    return weeklyData;
  }

  /**
   * Calculate productivity trend for the last 30 days
   */
  calculateProductivityTrend(): any[] {
    const today = new Date();
    const trendData = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayTickets = this.assignedTickets.filter(ticket => {
        const ticketDate = new Date(ticket.dateCreation);
        return ticketDate >= date && ticketDate < nextDate;
      });

      const resolvedTickets = dayTickets.filter(ticket => ticket.statut === 'RESOLU');

      trendData.push({
        date: date.toISOString().split('T')[0],
        ticketsCreated: dayTickets.length,
        ticketsResolved: resolvedTickets.length,
        productivity: dayTickets.length > 0 ? (resolvedTickets.length / dayTickets.length) * 100 : 0
      });
    }

    return trendData;
  }

  /**
   * Get resolved tickets count
   */
  getResolvedTicketsCount(): number {
    return this.assignedTickets.filter(ticket => ticket.statut === 'RESOLU').length;
  }

  /**
   * Get high priority tickets count
   */
  getHighPriorityCount(): number {
    return this.assignedTickets.filter(ticket =>
      ticket.priorite === 'HAUTE' || ticket.priorite === 'CRITIQUE'
    ).length;
  }

  /**
   * Get performance bar class based on percentage
   */
  getPerformanceBarClass(performance: number): string {
    if (performance >= 90) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (performance >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-400';
    if (performance >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  }

  /**
   * Get list of statuses present in tickets
   */
  getStatusList(): string[] {
    const statuses = [...new Set(this.assignedTickets.map(ticket => ticket.statut))];
    return statuses.sort();
  }

  /**
   * Get status percentage
   */
  getStatusPercentage(status: string): number {
    if (this.assignedTickets.length === 0) return 0;
    const count = this.getStatusCount(status);
    return (count / this.assignedTickets.length) * 100;
  }

  /**
   * Get list of priorities present in tickets
   */
  getPriorityList(): string[] {
    const priorities = [...new Set(this.assignedTickets.map(ticket => ticket.priorite))];
    return priorities.sort((a, b) => {
      const order = ['BASSE', 'NORMALE', 'HAUTE', 'CRITIQUE'];
      return order.indexOf(a) - order.indexOf(b);
    });
  }

  /**
   * Get priority count
   */
  getPriorityCount(priority: string): number {
    return this.assignedTickets.filter(ticket => ticket.priorite === priority).length;
  }

  /**
   * Get priority percentage
   */
  getPriorityPercentage(priority: string): number {
    if (this.assignedTickets.length === 0) return 0;
    const count = this.getPriorityCount(priority);
    return (count / this.assignedTickets.length) * 100;
  }

  /**
   * Get priority icon path
   */
  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'CRITIQUE':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'HAUTE':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'NORMALE':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'BASSE':
        return 'M19 14l-7 7m0 0l-7-7m7 7V3';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  // ==================== COMMENT METHODS ====================

  /**
   * Add comment to selected ticket
   */
  addCommentToSelectedTicket(): void {
    if (!this.selectedTicketForComment || !this.technicalNote.trim()) {
      alert('Veuillez sélectionner un ticket et saisir un commentaire.');
      return;
    }

    console.log('📝 Adding comment to ticket:', this.selectedTicketForComment.id, 'comment:', this.technicalNote);
    this.isAddingNote = true;

    this.technicianService.addTechnicalNote(this.selectedTicketForComment.id, this.technicalNote.trim()).subscribe({
      next: (response) => {
        console.log('✅ Comment added successfully:', response);

        // Reset form
        this.selectedTicketForComment = null;
        this.technicalNote = '';
        this.isAddingNote = false;

        alert('Commentaire technique ajouté avec succès !');
      },
      error: (error) => {
        console.error('❌ Error adding comment:', error);
        this.isAddingNote = false;

        let errorMessage = 'Erreur lors de l\'ajout du commentaire.';
        if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions pour ajouter un commentaire à ce ticket.';
        } else if (error.status === 404) {
          errorMessage = 'Ticket non trouvé.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        alert(errorMessage);
      }
    });
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get formatted status for display
   */
  getStatusDisplay(status: string): { label: string; color: string } {
    return this.technicianService.formatStatus(status);
  }

  /**
   * Get formatted priority for display
   */
  getPriorityDisplay(priority: string): { label: string; color: string } {
    return this.technicianService.formatPriority(priority);
  }

  /**
   * Get formatted date for display
   */
  getFormattedDate(dateString: string): string {
    return this.technicianService.formatTicketDate(dateString);
  }

  /**
   * Get ticket display ID
   */
  getTicketDisplayId(ticket: TechnicianTicketResponse): string {
    return this.technicianService.getTicketDisplayId(ticket);
  }

  /**
   * Get tickets by status for status management section
   */
  getTicketsByStatus(status: string): TechnicianTicketResponse[] {
    return this.assignedTickets.filter(ticket => ticket.statut === status);
  }

  /**
   * Get status count for display
   */
  getStatusCount(status: string): number {
    return this.getTicketsByStatus(status).length;
  }

  // ==================== FILE MANAGEMENT METHODS ====================

  /**
   * Handle file selection
   */
  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    console.log('📎 Files selected:', files);

    // Validate files
    const validFiles = files.filter(file => this.validateFile(file));

    if (validFiles.length !== files.length) {
      alert('Certains fichiers ont été ignorés car ils ne respectent pas les critères (taille max: 10MB, types autorisés: images, documents)');
    }

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    console.log('📎 Valid files added:', this.selectedFiles);
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];

    if (file.size > maxSize) {
      console.warn('❌ File too large:', file.name, file.size);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      console.warn('❌ File type not allowed:', file.name, file.type);
      return false;
    }

    return true;
  }

  /**
   * Remove file from selection
   */
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    console.log('🗑️ File removed, remaining:', this.selectedFiles);
  }

  /**
   * Upload files to ticket
   */
  uploadFiles(): void {
    if (!this.selectedTicket || this.selectedFiles.length === 0) {
      return;
    }

    console.log('📤 Starting file upload for ticket:', this.selectedTicket.id);
    this.isUploading = true;
    this.uploadProgress = 50; // Show some progress immediately

    this.ticketService.uploadFilesToTicket(this.selectedTicket.id, this.selectedFiles).subscribe({
      next: (updatedTicket) => {
        console.log('✅ Files uploaded successfully:', updatedTicket);

        // Update the ticket with new files
        if (this.selectedTicket) {
          this.selectedTicket.fichiersAttaches = updatedTicket.fichiersAttaches;

          // Also update the ticket in our local arrays
          const ticketIndex = this.assignedTickets.findIndex(t => t.id === this.selectedTicket!.id);
          if (ticketIndex !== -1) {
            this.assignedTickets[ticketIndex].fichiersAttaches = updatedTicket.fichiersAttaches;
            this.filteredTickets = [...this.assignedTickets];
          }
        }

        // Reset upload state
        this.selectedFiles = [];
        this.uploadProgress = 100;
        this.isUploading = false;

        alert('Fichiers uploadés avec succès !');

        // Reset progress after a short delay
        setTimeout(() => {
          this.uploadProgress = 0;
        }, 1000);
      },
      error: (error: any) => {
        console.error('❌ Error uploading files:', error);
        this.isUploading = false;
        this.uploadProgress = 0;

        let errorMessage = 'Erreur lors de l\'upload des fichiers.';
        if (error.status === 413) {
          errorMessage = 'Fichiers trop volumineux. Taille maximum: 10MB par fichier.';
        } else if (error.status === 415) {
          errorMessage = 'Type de fichier non supporté.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        alert(errorMessage);
      }
    });
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get attached files from ticket
   */
  getAttachedFiles(ticket: TechnicianTicketResponse): AttachedFile[] {
    if (!ticket.fichiersAttaches) {
      return [];
    }

    try {
      const files = JSON.parse(ticket.fichiersAttaches);
      return Array.isArray(files) ? files : [];
    } catch (error) {
      console.error('❌ Error parsing attached files:', error);
      return [];
    }
  }

  /**
   * Check if ticket has attached files
   */
  hasAttachedFiles(ticket: TechnicianTicketResponse): boolean {
    return this.getAttachedFiles(ticket).length > 0;
  }

  /**
   * Download file attachment
   */
  downloadFile(file: AttachedFile): void {
    console.log('📥 Downloading file:', file);

    // Verify we have a selected ticket
    if (!this.selectedTicket) {
      console.error('❌ No selected ticket for file download');
      alert('Erreur: Aucun ticket sélectionné pour le téléchargement');
      return;
    }

    // Get the actual filename for download (from backend storage path)
    const fileName = this.getActualFileName(file);
    if (!fileName) {
      console.error('❌ No filename found in file object:', file);
      alert('Erreur: Nom de fichier introuvable dans les données du fichier');
      return;
    }

    console.log('📥 Using filename for download:', fileName);
    console.log('📥 Selected ticket ID:', this.selectedTicket.id);

    // Get the JWT token for authentication
    const token = this.authService.getToken();
    if (!token) {
      console.error('❌ No authentication token found');
      alert('Erreur: Vous devez être connecté pour télécharger des fichiers');
      return;
    }

    // Use the general endpoint for file download (now supports technicians)
    const downloadUrl = `http://localhost:8083/api/tickets/files/${encodeURIComponent(fileName)}`;
    console.log('📥 Download URL:', downloadUrl);

    // Use fetch with proper authentication headers
    fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Fichier non trouvé sur le serveur. Le fichier "${fileName}" n'existe peut-être plus.`);
        } else if (response.status === 403) {
          throw new Error(`Accès refusé. Vous n'avez pas les permissions pour télécharger ce fichier.`);
        } else if (response.status === 401) {
          throw new Error(`Session expirée. Veuillez vous reconnecter.`);
        } else {
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
      link.download = this.getFileDisplayName(file);
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

  /**
   * Get display name for file (what user sees)
   */
  getFileDisplayName(file: AttachedFile): string {
    return file.originalName || file.fileName || 'Fichier sans nom';
  }

  /**
   * Get actual filename for download (from backend storage)
   */
  getActualFileName(file: AttachedFile): string | null {
    return file.fileName || null;
  }

  /**
   * Check if file is an image
   */
  isImageFile(file: AttachedFile): boolean {
    const fileName = file.originalName || file.fileName;
    if (!fileName) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }
}
