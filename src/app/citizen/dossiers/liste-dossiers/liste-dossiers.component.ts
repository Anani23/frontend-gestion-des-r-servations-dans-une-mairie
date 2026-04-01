import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-liste-dossiers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-dossiers.component.html',
  styleUrls: ['./liste-dossiers.component.scss']
})
export class ListeDossiersComponent {

  dossiers = [
    { id: 1, type: 'Acte de naissance', statut: 'En cours' },
    { id: 2, type: 'Certificat de résidence', statut: 'Validé' },
    { id: 3, type: 'Permis de construire', statut: 'Refusé' },
    { id: 4, type: 'Attestation fiscale', statut: 'En cours' },
    { id: 5, type: 'Certificat de mariage', statut: 'Validé' }
  ];

  page = 1;
  pageSize = 3;

  // 🔹 Expose Math.ceil pour le template
  Math = Math;

  get paginatedDossiers() {
    const start = (this.page - 1) * this.pageSize;
    return this.dossiers.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.page * this.pageSize) < this.dossiers.length) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  getBadgeClass(statut: string) {
    switch(statut) {
      case 'Validé': return 'badge-valid';
      case 'En cours': return 'badge-pending';
      case 'Refusé': return 'badge-refused';
      default: return '';
    }
  }
}