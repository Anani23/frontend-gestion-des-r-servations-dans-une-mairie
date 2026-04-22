import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
  // Liste initiale de test
  private initialRdvs = [
    { id: 1, nom: 'Ajavon Koffi', service: 'État Civil', date: '2026-04-20T10:00:00', status: 'Confirmé' },
    { id: 2, nom: 'Amegan Marie', service: 'Urbanisme', date: '2026-04-21T14:30:00', status: 'En attente' }
  ];

  private rdvsSubject = new BehaviorSubject<any[]>(this.initialRdvs);

  // Récupérer la liste (pour l'agent et le citoyen)
  getRdvs(): Observable<any[]> {
    return this.rdvsSubject.asObservable();
  }

  // Ajouter un RDV (utilisé par le citoyen)
  ajouterRdv(rdv: any) {
    const currentRdvs = this.rdvsSubject.value;
    const newRdv = { ...rdv, id: Date.now(), status: 'En attente' };
    this.rdvsSubject.next([...currentRdvs, newRdv]);
  }

  // Mettre à jour (utilisé par l'agent)
  updateStatus(id: number, newStatus: string) {
    const currentRdvs = this.rdvsSubject.value.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    );
    this.rdvsSubject.next(currentRdvs);
  }

  // Supprimer
  supprimerRdv(id: number) {
    const filtered = this.rdvsSubject.value.filter(r => r.id !== id);
    this.rdvsSubject.next(filtered);
  }
}