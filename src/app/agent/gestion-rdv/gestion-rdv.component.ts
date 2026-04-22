import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../services/rdv.service';

@Component({
  selector: 'app-gestion-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-rdv.component.html',
  styleUrls: ['./gestion-rdv.component.scss']
})
export class GestionRdvComponent implements OnInit {
  private rdvService = inject(RdvService);

  rdvs: any[] = [];
  filteredRdvs: any[] = [];
  pagedRdvs: any[] = [];
  
  searchText = '';
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  ngOnInit() {
    this.rdvService.getRdvs().subscribe(data => {
      this.rdvs = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    const search = this.searchText.toLowerCase().trim();
    this.filteredRdvs = this.rdvs.filter(r =>
      r.nom.toLowerCase().includes(search) || r.service.toLowerCase().includes(search)
    );
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRdvs.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedRdvs = this.filteredRdvs.slice(start, start + this.pageSize);
  }

  changerStatut(id: number, statut: string) {
    this.rdvService.updateStatus(id, statut);
  }

  supprimer(id: number) {
    if(confirm("Supprimer ce rendez-vous ?")) {
      this.rdvService.supprimerRdv(id);
    }
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagination(); } }
  prevPage() { if (this.currentPage > 1) { this.currentPage--; this.updatePagination(); } }
}