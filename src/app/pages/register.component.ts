import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { RegisterRequest } from '../core/interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23334155&quot; fill-opacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>
      
      <div class="relative w-full max-w-md">
        <!-- Register Card -->
        <div class="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 animate-slide-up">
          <!-- Header -->
          <div class="text-center mb-8">
            <!-- ITSM Logo/Icon -->
            <div class="mx-auto h-16 w-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 animate-bounce-in shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p class="text-slate-400">Join the ITSM system today</p>
          </div>

          <!-- Register Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Name Fields Row -->
            <div class="grid grid-cols-2 gap-4">
              <!-- First Name -->
              <div class="space-y-2">
                <label for="prenom" class="block text-sm font-medium text-slate-300">
                  First Name
                </label>
                <input
                  id="prenom"
                  type="text"
                  formControlName="prenom"
                  class="w-full px-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                  placeholder="John"
                  [class.border-red-500]="registerForm.get('prenom')?.invalid && registerForm.get('prenom')?.touched"
                />
                <div *ngIf="registerForm.get('prenom')?.invalid && registerForm.get('prenom')?.touched" class="text-xs text-red-400">
                  First name is required
                </div>
              </div>

              <!-- Last Name -->
              <div class="space-y-2">
                <label for="nom" class="block text-sm font-medium text-slate-300">
                  Last Name
                </label>
                <input
                  id="nom"
                  type="text"
                  formControlName="nom"
                  class="w-full px-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                  placeholder="Doe"
                  [class.border-red-500]="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched"
                />
                <div *ngIf="registerForm.get('nom')?.invalid && registerForm.get('nom')?.touched" class="text-xs text-red-400">
                  Last name is required
                </div>
              </div>
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div class="relative">
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                  placeholder="john.doe@company.com"
                  [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-sm text-red-400">
                <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</span>
              </div>
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="motDePasse"
                  class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                  placeholder="Create a strong password"
                  [class.border-red-500]="registerForm.get('motDePasse')?.invalid && registerForm.get('motDePasse')?.touched"
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
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
              <div *ngIf="registerForm.get('motDePasse')?.invalid && registerForm.get('motDePasse')?.touched" class="text-sm text-red-400">
                <span *ngIf="registerForm.get('motDePasse')?.errors?.['required']">Password is required</span>
                <span *ngIf="registerForm.get('motDePasse')?.errors?.['minlength']">Password must be at least 8 characters</span>
              </div>
              <!-- Password Strength Indicator -->
              <div class="mt-2">
                <div class="flex space-x-1">
                  <div class="h-1 flex-1 rounded-full" [class]="getPasswordStrengthClass(0)"></div>
                  <div class="h-1 flex-1 rounded-full" [class]="getPasswordStrengthClass(1)"></div>
                  <div class="h-1 flex-1 rounded-full" [class]="getPasswordStrengthClass(2)"></div>
                  <div class="h-1 flex-1 rounded-full" [class]="getPasswordStrengthClass(3)"></div>
                </div>
                <p class="text-xs text-slate-400 mt-1">{{ getPasswordStrengthText() }}</p>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-2">
              <label for="confirmPassword" class="block text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 transition-all duration-200"
                  placeholder="Confirm your password"
                  [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                />
                <button
                  type="button"
                  (click)="toggleConfirmPasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <svg *ngIf="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg *ngIf="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" class="text-sm text-red-400">
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
                <span *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</span>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <input
                id="terms"
                type="checkbox"
                formControlName="acceptTerms"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-600 rounded bg-slate-700 mt-1"
              />
              <label for="terms" class="ml-3 block text-sm text-slate-300">
                I agree to the 
                <a href="#" class="text-emerald-400 hover:text-emerald-300 transition-colors">Terms of Service</a>
                and 
                <a href="#" class="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy Policy</a>
              </label>
            </div>
            <div *ngIf="registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched" class="text-sm text-red-400 -mt-2">
              You must accept the terms and conditions
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm text-red-400">{{ errorMessage }}</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-slate-400">
              Already have an account?
              <a routerLink="/login" class="font-medium text-emerald-400 hover:text-emerald-300 ml-1 transition-colors">
                Sign in here
              </a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-xs text-slate-500">
            © 2024 ITSM System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    /* Custom animations */
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .animate-slide-up {
      animation: slideUp 0.6s ease-out;
    }
    
    .animate-bounce-in {
      animation: bounceIn 0.8s ease-out;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, acceptTerms, ...userData } = this.registerForm.value;
      const registerData: RegisterRequest = userData;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('✅ Registration successful:', response);
          this.redirectBasedOnRole();
        },
        error: (error) => {
          console.error('❌ Registration failed:', error);
          this.errorMessage = error.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('motDePasse')?.value || '';
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
  }

  getPasswordStrengthClass(index: number): string {
    const strength = this.getPasswordStrength();
    if (index < strength) {
      switch (strength) {
        case 1: return 'bg-red-500';
        case 2: return 'bg-yellow-500';
        case 3: return 'bg-blue-500';
        case 4: return 'bg-emerald-500';
        default: return 'bg-slate-600';
      }
    }
    return 'bg-slate-600';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0: return 'Enter a password';
      case 1: return 'Weak password';
      case 2: return 'Fair password';
      case 3: return 'Good password';
      case 4: return 'Strong password';
      default: return '';
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('motDePasse');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      console.log('🔄 Redirecting user based on role:', user.role);
      switch (user.role) {
        case 'ADMIN':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'MANAGER':
          this.router.navigate(['/manager/dashboard']);
          break;
        case 'TECHNICIEN':
          this.router.navigate(['/technician/dashboard']);
          break;
        case 'UTILISATEUR':
          this.router.navigate(['/user/dashboard']);
          break;
        default:
          console.warn('⚠️ Unknown role:', user.role);
          this.router.navigate(['/user/dashboard']); // Default to user dashboard
      }
    }
  }
}
