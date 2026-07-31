import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Rdv, RdvService, RdvStatut } from '../../services/rdv.service';
import { getFallbackImageByKeyword } from '../../shared/utils/image-fallback.util';

@Component({
  selector: 'app-mes-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mes-rdv.component.html',
  styleUrls: ['./mes-rdv.component.scss']
})
export class MesRdvComponent implements OnInit {
  private rdvService = inject(RdvService);
  private cdr = inject(ChangeDetectorRef);

  rdvs: Rdv[] = [];
  filteredRdvs: Rdv[] = [];
  searchText = '';
  loading = false;
  selectedRdv: Rdv | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.rdvService.getMesRdvs().subscribe({
      next: (data) => {
        this.rdvs = data || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const term = this.searchText.toLowerCase().trim();
    this.filteredRdvs = this.rdvs.filter(r => 
      (r.motif?.toLowerCase().includes(term)) || 
      (r.nomBien?.toLowerCase().includes(term))
    );
  }

  // Fonctions de formatage pour le HTML
  getStatusLabel(status: RdvStatut): string {
    const labels: Record<string, string> = {
      'CONFIRME': 'Confirmé',
      'EN_ATTENTE': 'En attente',
      'ANNULE': 'Annulé',
      'VALIDE': 'Validé'
    };
    return labels[status] || status;
  }

  getBadgeClass(status: RdvStatut): string {
    switch (status) {
      case 'CONFIRME': return 'badge-success';
      case 'VALIDE': return 'badge-success';
      case 'EN_ATTENTE': return 'badge-warning';
      case 'ANNULE': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  closeDetail(): void {
    this.selectedRdv = null;
  }

  annuler(rdv: Rdv): void {
    if (!rdv.id || !confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
    this.rdvService.annulerRdv(rdv.id).subscribe({
      next: () => {
        rdv.statut = 'ANNULE';
        this.applyFilter();
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => alert('Erreur lors de l\'annulation')
    });
  }

  getImageByMotif(motif?: string): string {
    return getFallbackImageByKeyword(motif);
  }
}