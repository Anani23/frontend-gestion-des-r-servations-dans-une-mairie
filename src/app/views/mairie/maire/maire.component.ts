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

  // Propriété qui manquait et causait l'erreur TS2339
  descriptionMairie: string = 'L’administration municipale de Lomé vous accompagne dans toutes vos démarches administratives et veille à l’amélioration constante de votre cadre de vie.';

  maire = {
    nom: 'S.E.M. Le Maire de Lomé',
    mandat: '2020 - 2026',
    photo: 'assets/images/mairie-centrale.jpg', 
    biographie: 'Engagé pour le développement durable et la modernisation des services numériques de la capitale, Monsieur le Maire œuvre pour une ville plus connectée et au service de ses citoyens.'
  };

  contact = {
    adresse: 'Hôtel de Ville, Boulevard du Mono, Lomé, Togo',
    telephone: '+228 22 21 00 00',
    email: 'secretariat@mairie-lome.tg'
  };

  horaires = [
    { jour: 'Lundi au Vendredi', heures: '07h30 — 12h00 / 14h30 — 17h30' },
    { jour: 'Samedi', heures: '08h00 — 12h00 (Permanence État Civil)' },
    { jour: 'Dimanche', heures: 'Fermé' }
  ];

  services = [
    { titre: 'État civil', desc: 'Extraits de naissance, mariages, décès', icone: '📜' },
    { titre: 'Urbanisme', desc: 'Permis de construire et plan de ville', icone: '🏗️' },
    { titre: 'Social', desc: 'Aide aux familles et logement', icone: '🤝' },
    { titre: 'Culture', desc: 'Événements et patrimoine local', icone: '🎨' },
    { titre: 'RDV Médicaux', desc: 'Gestion des services de santé municipaux', icone: '🏥' }
  ];
}