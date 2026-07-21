import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Dossier } from '../models/dossier.model';

@Injectable({
  providedIn: 'root'
})
export class DossiersService {

  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getFormDataHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Ne PAS mettre 'Content-Type' pour FormData, le navigateur le gère automatiquement
    });
  }

  // CITOYEN
  getMesDossiers(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(`${this.API_URL}/api/citoyen/dossiers`, { 
      headers: this.getHeaders() 
    });
  }

  ajouterDossier(dossier: Dossier, fichier: File): Observable<Dossier> {
    const formData = new FormData();

    const requestData = {
      typePrestation: dossier.typePrestation,
      description: dossier.description,
      details: dossier.details || {},
      statut: 'EN_ATTENTE'
    };

    formData.append(
      'request',
      new Blob([JSON.stringify(requestData)], { type: 'application/json' })
    );
    formData.append('file', fichier);

    return this.http.post<Dossier>(`${this.API_URL}/api/citoyen/dossiers`, formData, {
      headers: this.getFormDataHeaders()
    });
  }

  getDossierById(id: number): Observable<Dossier> {
    return this.http.get<Dossier>(`${this.API_URL}/api/citoyen/dossiers/${id}`, {
      headers: this.getHeaders()
    });
  }

  // AGENT
  getDossiersEnAttente(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(`${this.API_URL}/api/agent/dossiers/flux-travail`, {
      headers: this.getHeaders()
    });
  }

  getAllDossiers(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(`${this.API_URL}/api/agent/dossiers/tous`, {
      headers: this.getHeaders()
    });
  }

  updateStatut(id: number, statut: Dossier['statut'], commentaire?: string): Observable<Dossier> {
    return this.http.patch<Dossier>(`${this.API_URL}/api/agent/dossiers/${id}/statut`, {
      statut: statut,
      commentaire: commentaire || ''
    }, {
      headers: this.getHeaders()
    });
  }

  validerDossier(id: number, commentaire?: string): Observable<Dossier> {
    return this.updateStatut(id, 'VALIDE', commentaire);
  }

  rejeterDossier(id: number, commentaire: string): Observable<Dossier> {
    return this.updateStatut(id, 'REJETE', commentaire);
  }

  // PIÈCES JOINTES
  downloadPieceJointe(pieceId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/api/dossiers/pieces-jointes/${pieceId}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}