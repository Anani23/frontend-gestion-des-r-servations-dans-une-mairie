import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Categorie } from '../../models/categorie.model';
import { BienService } from '../../services/bien.service';
import { CategorieBienService } from '../../services/categorie-bien.service';

interface MoyenPaiement {
  code: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-create-bien',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-bien.component.html',
  styleUrls: ['./create-bien.component.scss']
})
export class CreateBienComponent implements OnInit {

  private bienService = inject(BienService);
  private catService = inject(CategorieBienService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  categories: Categorie[] = [];
  isLoading = false;
  isEditing = false;
  bienId?: number;

  moyensPaiementDisponibles: MoyenPaiement[] = [
    { code: 'MIXX_YAS', label: 'Mixx Yas', icon: '💳' },
    { code: 'MOOV_MONEY', label: 'Moov Money', icon: '📱' },
    { code: 'TMONEY', label: 'T-Money', icon: '💰' },
    { code: 'CASH', label: 'Espèces', icon: '💵' },
    { code: 'CARD', label: 'Carte bancaire', icon: '🏧' }
  ];

  selectedMoyens: Set<string> = new Set();

  newBien = {
    nom: '',
    description: '',
    localisation: '',
    prixLocation: 0,
    categorieId: null as number | null,
    disponible: true,
    moyensPaiement: ''
  };

  ngOnInit(): void {
    this.loadCategories();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBien(+id);
      }
    });
  }

  loadCategories(): void {
    this.catService.getTreeCategories().subscribe({
      next: (data: Categorie[]) => {
        // ⚠️ uniquement BIENS
        this.categories = data.filter(c => c.type === 'biens');
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur categories:', err);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  getCategorieLabel(id: number | null): string {
    if (!id) return '';
    return this.categories.find(c => c.id === id)?.nom || '';
  }

  toggleMoyen(code: string): void {
    if (this.selectedMoyens.has(code)) {
      this.selectedMoyens.delete(code);
    } else {
      this.selectedMoyens.add(code);
    }
    this.newBien.moyensPaiement = Array.from(this.selectedMoyens).join(',');
  }

  isMoyenSelected(code: string): boolean {
    return this.selectedMoyens.has(code);
  }

  private loadBien(id: number): void {
    this.bienService.getBienById(id).subscribe({
      next: (bien: any) => {
        this.isEditing = true;
        this.bienId = bien.id;
        this.newBien = {
          nom: bien.nom || '',
          description: bien.description || '',
          localisation: bien.localisation || '',
          prixLocation: bien.prixLocation || 0,
          categorieId: bien.categorieId ?? null,
          disponible: bien.disponible ?? true,
          moyensPaiement: bien.moyensPaiement || ''
        };
        this.selectedMoyens = new Set(
          (bien.moyensPaiement || '').split(',').map((m: string) => m.trim()).filter(Boolean)
        );
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erreur chargement bien:', err);
        alert('Impossible de charger ce bien pour modification');
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.newBien.nom || !this.newBien.categorieId) {
      alert('Champs obligatoires manquants');
      return;
    }

    this.isLoading = true;

    const operation = this.isEditing && this.bienId
      ? this.bienService.modifierBien(this.bienId, this.newBien)
      : this.bienService.ajouterBien(this.newBien);

    operation.subscribe({
      next: () => {
        alert(this.isEditing ? 'Bien modifié avec succès' : 'Bien créé avec succès');
        this.reset();
        this.router.navigate(['/admin/biens']);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        alert(this.isEditing ? 'Erreur modification du bien' : 'Erreur création bien');
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  reset(): void {
    this.isEditing = false;
    this.bienId = undefined;
    this.selectedMoyens = new Set();
    this.newBien = {
      nom: '',
      description: '',
      localisation: '',
      prixLocation: 0,
      categorieId: null,
      disponible: true,
      moyensPaiement: ''
    };
  }
}
