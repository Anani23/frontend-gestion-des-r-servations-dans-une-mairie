import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liste-dossiers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liste-dossiers.component.html',
  styleUrls: ['./liste-dossiers.component.scss']
})
export class ListeDossiersComponent implements OnInit {

  dossiers = [
    { id: 101, type: 'Acte de naissance', statut: 'En cours', dateUpdate: new Date(2026, 3, 5) },
    { id: 102, type: 'Certificat de résidence', statut: 'Validé', dateUpdate: new Date(2026, 3, 2) },
    { id: 103, type: 'Permis de construire', statut: 'Refusé', dateUpdate: new Date(2026, 2, 28) },
    { id: 104, type: 'Attestation fiscale', statut: 'En cours', dateUpdate: new Date(2026, 3, 8) },
    { id: 105, type: 'Certificat de mariage', statut: 'Validé', dateUpdate: new Date(2026, 3, 1) },
    { id: 106, type: 'Passeport municipal', statut: 'En cours', dateUpdate: new Date(2026, 3, 9) }
  ];

  page = 1;
  pageSize = 4; 
  totalPages = 0;

  ngOnInit() {
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.dossiers.length / this.pageSize) || 1;
  }

  get paginatedDossiers() {
    const start = (this.page - 1) * this.pageSize;
    return this.dossiers.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  getBadgeClass(statut: string): string {
    const statusMap: { [key: string]: string } = {
      'Validé': 'badge-valid',
      'En cours': 'badge-pending',
      'Refusé': 'badge-refused'
    };
    return statusMap[statut] || '';
  }

  viewDetails(id: number) {
    // Logique future : Navigation vers /citizen/dossier/101
    console.log("Détails du dossier:", id);
  }
}