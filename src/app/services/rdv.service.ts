import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type RdvStatut = 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'VALIDE';

export interface Rdv {
  id: number;
  motif: string;
  dateDebut: string;
  dateFin?: string;
  statut: RdvStatut;
  nomCitoyen?: string;
  nomBien?: string;
  citoyenId?: number;
  dossierId?: number;
  bienId?: number;
  referenceDossier?: string;
  typePrestation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RdvService {
  private http = inject(HttpClient);
  
  // ✅ URL CORRECTE correspondant au backend Spring Boot
  private readonly API = `${environment.apiUrl}/api/rdvs`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ============================================
  // MÉTHODES POUR LE CITOYEN
  // ============================================

  /**
   * Créer un nouveau rendez-vous
   * POST /api/rdvs
   */
  createRdv(data: { motif: string; dateDebut: string; dateFin?: string; dossierId?: number }): Observable<Rdv> {
    console.log('📅 Création RDV - URL:', this.API);
    console.log('📦 Payload envoyé:', data);
    return this.http.post<Rdv>(this.API, data, { headers: this.getHeaders() });
  }

  /**
   * Récupérer mes rendez-vous (citoyen connecté)
   * GET /api/rdvs/mes-rdvs
   */
  getMesRdvs(): Observable<Rdv[]> {
    console.log('📋 Récupération de mes RDV');
    return this.http.get<Rdv[]>(`${this.API}/mes-rdvs`, { headers: this.getHeaders() });
  }

  /** Alias pour getMesRdvs (utilisé dans le dashboard) */
  getRendezVous(): Observable<Rdv[]> {
    return this.getMesRdvs();
  }

  // ============================================
  // MÉTHODES POUR L'AGENT
  // ============================================

  /**
   * Récupérer tous les rendez-vous (pour l'agent)
   * GET /api/rdvs
   */
  getAllRdvs(): Observable<Rdv[]> {
    console.log('📋 Récupération de tous les RDV (agent)');
    return this.http.get<Rdv[]>(this.API, { headers: this.getHeaders() });
  }

  /**
   * Confirmer un rendez-vous
   * PUT /api/rdvs/{id}/statut?statut=CONFIRME
   */
  confirmerRdv(id: number): Observable<Rdv> {
    console.log(`✅ Confirmation du RDV ${id}`);
    return this.http.put<Rdv>(`${this.API}/${id}/statut?statut=CONFIRME`, {}, { headers: this.getHeaders() });
  }

  /**
   * Annuler un rendez-vous
   * PUT /api/rdvs/{id}/statut?statut=ANNULE
   */
  annulerRdv(id: number): Observable<Rdv> {
    console.log(`❌ Annulation du RDV ${id}`);
    return this.http.put<Rdv>(`${this.API}/${id}/statut?statut=ANNULE`, {}, { headers: this.getHeaders() });
  }

  /**
   * Valider un rendez-vous
   * PUT /api/rdvs/{id}/statut?statut=VALIDE
   */
  validerRdv(id: number): Observable<Rdv> {
    console.log(`✔️ Validation du RDV ${id}`);
    return this.http.put<Rdv>(`${this.API}/${id}/statut?statut=VALIDE`, {}, { headers: this.getHeaders() });
  }

  /**
   * Supprimer un rendez-vous
   * DELETE /api/rdvs/{id}
   */
  supprimerRdv(id: number): Observable<{ message: string }> {
    console.log(`🗑️ Suppression du RDV ${id}`);
    return this.http.delete<{ message: string }>(`${this.API}/${id}`, { headers: this.getHeaders() });
  }
}