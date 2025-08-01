import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TechnicianService, TechnicianResponse, CreateTechnicianRequest, UpdateTechnicianRequest, Competence, TechnicianStats } from '../core/services/technician.service';

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
              <button class="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19c-5 0-8-3-8-6s4-6 9-6 9 3 9 6c0 1-1 3-2 3h-1l-1 1z"></path>
                </svg>
                <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
              </button>
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
        <h3 class="text-xl font-bold text-white">Tous les Tickets de l'Équipe</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p class="text-slate-400">Liste de tous les tickets (ouverts, fermés, etc.)...</p>
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-400 mb-2">2h 45min</div>
              <div class="text-slate-400 text-sm">MTTR Global</div>
            </div>
          </div>
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="text-center">
              <div class="text-3xl font-bold text-green-400 mb-2">1h 30min</div>
              <div class="text-slate-400 text-sm">MTTR Cette Semaine</div>
            </div>
          </div>
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-400 mb-2">3h 15min</div>
              <div class="text-slate-400 text-sm">MTTR Mois Dernier</div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- SLA Percentage Template -->
    <ng-template #slaPercentageTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">% de Tickets dans les Délais SLA</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="text-center mb-6">
            <div class="text-6xl font-bold text-green-400 mb-2">94.2%</div>
            <div class="text-slate-400">Tickets respectant les SLA ce mois</div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="text-center p-4 bg-slate-700 rounded-lg">
              <div class="text-2xl font-bold text-green-400">156</div>
              <div class="text-slate-400 text-sm">Dans les délais</div>
            </div>
            <div class="text-center p-4 bg-slate-700 rounded-lg">
              <div class="text-2xl font-bold text-red-400">10</div>
              <div class="text-slate-400 text-sm">Hors délais</div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Category Distribution Template -->
    <ng-template #categoryDistributionTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Répartition par Catégorie</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p class="text-slate-400">Graphiques de répartition des tickets par catégorie...</p>
        </div>
      </div>
    </ng-template>

    <!-- Workload Template -->
    <ng-template #workloadTemplate>
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-white">Charge Actuelle par Technicien</h3>
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-sm">JD</span>
                </div>
                <div>
                  <div class="text-white font-medium">Jean Dupont</div>
                  <div class="text-slate-400 text-sm">8 tickets assignés</div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-24 bg-slate-600 rounded-full h-2">
                  <div class="bg-yellow-500 h-2 rounded-full" style="width: 80%"></div>
                </div>
                <span class="text-yellow-400 font-medium">80%</span>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-sm">ML</span>
                </div>
                <div>
                  <div class="text-white font-medium">Marie Leroy</div>
                  <div class="text-slate-400 text-sm">5 tickets assignés</div>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-24 bg-slate-600 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 50%"></div>
                </div>
                <span class="text-green-400 font-medium">50%</span>
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
    private fb: FormBuilder
  ) {
    this.initializeTechnicianForm();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeForms();
    this.loadTechnicians();
    this.loadTechnicianStats();
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
   * Parse competences JSON and return only names
   */
  getCompetenceNames(competencesJson: string): string {
    if (!competencesJson) {
      return 'Aucune compétence';
    }

    try {
      const competences = JSON.parse(competencesJson);
      if (Array.isArray(competences) && competences.length > 0) {
        return competences.map(comp => comp.nom).join(', ');
      }
      return 'Aucune compétence';
    } catch (error) {
      console.warn('Error parsing competences JSON:', error);
      return 'Format invalide';
    }
  }

  /**
   * Parse competences JSON and return array of competences
   */
  parseCompetences(competencesJson: string): any[] {
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
   * Load technicians from API
   */
  loadTechnicians(): void {
    this.loading = true;
    this.error = null;

    this.technicianService.getTechnicians().subscribe({
      next: (technicians) => {
        this.technicians = technicians;
        this.filteredTechniciansForCompetences = [...technicians]; // Initialize filtered list
        this.loading = false;
        console.log('✅ Technicians loaded:', technicians.length);
      },
      error: (error) => {
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
        competences: formValue.competences
      };

      this.technicianService.updateTechnician(this.selectedTechnician.id, updateRequest).subscribe({
        next: (updatedTechnician) => {
          this.loading = false;
          this.closeTechnicianModal();
          this.loadTechnicians();
          console.log('✅ Technician updated successfully');
        },
        error: (error) => {
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
        competences: formValue.competences
      };

      this.technicianService.createTechnician(createRequest).subscribe({
        next: (response) => {
          this.loading = false;
          this.closeTechnicianModal();
          this.loadTechnicians();
          this.loadTechnicianStats();
          console.log('✅ Technician created successfully');
        },
        error: (error) => {
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

    this.technicianService.toggleTechnicianStatus(technician.id, !technician.actif).subscribe({
      next: (updatedTechnician) => {
        this.loading = false;
        this.loadTechnicians();
        this.loadTechnicianStats();
        console.log('✅ Technician status toggled successfully');
      },
      error: (error) => {
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
        technician.specialite.toLowerCase().includes(this.competenceSearchTerm.toLowerCase()) ||
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
    const updateRequest = {
      competences: formValue.competences
    };

    this.technicianService.updateTechnician(this.selectedTechnicianForCompetences.id, updateRequest).subscribe({
      next: (updatedTechnician) => {
        this.loading = false;
        this.closeCompetenceModal();
        this.loadTechnicians(); // Refresh the list
        this.filterCompetences(); // Refresh filtered list
        console.log('✅ Competences updated successfully');
      },
      error: (error) => {
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



  /**
   * Get workload percentage
   */
  getWorkloadPercentage(charge: number): number {
    return Math.min(100, (charge / 10) * 100); // Assuming max workload is 10
  }

  /**
   * Get workload color class
   */
  getWorkloadColor(charge: number): string {
    const percentage = this.getWorkloadPercentage(charge);
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  }
}
