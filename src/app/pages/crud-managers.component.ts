import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ManagerService, Manager, CreateManagerRequest, UpdateManagerRequest } from '../core/services/manager.service';

@Component({
  selector: 'app-crud-managers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-slate-900 p-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Gestion des Managers</h1>
            <p class="text-slate-400">Créer, modifier et supprimer les managers du système</p>
          </div>
          <button
            (click)="openCreateModal()"
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nouveau Manager
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="onSearch()"
                placeholder="Rechercher par nom, email, spécialité..."
                class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 pl-12 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
              />
              <svg class="absolute left-4 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <button
            (click)="loadManagers()"
            class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
            title="Actualiser"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="text-red-300 font-medium">Erreur</h3>
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="text-green-300 font-medium">Succès</h3>
            <p class="text-green-400 text-sm">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Managers Table -->
      <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-700">
              <tr>
                <th class="text-left text-slate-300 font-medium px-6 py-4">Manager</th>
                <th class="text-left text-slate-300 font-medium px-6 py-4">Email</th>
                <th class="text-left text-slate-300 font-medium px-6 py-4">Équipe</th>
                <th class="text-left text-slate-300 font-medium px-6 py-4">Contact</th>
                <th class="text-left text-slate-300 font-medium px-6 py-4">Spécialité</th>
                <th class="text-left text-slate-300 font-medium px-6 py-4">Statut</th>
                <th class="text-left text-slate-300 font-medium px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              <tr *ngFor="let manager of managers" class="hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white font-semibold text-sm">{{ getInitials(manager) }}</span>
                    </div>
                    <div>
                      <p class="text-white font-medium">{{ manager.prenom }} {{ manager.nom }}</p>
                      <p class="text-slate-400 text-sm">{{ manager.role }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="text-slate-300 text-sm">{{ manager.email }}</p>
                    <p class="text-slate-400 text-xs">ID: {{ manager.id }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="text-slate-300 font-medium text-sm">{{ manager.teamName || 'Aucune équipe' }}</p>
                    <p class="text-slate-400 text-xs mt-1" *ngIf="manager.teamDescription">{{ manager.teamDescription }}</p>
                    <div class="flex flex-wrap gap-1 mt-2" *ngIf="manager.teamCategories && manager.teamCategories.length > 0">
                      <span
                        *ngFor="let category of manager.teamCategories"
                        [class]="getCategoryClass(category) + ' px-2 py-1 rounded text-xs font-medium'"
                      >
                        {{ category }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="text-slate-300 text-sm">{{ manager.telephone }}</p>
                    <p class="text-slate-400 text-xs">{{ manager.localisation }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-slate-300 text-sm">{{ manager.specialite }}</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    [class]="manager.actif !== false ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'"
                  >
                    {{ manager.actif !== false ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button
                      (click)="openEditModal(manager)"
                      class="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-slate-600 transition-colors"
                      title="Modifier"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      (click)="confirmDelete(manager)"
                      class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-slate-600 transition-colors"
                      title="Supprimer"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="managers.length === 0 && !loading">
                <td colspan="7" class="px-6 py-12 text-center">
                  <div class="text-slate-400">
                    <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <p class="text-lg font-medium mb-2">Aucun manager trouvé</p>
                    <p class="text-sm">Commencez par créer votre premier manager</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-400">Total Managers</p>
              <p class="text-2xl font-bold text-white">{{ managers.length }}</p>
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
              <p class="text-sm font-medium text-slate-400">Managers Actifs</p>
              <p class="text-2xl font-bold text-white">{{ getActiveManagersCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-400">Équipes Gérées</p>
              <p class="text-2xl font-bold text-white">{{ getUniqueTeamsCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center">
            <div class="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-400">Catégories</p>
              <p class="text-2xl font-bold text-white">{{ getUniqueCategoriesCount() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-slate-700">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">
              {{ isEditMode ? 'Modifier le Manager' : 'Nouveau Manager' }}
            </h2>
            <button
              (click)="closeModal()"
              class="text-slate-400 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form [formGroup]="managerForm" (ngSubmit)="onSubmit()" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white mb-4">Informations Personnelles</h3>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Prénom *</label>
                <input
                  type="text"
                  formControlName="prenom"
                  class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                  placeholder="Prénom du manager"
                />
                <div *ngIf="managerForm.get('prenom')?.invalid && managerForm.get('prenom')?.touched" class="text-red-400 text-sm mt-1">
                  Le prénom est requis
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Nom *</label>
                <input
                  type="text"
                  formControlName="nom"
                  class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                  placeholder="Nom du manager"
                />
                <div *ngIf="managerForm.get('nom')?.invalid && managerForm.get('nom')?.touched" class="text-red-400 text-sm mt-1">
                  Le nom est requis
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  formControlName="email"
                  class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                  placeholder="email@itsm.com"
                />
                <div *ngIf="managerForm.get('email')?.invalid && managerForm.get('email')?.touched" class="text-red-400 text-sm mt-1">
                  <span *ngIf="managerForm.get('email')?.errors?.['required']">L'email est requis</span>
                  <span *ngIf="managerForm.get('email')?.errors?.['email']">Format d'email invalide</span>
                </div>
              </div>

              <div *ngIf="!isEditMode">
                <label class="block text-sm font-medium text-slate-300 mb-2">Mot de passe *</label>
                <div class="relative">
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    formControlName="motDePasse"
                    class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 pr-12 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                    placeholder="Mot de passe sécurisé"
                  />
                  <button
                    type="button"
                    (click)="togglePasswordVisibility()"
                    class="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  (click)="generatePassword()"
                  class="text-red-400 hover:text-red-300 text-sm mt-1"
                >
                  Générer un mot de passe sécurisé
                </button>
                <div *ngIf="managerForm.get('motDePasse')?.invalid && managerForm.get('motDePasse')?.touched" class="text-red-400 text-sm mt-1">
                  Le mot de passe est requis (min. 8 caractères)
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  formControlName="telephone"
                  class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                  placeholder="+33 1 23 45 67 89"
                />
                <div *ngIf="managerForm.get('telephone')?.invalid && managerForm.get('telephone')?.touched" class="text-red-400 text-sm mt-1">
                  Le téléphone est requis
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Localisation *</label>
                <input
                  type="text"
                  formControlName="localisation"
                  class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                  placeholder="Ville - Bureau"
                />
                <div *ngIf="managerForm.get('localisation')?.invalid && managerForm.get('localisation')?.touched" class="text-red-400 text-sm mt-1">
                  La localisation est requise
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Spécialité *</label>
                <select
                  formControlName="specialite"
                  class="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                >
                  <option value="">Sélectionner une spécialité</option>
                  <option *ngFor="let specialite of managerService.SPECIALITES" [value]="specialite">
                    {{ specialite }}
                  </option>
                </select>
                <div *ngIf="managerForm.get('specialite')?.invalid && managerForm.get('specialite')?.touched" class="text-red-400 text-sm mt-1">
                  La spécialité est requise
                </div>
              </div>
            </div>

            <!-- Team Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-white mb-4">Informations Équipe</h3>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Nom de l'équipe *</label>
                <input
                  type="text"
                  formControlName="teamName"
                  class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none"
                  placeholder="Nom de l'équipe"
                />
                <div *ngIf="managerForm.get('teamName')?.invalid && managerForm.get('teamName')?.touched" class="text-red-400 text-sm mt-1">
                  Le nom de l'équipe est requis
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Description de l'équipe *</label>
                <textarea
                  formControlName="teamDescription"
                  rows="3"
                  class="w-full bg-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-600 focus:border-red-500 focus:outline-none resize-none"
                  placeholder="Description des responsabilités de l'équipe"
                ></textarea>
                <div *ngIf="managerForm.get('teamDescription')?.invalid && managerForm.get('teamDescription')?.touched" class="text-red-400 text-sm mt-1">
                  La description de l'équipe est requise
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Catégories de l'équipe *</label>
                <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-slate-700 p-3 rounded-lg border border-slate-600">
                  <label *ngFor="let category of managerService.TEAM_CATEGORIES" class="flex items-center">
                    <input
                      type="checkbox"
                      [value]="category"
                      (change)="onCategoryChange($event)"
                      [checked]="selectedCategories.includes(category)"
                      class="mr-2 text-red-500 bg-slate-600 border-slate-500 rounded focus:ring-red-500"
                    />
                    <span class="text-slate-300 text-sm">{{ category }}</span>
                  </label>
                </div>
                <div *ngIf="selectedCategories.length === 0 && managerForm.touched" class="text-red-400 text-sm mt-1">
                  Au moins une catégorie est requise
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-slate-700">
            <button
              type="button"
              (click)="closeModal()"
              class="px-6 py-3 text-slate-300 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="managerForm.invalid || selectedCategories.length === 0 || submitting"
              class="bg-red-500 hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg *ngIf="submitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Enregistrement...' : (isEditMode ? 'Modifier' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div *ngIf="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white">Confirmer la suppression</h3>
              <p class="text-slate-400 text-sm">Cette action est irréversible</p>
            </div>
          </div>

          <p class="text-slate-300 mb-6">
            Êtes-vous sûr de vouloir supprimer le manager
            <span class="font-semibold text-white">{{ managerToDelete?.prenom }} {{ managerToDelete?.nom }}</span> ?
          </p>

          <div class="flex items-center justify-end space-x-4">
            <button
              (click)="closeDeleteModal()"
              class="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              (click)="deleteManager()"
              [disabled]="submitting"
              class="bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg *ngIf="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Suppression...' : 'Supprimer' }}
            </button>
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
export class CrudManagersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  managers: Manager[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  searchTerm = '';

  // Modal states
  showModal = false;
  showDeleteModal = false;
  isEditMode = false;
  submitting = false;
  showPassword = false;

  // Form and data
  managerForm: FormGroup;
  selectedCategories: string[] = [];
  managerToDelete: Manager | null = null;
  editingManager: Manager | null = null;

  constructor(
    public managerService: ManagerService,
    private fb: FormBuilder
  ) {
    this.managerForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadManagers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.minLength(8)]],
      telephone: ['', [Validators.required]],
      localisation: ['', [Validators.required]],
      specialite: ['', [Validators.required]],
      teamName: ['', [Validators.required]],
      teamDescription: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadManagers(): void {
    console.log('🔄 Loading managers from API...');
    this.loading = true;
    this.error = null;

    this.managerService.getAllManagers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (managers) => {
          console.log('✅ Managers loaded successfully from API:', managers);
          this.managers = managers;
          this.loading = false;

          if (managers.length === 0) {
            console.log('ℹ️ No managers found in the system');
          }
        },
        error: (error) => {
          console.error('❌ Error loading managers from API:', error);

          let errorMessage = 'Erreur lors du chargement des managers';
          if (error.status === 401) {
            errorMessage = 'Non autorisé - Veuillez vous reconnecter';
          } else if (error.status === 403) {
            errorMessage = 'Accès refusé - Permissions insuffisantes';
          } else if (error.status === 404) {
            errorMessage = 'Endpoint non trouvé - Vérifiez que le backend est démarré';
          } else if (error.status === 0) {
            errorMessage = 'Impossible de contacter le serveur - Vérifiez que le backend est démarré sur le port 8082';
          } else if (error.message) {
            errorMessage += ': ' + error.message;
          }

          this.error = errorMessage;
          this.managers = [];
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.clearMessages();

    if (this.searchTerm.trim()) {
      this.loading = true;
      this.managerService.searchManagers(this.searchTerm)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (managers) => {
            this.managers = managers;
            this.loading = false;
            console.log('🔍 Search results:', managers.length, 'managers found');
          },
          error: (error) => {
            this.error = 'Erreur lors de la recherche';
            this.loading = false;
            console.error('❌ Search error:', error);
          }
        });
    } else {
      this.loadManagers();
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingManager = null;
    this.managerForm = this.createForm();
    this.managerForm.get('motDePasse')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.managerForm.get('motDePasse')?.updateValueAndValidity();
    this.selectedCategories = [];
    this.showModal = true;
    this.clearMessages();
  }

  openEditModal(manager: Manager): void {
    console.log('🔧 Opening edit modal for manager:', manager);

    this.isEditMode = true;
    this.editingManager = manager;
    this.managerForm = this.createForm();
    this.managerForm.get('motDePasse')?.clearValidators();
    this.managerForm.get('motDePasse')?.updateValueAndValidity();

    // Populate form with manager data
    this.managerForm.patchValue({
      prenom: manager.prenom || '',
      nom: manager.nom || '',
      email: manager.email || '',
      telephone: manager.telephone || '',
      localisation: manager.localisation || '',
      specialite: manager.specialite || '',
      teamName: manager.teamName || '',
      teamDescription: manager.teamDescription || ''
    });

    // Set selected categories
    this.selectedCategories = (manager.teamCategories && Array.isArray(manager.teamCategories)) ? [...manager.teamCategories] : [];

    this.showModal = true;
    this.clearMessages();

    console.log('✅ Edit modal opened with data:', {
      form: this.managerForm.value,
      categories: this.selectedCategories
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.editingManager = null;
    this.selectedCategories = [];
    this.managerForm.reset();
  }

  confirmDelete(manager: Manager): void {
    this.managerToDelete = manager;
    this.showDeleteModal = true;
    this.clearMessages();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.managerToDelete = null;
  }

  onCategoryChange(event: any): void {
    const category = event.target.value;
    if (event.target.checked) {
      if (!this.selectedCategories.includes(category)) {
        this.selectedCategories.push(category);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  generatePassword(): void {
    const password = this.managerService.generatePassword();
    this.managerForm.patchValue({ motDePasse: password });
    this.showPassword = true;
  }

  onSubmit(): void {
    // For edit mode, categories are not required
    // For create mode, categories are required
    const categoriesValid = this.isEditMode || this.selectedCategories.length > 0;

    if (this.managerForm.valid && categoriesValid) {
      this.submitting = true;
      this.clearMessages();

      let formData = {
        ...this.managerForm.value,
        teamCategories: this.selectedCategories
      };

      // For update operations, always remove password field (handled separately)
      if (this.isEditMode) {
        delete formData.motDePasse;
      }

      console.log('📤 Submitting manager data:', formData);

      const operation = this.isEditMode
        ? this.managerService.updateManager(this.editingManager!.id!, formData)
        : this.managerService.createManager(formData);

      operation.pipe(takeUntil(this.destroy$)).subscribe({
        next: (manager) => {
          this.submitting = false;
          this.showSuccess(
            this.isEditMode
              ? `Manager ${manager.prenom} ${manager.nom} modifié avec succès`
              : `Manager ${manager.prenom} ${manager.nom} créé avec succès`
          );
          this.closeModal();
          this.loadManagers();
        },
        error: (error) => {
          this.submitting = false;
          this.error = this.isEditMode
            ? 'Erreur lors de la modification du manager'
            : 'Erreur lors de la création du manager';
          console.error('❌ Error saving manager:', error);
          console.error('📤 Form data that failed:', formData);
          console.error('🔍 Full error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
        }
      });
    }
  }

  deleteManager(): void {
    if (this.managerToDelete) {
      this.submitting = true;
      this.clearMessages();

      this.managerService.deleteManager(this.managerToDelete.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting = false;
            this.showSuccess(`Manager ${this.managerToDelete!.prenom} ${this.managerToDelete!.nom} supprimé avec succès`);
            this.closeDeleteModal();
            this.loadManagers();
          },
          error: (error) => {
            this.submitting = false;
            this.error = 'Erreur lors de la suppression du manager';
            console.error('Error deleting manager:', error);
          }
        });
    }
  }

  getInitials(manager: Manager): string {
    return `${manager.prenom.charAt(0)}${manager.nom.charAt(0)}`.toUpperCase();
  }

  getActiveManagersCount(): number {
    return this.managers.filter(m => m.actif !== false).length;
  }

  getUniqueTeamsCount(): number {
    const uniqueTeams = new Set(this.managers.map(m => m.teamName));
    return uniqueTeams.size;
  }

  getUniqueCategoriesCount(): number {
    const allCategories = this.managers
      .filter(m => m.teamCategories && m.teamCategories.length > 0)
      .flatMap(m => m.teamCategories!);
    const uniqueCategories = new Set(allCategories);
    return uniqueCategories.size;
  }

  getCategoryClass(category: string): string {
    const categoryColors: { [key: string]: string } = {
      'DEVELOPPEMENT': 'bg-blue-500/20 text-blue-300',
      'DEVOPS': 'bg-purple-500/20 text-purple-300',
      'CLOUD': 'bg-cyan-500/20 text-cyan-300',
      'CI_CD': 'bg-indigo-500/20 text-indigo-300',
      'SECURITE': 'bg-red-500/20 text-red-300',
      'CYBER_DEFENSE': 'bg-orange-500/20 text-orange-300',
      'AUDIT': 'bg-yellow-500/20 text-yellow-300',
      'CONFORMITE': 'bg-amber-500/20 text-amber-300',
      'RESEAU': 'bg-green-500/20 text-green-300',
      'INFRASTRUCTURE': 'bg-teal-500/20 text-teal-300',
      'VPN': 'bg-emerald-500/20 text-emerald-300',
      'SUPPORT': 'bg-pink-500/20 text-pink-300'
    };

    return categoryColors[category] || 'bg-slate-500/20 text-slate-300';
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 5000);
  }

  private clearMessages(): void {
    this.error = null;
    this.successMessage = null;
  }
}
