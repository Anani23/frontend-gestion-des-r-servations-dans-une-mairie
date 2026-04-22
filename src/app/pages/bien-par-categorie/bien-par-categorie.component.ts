import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Bien } from '../../models/bien.model';
import { CategorieBien } from '../../models/categorie-bien.model';
import { BienService } from '../../services/bien.service';
import { CategorieBienService } from '../../services/categorie-bien.service';

@Component({
  selector: 'app-bien-par-categorie',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bien-par-categorie.component.html',
  styleUrls: ['./bien-par-categorie.component.scss']
})
export class BienParCategorieComponent implements OnInit {
  biens: Bien[] = [];
  currentCategorie?: CategorieBien;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private bienService: BienService,
    private catService: CategorieBienService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const catId = +params['id'];
      if (catId) {
        this.loadData(catId);
      }
    });
  }

  loadData(catId: number): void {
    this.loading = true;
    // Récupère l'ID de la catégorie pour le titre
    this.catService.getCategorieById(catId).subscribe(cat => this.currentCategorie = cat);
    // Récupère les biens de cette catégorie
    this.bienService.getBiensByCategorie(catId).subscribe({
      next: (data) => {
        this.biens = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}