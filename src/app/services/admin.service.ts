import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin`;

  // Récupère les services municipaux
  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services-municipaux`);
  }

  // Récupère les biens du patrimoine
  getBiens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patrimoine/biens`);
  }
}