import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  reservations: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const saved = localStorage.getItem('municipal_reservations');
    if (saved) {
      this.reservations = JSON.parse(saved);
    } else {
      // Données de test si vide
      this.reservations = [
        { bien: 'Salle des fêtes - Mairie', date: new Date(), statut: 'CONFIRMÉ', image: 'mairie-togo.jpg' },
        { bien: 'Terrain de sport', date: new Date(), statut: 'EN ATTENTE', image: 'palais-lomé.jpg' }
      ];
    }
  }

  annuler(r: any) {
    if (confirm(`Voulez-vous annuler la réservation pour ${r.bien} ?`)) {
      r.statut = 'ANNULÉ';
      localStorage.setItem('municipal_reservations', JSON.stringify(this.reservations));
    }
  }

  // Nom synchronisé avec le HTML
  getStatusClass(statut: string) {
    return {
      'status-pending': statut === 'EN ATTENTE',
      'status-confirmed': statut === 'CONFIRMÉ',
      'status-canceled': statut === 'ANNULÉ'
    };
  }
}