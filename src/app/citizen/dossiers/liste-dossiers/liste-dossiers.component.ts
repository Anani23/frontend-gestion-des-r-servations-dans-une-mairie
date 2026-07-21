import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { DossiersService } from '../../../services/dossiers.service';
import { Dossier } from '../../../models/dossier.model';

@Component({
  selector: 'app-liste-dossiers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-dossiers.component.html',
  styleUrls: ['./liste-dossiers.component.scss']
})
export class ListeDossiersComponent implements OnInit {

  private authService = inject(AuthService);
  private dossiersService = inject(DossiersService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  dossiers: Dossier[] = [];
  filteredDossiers: Dossier[] = [];
  page = 1;
  pageSize = 6;
  isLoading = true;
  searchTerm = '';

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.dossiersService.getMesDossiers().subscribe({
      next: (data) => {
        console.log('Dossiers reçus:', data);
        this.dossiers = data || [];
        this.filteredDossiers = [...this.dossiers];
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des dossiers:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  filterDossiers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredDossiers = [...this.dossiers];
      this.page = 1;
      return;
    }
    
    this.filteredDossiers = this.dossiers.filter(dossier => {
      return (
        (dossier.typePrestation && dossier.typePrestation.toLowerCase().includes(term)) ||
        (dossier.reference && dossier.reference.toLowerCase().includes(term)) ||
        (dossier.numeroDossier && dossier.numeroDossier.toLowerCase().includes(term)) ||
        (dossier.description && dossier.description.toLowerCase().includes(term)) ||
        (dossier.statut && dossier.statut.toLowerCase().includes(term)) ||
        (dossier.id && dossier.id.toString().includes(term))
      );
    });
    this.page = 1;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDossiers = [...this.dossiers];
    this.page = 1;
  }

  get paginatedDossiers(): Dossier[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredDossiers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredDossiers.length / this.pageSize) || 1;
  }

  get totalResults(): number {
    return this.filteredDossiers.length;
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  viewDetails(id?: number) {
    if (id) {
      this.router.navigate(['/citizen/dossiers', id]);
    }
  }

  payerDossier(dossier: Dossier): void {
    this.router.navigate(['/citizen/payment'], {
      queryParams: {
        dossierId: dossier.id,
        description: 'Frais de dossier - ' + (dossier.typePrestation || dossier.reference)
      }
    });
  }

  planifierRdvPourDossier(dossier: Dossier) {
    if (dossier?.id) {
      this.router.navigate(
        ['/citizen/rdv/nouveau'],
        {
          queryParams: {
            dossierId: dossier.id,
            prestation: dossier.typePrestation
          }
        }
      );
    }
  }

  getBadgeClass(statut?: string): string {
    if (!statut) return 'badge-waiting';
    
    switch (statut.toUpperCase()) {
      case 'VALIDE': return 'badge-success';
      case 'REJETE': return 'badge-danger';
      case 'EN_COURS': return 'badge-info';
      case 'ANNULE': return 'badge-secondary';
      default: return 'badge-waiting';
    }
  }

  formatStatut(statut?: string): string {
    if (!statut) return 'En attente';
    const text = statut.replace('_', ' ').toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  getStatusIcon(statut?: string): string {
    if (!statut) return 'fa-regular fa-clock';
    
    switch (statut.toUpperCase()) {
      case 'VALIDE': return 'fa-regular fa-circle-check';
      case 'REJETE': return 'fa-solid fa-circle-xmark';
      case 'EN_COURS': return 'fa-solid fa-spinner fa-pulse';
      default: return 'fa-regular fa-hourglass-half';
    }
  }

  getStatusColor(statut?: string): string {
    if (!statut) return '#f59e0b';
    
    switch (statut.toUpperCase()) {
      case 'VALIDE': return '#10b981';
      case 'REJETE': return '#ef4444';
      case 'EN_COURS': return '#3b82f6';
      default: return '#f59e0b';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'Date non disponible';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}