import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  rdvs: any[] = [];
  filteredRdvs: any[] = [];
  pagedRdvs: any[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  sortField: string = 'nom';
  sortDesc: boolean = false;

  constructor(private rdvService: RdvService) {}

  ngOnInit() {
    this.rdvs = this.rdvService.getRdvs();
    this.filteredRdvs = [...this.rdvs];
    this.totalPages = Math.ceil(this.filteredRdvs.length / this.pageSize);
    this.updatePaged();
  }

  applyFilter() {
    const search = this.searchText.toLowerCase();
    this.filteredRdvs = this.rdvs.filter(r =>
      r.nom.toLowerCase().includes(search) ||
      r.service.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredRdvs.length / this.pageSize);
    this.updatePaged();
  }

  sortColumn(field: string) {
    if (this.sortField === field) this.sortDesc = !this.sortDesc;
    else { this.sortField = field; this.sortDesc = false; }

    this.filteredRdvs.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (valA < valB) return this.sortDesc ? 1 : -1;
      if (valA > valB) return this.sortDesc ? -1 : 1;
      return 0;
    });

    this.updatePaged();
  }

  updatePaged() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRdvs = this.filteredRdvs.slice(start, end);
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

  valider(i: number) {
    const index = (this.currentPage - 1) * this.pageSize + i;
    this.rdvService.updateStatut(index, 'VALIDÉ');
    this.rdvs[index].status = 'VALIDÉ';
    this.updatePaged();
  }

  refuser(i: number) {
    const index = (this.currentPage - 1) * this.pageSize + i;
    this.rdvService.updateStatut(index, 'REFUSÉ');
    this.rdvs[index].status = 'REFUSÉ';
    this.updatePaged();
  }

}