import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/auth.interface';
import { TicketService, TicketResponse, CreateTicketRequest, UserTicketStats } from '../core/services/ticket.service';
import { FileUploadService, AttachedFile, FileUploadResponse } from '../core/services/file-upload.service';

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
            <div class="flex items-center space-x-3">
              <div class="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">{{ getUserInitials() }}</span>
              </div>
              <span class="text-sm text-slate-300">{{ currentUser?.email }}</span>
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
        <!-- Filters -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                type="text"
                placeholder="Rechercher un ticket..."
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
            </div>
            <select class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Tous les statuts</option>
              <option value="OUVERT">Ouvert</option>
              <option value="EN_COURS">En cours</option>
              <option value="FERME">Fermé</option>
            </select>
            <select class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Toutes les priorités</option>
              <option value="BASSE">Basse</option>
              <option value="MOYENNE">Moyenne</option>
              <option value="HAUTE">Haute</option>
              <option value="CRITIQUE">Critique</option>
            </select>
          </div>
        </div>

        <!-- Tickets List -->
        <div class="space-y-4">
          <!-- Sample Ticket 1 -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-semibold text-white">#TICK-001 - Problème de connexion réseau</h3>
                  <span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">EN_COURS</span>
                  <span class="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">HAUTE</span>
                </div>
                <p class="text-slate-400 mb-3">Impossible de se connecter au réseau depuis ce matin...</p>
                <div class="flex items-center space-x-4 text-sm text-slate-500">
                  <span>Créé le: 15/01/2025</span>
                  <span>Assigné à: Jean Dupont</span>
                  <span>Catégorie: Réseau</span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button class="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Voir détails">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button class="text-emerald-400 hover:text-emerald-300 p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Ajouter commentaire">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </button>
                <button class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Supprimer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Sample Ticket 2 -->
          <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-semibold text-white">#TICK-002 - Demande d'installation logiciel</h3>
                  <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">FERME</span>
                  <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">MOYENNE</span>
                </div>
                <p class="text-slate-400 mb-3">Installation de Microsoft Office sur mon poste de travail</p>
                <div class="flex items-center space-x-4 text-sm text-slate-500">
                  <span>Créé le: 12/01/2025</span>
                  <span>Résolu par: Marie Martin</span>
                  <span>Catégorie: Logiciel</span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button class="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Voir détails">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button class="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-slate-700 transition-colors" title="Évaluer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="text-center py-12 text-slate-400" style="display: none;">
            <svg class="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <h3 class="text-lg font-medium text-slate-300 mb-2">Aucun ticket trouvé</h3>
            <p class="text-slate-400">Vous n'avez pas encore créé de tickets</p>
            <button
              (click)="setActiveSection('create-ticket')"
              class="mt-4 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            >
              Créer votre premier ticket
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private fileUploadService: FileUploadService
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
   * Format file size
   */
  formatFileSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
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
}
