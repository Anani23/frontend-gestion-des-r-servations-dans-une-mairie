import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Bien } from '../../models/bien.model';
import { Categorie } from '../../models/categorie-bien.model';
import { BienService } from '../../services/bien.service';
import { CategorieBienService } from '../../services/categorie-bien.service';

@Component({
  selector: 'app-list-bien',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-bien.component.html',
  styleUrls: ['./list-bien.component.scss']
})
export class ListBienComponent implements OnInit {
  private bienService = inject(BienService);
  private catService = inject(CategorieBienService);
  private cdr = inject(ChangeDetectorRef);

  biens: Bien[] = [];
  categories: Categorie[] = [];

  searchTerm = '';
  selectedCat: number | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // Charger les catégories avec filtrage pour exclure les "services"
    this.catService.getTreeCategories().subscribe({
      next: (data: Categorie[]) => {
        // Correction de l'erreur TS2367 : on convertit en minuscule pour comparer sans risque
        this.categories = (data ?? []).filter(c => {
          const typeLower = c.type?.toLowerCase();
          return typeLower === 'bien' || typeLower === 'biens' || !c.nom.toLowerCase().includes('service');
        });
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur API Catégories', err)
    });

    // Charger les biens
    this.bienService.getBiens().subscribe({
      next: (data: Bien[]) => {
        this.biens = data ?? [];
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API Biens', err);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  filterCat(id: number | null | undefined): void {
    this.selectedCat = id ?? null;
  }

  getFiltered(): Bien[] {
    const t = this.searchTerm.toLowerCase().trim();
    return this.biens.filter(b => {
      const matchCat = this.selectedCat === null || b.categorieId === this.selectedCat;
      const matchSearch = !t || b.nom?.toLowerCase().includes(t) || b.localisation?.toLowerCase().includes(t);
      return matchCat && matchSearch;
    });
  }

  getCatNom(id: number | undefined): string {
    if (!id) return 'Patrimoine Municipal';
    const cat = this.categories.find(c => c.id === id);
    return cat ? cat.nom : 'Infrastructure';
  }

  getImg(b: Bien): string {
    if (b.images && b.images.length > 0) {
      const img = b.images[0];
      return (img.startsWith('data:') || img.startsWith('http')) ? img : `assets/images/${img}`;
    }
    return 'assets/images/mairie-togo.jpg';
  }

  onImgErr(event: any): void {
    event.target.src = 'assets/images/mairie-togo.jpg';
  }

  supprimer(id: number | undefined): void {
    if (!id || !confirm("Voulez-vous vraiment retirer ce bien du répertoire municipal ?")) return;
    this.bienService.supprimerBien(id).subscribe({
      next: () => {
        this.biens = this.biens.filter(b => b.id !== id);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => alert("Erreur lors de la suppression")
    });
  }
}