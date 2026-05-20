import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategorieBienService } from '../../services/categorie-bien.service';
import { CategorieBien } from '../../models/categorie-bien.model';

@Component({
  selector: 'app-create-categorie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss']
})
export class CreateCategorieComponent implements OnInit {
  
  currentPage: number = 1; 
  
  categoriesBiens: CategorieBien[] = [];
  categoriesServices: CategorieBien[] = [];
  
  searchTerm: string = '';
  successMessage: string | null = null;
  editingItem: CategorieBien | null = null;
  imagePreview: string | null = null;

  newCat: Partial<CategorieBien> = {
    nom: '',
    description: '',
    image: ''
  };

  constructor(private categorieService: CategorieBienService) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.categorieService.getCategoriesByType('biens').subscribe({
      next: (data) => this.categoriesBiens = data || [],
      error: (err) => console.error('Erreur chargement biens', err)
    });
    this.categorieService.getCategoriesByType('services').subscribe({
      next: (data) => this.categoriesServices = data || [],
      error: (err) => console.error('Erreur chargement services', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.newCat.image = this.imagePreview;
      };
      reader.readAsDataURL(file);
    }
  }

  getFilteredList(): CategorieBien[] {
    const currentList = (this.currentPage <= 2) ? this.categoriesBiens : this.categoriesServices;
    if (!this.searchTerm.trim()) return currentList;
    return currentList.filter(item => 
      item.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ajouter(): void {
    if (!this.newCat.nom) return;
    const currentType = (this.currentPage <= 2) ? 'biens' : 'services';

    const categoryData: Partial<CategorieBien> = {
      nom: this.newCat.nom!,
      description: this.newCat.description || '',
      type: currentType,
      image: this.newCat.image
    };

    if (this.editingItem) {
      const updateData: CategorieBien = { ...this.editingItem, ...categoryData } as CategorieBien;
      this.categorieService.modifierCategorie(updateData).subscribe({
        next: () => {
          this.showToast("Modifié !");
          this.chargerDonnees();
          this.resetForm();
          this.currentPage = (currentType === 'biens') ? 2 : 4;
        },
        error: (err) => console.error('Erreur modification', err)
      });
    } else {
      this.categorieService.ajouterCategorie(categoryData).subscribe({
        next: () => {
          this.showToast("Enregistré !");
          this.chargerDonnees();
          this.resetForm();
          this.currentPage = (currentType === 'biens') ? 2 : 4;
        },
        error: (err) => console.error('Erreur création', err)
      });
    }
  }

  supprimer(id: number): void {
    if (confirm('Supprimer cet élément ?')) {
      this.categorieService.supprimerCategorie(id).subscribe({
        next: () => {
          this.showToast("Supprimé");
          this.chargerDonnees();
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  private showToast(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = null, 3000);
  }

  private resetForm(): void {
    this.newCat = { nom: '', description: '', image: '' };
    this.imagePreview = null;
    this.editingItem = null;
  }
}
