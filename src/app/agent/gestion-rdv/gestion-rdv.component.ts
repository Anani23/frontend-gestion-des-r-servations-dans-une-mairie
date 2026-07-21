import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Rdv, RdvService, RdvStatut } from '../../services/rdv.service';

@Component({
  selector: 'app-gestion-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-rdv.component.html',
  styleUrls: ['./gestion-rdv.component.scss']
})
export class GestionRdvComponent implements OnInit {
  private rdvService = inject(RdvService);

  rdvs: Rdv[] = [];
  filteredRdvs: Rdv[] = [];
  pagedRdvs: Rdv[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  isLoading = true;

  ngOnInit(): void {
    this.loadRdvs();
  }

  loadRdvs(): void {
    this.isLoading = true;
    this.rdvService.getAllRdvs().subscribe({
      next: (data) => {
        this.rdvs = data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement RDV:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredRdvs = this.rdvs.filter(r => 
      r.nomCitoyen?.toLowerCase().includes(search) || 
      r.motif?.toLowerCase().includes(search) ||
      r.nomBien?.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRdvs.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedRdvs = this.filteredRdvs.slice(start, start + this.pageSize);
  }

  getPendingCount(): number {
    return this.rdvs.filter(r => r.statut === 'EN_ATTENTE').length;
  }

  getConfirmedCount(): number {
    return this.rdvs.filter(r => r.statut === 'CONFIRME' || r.statut === 'VALIDE').length;
  }

  getCancelledCount(): number {
    return this.rdvs.filter(r => r.statut === 'ANNULE').length;
  }

  confirmer(id?: number): void {
    if (!id) return;
    if (confirm('Confirmer ce rendez-vous ?')) {
      this.rdvService.confirmerRdv(id).subscribe({
        next: () => {
          const rdv = this.rdvs.find(r => r.id === id);
          if (rdv) rdv.statut = 'CONFIRME';
          this.updatePagination();
        },
        error: (err) => {
          console.error('Erreur confirmation:', err);
          alert('Erreur lors de la confirmation');
        }
      });
    }
  }

  annuler(id?: number): void {
    if (!id) return;
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;
    
    this.rdvService.annulerRdv(id).subscribe({
      next: () => {
        const rdv = this.rdvs.find(r => r.id === id);
        if (rdv) rdv.statut = 'ANNULE';
        this.updatePagination();
      },
      error: (err) => {
        console.error('Erreur annulation:', err);
        alert('Erreur lors de l\'annulation');
      }
    });
  }

  getStatusClass(statut: RdvStatut): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'status-pending';
      case 'CONFIRME': return 'status-success';
      case 'VALIDE': return 'status-success';
      case 'ANNULE': return 'status-danger';
      default: return 'status-default';
    }
  }

  getStatusText(statut: RdvStatut): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'CONFIRME': return 'Confirmé';
      case 'VALIDE': return 'Validé';
      case 'ANNULE': return 'Annulé';
      default: return 'Inconnu';
    }
  }

  getStatusIcon(statut: RdvStatut): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'fa-regular fa-hourglass-half';
      case 'CONFIRME': return 'fa-regular fa-circle-check';
      case 'VALIDE': return 'fa-regular fa-circle-check';
      case 'ANNULE': return 'fa-solid fa-circle-xmark';
      default: return 'fa-regular fa-question-circle';
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}