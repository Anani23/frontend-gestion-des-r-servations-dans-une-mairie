import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ✅ Interface complète avec nomBien
export interface Reservation {
  id?: number;
  bienId: number;
  nomBien?: string;        // ✅ Ajouté
  bienNom?: string;        // ✅ Alias pour compatibilité
  citoyenId?: number;
  nomCitoyen?: string;
  userName?: string;
  userEmail?: string;
  dateDebut: string;
  dateFin: string;
  motif?: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE' | 'ANNULEE';
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private CITOYEN_API = `${this.baseUrl}/api/citoyen/reservations`;
  private AGENT_API = `${this.baseUrl}/api/agent/agenda`;

  create(reservation: any): Observable<any> {
    return this.http.post<any>(this.CITOYEN_API, reservation);
  }

  getMine(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.CITOYEN_API}/mes-reservations`);
  }

  getReservations(): Observable<Reservation[]> {
    return this.getMine();
  }

  cancel(id: number): Observable<void> {
    return this.http.put<void>(`${this.CITOYEN_API}/${id}/annuler`, {});
  }

  getRendezVous(): Observable<Reservation[]> {
    return this.getMine();
  }

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.AGENT_API}/reservations`);
  }

  getAll(): Observable<Reservation[]> {
    return this.getAllReservations();
  }

  getPending(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.AGENT_API}/pending`);
  }

  getByStatus(status: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.AGENT_API}/reservations/status/${status}`);
  }

  updateStatus(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<any>(`${this.AGENT_API}/reservations/${id}/status`, {}, { params });
  }
}