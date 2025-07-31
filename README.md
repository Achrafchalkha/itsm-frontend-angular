# 🎯 ITSM Frontend Angular

Une application frontend moderne pour la gestion des services IT (ITSM) construite avec Angular 17 et Tailwind CSS.

## 🚀 Fonctionnalités

### 🔐 Authentification & Autorisation
- **Connexion sécurisée** avec JWT tokens
- **Contrôle d'accès basé sur les rôles** (Admin, Manager, Technician, User)
- **Guards de route** pour protéger les pages sensibles
- **Intercepteurs HTTP** pour l'authentification automatique

### 👥 Gestion des Utilisateurs
- **CRUD complet des managers** avec interface intuitive
- **Gestion des équipes** avec informations détaillées
- **Catégories d'équipes** avec badges colorés
- **Validation de formulaires** en temps réel

### 🎨 Interface Utilisateur
- **Design moderne** avec Tailwind CSS
- **Interface responsive** pour tous les appareils
- **Thème sombre** élégant
- **Animations fluides** et transitions

### 📊 Tableaux de Bord
- **Dashboard Admin** - Gestion complète du système
- **Dashboard Manager** - Vue d'ensemble des équipes
- **Dashboard Technician** - Gestion des tickets
- **Dashboard User** - Interface utilisateur simplifiée

## 🛠️ Technologies Utilisées

- **Angular 17** - Framework frontend
- **TypeScript** - Langage de programmation
- **Tailwind CSS** - Framework CSS utilitaire
- **RxJS** - Programmation réactive
- **Angular Router** - Navigation
- **Angular Forms** - Gestion des formulaires

## 📦 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Angular CLI

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/Achrafchalkha/itsm-frontend-angular.git
cd itsm-frontend-angular
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur de développement**
```bash
npm start
# ou
ng serve
```

4. **Ouvrir l'application**
Naviguer vers `http://localhost:4200/`

## 🔧 Configuration

### Variables d'environnement

L'application se connecte aux services backend suivants :

- **Auth Service** : `http://localhost:8081/api/auth`
- **User Service** : `http://localhost:8082/api`

### Services Backend Requis

L'application nécessite les services backend suivants :

- **Auth Service** (port 8081) - Authentification
- **User Service** (port 8082) - Gestion des utilisateurs et équipes

## 👤 Comptes de Test

### Administrateur
- **Email** : `admin@itsm.com`
- **Mot de passe** : `admin123`

### Manager
- **Email** : `manager1@itsm.com`
- **Mot de passe** : `manager123`

## 📱 Fonctionnalités par Rôle

### 🔑 Admin
- Gestion complète des utilisateurs
- CRUD des managers avec équipes
- Statistiques et rapports
- Configuration système

### 👨‍💼 Manager
- Vue d'ensemble de son équipe
- Gestion des techniciens
- Rapports d'équipe
- Assignation des tickets

### 🔧 Technician
- Gestion des tickets assignés
- Mise à jour des statuts
- Communication avec les utilisateurs
- Rapports d'activité

### 👤 User
- Création de tickets
- Suivi des demandes
- Historique personnel
- Notifications

## 🚀 Scripts Disponibles

```bash
# Démarrage en développement
npm start

# Build de production
npm run build

# Tests unitaires
npm test

# Linting
npm run lint
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Guards de route
│   │   ├── interceptors/    # Intercepteurs HTTP
│   │   ├── interfaces/      # Interfaces TypeScript
│   │   └── services/        # Services Angular
│   ├── pages/               # Composants de pages
│   ├── app.component.*      # Composant racine
│   ├── app.config.ts        # Configuration de l'app
│   └── app.routes.ts        # Routes de l'application
├── assets/                  # Ressources statiques
└── styles.scss             # Styles globaux
```

## 🎯 Fonctionnalités Avancées

### Gestion des Managers
- **Création** avec génération automatique de mot de passe
- **Modification** des informations (sans mot de passe pour la sécurité)
- **Suppression** avec confirmation
- **Assignation d'équipes** avec catégories

### Interface Enrichie
- **Badges colorés** pour les catégories d'équipes
- **Statistiques en temps réel** (managers, équipes, catégories)
- **Formulaires adaptatifs** selon le mode (création/modification)
- **Messages d'erreur** contextuels

### Intégration API
- **Données en temps réel** depuis le backend
- **Gestion d'erreurs** robuste
- **Logs détaillés** pour le débogage
- **Fallback** gracieux en cas d'erreur

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

**Achraf Chalkha**
- GitHub: [@Achrafchalkha](https://github.com/Achrafchalkha)
