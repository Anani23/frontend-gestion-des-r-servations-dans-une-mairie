import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Bien } from '../../models/bien.model';
import { BienService } from '../../services/bien.service';
import { CategorieBienService } from '../../services/categorie-bien.service';

@Component({
  selector: 'app-create-bien',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-bien.component.html',
  styleUrls: ['./create-bien.component.scss']
})
export class CreateBienComponent implements OnInit {
  // Données
  categories: any[] = [];
  biens: Bien[] = [];
  filteredBiens: Bien[] = [];
  
  // État de l'interface
  searchTerm: string = '';
  selectedCategory: any = null;
  activeTab: 'form' | 'list' = 'form'; // Gère l'affichage entre Formulaire et Registre
  isEditing: boolean = false; // Pour savoir si on modifie ou si on crée

  // Modèle du bien (adapté pour l'édition et la création)
  newBien: any = {
    nom: '',
    type: 'Bâtiment',
    categorieId: null,
    lieu: '',
    description: '',
    tempImage: null
  };

  constructor(
    private categorieService: CategorieBienService,
    private bienService: BienService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBiens();
  }

  // Chargement des catégories
  loadCategories(): void {
    this.categorieService.getTreeCategories().subscribe({
      next: (data) => this.categories = data ?? [],
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  // Chargement de la liste des biens
  loadBiens(): void {
    this.bienService.getBiens().subscribe({
      next: (data) => {
        this.biens = data ?? [];
        this.filteredBiens = [...this.biens];
      },
      error: (err) => console.error('Erreur chargement biens', err)
    });
  }

  // Basculer vers le mode édition
  onEdit(bien: Bien): void {
    this.isEditing = true;
    // On remplit le formulaire avec les données existantes
    this.newBien = { 
      ...bien, 
      tempImage: bien.images && bien.images.length > 0 ? bien.images[0] : null 
    };
    // On change d'onglet pour afficher le formulaire
    this.activeTab = 'form';
    this.onCategoryChange(); // Pour mettre à jour l'UI de la catégorie si besoin
  }

  // Détection du changement de catégorie
  onCategoryChange(): void {
    const id = Number(this.newBien.categorieId);
    this.selectedCategory = null;
    if (!id) return;

    for (const parent of this.categories) {
      if (parent.id === id) { 
        this.selectedCategory = parent; 
        break; 
      }
      const sub = parent.sousCategories?.find((s: any) => s.id === id);
      if (sub) {
        this.selectedCategory = sub;
        break;
      }
    }
  }

  // Recherche filtrée
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredBiens = this.biens;
      return;
    }
    this.filteredBiens = this.biens.filter(b => 
      (b.nom?.toLowerCase().includes(term)) || 
      (b.lieu?.toLowerCase().includes(term)) ||
      (b.type?.toLowerCase().includes(term))
    );
  }

  // Récupération du nom de la catégorie pour le tableau
  getCategoryNameForList(id: number): string {
    if (!id) return 'Général';
    for (const p of this.categories) {
      if (p.id === id) return p.nom;
      const sub = p.sousCategories?.find((s: any) => s.id === id);
      if (sub) return sub.nom;
    }
    return 'Général';
  }

  // Gestion de l'image (Aperçu)
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.newBien.tempImage = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  // Soumission (Création ou Mise à jour)
  onSubmit(): void {
    if (!this.newBien.nom || !this.newBien.categorieId) {
      alert("Veuillez renseigner au moins le nom et la catégorie.");
      return;
    }

    const bienToSave: Bien = {
      ...this.newBien,
      images: this.newBien.tempImage ? [this.newBien.tempImage] : (this.newBien.images || [])
    };

    if (this.isEditing) {
      // Logique de mise à jour
      this.bienService.modifierBien(bienToSave).subscribe(() => {
        this.finishSubmit("Bien mis à jour avec succès !");
      });
    } else {
      // Logique de création
      bienToSave.id = Date.now(); // ID temporaire
      this.bienService.ajouterBien(bienToSave).subscribe(() => {
        this.finishSubmit("Bien enregistré avec succès !");
      });
    }
  }

  private finishSubmit(message: string): void {
    this.loadBiens();
    this.resetForm();
    alert(message);
    this.activeTab = 'list'; // Redirige vers le tableau après l'action
  }

  // Suppression
  onDelete(id: number): void {
    if (confirm('Voulez-vous vraiment retirer ce bien du registre ?')) {
      this.bienService.supprimerBien(id).subscribe(() => {
        this.loadBiens();
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.newBien = { 
      nom: '', 
      type: 'Bâtiment', 
      categorieId: null, 
      lieu: '', 
      description: '', 
      tempImage: null 
    };
    this.selectedCategory = null;
  }
}