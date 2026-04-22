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

  actualites = [
    { 
      titre: 'Nouveau portail numérique', 
      description: 'La mairie lance une nouvelle plateforme digitale pour simplifier vos démarches administratives.', 
      date: '2026-03-28',
      image: 'assets/images/mairie-centrale.jpg' // Utilisation de tes images existantes
    },
    { 
      titre: 'Campagne de reboisement', 
      description: 'Participez à la grande journée "Ville Verte" ce samedi au parc municipal.', 
      date: '2026-03-25',
      image: 'assets/images/mairie-togo.jpg'
    }
  ];

  // Champs du formulaire
  titre: string = '';
  description: string = '';
  date: string = '';
  imageUrl: string = ''; // Nouveau champ

  ajouterActualite() {
    if (!this.titre || !this.description) {
      alert('Veuillez remplir les champs obligatoires !');
      return;
    }

    this.actualites.unshift({
      titre: this.titre,
      description: this.description,
      date: this.date || new Date().toISOString().split('T')[0],
      // Si pas d'image, on met une image générique par défaut
      image: this.imageUrl || 'assets/images/blank-adverting-billboard-center-road.jpg'
    });

    this.reinitialiserFormulaire();
  }

  supprimerActualite(i: number) {
    if (confirm('Supprimer définitivement cette actualité ?')) {
      this.actualites.splice(i, 1);
    }
  }

  private reinitialiserFormulaire() {
    this.titre = '';
    this.description = '';
    this.date = '';
    this.imageUrl = '';
  }
}