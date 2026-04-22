import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bien } from '../models/bien.model';

@Injectable({
  providedIn: 'root'
})
export class BienService {

  private mockBiens: Bien[] = [
    { 
      id: 101, 
      nom: 'Villa Horizon Agoè', 
      type: 'Villa',
      categorieId: 11, 
      dispo: true,
      description: 'Superbe villa F4 située à Agoè-Nyivé, idéale pour une famille.', 
      lieu: 'Lomé, Agoè-Nyivé',
      superficie: '300m²',
      telephone: '+228 90 00 00 00',
      images: ['assets/images/salle-fete-1.jfif'] 
    },
    { 
      id: 102, 
      nom: 'Terrain Titré Baguida', 
      type: 'Terrain',
      categorieId: 12, 
      dispo: true,
      description: 'Parcelle de 600m² avec titre foncier sécurisé.', 
      lieu: 'Baguida, Littoral',
      superficie: '600m²',
      images: ['assets/images/terrain-vend.webp'] 
    },
    { 
      id: 103, 
      nom: 'Espace Polyvalent Lomé', 
      type: 'Salle',
      categorieId: 31, 
      dispo: false,
      description: 'Salle de conférence équipée.', 
      lieu: 'Lomé Centre',
      capacite: '500 personnes',
      horaires: '08h00 - 22h00',
      images: ['assets/images/salle-fete.webp'] 
    }
  ];

  getBiens(): Observable<Bien[]> {
    return of(this.mockBiens);
  }

  // --- CORRECTION & AJOUT DES MÉTHODES ---

  ajouterBien(bien: Bien): Observable<Bien> {
    // On utilise l'ID généré par le composant ou on en crée un si absent
    const newBien = { ...bien, id: bien.id || Math.floor(Math.random() * 1000) };
    this.mockBiens.unshift(newBien); // unshift pour l'ajouter en haut de liste
    return of(newBien);
  }

  /**
   * MÉTHODE INDISPENSABLE POUR CORRIGER L'ERREUR TS2339
   */
  modifierBien(bienModifie: Bien): Observable<Bien> {
    const index = this.mockBiens.findIndex(b => b.id === bienModifie.id);
    if (index !== -1) {
      this.mockBiens[index] = { ...bienModifie };
      return of(this.mockBiens[index]);
    }
    return of(bienModifie);
  }

  supprimerBien(id: number): Observable<boolean> {
    const index = this.mockBiens.findIndex(b => b.id === id);
    if (index !== -1) {
      this.mockBiens.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // --- AUTRES MÉTHODES ---

  getBiensByCategorie(catId: number): Observable<Bien[]> {
    return of(this.mockBiens.filter(b => b.categorieId === catId));
  }

  getBienById(id: number): Observable<Bien | undefined> {
    return of(this.mockBiens.find(b => b.id === id));
  }
}