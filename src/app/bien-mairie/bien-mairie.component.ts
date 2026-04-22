import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';
import { Bien } from '../models/bien.model';
import { CategorieBien } from '../models/categorie-bien.model';
import { BienService } from '../services/bien.service';
import { CategorieBienService } from '../services/categorie-bien.service';

@Component({
  selector: 'app-bien-mairie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bien-mairie.component.html',
  styleUrls: ['./bien-mairie.component.scss']
})
export class BienMairieComponent implements OnInit {
  biens$!: Observable<Bien[]>;
  categories: CategorieBien[] = [];
  
  private categoryFilter$ = new BehaviorSubject<number | null>(null);
  private searchFilter$ = new BehaviorSubject<string>('');

  selectedCategorie: number | null = null;
  searchTerm = '';
  currentPage = 1;
  readonly pageSize = 6;
  selectedBien: Bien | null = null;

  constructor(
    private router: Router,
    private bienService: BienService,
    private categorieBienService: CategorieBienService
  ) {}

  ngOnInit(): void {
    // Chargement des catégories depuis le service
    this.categorieBienService.getTreeCategories().subscribe(data => this.categories = data);

    // Pipeline réactif pour le filtrage
    this.biens$ = combineLatest([
      this.bienService.getBiens().pipe(startWith([])),
      this.categoryFilter$,
      this.searchFilter$
    ]).pipe(
      map(([biens, catId, search]) => {
        return biens.filter(b => {
          const matchesCat = catId === null || Number(b.categorieId) === Number(catId);
          const matchesSearch = b.nom.toLowerCase().includes(search.toLowerCase()) ||
                                (b.lieu || '').toLowerCase().includes(search.toLowerCase());
          return matchesCat && matchesSearch;
        });
      })
    );
  }

  filterByCategorie(id: number | null): void {
    this.selectedCategorie = id;
    this.currentPage = 1;
    this.categoryFilter$.next(id);
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.searchFilter$.next(term);
  }

  // Logique de pagination
  getPaginatedItems(list: Bien[]): Bien[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  getTotalPages(list: Bien[]): number {
    return Math.ceil(list.length / this.pageSize) || 1;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getCategorieNom(id: number): string {
    return this.categories.find(c => Number(c.id) === Number(id))?.nom || 'Espace Public';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/mairie-centrale.jpg';
  }

  voirDetails(bien: Bien): void { this.selectedBien = bien; }
  fermerDetails(): void { this.selectedBien = null; }

  reserver(bien: Bien): void {
    this.router.navigate(['/citizen/create-reservation'], {
      queryParams: { bienId: bien.id, nomEspace: bien.nom }
    });
  }
}