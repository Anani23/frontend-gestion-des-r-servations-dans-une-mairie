import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BienService {
  private http = inject(HttpClient);
  private API = `${environment.apiUrl}/api/admin/patrimoine/biens`;
  private PUBLIC_API = `${environment.apiUrl}/api/publics/biens`;

  // Récupérer la liste
  getBiens(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  // Récupérer uniquement les biens disponibles (espace public, sans authentification)
  getBiensDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(this.PUBLIC_API);
  }

  // ✅ Créer un bien (Le POST qui bloquait)
  ajouterBien(bien: any): Observable<any> {
    return this.http.post<any>(this.API, bien);
  }

  getBienById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  getBiensByCategorie(categorieId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/categorie/${categorieId}`);
  }

  modifierBien(id: number | string, bien: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${id}`, bien);
  }

  supprimerBien(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}