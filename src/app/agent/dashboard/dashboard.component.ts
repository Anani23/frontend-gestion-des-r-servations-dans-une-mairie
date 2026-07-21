import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DossiersService } from '../../services/dossiers.service';
import { ReservationService, Reservation } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { Dossier } from '../../models/dossier.model';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {
  private dossiersService = inject(DossiersService);
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  notifications: Notification[] = [];
  showNotifications = false;

  get unreadNotifCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  dossiersEnAttente: Dossier[] = [];
  dossiersEnCours: Dossier[] = [];
  dossiersTermines: Dossier[] = [];
  reservationsEnCours: Reservation[] = [];
  
  stats = {
    totalDossiers: 0,
    enAttente: 0,
    enCours: 0,
    termines: 0,
    reservations: 0,
    urgents: 0
  };
  
  isLoading = true;
  searchTerm = '';
  currentDate = new Date();
  userName = '';
  recentDossiersLimit = 5;

  ngOnInit(): void {
    this.loadAgentData();
    this.getCurrentUser();
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getUserNotifications().subscribe({
      next: (data) => {
        this.notifications = data ?? [];
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement notifications:', err)
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  ouvrirNotification(notif: Notification): void {
    if (!notif.read) {
      this.notificationService.markAsRead(notif.id).subscribe({
        next: () => {
          notif.read = true;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    }
    this.showNotifications = false;
    if (notif.link) {
      this.router.navigate([notif.link]);
    }
  }

  getCurrentUser(): void {
    this.userName = this.authService.getUserName();
  }

  loadAgentData(): void {
    this.isLoading = true;
    
    this.dossiersService.getAllDossiers().subscribe({
      next: (dossiers: Dossier[]) => {
        const data = dossiers ?? [];
        
        this.dossiersEnAttente = data.filter(d => d.statut === 'EN_ATTENTE');
        this.dossiersEnCours = data.filter(d => d.statut === 'EN_COURS' || d.statut === 'VALIDE');
        this.dossiersTermines = data.filter(d => d.statut === 'REJETE');
        
        this.stats = {
          totalDossiers: data.length,
          enAttente: this.dossiersEnAttente.length,
          enCours: this.dossiersEnCours.length,
          termines: this.dossiersTermines.length,
          reservations: this.reservationsEnCours.length,
          urgents: this.dossiersEnAttente.filter(d => this.isUrgent(d)).length
        };
        
        this.loadReservations();
      },
      error: (err) => {
        console.error('Erreur chargement dossiers:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (reservations: Reservation[]) => {
        this.reservationsEnCours = (reservations ?? [])
          .filter(r => r.statut === 'EN_ATTENTE')
          .slice(0, 10);

        this.stats.reservations = this.reservationsEnCours.length;
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement réservations:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  isUrgent(dossier: Dossier): boolean {
    // ✅ Utiliser dateCreation uniquement
    const dateStr = dossier.dateCreation;
    const creationDate = dateStr ? new Date(dateStr) : new Date();
    const daysOld = (Date.now() - creationDate.getTime()) / (1000 * 3600 * 24);
    return daysOld > 3 && dossier.statut === 'EN_ATTENTE';
  }

  get filteredDossiers(): Dossier[] {
    if (!this.searchTerm.trim()) {
      return this.dossiersEnAttente.slice(0, this.recentDossiersLimit);
    }
    const term = this.searchTerm.toLowerCase();
    return this.dossiersEnAttente.filter(d => 
      (d.reference?.toLowerCase().includes(term) || false) ||
      (d.typePrestation?.toLowerCase().includes(term) || false) ||
      (d.id?.toString().includes(term) || false)
    ).slice(0, this.recentDossiersLimit);
  }

  get filteredReservations(): Reservation[] {
    if (!this.searchTerm.trim()) {
      return this.reservationsEnCours;
    }
    const term = this.searchTerm.toLowerCase();
    return this.reservationsEnCours.filter(r => 
      (r.bienNom?.toLowerCase().includes(term) || false) ||
      (r.nomCitoyen?.toLowerCase().includes(term) || false)
    );
  }

  navigateToDossiers(): void {
    this.router.navigate(['/agent/dossiers']);
  }

  navigateToReservations(): void {
    this.router.navigate(['/agent/reservations']);
  }

  navigateToRendezVous(): void {
    this.router.navigate(['/agent/rdv']);
  }

  traiterDossier(id: number | undefined): void {
    this.router.navigate(['/agent/dossiers']);
  }

  voirReservation(id: number | undefined): void {
    this.router.navigate(['/agent/reservations']);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusBadgeClass(statut: string): string {
    const statusMap: Record<string, string> = {
      'EN_ATTENTE': 'status-pending',
      'EN_COURS': 'status-progress',
      'VALIDE': 'status-progress',
      'REJETE': 'status-rejected'
    };
    return statusMap[statut] || 'status-default';
  }

  getStatusLabel(statut: string): string {
    const labelMap: Record<string, string> = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'VALIDE': 'Validé',
      'REJETE': 'Rejeté'
    };
    return labelMap[statut] || statut;
  }

  getReservationStatusClass(statut: string): string {
    const statusMap: Record<string, string> = {
      'EN_ATTENTE': 'status-pending',
      'ACCEPTEE': 'status-confirmed',
      'REFUSEE': 'status-rejected',
      'ANNULEE': 'status-rejected'
    };
    return statusMap[statut] || 'status-default';
  }

  getReservationStatusLabel(statut: string): string {
    const labelMap: Record<string, string> = {
      'EN_ATTENTE': 'En attente',
      'ACCEPTEE': 'Acceptée',
      'REFUSEE': 'Refusée',
      'ANNULEE': 'Annulée'
    };
    return labelMap[statut] || statut;
  }

  rafraichir(): void {
    this.loadAgentData();
  }
}