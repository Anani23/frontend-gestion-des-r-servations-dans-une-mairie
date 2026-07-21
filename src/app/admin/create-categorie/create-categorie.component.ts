import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategorieBienService } from '../../services/categorie-bien.service';

@Component({
  selector: 'app-create-categorie',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss']
})
export class CreateCategorieComponent implements OnInit {

  private service = inject(CategorieBienService);

  categories: any[] = [];
  filteredCategories: any[] = [];

  filterType: 'biens' | 'services' = 'biens';

  selectedFile?: File;

  isEditing = false;

  isSaving = false;

  newCat: any = {
    id: null,
    nom: '',
    description: '',
    type: 'biens',
    parentId: null,
    image: null
  };

  ngOnInit(): void {
    this.load();

    this.service.refresh$.subscribe(() => this.load());
  }

  // =============================
  // FILTER TYPE
  // =============================
  setType(type: 'biens' | 'services') {
    this.filterType = type;
    this.newCat.type = type;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredCategories = this.categories.filter(c => c.type === this.filterType);
  }

  // =============================
  // LOAD
  // =============================
  load() {
    this.service.getTreeCategories().subscribe({
      next: (data: any[]) => {
        this.categories = data || [];
        this.applyFilter();
      },
      error: err => console.error(err)
    });
  }

  // =============================
  // FILE IMAGE
  // =============================
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.newCat.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // =============================
  // SAVE
  // =============================
  save() {
    // SÉCURITÉ A : Bloquer si le nom est vide (évite le deuxième envoi vide)
    if (!this.newCat.nom || this.newCat.nom.trim() === '') {
      console.warn("Annulation : Le nom de la catégorie est vide.");
      return;
    }

    // SÉCURITÉ B : Empêcher les soumissions multiples
    if (this.isSaving) {
      console.log("Sauvegarde déjà en cours, ignore le clic");
      return;
    }

    console.log("Valeur de newCat avant envoi :", this.newCat);
    console.log("Valeur du nom :", this.newCat.nom);

    this.isSaving = true;

    const obs = this.isEditing
      ? this.service.updateCategorie(this.newCat)
      : this.service.createCategorie(this.newCat);

    obs.subscribe({
      next: () => {
        this.reset();
        this.service.refresh();
        this.isSaving = false;
      },
      error: err => {
        console.log(err);
        this.isSaving = false;
      }
    });
  }

  // =============================
  // EDIT
  // =============================
  edit(cat: any) {
    this.newCat = { ...cat };
    this.isEditing = true;
  }

  // =============================
  // DELETE
  // =============================
  delete(id: number) {
    this.service.deleteCategorie(id).subscribe(() => {
      this.service.refresh();
    });
  }

  // =============================
  // RESET
  // =============================
  reset() {
    this.isEditing = false;
    this.selectedFile = undefined;

    this.newCat = {
      id: null,
      nom: '',
      description: '',
      type: this.filterType,
      parentId: null,
      image: null
    };
  }
}