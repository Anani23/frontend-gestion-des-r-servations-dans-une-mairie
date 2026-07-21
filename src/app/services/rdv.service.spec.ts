import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RdvService {

  rdvs: any[] = [];

  ajouterRdv(rdv: any) {
    this.rdvs.push({ ...rdv, statut: 'EN_ATTENTE' });
  }

  getRdvs() {
    return this.rdvs;
  }

  updateStatut(index: number, statut: string) {
    this.rdvs[index].statut = statut;
  }
}