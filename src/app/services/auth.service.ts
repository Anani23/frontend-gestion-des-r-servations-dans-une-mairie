import { Injectable } from '@angular/core';

export interface User {
  nom: string;
  role: 'ADMIN' | 'AGENT' | 'CITOYEN';
  password?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private users: User[] = [
    { nom: 'admin', role: 'ADMIN', password: '1234' },
    { nom: 'agent', role: 'AGENT', password: '1234' },
    { nom: 'citoyen', role: 'CITOYEN', password: '1234' }
  ];

  private currentUser: User | null = null;

  constructor() {
    const saved = localStorage.getItem('mairie_session');
    if (saved) this.currentUser = JSON.parse(saved);
  }

  // ================= AJOUT POUR CORRIGER L'ERREUR =================
  /**
   * Vérifie si un utilisateur est actuellement stocké en session.
   * Cette méthode est appelée par default-header.component.ts
   */
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // ================= LOGIN =================
  login(nom: string, password: string): User | null {
    const user = this.users.find(u => u.nom === nom && u.password === password);

    if (!user) return null;

    this.currentUser = { ...user };
    delete this.currentUser.password;

    localStorage.setItem('mairie_session', JSON.stringify(this.currentUser));

    return this.currentUser;
  }

  // ================= RESTANT DU SERVICE (Inchangé) =================
  register(user: User): boolean {
    const exists = this.users.some(u => u.nom === user.nom);
    if (exists) return false;
    this.users.push(user);
    return true;
  }

  getUsers(): User[] {
    return this.users;
  }

  deleteUser(nom: string): void {
    this.users = this.users.filter(u => u.nom !== nom);
  }

  updateUser(index: number, user: User): void {
    if (index >= 0 && index < this.users.length) {
      this.users[index] = user;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUserName(): string {
    return this.currentUser?.nom ?? 'Invité';
  }

  getRole(): string {
    return this.currentUser?.role ?? '';
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('mairie_session');
  }
}