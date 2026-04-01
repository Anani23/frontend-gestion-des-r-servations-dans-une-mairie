import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-actualites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-actualites.component.html',
  styleUrls: ['./liste-actualites.component.scss'],
})
export class ListeActualitesComponent {

  // 🌟 Liste des actualités
  actualites = [
    { titre: 'Nouveau portail numérique', description: 'La mairie lance une nouvelle plateforme digitale.', date: '2026-03-28' },
    { titre: 'Salubrité publique', description: 'Campagne de nettoyage dans la commune.', date: '2026-03-25' }
  ];

  // 🌟 Formulaire
  titre: string = '';
  description: string = '';
  date: string = '';

  // Ajouter une actualité
  ajouterActualite() {
    if (!this.titre || !this.description) {
      alert('Veuillez remplir tous les champs obligatoires !');
      return;
    }

    this.actualites.push({
      titre: this.titre,
      description: this.description,
      date: this.date || new Date().toLocaleDateString()
    });

    // Réinitialiser le formulaire
    this.titre = '';
    this.description = '';
    this.date = '';
  }

  // Supprimer une actualité
  supprimerActualite(i: number) {
    this.actualites.splice(i, 1);
  }
}