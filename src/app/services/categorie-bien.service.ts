import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategorieBien } from '../models/categorie-bien.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieBienService {

  private mockCategories: CategorieBien[] = [
    { id: 1, nom: 'Immobilier', description: 'Terrains, maisons et bureaux', icon: 'cil-home' },
    { id: 2, nom: 'Transport', description: 'Véhicules et logistique', icon: 'cil-truck' },
    { id: 3, nom: 'Événementiel', description: 'Salles et matériel de fête', icon: 'cil-star' },
    { id: 11, parentId: 1, nom: 'Maisons', description: 'Villas et appartements', icon: 'cil-building' },
    { id: 12, parentId: 1, nom: 'Terrains', description: 'Parcelles et domaines', icon: 'cil-map' },
    { id: 21, parentId: 2, nom: 'Voitures', description: 'Location de véhicules', icon: 'cil-car-alt' },
    { id: 31, parentId: 3, nom: 'Salles de fête', description: 'Espaces de réception', icon: 'cil-room' }
  ];

  constructor() {}

  /**
   * Récupère les catégories sous forme d'arbre pour le sélecteur HTML
   */
  getTreeCategories(): Observable<any[]> {
    return of(
      this.mockCategories
        .filter(c => !c.parentId) // On récupère les catégories parentes
        .map(parent => ({
          ...parent,
          // On attache les enfants à la propriété 'sousCategories'
          sousCategories: this.mockCategories.filter(child => child.parentId === parent.id)
        }))
    );
  }

  /**
   * Ajoute une nouvelle catégorie avec un ID auto-généré
   */
  ajouterCategorie(categorie: CategorieBien): Observable<CategorieBien> {
    const newId = this.mockCategories.length > 0 
      ? Math.max(...this.mockCategories.map(c => c.id)) + 1 
      : 1;
    const newCat = { ...categorie, id: newId };
    this.mockCategories.push(newCat);
    return of(newCat);
  }

  /**
   * MODIFICATION (Ajoutée) : Met à jour une catégorie existante
   */
  modifierCategorie(categorieModifiee: CategorieBien): Observable<CategorieBien> {
    const index = this.mockCategories.findIndex(c => c.id === categorieModifiee.id);
    if (index !== -1) {
      this.mockCategories[index] = { ...categorieModifiee };
      return of(this.mockCategories[index]);
    }
    return of(categorieModifiee);
  }

  /**
   * Supprime une catégorie par son ID
   */
  supprimerCategorie(id: number): Observable<boolean> {
    const index = this.mockCategories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCategories.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // --- MÉTHODES UTILITAIRES ---

  getCategoriesParentes(): Observable<CategorieBien[]> {
    return of(this.mockCategories.filter(c => !c.parentId));
  }

  getSousCategories(parentId: number): Observable<CategorieBien[]> {
    return of(this.mockCategories.filter(c => c.parentId === parentId));
  }

  getCategorieById(id: number): Observable<CategorieBien | undefined> {
    return of(this.mockCategories.find(c => c.id === id));
  }
}