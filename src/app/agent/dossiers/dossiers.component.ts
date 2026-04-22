import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DossiersService } from '../../services/dossiers.service';

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dossiers.component.html',
  styleUrls: ['./dossiers.component.scss']
})
export class DossiersComponent implements OnInit {
  // Utilisation de inject() pour une injection plus stable
  private dossiersService = inject(DossiersService);

  dossiers: any[] = [];
  filteredDossiers: any[] = [];
  pagedDossiers: any[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  isLoading = true;

  ngOnInit(): void {
    this.loadDossiers();
  }

  loadDossiers() {
    this.isLoading = true;
    this.dossiersService.getDossiersObservable().subscribe({
      next: (data) => {
        this.dossiers = data.map(d => ({
          ...d,
          statutKey: d.statut.toLowerCase().replace(/\s/g, '-')
        }));
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  applyFilter() {
    const search = this.searchText.toLowerCase().trim();
    this.filteredDossiers = this.dossiers.filter(d =>
      d.citoyen.toLowerCase().includes(search) ||
      d.serviceNom?.toLowerCase().includes(search) ||
      d.type.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredDossiers.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedDossiers = this.filteredDossiers.slice(start, start + this.pageSize);
  }

  changePage(step: number) {
    this.currentPage += step;
    this.updatePagination();
  }

  valider(dossier: any) {
    if (confirm(`Confirmer la validation du dossier de ${dossier.citoyen} ?`)) {
      this.dossiersService.updateStatut(dossier.id, 'VALIDÉ').subscribe(() => {
        dossier.statut = 'VALIDÉ';
        dossier.statutKey = 'validé';
      });
    }
  }

  refuser(dossier: any) {
    const motif = prompt("Indiquez le motif du refus :");
    if (motif) {
      this.dossiersService.updateStatut(dossier.id, 'REFUSÉ', motif).subscribe(() => {
        dossier.statut = 'REFUSÉ';
        dossier.statutKey = 'refusé';
      });
    }
  }

  // Fonction pour afficher les détails spécifiques envoyés par le citoyen
  getDetailsList(details: any) {
    return details ? Object.entries(details) : [];
  }
}