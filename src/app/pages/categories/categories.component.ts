import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategorieBien } from '../../models/categorie-bien.model';
import { CategorieBienService } from '../../services/categorie-bien.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule], // Important pour le [routerLink]
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categoriesParentes: CategorieBien[] = [];

  constructor(private catService: CategorieBienService) {}

  ngOnInit(): void {
    // On appelle la méthode créée à l'étape 2
    this.catService.getCategoriesParentes().subscribe({
      next: (data) => {
        this.categoriesParentes = data;
      },
      error: (err) => console.error('Erreur lors du chargement des catégories', err)
    });
  }
}