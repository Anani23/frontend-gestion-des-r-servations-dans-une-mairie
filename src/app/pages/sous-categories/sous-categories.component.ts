import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategorieBien } from '../../models/categorie-bien.model';
import { CategorieBienService } from '../../services/categorie-bien.service';

@Component({
  selector: 'app-sous-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sous-categories.component.html',
  styleUrls: ['./sous-categories.component.scss']
})
export class SousCategoriesComponent implements OnInit {
  parentCategorie?: CategorieBien;
  sousCategories: CategorieBien[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private catService: CategorieBienService
  ) {}

  ngOnInit(): void {
    // On écoute l'ID dans l'URL
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadData(id);
      }
    });
  }

  loadData(id: number): void {
    this.loading = true;
    
    // 1. On récupère les détails du parent (pour le titre)
    this.catService.getCategorieById(id).subscribe(cat => this.parentCategorie = cat);

    // 2. On récupère les sous-catégories
    this.catService.getSousCategories(id).subscribe({
      next: (data) => {
        this.sousCategories = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}