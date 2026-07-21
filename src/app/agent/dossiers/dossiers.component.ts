// agent/dossiers/dossiers.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dossier } from '../../models/dossier.model';
import { DossiersService } from '../../services/dossiers.service';

const FILTER_QUERY_MAP: Record<string, Dossier['statut'] | 'TOUS'> = {
  all: 'TOUS',
  attente: 'EN_ATTENTE',
  cours: 'EN_COURS',
  valides: 'VALIDE',
  refuses: 'REJETE'
};

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dossiers.component.html',
  styleUrls: ['./dossiers.component.scss']
})
export class DossiersComponent implements OnInit {

  private dossiersService = inject(DossiersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  dossiers: Dossier[] = [];
  filteredDossiers: Dossier[] = [];
  pagedDossiers: Dossier[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  isLoading = true;
  selectedStatus: Dossier['statut'] | 'TOUS' = 'EN_ATTENTE';
  downloadingId: number | null = null;

  ngOnInit(): void {
    const filter = this.route.snapshot.queryParamMap.get('filter');
    if (filter && FILTER_QUERY_MAP[filter]) {
      this.selectedStatus = FILTER_QUERY_MAP[filter];
    }
    this.loadDossiers();
  }

  loadDossiers(): void {
    this.isLoading = true;
    console.log('🔍 Chargement des dossiers pour l\'agent...');
    
    this.dossiersService.getAllDossiers().subscribe({
      next: (data: Dossier[]) => {
        console.log('📋 Dossiers reçus:', data);
        this.dossiers = data ?? [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.isLoading = false;
        alert('Erreur lors du chargement des dossiers.');
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const search = this.searchText.toLowerCase().trim();
    
    this.filteredDossiers = this.dossiers.filter(d => {
      const nomCitoyen = (d.nomCitoyen ?? d.citoyen ?? '').toLowerCase();
      const prestation = (d.typePrestation ?? '').toLowerCase();
      const reference = (d.reference ?? d.numeroDossier ?? '').toLowerCase();
      
      const matchSearch = nomCitoyen.includes(search) || 
                         prestation.includes(search) || 
                         reference.includes(search);
      
      const matchStatus = this.selectedStatus === 'TOUS' || d.statut === this.selectedStatus;
      
      return matchSearch && matchStatus;
    });
    
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDossiers.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedDossiers = this.filteredDossiers.slice(start, start + this.pageSize);
  }

  changePage(step: number): void {
    const next = this.currentPage + step;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
      this.updatePagination();
    }
  }

  getPendingCount(): number {
    return this.dossiers.filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'EN_COURS').length;
  }

  getValidatedCount(): number {
    return this.dossiers.filter(d => d.statut === 'VALIDE').length;
  }

  getRejectedCount(): number {
    return this.dossiers.filter(d => d.statut === 'REJETE').length;
  }

  getBadgeClass(statut: Dossier['statut']): string {
    switch (statut) {
      case 'VALIDE': return 'status-validated';
      case 'REJETE': return 'status-rejected';
      case 'EN_COURS': return 'status-progress';
      default: return 'status-pending';
    }
  }

  getStatusText(statut: Dossier['statut']): string {
    switch (statut) {
      case 'VALIDE': return 'Validé';
      case 'REJETE': return 'Rejeté';
      case 'EN_COURS': return 'En cours';
      default: return 'En attente';
    }
  }

  getStatusIcon(statut: Dossier['statut']): string {
    switch (statut) {
      case 'VALIDE': return 'fa-regular fa-circle-check';
      case 'REJETE': return 'fa-solid fa-circle-xmark';
      case 'EN_COURS': return 'fa-regular fa-clock';
      default: return 'fa-regular fa-hourglass-half';
    }
  }

  getNomCitoyen(d: Dossier): string {
    return d.nomCitoyen ?? d.citoyen ?? 'Citoyen';
  }

  getReference(d: Dossier): string {
    return d.reference ?? d.numeroDossier ?? `DOS-${d.id}`;
  }

  getDetailsEntries(details: any): [string, any][] {
    if (!details) return [];
    return Object.entries(details);
  }

  peutIntervenir(statut: Dossier['statut']): boolean {
    return statut === 'EN_ATTENTE' || statut === 'EN_COURS';
  }

  valider(dossier: Dossier): void {
    if (!dossier.id) return;
    
    if (confirm(`Valider le dossier "${dossier.typePrestation}" ?`)) {
      this.dossiersService.validerDossier(dossier.id).subscribe({
        next: () => {
          alert('✓ Dossier validé !');
          this.loadDossiers();
        },
        error: (err) => console.error(err)
      });
    }
  }

  refuser(dossier: Dossier): void {
    if (!dossier.id) return;
    
    const motif = prompt('Motif du rejet :');
    if (!motif?.trim()) return;
    
    this.dossiersService.rejeterDossier(dossier.id, motif).subscribe({
      next: () => {
        alert('✓ Dossier rejeté.');
        this.loadDossiers();
      },
      error: (err) => console.error(err)
    });
  }

  filterByStatus(status: Dossier['statut'] | 'TOUS'): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  telecharger(pieceId: number | undefined, nom: string): void {
    if (!pieceId) return;
    this.downloadingId = pieceId;
    this.dossiersService.downloadPieceJointe(pieceId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nom || `piece-${pieceId}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloadingId = null;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur téléchargement pièce jointe:', err);
        this.downloadingId = null;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }
}