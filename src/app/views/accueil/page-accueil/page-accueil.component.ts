import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from '../../../services/auth.service';
import { BienService } from '../../../services/bien.service';
import { CategorieBienService } from '../../../services/categorie-bien.service';
import { ServiceService } from '../../../services/service.service';

const PREVIEW_COUNT = 6;

@Component({
  selector: 'app-page-accueil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './page-accueil.component.html',
  styleUrls: ['./page-accueil.component.scss']
})
export class PageAccueilComponent implements OnInit {

  private catService = inject(CategorieBienService);
  private bienService = inject(BienService);
  private serviceService = inject(ServiceService);
  private cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService);

  categories: any[] = [];
  services: any[] = [];
  biens: any[] = [];
  isLoading = true;

  stats = [
    { label: 'Services Publics', value: '24+', icon: 'fa-solid fa-file-alt' },
    { label: 'Biens Recensés', value: '1,250', icon: 'fa-solid fa-building' },
    { label: 'Agents Actifs', value: '85', icon: 'fa-solid fa-users' },
    { label: 'Satisfaction', value: '98%', icon: 'fa-solid fa-star' }
  ];

  // Avis de citoyens affichés sur la page d'accueil (contenu éditorial statique).
  testimonials = [
    {
      nom: 'Akouvi M.',
      quartier: 'Agoè-Nyivé',
      note: 5,
      texte: "J'ai réservé la salle des fêtes pour un mariage en quelques minutes, tout s'est fait en ligne sans me déplacer. Un vrai gain de temps."
    },
    {
      nom: 'Komla A.',
      quartier: 'Bè',
      note: 5,
      texte: "Ma demande d'acte administratif a été traitée rapidement grâce au suivi de dossier en ligne. Je recommande la plateforme."
    },
    {
      nom: 'Essi T.',
      quartier: 'Tokoin',
      note: 4,
      texte: "Le paiement en ligne est pratique et sécurisé. J'ai pu régler ma redevance depuis mon téléphone sans passer au guichet."
    }
  ];

  ngOnInit(): void {
    this.loadMairieData();
  }

  getStatIcon(label: string): string {
    const icons: { [key: string]: string } = {
      'Services Publics': 'fa-solid fa-file-alt',
      'Biens Recensés': 'fa-solid fa-building',
      'Agents Actifs': 'fa-solid fa-users',
      'Satisfaction': 'fa-solid fa-star'
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
            image: cat.image || 'assets/images/mairie-centrale.jpg'
          }));
        }),
        catchError(err => {
          console.error('Erreur catégories', err);
          return of([]);
        })
      ),
      servs: this.serviceService.getServicesPublics().pipe(
        map((items: any[]) => (items || []).filter(s => s.actif !== false)),
        catchError(err => {
          console.error('Erreur services', err);
          return of([]);
        })
      ),
      biensData: this.bienService.getBiensDisponibles().pipe(
        map((items: any[]) => {
          return items.map(item => ({
            ...item,
            image: item.imageUrl || item.image || 'assets/images/mairie-centrale.jpg',
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
        this.services = (res.servs || []).slice(0, PREVIEW_COUNT);
        this.biens = (res.biensData || []).slice(0, PREVIEW_COUNT);
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

  getStars(note: number): number[] {
    return Array(5).fill(0).map((_, i) => i < note ? 1 : 0);
  }

  trackByNom(index: number, item: any): string {
    return item.nom;
  }

  trackByLabel(index: number, item: any): string {
    return item.label;
  }

  onImgError(event: any): void {
    event.target.src = 'assets/images/mairie-centrale.jpg';
  }
}
