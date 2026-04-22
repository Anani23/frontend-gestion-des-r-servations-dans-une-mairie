import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Bien } from '../../models/bien.model';
import { CategorieBien } from '../../models/categorie-bien.model';
import { BienService } from '../../services/bien.service';
import { CategorieBienService } from '../../services/categorie-bien.service';

@Component({
  selector: 'app-list-bien', // Adjusted to match folder name
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-bien.component.html', // FIX: Matches your HTML file name
  styleUrls: ['./list-bien.component.scss']
})
export class ListBienComponent implements OnInit { // Renamed for consistency
  biens: Bien[] = [];
  categories: CategorieBien[] = [];
  searchTerm = '';
  selectedCat: number | null = null;

  constructor(
    private bienService: BienService,
    private catService: CategorieBienService 
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // FIX: Added explicit types to prevent 'any' errors
    this.bienService.getBiens().subscribe((data: Bien[]) => this.biens = data);
    
    this.catService.getSousCategories(1).subscribe((data: CategorieBien[]) => {
      this.categories = data;
    });
  }

  filterCat(id: number | null): void {
    this.selectedCat = id;
  }

  getFiltered(): Bien[] {
    return this.biens.filter(b => {
      const matchCat = this.selectedCat === null || b.categorieId === this.selectedCat;
      const t = this.searchTerm.toLowerCase();
      const matchSearch = !t || b.nom.toLowerCase().includes(t) || (b.lieu && b.lieu.toLowerCase().includes(t));
      return matchCat && matchSearch;
    });
  }

  getCatNom(id: number): string {
    return this.categories.find(c => c.id === id)?.nom || 'Patrimoine';
  }

  getImg(b: Bien): string {
    if (b.images && b.images.length > 0) {
      const img = b.images[0];
      return img.startsWith('data:') || img.startsWith('http') ? img : `assets/images/${img}`;
    }
    return 'assets/images/mairie-togo.jpg'; // Using a verified filename from your assets
  }

  onImgErr(event: any): void {
    event.target.src = 'assets/images/mairie-togo.jpg';
  }

  supprimer(id: number): void {
    if (confirm('Voulez-vous vraiment retirer ce bien de l\'inventaire municipal ?')) {
      // FIX: Check if service.supprimerBien returns an observable
      const result = this.bienService.supprimerBien(id);
      if (result && typeof result.subscribe === 'function') {
        result.subscribe(() => this.loadData());
      } else {
        this.loadData();
      }
    }
  }
}