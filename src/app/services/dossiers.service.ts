import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DossiersService {

  private dossiers = [
    { citoyen: 'Jean Dupont', type: 'Demande CNI', date: new Date('2026-03-20'), description: 'Nouvelle carte nationale', statut: 'En attente' },
    { citoyen: 'Marie Curie', type: 'Permis de construire', date: new Date('2026-03-21'), description: 'Maison R+1', statut: 'En attente' },
    { citoyen: 'Paul Martin', type: 'Certificat de résidence', date: new Date('2026-03-22'), description: 'Attestation pour banque', statut: 'En attente' },
    { citoyen: 'Sophie Leroy', type: 'Demande CNI', date: new Date('2026-03-23'), description: 'Renouvellement', statut: 'En attente' },
    { citoyen: 'Ali Toure', type: 'Permis de construire', date: new Date('2026-03-24'), description: 'Petit commerce', statut: 'En attente' }
  ];

  constructor() { }

  getDossiers(): any[] {
    return this.dossiers;
  }

  updateStatut(dossier: any, statut: string) {
    const index = this.dossiers.indexOf(dossier);
    if (index > -1) {
      this.dossiers[index].statut = statut;
    }
  }
}