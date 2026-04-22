import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-accueil.component.html',
  styleUrls: ['./page-accueil.component.scss']
})
export class PageAccueilComponent {
  mairieImages = [
    { url: 'assets/images/mairie-centrale.jpg', alt: 'Mairie Centrale' },
    { url: 'assets/images/palais-lomé.jpg', alt: 'Palais de Lomé' },
    { url: 'assets/images/musee.jpg', alt: 'Musée National' },
    { url: 'assets/images/salle-fete-2.jpg', alt: 'Salle des fêtes' }
  ];

  categories = [
    { nom: 'Terrains & Espaces', image: 'assets/images/terrain-sportif.jpg', link: '1' },
    { nom: 'Salles de Réception', image: 'assets/images/salle-fete-1.jfif', link: '2' },
    { nom: 'Patrimoine Culturel', image: 'assets/images/musee1.jpg', link: '3' },
    { nom: 'Bâtiments Publics', image: 'assets/images/mairie-togo.jpg', link: '4' }
  ];

  stats = [
    { label: 'Services Publics', value: '24+', icon: '🏛️' },
    { label: 'Biens Recensés', value: '1,250', icon: '📊' },
    { label: 'Agents Actifs', value: '85', icon: '👥' },
    { label: 'Satisfaction', value: '98%', icon: '⭐' }
  ];
}