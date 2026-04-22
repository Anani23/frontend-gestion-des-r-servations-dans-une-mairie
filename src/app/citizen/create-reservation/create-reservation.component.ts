import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Reservation {
  id: number;
  bien: string;
  image: string;
  date: string;
  heure: string;
  statut: 'EN ATTENTE' | 'CONFIRMÉ' | 'ANNULÉ';
}

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.scss']
})
export class CreateReservationComponent implements OnInit {

  biens = [
    { id: 1, nom: 'Salle des fêtes de Lomé', image: 'salle-fete.webp' },
    { id: 2, nom: 'Palais des Congrès', image: 'palais-lomé.jpg' },
    { id: 3, nom: 'Terrain Municipal (Kegue)', image: 'terrain-sportif2.jpg' },
    { id: 4, nom: 'Espace Vert - Marina', image: 'musee.jpg' }
  ];

  bienId: number | null = null;
  date: string = '';
  heure: string = '';
  reservations: Reservation[] = [];
  
  // Date minimum : aujourd'hui
  minDate = new Date().toISOString().split('T')[0];

  ngOnInit(): void {
    const saved = localStorage.getItem('municipal_reservations');
    if (saved) {
      try {
        this.reservations = JSON.parse(saved);
      } catch (e) {
        this.reservations = [];
      }
    }
  }

  reserver(): void {
    if (!this.bienId || !this.date || !this.heure) return;
    
    const selected = this.biens.find(b => b.id == this.bienId);
    const newRes: Reservation = {
      id: Date.now(),
      bien: selected?.nom || '',
      image: selected?.image || 'mairie-togo.jpg',
      date: this.date,
      heure: this.heure,
      statut: 'EN ATTENTE'
    };

    this.reservations.unshift(newRes);
    this.save();
    this.reset();
    
    // Feedback utilisateur
    alert('Votre demande a été envoyée aux services municipaux.');
  }

  annuler(r: Reservation): void {
    if (confirm('Souhaitez-vous vraiment annuler cette réservation ?')) {
      r.statut = 'ANNULÉ';
      this.save();
    }
  }

  getBadgeClass(s: string) {
    return { 
      'status-pending': s === 'EN ATTENTE', 
      'status-confirmed': s === 'CONFIRMÉ', 
      'status-canceled': s === 'ANNULÉ' 
    };
  }

  private save() { 
    localStorage.setItem('municipal_reservations', JSON.stringify(this.reservations)); 
  }

  private reset() { 
    this.bienId = null; 
    this.date = ''; 
    this.heure = ''; 
  }
}