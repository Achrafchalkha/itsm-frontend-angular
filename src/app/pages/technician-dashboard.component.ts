import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex">
      <!-- Vertical Sidebar -->
      <div class="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        <!-- Header -->
        <div class="p-6 border-b border-slate-700">
          <div class="flex items-center mb-4">
            <div class="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">ITSM Technicien</h1>
              <p class="text-sm text-slate-400">Support Technique</p>
            </div>
          </div>
          
          <!-- User Info -->
          <div class="flex items-center p-3 bg-slate-700/50 rounded-lg">
            <div class="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <span class="text-white font-semibold text-sm">{{ getUserInitials() }}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-white">{{ currentUser?.prenom }} {{ currentUser?.nom }}</p>
              <p class="text-xs text-orange-400 font-semibold">{{ currentUser?.role }}</p>
            </div>
            <button
              (click)="logout()"
              class="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-600"
              title="Déconnexion"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
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
                            class="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors">
                      Tous
                    </button>
                    <button (click)="filterTicketsByStatus('OUVERT')"
                            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                      Ouverts
                    </button>
                    <button (click)="filterTicketsByStatus('EN_COURS')"
                            class="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors">
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
                          Voir Détails
                        </button>
                        <button *ngIf="ticket.statut === 'OUVERT'"
                                (click)="startWorkingOnTicket(ticket)"
                                class="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors">
                          Prendre en Charge
                        </button>
                        <button *ngIf="ticket.statut === 'EN_COURS'"
                                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors">
                          Résoudre
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
                      <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h4 class="font-medium text-white">OUVERT</h4>
                    </div>
                    <p class="text-sm text-slate-400 mb-3">Tickets nouvellement assignés</p>
                    <span class="text-2xl font-bold text-blue-400">{{ getStatusCount('OUVERT') }}</span>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <h4 class="font-medium text-white">EN_COURS</h4>
                    </div>
                    <p class="text-sm text-slate-400 mb-3">Tickets en cours de traitement</p>
                    <span class="text-2xl font-bold text-orange-400">{{ getStatusCount('EN_COURS') }}</span>
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
                    <button (click)="filterTicketsByStatus('OUVERT')"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      Voir Tickets Ouverts ({{ getStatusCount('OUVERT') }})
                    </button>
                    <button (click)="filterTicketsByStatus('EN_COURS')"
                            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors">
                      Voir En Cours ({{ getStatusCount('EN_COURS') }})
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
                    <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                      <option>Sélectionner un ticket</option>
                      <option>#TK-001 - Problème de connexion réseau</option>
                      <option>#TK-002 - Installation logiciel</option>
                    </select>
                    <textarea
                      class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white h-24 resize-none"
                      placeholder="Saisir votre commentaire technique..."></textarea>
                    <div class="flex justify-end">
                      <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                        Ajouter Commentaire
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Recent Comments -->
                <div class="space-y-4">
                  <h4 class="font-medium text-white">Commentaires Récents</h4>

                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-white">#TK-001 - Problème de connexion réseau</span>
                      <span class="text-xs text-slate-400">Il y a 30 min</span>
                    </div>
                    <p class="text-sm text-slate-300 mb-2">
                      Diagnostic effectué : problème au niveau du switch principal. Remplacement nécessaire.
                    </p>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">DIAGNOSTIC</span>
                      <span class="text-xs text-slate-500">Par vous</span>
                    </div>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-white">#TK-002 - Installation logiciel</span>
                      <span class="text-xs text-slate-400">Il y a 1h</span>
                    </div>
                    <p class="text-sm text-slate-300 mb-2">
                      Logiciel installé avec succès. Configuration des paramètres utilisateur en cours.
                    </p>
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">PROGRESSION</span>
                      <span class="text-xs text-slate-500">Par vous</span>
                    </div>
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
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Technical Skills -->
                  <div>
                    <h4 class="font-medium text-white mb-4">Compétences Techniques</h4>
                    <div class="space-y-3">
                      <div class="bg-slate-700/50 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-medium text-white">Réseau & Infrastructure</span>
                          <span class="text-xs text-green-400 font-medium">Expert</span>
                        </div>
                        <div class="w-full bg-slate-600 rounded-full h-2">
                          <div class="bg-green-500 h-2 rounded-full" style="width: 90%"></div>
                        </div>
                      </div>

                      <div class="bg-slate-700/50 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-medium text-white">Sécurité Informatique</span>
                          <span class="text-xs text-blue-400 font-medium">Avancé</span>
                        </div>
                        <div class="w-full bg-slate-600 rounded-full h-2">
                          <div class="bg-blue-500 h-2 rounded-full" style="width: 75%"></div>
                        </div>
                      </div>

                      <div class="bg-slate-700/50 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-medium text-white">Développement</span>
                          <span class="text-xs text-yellow-400 font-medium">Intermédiaire</span>
                        </div>
                        <div class="w-full bg-slate-600 rounded-full h-2">
                          <div class="bg-yellow-500 h-2 rounded-full" style="width: 60%"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Certifications -->
                  <div>
                    <h4 class="font-medium text-white mb-4">Certifications</h4>
                    <div class="space-y-3">
                      <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-white">CCNA - Cisco</p>
                            <p class="text-xs text-slate-400">Valide jusqu'en 2025</p>
                          </div>
                        </div>
                      </div>

                      <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-white">CompTIA Security+</p>
                            <p class="text-xs text-slate-400">Valide jusqu'en 2026</p>
                          </div>
                        </div>
                      </div>
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
                <!-- Workload Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div class="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <p class="text-2xl font-bold text-white mb-1">75%</p>
                    <p class="text-sm text-slate-400">Capacité Utilisée</p>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>
                    <p class="text-2xl font-bold text-white mb-1">92%</p>
                    <p class="text-sm text-slate-400">Taux de Résolution</p>
                  </div>

                  <div class="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div class="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg class="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <p class="text-2xl font-bold text-white mb-1">2.1h</p>
                    <p class="text-sm text-slate-400">Temps Moyen</p>
                  </div>
                </div>

                <!-- Weekly Performance Chart -->
                <div class="bg-slate-700/30 rounded-lg p-4">
                  <h4 class="font-medium text-white mb-4">Performance Hebdomadaire</h4>
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-300">Lundi</span>
                      <div class="flex-1 mx-4 bg-slate-600 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                      </div>
                      <span class="text-sm text-slate-400">8 tickets</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-300">Mardi</span>
                      <div class="flex-1 mx-4 bg-slate-600 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 92%"></div>
                      </div>
                      <span class="text-sm text-slate-400">11 tickets</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-300">Mercredi</span>
                      <div class="flex-1 mx-4 bg-slate-600 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: 78%"></div>
                      </div>
                      <span class="text-sm text-slate-400">6 tickets</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-300">Jeudi</span>
                      <div class="flex-1 mx-4 bg-slate-600 rounded-full h-2">
                        <div class="bg-orange-500 h-2 rounded-full" style="width: 95%"></div>
                      </div>
                      <span class="text-sm text-slate-400">12 tickets</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-300">Vendredi</span>
                      <div class="flex-1 mx-4 bg-slate-600 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: 88%"></div>
                      </div>
                      <span class="text-sm text-slate-400">9 tickets</span>
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
                  <button *ngIf="selectedTicket.statut === 'OUVERT'"
                          (click)="startWorkingOnTicket(selectedTicket)"
                          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors">
                    Prendre en Charge
                  </button>
                  <button *ngIf="selectedTicket.statut === 'EN_COURS'"
                          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors">
                    Marquer comme Résolu
                  </button>
                  <button class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors">
                    Demander Réassignation
                  </button>
                  <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                    Ajouter Commentaire
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

  // Modal states
  showTicketDetails: boolean = false;

  // File upload
  selectedFiles: File[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;

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
      label: 'Tickets Assignés',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>',
      description: 'Gérer vos tickets en cours',
      badge: 13,
      color: 'bg-orange-500',
    },
    {
      id: 'status',
      label: 'Gestion Statuts',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
      description: 'Changer le statut des tickets',
      color: 'bg-green-500',
    },
    {
      id: 'comments',
      label: 'Commentaires',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>',
      description: 'Ajouter des notes techniques',
      color: 'bg-purple-500',
    },
    {
      id: 'skills',
      label: 'Compétences',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>',
      description: 'Consulter vos expertises',
      color: 'bg-yellow-500',
    },
    {
      id: 'workload',
      label: 'Charge de Travail',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
      description: 'Indicateurs de performance',
      color: 'bg-indigo-500',
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
      description: 'Informations personnelles',
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
    if (status === 'ALL') {
      this.filteredTickets = this.assignedTickets;
    } else {
      this.filteredTickets = this.assignedTickets.filter(ticket => ticket.statut === status);
    }
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
        alert('Ticket pris en charge avec succès !');
      },
      error: (error) => {
        console.error('❌ Error starting work on ticket:', error);
        alert('Erreur lors de la prise en charge du ticket.');
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
