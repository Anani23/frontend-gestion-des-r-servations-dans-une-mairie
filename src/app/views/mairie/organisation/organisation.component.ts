import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Interfaces définies localement pour corriger les erreurs TS2304.
 * Si tu prévois de les réutiliser ailleurs, l'idéal serait de les mettre 
 * dans un fichier 'src/app/models/mairie.model.ts'.
 */
interface Departement {
  nom: string;
  description: string;
  icone: string;
  color: string;
}

interface Equipe {
  chef: string;
  poste: string;
  initiales: string;
}

interface Bien {
  nom: string;
  type: string;
  dispo: boolean;
  image: string;
}

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent {
  
  // Message d'introduction pour l'en-tête
  description: string = "Structure administrative et gestion du patrimoine de la commune de Lomé.";

  // Liste des pôles administratifs avec couleurs personnalisées (utilisées pour la bordure CSS)
  departements: Departement[] = [
    { 
      nom: 'État Civil', 
      description: 'Gestion des actes officiels : naissances, mariages et décès.', 
      icone: '📜', 
      color: '#3498db' 
    },
    { 
      nom: 'Urbanisme', 
      description: 'Aménagement du territoire et délivrance des permis de construire.', 
      icone: '🏗️', 
      color: '#e67e22' 
    },
    { 
      nom: 'Affaires Sociales', 
      description: 'Accompagnement des familles et programmes de solidarité.', 
      icone: '🤝', 
      color: '#e74c3c' 
    },
    { 
      nom: 'Digital & IT', 
      description: 'Modernisation des services publics et maintenance technique.', 
      icone: '💻', 
      color: '#9b59b6' 
    }
  ];

  // Membres de la direction
  equipes: Equipe[] = [
    { chef: 'Jean Dupont', poste: 'Maire de la Commune', initiales: 'JD' },
    { chef: 'Alice Martin', poste: 'Secrétaire Générale', initiales: 'AM' },
    { chef: 'Paul Leblanc', poste: 'Directeur Technique', initiales: 'PL' },
    { chef: 'Sophie Kossi', poste: 'DSI (Informatique)', initiales: 'SK' }
  ];

  // Gestion des infrastructures et biens municipaux
  biens: Bien[] = [
    { 
      nom: 'Palais des Congrès', 
      type: 'Événementiel', 
      dispo: true, 
      image: 'assets/images/palais-lomé.jpg' 
    },
    { 
      nom: 'Terrain de Kégué', 
      type: 'Sport & Loisirs', 
      dispo: false, 
      image: 'assets/images/blank-adverting-billboard-center-road.jpg' 
    },
    { 
      nom: 'Annexe Administrative', 
      type: 'Bâtiment Public', 
      dispo: true, 
      image: 'assets/images/mairie-togo.jpg' 
    }
  ];

  // Services mis en avant dans le footer
  services: string[] = [
    'Extraits de naissance', 
    'Permis de bâtir', 
    'Aide sociale', 
    'Location de salles', 
    'Plateforme E-citoyen'
  ];

  /**
   * Méthode optionnelle pour gérer le clic sur un service
   */
  onServiceClick(service: string): void {
    console.log(`Service sélectionné : ${service}`);
  }
}