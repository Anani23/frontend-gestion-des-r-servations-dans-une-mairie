import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../../../services/auth.service';
import { BienService } from '../../../services/bien.service';
import { CategorieBienService } from '../../../services/categorie-bien.service';
import { ServiceService } from '../../../services/service.service';
import { getFallbackImageByKeyword } from '../../../shared/utils/image-fallback.util';

const PREVIEW_COUNT = 6;

@Component({
  selector: 'app-page-accueil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './page-accueil.component.html',
  styleUrls: ['./page-accueil.component.scss']
})
export class PageAccueilComponent implements OnInit {

  private catService = inject(CategorieBienService);
  private bienService = inject(BienService);
  private serviceService = inject(ServiceService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  public authService = inject(AuthService);

  categories: any[] = [];
  services: any[] = [];
  biens: any[] = [];
  isLoading = true;
  heroSearchTerm = '';
  readonly skeletonSlots = Array(PREVIEW_COUNT).fill(0);

  // Statistiques calculees a partir des vraies donnees chargees depuis l'API
  // (plus de chiffres fictifs codes en dur).
  stats: { label: string; value: string; icon: string }[] = [];

  ngOnInit(): void {
    this.loadMairieData();
  }

  getStatIcon(label: string): string {
    const icons: { [key: string]: string } = {
      'Services Publics': 'fa-solid fa-file-alt',
      'Biens Recensés': 'fa-solid fa-building',
      'Catégories': 'fa-solid fa-layer-group'
    };
    return icons[label] || 'fa-solid fa-chart-line';
  }

  loadMairieData(): void {
    this.isLoading = true;

    forkJoin({
      cats: this.catService.getTreeCategories().pipe(
        map((cats: any[]) => {
          return cats.map(cat => ({
            ...cat,
            image: cat.image || getFallbackImageByKeyword(cat.nom)
          }));
        }),
        catchError(err => {
          console.error('Erreur catégories', err);
          return of([]);
        })
      ),
      servs: this.serviceService.getServicesPublics().pipe(
        map((items: any[]) => (items || [])
          .filter(s => s.actif !== false)
          .map(s => ({
            ...s,
            image: s.imageUrl || s.image || getFallbackImageByKeyword(s.nom || s.categorieNom)
          }))),
        catchError(err => {
          console.error('Erreur services', err);
          return of([]);
        })
      ),
      biensData: this.bienService.getBiensDisponibles().pipe(
        map((items: any[]) => {
          return items.map(item => ({
            ...item,
            image: item.imageUrl || item.image || getFallbackImageByKeyword(item.nom),
            alt: item.nom || 'Image mairie'
          }));
        }),
        catchError(err => {
          console.error('Erreur biens', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (res: any) => {
        this.categories = res.cats || [];
        const allServices = res.servs || [];
        const allBiens = res.biensData || [];
        this.services = allServices.slice(0, PREVIEW_COUNT);
        this.biens = allBiens.slice(0, PREVIEW_COUNT);

        this.stats = [
          { label: 'Services Publics', value: String(allServices.length), icon: 'fa-solid fa-file-alt' },
          { label: 'Biens Recensés', value: String(allBiens.length), icon: 'fa-solid fa-building' },
          { label: 'Catégories', value: String(this.categories.length), icon: 'fa-solid fa-layer-group' }
        ];

        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  getRepeatedImages(): any[] {
    return this.biens.length ? [...this.biens, ...this.biens] : [];
  }

  getRepeatedCategories(): any[] {
    return this.categories.length ? [...this.categories, ...this.categories] : [];
  }

  /**
   * Durée de l'animation proportionnelle au nombre de catégories : évite un défilement
   * trop rapide/saccadé quand il n'y a que peu de cartes, et trop lent quand il y en a beaucoup.
   */
  getMarqueeDuration(): number {
    return Math.max(20, this.categories.length * 6);
  }

  trackByLabel(index: number, item: any): string {
    return item.label;
  }

  onImgError(event: any, nom?: string): void {
    event.target.src = getFallbackImageByKeyword(nom);
  }

  onHeroSearch(): void {
    const term = this.heroSearchTerm.trim();
    this.router.navigate(['/services'], term ? { queryParams: { q: term } } : {});
  }

  scrollToContent(): void {
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  }
}
