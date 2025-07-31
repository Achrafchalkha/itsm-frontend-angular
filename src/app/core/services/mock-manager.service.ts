import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Manager } from './manager.service';

@Injectable({
  providedIn: 'root'
})
export class MockManagerService {
  private mockManagers: Manager[] = [
    {
      id: '1',
      nom: 'Benali',
      prenom: 'Nadia',
      email: 'n.benali@itsm.com',
      role: 'MANAGER',
      teamId: 'team-1',
      localisation: 'Toulouse - Bureau 410',
      telephone: '+33 5 61 78 90 12',
      specialite: 'Développement Logiciel',
      competencesJson: '["Java", "Spring", "Angular"]',
      chargeActuelle: 75,
      dateCreation: '2024-01-15T10:00:00Z',
      dateModification: '2024-01-20T14:30:00Z',
      actif: true,
      teamName: 'Équipe DevOps',
      teamDescription: 'Équipe en charge du développement, de l\'intégration continue et du déploiement',
      teamCategories: ['DEVELOPPEMENT', 'DEVOPS', 'CLOUD']
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'p.martin@itsm.com',
      role: 'MANAGER',
      teamId: 'team-2',
      localisation: 'Paris - Bureau 205',
      telephone: '+33 1 42 56 78 90',
      specialite: 'Infrastructure IT',
      competencesJson: '["VMware", "Docker", "Kubernetes"]',
      chargeActuelle: 60,
      dateCreation: '2024-01-10T09:00:00Z',
      dateModification: '2024-01-18T16:45:00Z',
      actif: true,
      teamName: 'Équipe Infrastructure',
      teamDescription: 'Équipe responsable de l\'infrastructure et des serveurs',
      teamCategories: ['INFRASTRUCTURE', 'CLOUD', 'MAINTENANCE']
    },
    {
      id: '3',
      nom: 'Dubois',
      prenom: 'Sophie',
      email: 's.dubois@itsm.com',
      role: 'MANAGER',
      teamId: 'team-3',
      localisation: 'Lyon - Bureau 301',
      telephone: '+33 4 78 90 12 34',
      specialite: 'Sécurité Informatique',
      competencesJson: '["Cybersécurité", "Firewall", "Audit"]',
      chargeActuelle: 85,
      dateCreation: '2024-01-05T08:30:00Z',
      dateModification: '2024-01-22T11:15:00Z',
      actif: true,
      teamName: 'Équipe Sécurité',
      teamDescription: 'Équipe dédiée à la sécurité informatique et cybersécurité',
      teamCategories: ['SECURITE', 'INFRASTRUCTURE', 'FORMATION']
    },
    {
      id: '4',
      nom: 'Leroy',
      prenom: 'Marc',
      email: 'm.leroy@itsm.com',
      role: 'MANAGER',
      teamId: 'team-4',
      localisation: 'Marseille - Bureau 150',
      telephone: '+33 4 91 23 45 67',
      specialite: 'Support Technique',
      competencesJson: '["Support", "Helpdesk", "Formation"]',
      chargeActuelle: 70,
      dateCreation: '2024-01-12T13:20:00Z',
      dateModification: '2024-01-19T09:30:00Z',
      actif: true,
      teamName: 'Équipe Support',
      teamDescription: 'Équipe de support technique et assistance utilisateurs',
      teamCategories: ['SUPPORT', 'FORMATION', 'MAINTENANCE']
    },
    {
      id: '5',
      nom: 'Garcia',
      prenom: 'Ana',
      email: 'a.garcia@itsm.com',
      role: 'MANAGER',
      teamId: 'team-5',
      localisation: 'Nice - Bureau 220',
      telephone: '+33 4 93 87 65 43',
      specialite: 'Réseaux et Télécoms',
      competencesJson: '["Cisco", "Réseaux", "VPN"]',
      chargeActuelle: 65,
      dateCreation: '2024-01-08T15:45:00Z',
      dateModification: '2024-01-21T12:00:00Z',
      actif: false,
      teamName: 'Équipe Réseaux',
      teamDescription: 'Équipe en charge des réseaux et télécommunications',
      teamCategories: ['RESEAU', 'INFRASTRUCTURE', 'SECURITE']
    }
  ];

