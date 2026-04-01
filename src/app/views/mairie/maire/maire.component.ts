import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-maire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maire.component.html',
  styleUrls: ['./maire.component.scss']
})
export class MaireComponent {

  // Informations dynamiques du maire
  maire = {
    nom: 'Jean Dupont',
    mandat: '2020 - 2026',
    photo: 'assets/maire.jpg',
    description: 'Le maire et le conseil municipal sont chargés de la gestion des affaires locales et de la représentation de la commune.'
  };

  // Liste dynamique des services municipaux
  services = [
    'État civil (naissance, mariage, décès)',
    'Urbanisme et construction',
    'Affaires sociales et aide aux citoyens',
    'Culture et événements locaux',
    'Gestion des rendez-vous et dossiers citoyens'
  ];

  // Description générale de la mairie
  descriptionMairie = 'La mairie est l’administration locale responsable de la gestion de la commune et des services municipaux.';
}