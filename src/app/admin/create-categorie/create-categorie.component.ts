import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategorieBienService } from '../../services/categorie-bien.service';

interface Categorie {
  id: number;
  nom: string;
  description: string;
  type: 'biens' | 'services';
  image?: string;
}

@Component({
  selector: 'app-create-categorie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-categorie.component.html',
  styleUrls: ['./create-categorie.component.scss']
})
export class CreateCategorieComponent implements OnInit {
  
  // Pagination : 1: Saisie Bien, 2: Index Bien, 3: Saisie Service, 4: Index Service
  currentPage: number = 1; 
  
  categoriesBiens: Categorie[] = [];
  categoriesServices: Categorie[] = [];
  
  searchTerm: string = '';
  successMessage: string | null = null;
  editingItem: Categorie | null = null;
  imagePreview: string | null = null;

  newCat: Partial<Categorie> = {
    nom: '',
    description: '',
    image: ''
  };

  constructor(private categorieService: CategorieBienService) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.categorieService.getTreeCategories().subscribe({
      next: (data) => {
        this.categoriesBiens = data?.filter(c => c.type === 'biens') || [];
        this.categoriesServices = data?.filter(c => c.type === 'services') || [];
      },
      error: (err) => console.error('Erreur chargement', err)
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

  getFilteredList(): Categorie[] {
    const currentList = (this.currentPage <= 2) ? this.categoriesBiens : this.categoriesServices;
    if (!this.searchTerm.trim()) return currentList;
    return currentList.filter(item => 
      item.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ajouter(): void {
    if (!this.newCat.nom) return;
    const currentType = (this.currentPage <= 2) ? 'biens' : 'services';

    const categoryData: Categorie = {
      id: this.editingItem ? this.editingItem.id : Date.now(),
      nom: this.newCat.nom!,
      description: this.newCat.description || '',
      type: currentType,
      image: this.newCat.image
    };

    const request = this.editingItem 
      ? this.categorieService.modifierCategorie(categoryData)
      : this.categorieService.ajouterCategorie(categoryData);

    request.subscribe({
      next: () => {
        this.showToast(this.editingItem ? "Modifié !" : "Enregistré !");
        this.chargerDonnees();
        this.resetForm();
        // Redirection vers l'index correspondant après ajout
        this.currentPage = (currentType === 'biens') ? 2 : 4;
      }
    });
  }

  supprimer(id: number): void {
    if (confirm('Supprimer cet élément ?')) {
      this.categorieService.supprimerCategorie(id).subscribe(() => {
        this.showToast("Supprimé");
        this.chargerDonnees();
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