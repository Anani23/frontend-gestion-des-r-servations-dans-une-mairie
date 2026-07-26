import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Reservation, ReservationService } from '../../services/reservation.service';

type StatutFiltre = Reservation['statut'] | 'TOUS';

const FILTER_QUERY_MAP: Record<string, StatutFiltre> = {
  all: 'TOUS',
  attente: 'EN_ATTENTE',
  acceptees: 'CONFIRMEE',
  annulees: 'ANNULEE',
  terminees: 'TERMINEE'
};

@Component({
  selector: 'app-agent-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class AgentReservationsComponent implements OnInit {

  private reservationService = inject(ReservationService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  pagedReservations: Reservation[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  isLoading = true;
  selectedStatus: StatutFiltre = 'TOUS';

  ngOnInit(): void {
    const filter = this.route.snapshot.queryParamMap.get('filter');
    if (filter && FILTER_QUERY_MAP[filter]) {
      this.selectedStatus = FILTER_QUERY_MAP[filter];
    }
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data ?? [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement réservations agent:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredReservations = this.reservations.filter(r => {
      const nomCitoyen = (r.nomCitoyen ?? r.userName ?? '').toLowerCase();
      const nomBien = (r.nomBien ?? r.bienNom ?? '').toLowerCase();
      const matchSearch = nomCitoyen.includes(search) || nomBien.includes(search);
      const matchStatus = this.selectedStatus === 'TOUS' || r.statut === this.selectedStatus;
      return matchSearch && matchStatus;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReservations.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedReservations = this.filteredReservations.slice(start, start + this.pageSize);
  }

  changePage(step: number): void {
    const next = this.currentPage + step;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
      this.updatePagination();
    }
  }

  filterByStatus(status: StatutFiltre): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  getCount(status: StatutFiltre): number {
    return status === 'TOUS'
      ? this.reservations.length
      : this.reservations.filter(r => r.statut === status).length;
  }

  peutIntervenir(statut: Reservation['statut']): boolean {
    return statut === 'EN_ATTENTE';
  }

  accepter(reservation: Reservation): void {
    if (!reservation.id) return;
    this.reservationService.updateStatus(reservation.id, 'CONFIRMEE').subscribe({
      next: () => this.loadReservations(),
      error: (err) => console.error(err)
    });
  }

  refuser(reservation: Reservation): void {
    if (!reservation.id) return;
    // ReservationStatus (backend) n'a pas d'etat "refuse" distinct : une reservation
    // refusee par l'agent est marquee ANNULEE, comme une annulation citoyenne.
    this.reservationService.updateStatus(reservation.id, 'ANNULEE').subscribe({
      next: () => this.loadReservations(),
      error: (err) => console.error(err)
    });
  }

  getStatusBadgeClass(statut: Reservation['statut']): string {
    switch (statut) {
      case 'CONFIRMEE': return 'status-validated';
      case 'TERMINEE': return 'status-validated';
      case 'ANNULEE': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  getStatusText(statut: Reservation['statut']): string {
    switch (statut) {
      case 'CONFIRMEE': return 'Confirmée';
      case 'TERMINEE': return 'Terminée';
      case 'ANNULEE': return 'Annulée';
      default: return 'En attente';
    }
  }

  getNomCitoyen(r: Reservation): string {
    return r.nomCitoyen ?? r.userName ?? 'Citoyen';
  }

  getNomBien(r: Reservation): string {
    return r.nomBien ?? r.bienNom ?? 'Bien municipal';
  }
}