  private mockTeams = [
    {
      id: 'team-1',
      nom: 'Équipe DevOps',
      description: 'Équipe en charge du développement, de l\'intégration continue et du déploiement',
      categories: ['DEVELOPPEMENT', 'DEVOPS', 'CLOUD']
    },
    {
      id: 'team-2',
      nom: 'Équipe Infrastructure',
      description: 'Équipe responsable de l\'infrastructure et des serveurs',
      categories: ['INFRASTRUCTURE', 'CLOUD', 'MAINTENANCE']
    },
    {
      id: 'team-3',
      nom: 'Équipe Sécurité',
      description: 'Équipe dédiée à la sécurité informatique et cybersécurité',
      categories: ['SECURITE', 'INFRASTRUCTURE', 'FORMATION']
    },
    {
      id: 'team-4',
      nom: 'Équipe Support',
      description: 'Équipe de support technique et assistance utilisateurs',
      categories: ['SUPPORT', 'FORMATION', 'MAINTENANCE']
    },
    {
      id: 'team-5',
      nom: 'Équipe Réseaux',
      description: 'Équipe en charge des réseaux et télécommunications',
      categories: ['RESEAU', 'INFRASTRUCTURE', 'SECURITE']
    }
  ];

  constructor() {}

  /**
   * Get all managers (mock data)
   */
  getAllManagers(): Observable<Manager[]> {
    console.log('🔄 [MOCK] Fetching all managers...');
    return of(this.mockManagers).pipe(
      delay(500) // Simulate network delay
    );
  }

  /**
   * Get manager by ID (mock data)
   */
  getManagerById(id: string): Observable<Manager> {
    console.log('🔄 [MOCK] Fetching manager by ID:', id);
    const manager = this.mockManagers.find(m => m.id === id);
    if (manager) {
      return of(manager).pipe(delay(300));
    } else {
      return throwError(() => new Error('Manager not found'));
    }
  }

  /**
   * Create new manager (mock)
   */
  createManager(managerData: any): Observable<Manager> {
    console.log('🔄 [MOCK] Creating new manager:', managerData);
    
    const newManager: Manager = {
      id: (this.mockManagers.length + 1).toString(),
      ...managerData,
      role: 'MANAGER',
      teamId: 'team-' + (this.mockManagers.length + 1),
      chargeActuelle: 0,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      actif: true
    };

    this.mockManagers.push(newManager);
    
    return of(newManager).pipe(delay(800));
  }

  /**
   * Update manager (mock)
   */
  updateManager(id: string, managerData: any): Observable<Manager> {
    console.log('🔄 [MOCK] Updating manager:', id, managerData);
    
    const index = this.mockManagers.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mockManagers[index] = {
        ...this.mockManagers[index],
        ...managerData,
        dateModification: new Date().toISOString()
      };
      return of(this.mockManagers[index]).pipe(delay(600));
    } else {
      return throwError(() => new Error('Manager not found'));
    }
  }

  /**
   * Delete manager (mock)
   */
  deleteManager(id: string): Observable<any> {
    console.log('🔄 [MOCK] Deleting manager:', id);
    
    const index = this.mockManagers.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mockManagers.splice(index, 1);
      return of({ success: true }).pipe(delay(400));
    } else {
      return throwError(() => new Error('Manager not found'));
    }
  }

  /**
   * Search managers (mock)
   */
  searchManagers(searchTerm: string): Observable<Manager[]> {
    console.log('🔍 [MOCK] Searching managers with term:', searchTerm);
    
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getAllManagers();
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filteredManagers = this.mockManagers.filter(manager => 
      manager.nom.toLowerCase().includes(term) ||
      manager.prenom.toLowerCase().includes(term) ||
      manager.email.toLowerCase().includes(term) ||
      manager.specialite.toLowerCase().includes(term) ||
      (manager.teamName && manager.teamName.toLowerCase().includes(term)) ||
      manager.localisation.toLowerCase().includes(term)
    );
    
    return of(filteredManagers).pipe(delay(300));
  }

  /**
   * Get teams (mock)
   */
  getAllTeams(): Observable<any[]> {
    console.log('🔄 [MOCK] Fetching all teams...');
    return of(this.mockTeams).pipe(delay(200));
  }
}
