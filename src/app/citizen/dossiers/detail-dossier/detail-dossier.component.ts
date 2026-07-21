import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Dossier } from '../../../models/dossier.model';
import { DossiersService } from '../../../services/dossiers.service';

@Component({
  selector: 'app-detail-dossier',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail-dossier.component.html',
  styleUrls: ['./detail-dossier.component.scss']
})
export class DetailDossierComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private dossiersService = inject(DossiersService);
  private cdr = inject(ChangeDetectorRef);

  dossier: Dossier | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  downloadingId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.isLoading = false;
      this.errorMessage = 'Dossier introuvable.';
      return;
    }

    this.dossiersService.getDossierById(id).subscribe({
      next: (data) => {
        this.dossier = data;
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement dossier:', err);
        this.errorMessage = 'Impossible de charger ce dossier.';
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  getReference(): string {
    return this.dossier?.reference ?? this.dossier?.numeroDossier ?? `DOS-${this.dossier?.id}`;
  }

  isStepReached(step: 'depose' | 'examen' | 'decision'): boolean {
    if (!this.dossier) return false;
    const statut = this.dossier.statut;
    if (step === 'depose') return true;
    if (step === 'examen') return statut !== 'EN_ATTENTE';
    return statut === 'VALIDE' || statut === 'REJETE';
  }

  getStatusLabel(): string {
    switch (this.dossier?.statut) {
      case 'VALIDE': return 'Validé';
      case 'REJETE': return 'Rejeté';
      case 'EN_COURS': return 'En cours d\'examen';
      default: return 'En attente';
    }
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
