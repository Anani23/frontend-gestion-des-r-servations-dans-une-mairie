import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DossiersService {

  dossiers: any[] = [
    { id: 1, citoyen: 'Jean', type: 'Acte de naissance', statut: 'EN ATTENTE' },
    { id: 2, citoyen: 'Alice', type: 'Certificat de résidence', statut: 'EN ATTENTE' },
    { id: 3, citoyen: 'Paul', type: 'Mariage', statut: 'EN ATTENTE' },
    { id: 4, citoyen: 'Marie', type: 'Carte nationale', statut: 'EN ATTENTE' }
  ];

  constructor() {}

  getDossiers() {
    return this.dossiers;
  }

  updateStatut(dossier: any, statut: string) {
    const d = this.dossiers.find(d => d.id === dossier.id);
    if (d) {
      d.statut = statut;
    }
  }
}