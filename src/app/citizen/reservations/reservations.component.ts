import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // ← AJOUTER CET IMPORT
import { ReservationService, Reservation } from '../../services/reservation.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],  // ← AJOUTER FormsModule
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {

  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  isLoading = true;
  searchTerm = '';

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.isLoading = true;
    this.reservationService.getMine().subscribe({
      next: (data: Reservation[]) => {
        // ✅ Transformation des données pour garantir nomBien
        this.reservations = (data || []).map(r => ({
          ...r,
          nomBien: r.nomBien || r.bienNom || 'Bien municipal'
        }));
        this.filteredReservations = [...this.reservations];
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement réservations', err);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  // MÉTHODES DE RECHERCHE
  filterReservations(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredReservations = [...this.reservations];
      return;
    }
    
    this.filteredReservations = this.reservations.filter(res => {
      return (
        (res.nomBien && res.nomBien.toLowerCase().includes(term)) ||
        (res.motif && res.motif.toLowerCase().includes(term)) ||
        (res.statut && res.statut.toLowerCase().includes(term)) ||
        (res.dateDebut && new Date(res.dateDebut).toLocaleDateString('fr-FR').includes(term))
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredReservations = [...this.reservations];
  }

  resetFilters(): void {
    this.clearSearch();
  }

  annuler(res: Reservation): void {
    if (!res.id) return;

    const confirmation = confirm('Voulez-vous annuler cette réservation de bien municipal ?');
    if (!confirmation) return;

    this.reservationService.cancel(res.id).subscribe({
      next: () => {
        res.statut = 'ANNULEE';
        // Mettre à jour la liste filtrée également
        const index = this.filteredReservations.findIndex(r => r.id === res.id);
        if (index !== -1) {
          this.filteredReservations[index].statut = 'ANNULEE';
        }
        this.fetchReservations(); // Recharger pour mettre à jour
      },
      error: (err) => {
        console.error('Erreur annulation', err);
        alert('Impossible d’annuler la réservation');
      }
    });
  }

  getImageByBien(nomBien: string | undefined): string {
    if (!nomBien) return 'assets/images/mairie-lome-default.jpg';
    
    const b = nomBien.toLowerCase();
    if (b.includes('salle')) return 'assets/images/salle-fete.jpg';
    if (b.includes('stade') || b.includes('terrain')) return 'assets/images/stade.jpg';
    if (b.includes('materiel') || b.includes('chaise')) return 'assets/images/materiel.jpg';
    
    return 'assets/images/mairie-lome-default.jpg';
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'status-pending';
      case 'ACCEPTEE':
      case 'CONFIRMEE':
        return 'status-success';
      case 'REFUSEE':
      case 'ANNULEE':
        return 'status-danger';
      default:
        return 'status-default';
    }
  }

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'ACCEPTEE':
      case 'CONFIRMEE':
        return 'Acceptée';
      case 'REFUSEE':
        return 'Refusée';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return statut;
    }
  }
}