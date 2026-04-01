import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // 🔥 ROLE
  getRole(): string {
    return localStorage.getItem('role') || 'PUBLIC';
  }

  setRole(role: string) {
    localStorage.setItem('role', role);
  }

  // 🔥 USER
  getUserName(): string {
    return localStorage.getItem('username') || 'Utilisateur';
  }

  setUserName(name: string) {
    localStorage.setItem('username', name);
  }

  // 🔥 LOGOUT
  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  }

}