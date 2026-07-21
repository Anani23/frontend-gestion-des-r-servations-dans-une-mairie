import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id?: number;
  nom: string;
  prenom?: string;
  email: string;

  role:
    | 'ROLE_SUPER_ADMIN'
    | 'ROLE_ADMIN'
    | 'ROLE_AGENT'
    | 'ROLE_CITOYEN';

  password?: string;
  enabled?: boolean;
  telephone?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private API_URL = `${environment.apiUrl}/api/auth`;
  private ADMIN_URL = `${environment.apiUrl}/api/admin/users`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.restoreSession();
  }

  // ================= SESSION =================

  private restoreSession() {
    const user = localStorage.getItem('mairie_session');
    const token = localStorage.getItem('auth_token');

    if (user && token) {
      const parsed = JSON.parse(user);
      parsed.token = token;
      this.currentUserSubject.next(parsed);
    }
  }

  // ================= AUTH =================

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      map(res => {

        if (!res?.user || !res?.token) {
          throw new Error('Login invalide');
        }

        const user: User = res.user;
        user.token = res.token;

        localStorage.setItem('mairie_session', JSON.stringify(user));
        localStorage.setItem('auth_token', res.token);

        this.currentUserSubject.next(user);

        return user;
      }),
      catchError(err => throwError(() => err))
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, user);
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  // ================= USER HELPERS =================

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserName(): string {
    const user = this.currentUserSubject.value;
    if (!user) return 'Invité';
    return user.prenom ? `${user.prenom} ${user.nom}` : user.nom;
  }

  getRole(): string {
    return this.currentUserSubject.value?.role || '';
  }

  // ================= AUTH CHECK =================

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(this.getRole());
  }

  // ================= ADMIN USERS =================

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.ADMIN_URL);
  }

  validateUser(id: number): Observable<any> {
    return this.http.put(`${this.ADMIN_URL}/${id}/validate`, {});
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.ADMIN_URL}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.ADMIN_URL}/${id}`);
  }

  createUserAsAdmin(user: User): Observable<User> {
    return this.http.post<User>(`${this.ADMIN_URL}/create`, user);
  }
}