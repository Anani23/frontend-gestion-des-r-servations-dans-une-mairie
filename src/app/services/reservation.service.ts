import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Reservation {
  id: number;
  bien: string;
  image: string;
  date: string;
  heure: string;
  statut: 'EN ATTENTE' | 'CONFIRMÉ' | 'ANNULÉ';
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private storageKey = 'municipal_reservations';
  
  // Le BehaviorSubject permet à la liste de se mettre à jour toute seule
  private reservationsSubject = new BehaviorSubject<Reservation[]>(this.load());
  reservations$ = this.reservationsSubject.asObservable();

  private load(): Reservation[] {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : [];
  }

  ajouter(res: Reservation) {
    const current = [res, ...this.reservationsSubject.value];
    this.save(current);
  }

  private save(data: Reservation[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.reservationsSubject.next(data);
  }
}