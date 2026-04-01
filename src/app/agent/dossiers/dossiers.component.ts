import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  dossiers: any[] = [];
  filteredDossiers: any[] = [];
  pagedDossiers: any[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private dossiersService: DossiersService) {}

  ngOnInit(): void {
    this.dossiers = this.dossiersService.getDossiers();
    this.filteredDossiers = [...this.dossiers];
    this.totalPages = Math.ceil(this.filteredDossiers.length / this.pageSize);
    this.updatePaged();
  }

  applyFilter() {
    const search = this.searchText.toLowerCase();
    this.filteredDossiers = this.dossiers.filter(d =>
      d.citoyen.toLowerCase().includes(search) ||
      d.type.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredDossiers.length / this.pageSize);
    this.updatePaged();
  }

  updatePaged() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedDossiers = this.filteredDossiers.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaged();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaged();
    }
  }

  valider(dossier: any) {
    this.dossiersService.updateStatut(dossier, 'VALIDÉ');
    dossier.statut = 'VALIDÉ';
  }

  refuser(dossier: any) {
    this.dossiersService.updateStatut(dossier, 'REFUSÉ');
    dossier.statut = 'REFUSÉ';
  }

}