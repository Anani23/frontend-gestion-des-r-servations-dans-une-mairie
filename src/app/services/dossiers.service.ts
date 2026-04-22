// ✅ CORRECT
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Import 'of' to simulate an API stream

@Injectable({ providedIn: 'root' })
export class DossiersService {
  private dossiers = [
    { id: 1, citoyen: 'Jean Dupont', type: 'Demande CNI', date: new Date(), description: '...', statut: 'EN ATTENTE' },
    // ... tes données initiales
  ];

  getDossiersObservable(): Observable<any[]> {
    return of(this.dossiers);
  }

  // MÉTHODE DE LIEN : Ajoute le dossier soumis par le citoyen
  ajouterDossier(dossier: any): Observable<boolean> {
    this.dossiers.unshift(dossier); // Ajoute au début de la liste
    return of(true);
  }

  updateStatut(id: number, statut: string, motif?: string): Observable<boolean> {
    const dossier = this.dossiers.find(d => d.id === id);
    if (dossier) { dossier.statut = statut; }
    return of(true);
  }
}