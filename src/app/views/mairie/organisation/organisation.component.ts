import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent {

  // Description générale de l'organisation de la mairie
  description = 'L’organisation de la mairie est structurée pour assurer le bon fonctionnement de tous les services municipaux et répondre efficacement aux citoyens.';

  // Liste des départements ou services
  departements = [
    { nom: 'État Civil', description: 'Gestion des naissances, mariages et décès' },
    { nom: 'Urbanisme', description: 'Suivi des constructions et de l’aménagement urbain' },
    { nom: 'Affaires Sociales', description: 'Accompagnement des citoyens et aide sociale' },
    { nom: 'Culture et Événements', description: 'Organisation d’événements et activités culturelles' },
    { nom: 'Informatique & Digital', description: 'Gestion des plateformes numériques et bases de données' }
  ];

  // Optionnel : organigramme sous forme d’équipe
  equipes = [
    { chef: 'Jean Dupont', poste: 'Maire' },
    { chef: 'Alice Martin', poste: 'Directrice État Civil' },
    { chef: 'Paul Leblanc', poste: 'Directeur Urbanisme' }
  ];
}