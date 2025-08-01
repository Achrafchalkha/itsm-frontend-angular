export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
}

export interface User {
  userId: string;
  prenom: string;
  nom: string;
  email: string;
  role: UserRole;
  telephone?: string;
  localisation?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  UTILISATEUR = 'UTILISATEUR',
  TECHNICIEN = 'TECHNICIEN'
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
}
