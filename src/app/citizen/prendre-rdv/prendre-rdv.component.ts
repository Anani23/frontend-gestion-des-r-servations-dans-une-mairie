import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RdvService } from '../../services/rdv.service';

/**
 * Interface pour structurer les services avec une identité visuelle
 */
interface ServiceMunicipal {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-prendre-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prendre-rdv.component.html',
  styleUrls: ['./prendre-rdv.component.scss']
})
export class PrendreRdvComponent implements OnInit {
  // Injection des dépendances via inject() pour une syntaxe moderne
  private rdvService = inject(RdvService);
  private router = inject(Router);

  // --- Modèles de données ---
  service: string = '';
  date: string = '';
  heureSelected: string = '';
  minDate: string = '';

  // Liste enrichie des services pour le design en "Cartes"
  servicesList: ServiceMunicipal[] = [
    { name: 'État Civil', icon: '🏛️', description: 'Naissance, Mariage, Décès' },
    { name: 'Passeport', icon: '🛂', description: 'Identité et voyage' },
    { name: 'Urbanisme', icon: '🏗️', description: 'Permis de construire' },
    { name: 'Légalisation', icon: '✍️', description: 'Certification de documents' },
    { name: 'Fiscalité', icon: '💰', description: 'Taxes et impôts locaux' }
  ];

  // Créneaux horaires disponibles
  creneaux: string[] = ['08:30', '09:30', '10:30', '11:30', '14:30', '15:30', '16:30'];

  ngOnInit(): void {
    // Bloquer la sélection des dates passées dans le calendrier HTML
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  /**
   * Sélectionne un créneau horaire
   * @param h Heure au format string
   */
  selectHeure(h: string): void {
    this.heureSelected = h;
  }

  /**
   * Enregistre le rendez-vous et redirige vers la liste
   */
  prendreRdv(): void {
    if (!this.service || !this.date || !this.heureSelected) {
      return;
    }

    // Construction de l'objet de données
    const newRdv = {
      nom: 'Utilisateur Actuel', // Dans un cas réel, viendrait d'un service d'Auth
      service: this.service,
      date: `${this.date}T${this.heureSelected}:00`, // Format ISO pour la base de données
      status: 'Confirmé'
    };

    // Appel au service pour sauvegarder
    this.rdvService.ajouterRdv(newRdv);

    // Navigation vers la page "Mes Rendez-vous" avec une animation de succès
    this.router.navigate(['/citizen/mes-rdv']);
  }

  /**
   * Méthode utilitaire pour réinitialiser le choix de l'heure 
   * si la date est changée par l'utilisateur
   */
  onDateChange(): void {
    this.heureSelected = '';
  }
}