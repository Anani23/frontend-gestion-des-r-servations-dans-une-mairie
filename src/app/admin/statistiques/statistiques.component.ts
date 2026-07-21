import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { BienService } from '../../services/bien.service';
import { ServiceService } from '../../services/service.service';
import { DossiersService } from '../../services/dossiers.service';
import { ReservationService } from '../../services/reservation.service';
import { RdvService } from '../../services/rdv.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService, PaymentResponse } from '../../services/payment.service';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.scss']
})
export class StatistiquesComponent implements OnInit {
  private bienService = inject(BienService);
  private serviceService = inject(ServiceService);
  private dossiersService = inject(DossiersService);
  private reservationService = inject(ReservationService);
  private rdvService = inject(RdvService);
  private authService = inject(AuthService);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  searchTerm = '';
  filteredSections: string[] = [];

  // Pagination pour les paiements
  currentPagePayments = 1;
  itemsPerPagePayments = 10;
  totalPayments = 0;
  totalPagesPayments = 0;
  paginatedPayments: PaymentResponse[] = [];

  // Pagination pour les notifications
  currentPageNotifications = 1;
  itemsPerPageNotifications = 10;
  totalNotifications = 0;
  totalPagesNotifications = 0;
  paginatedNotifications: Notification[] = [];

  // Liste des sections disponibles pour la recherche
  private sectionsList = [
    'utilisateurs', 'citoyens', 'agents', 'admins',
    'dossiers', 'demandes', 'en attente', 'validés', 'refusés',
    'réservations', 'reservations',
    'rendez-vous', 'rdv', 'rendezvous',
    'patrimoine', 'biens', 'services',
    'paiements', 'payments', 'payé', 'non payé',
    'notifications', 'alertes', 'messages'
  ];
  
  // Statistiques complètes
  stats = {
    // Utilisateurs
    citoyens: 0,
    agents: 0,
    admins: 0,
    
    // Dossiers
    dossiersTotal: 0,
    dossiersEnAttente: 0,
    dossiersEnCours: 0,
    dossiersValides: 0,
    dossiersRefuses: 0,
    
    // Réservations
    reservationsTotal: 0,
    reservationsEnAttente: 0,
    reservationsAcceptees: 0,
    reservationsRefusees: 0,
    reservationsAnnulees: 0,
    
    // Rendez-vous
    rdvTotal: 0,
    rdvEnAttente: 0,
    rdvValides: 0,
    rdvAnnules: 0,
    rdvRefuses: 0,
    
    // Paiements
    paiementsTotal: 0,
    paiementsPayes: 0,
    paiementsNonPayes: 0,
    paiementsEchoues: 0,
    montantTotalPaye: 0,
    montantTotalAttendu: 0,
    tauxRecouvrement: 0,
    
    // Notifications
    notificationsTotal: 0,
    notificationsNonLues: 0,
    notificationsLues: 0,
    
    // Biens & Services
    biens: 0,
    services: 0
  };

  // Listes détaillées
  paymentsList: PaymentResponse[] = [];
  notificationsList: Notification[] = [];

  // Valeurs affichées pour l'animation
  displayStats = { ...this.stats };

  ngOnInit(): void {
    this.loadAllStats();
  }

  loadAllStats(): void {
    this.isLoading = true;

    forkJoin({
      users: this.authService.getUsers().pipe(catchError(() => of([]))),
      dossiers: this.dossiersService.getAllDossiers().pipe(catchError(() => of([]))),
      reservations: this.reservationService.getAllReservations().pipe(catchError(() => of([]))),
      rendezVous: this.rdvService.getRendezVous().pipe(catchError(() => of([]))),
      biens: this.bienService.getBiens().pipe(catchError(() => of([]))),
      services: this.serviceService.getServices().pipe(catchError(() => of([]))),
      paiements: this.paymentService.getAllPayments().pipe(catchError(() => of([]))),
      notifications: this.notificationService.getUserNotifications().pipe(catchError(() => of([])))
    })
    .pipe(finalize(() => {
      this.isLoading = false;
      this.animateNumbers();
      this.updatePaginationPayments();
      this.updatePaginationNotifications();
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }))
    .subscribe({
      next: (res) => {
        // Traitement des utilisateurs
        const users = res.users || [];
        this.stats.citoyens = users.filter((u: any) => u.role === 'ROLE_CITOYEN' || u.role === 'CITOYEN').length;
        this.stats.agents = users.filter((u: any) => u.role === 'ROLE_AGENT' || u.role === 'AGENT').length;
        this.stats.admins = users.filter((u: any) => u.role === 'ROLE_ADMIN' || u.role === 'ROLE_SUPER_ADMIN' || u.role === 'ADMIN').length;
        
        // Traitement des dossiers
        const dossiers = res.dossiers || [];
        this.stats.dossiersTotal = dossiers.length;
        this.stats.dossiersEnAttente = dossiers.filter((d: any) => d.statut === 'EN_ATTENTE').length;
        this.stats.dossiersEnCours = dossiers.filter((d: any) => d.statut === 'EN_COURS').length;
        this.stats.dossiersValides = dossiers.filter((d: any) => d.statut === 'VALIDE').length;
        this.stats.dossiersRefuses = dossiers.filter((d: any) => d.statut === 'REJETE').length;
        
        // Traitement des réservations
        const reservations = res.reservations || [];
        this.stats.reservationsTotal = reservations.length;
        this.stats.reservationsEnAttente = reservations.filter((r: any) => r.statut === 'EN_ATTENTE').length;
        this.stats.reservationsAcceptees = reservations.filter((r: any) => r.statut === 'ACCEPTEE').length;
        this.stats.reservationsRefusees = reservations.filter((r: any) => r.statut === 'REFUSEE').length;
        this.stats.reservationsAnnulees = reservations.filter((r: any) => r.statut === 'ANNULEE').length;
        
        // Traitement des rendez-vous
        const rdvs = res.rendezVous || [];
        this.stats.rdvTotal = rdvs.length;
        this.stats.rdvEnAttente = rdvs.filter((r: any) => r.statut === 'EN_ATTENTE').length;
        this.stats.rdvValides = rdvs.filter((r: any) => r.statut === 'CONFIRME' || r.statut === 'VALIDE').length;
        this.stats.rdvRefuses = rdvs.filter((r: any) => r.statut === 'REFUSE').length;
        this.stats.rdvAnnules = rdvs.filter((r: any) => r.statut === 'ANNULE').length;
        
        // Traitement des paiements
        const paiements = res.paiements || [];
        this.paymentsList = paiements;
        this.stats.paiementsTotal = paiements.length;
        this.stats.paiementsPayes = paiements.filter((p: PaymentResponse) => p.status === 'SUCCESS' || p.status === 'COMPLETED').length;
        this.stats.paiementsNonPayes = paiements.filter((p: PaymentResponse) => p.status === 'PENDING' || p.status === 'INITIATED').length;
        this.stats.paiementsEchoues = paiements.filter((p: PaymentResponse) => p.status === 'FAILED' || p.status === 'CANCELLED').length;
        this.stats.montantTotalPaye = paiements
          .filter((p: PaymentResponse) => p.status === 'SUCCESS' || p.status === 'COMPLETED')
          .reduce((sum: number, p: PaymentResponse) => sum + (p.amount || 0), 0);
        this.stats.montantTotalAttendu = paiements
          .reduce((sum: number, p: PaymentResponse) => sum + (p.amount || 0), 0);
        this.stats.tauxRecouvrement = this.stats.montantTotalAttendu > 0 
          ? Math.round((this.stats.montantTotalPaye / this.stats.montantTotalAttendu) * 100)
          : 0;
        
        // Traitement des notifications
        const notifications = res.notifications || [];
        this.notificationsList = notifications;
        this.stats.notificationsTotal = notifications.length;
        this.stats.notificationsNonLues = notifications.filter((n: Notification) => !n.read).length;
        this.stats.notificationsLues = notifications.filter((n: Notification) => n.read).length;
        
        // Biens et services
        this.stats.biens = (res.biens || []).length;
        this.stats.services = (res.services || []).length;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques:', err);
      }
    });
  }

  private animateNumbers() {
    const duration = 1500;
    const steps = 50;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      this.displayStats.citoyens = Math.round(this.stats.citoyens * progress);
      this.displayStats.agents = Math.round(this.stats.agents * progress);
      this.displayStats.dossiersTotal = Math.round(this.stats.dossiersTotal * progress);
      this.displayStats.dossiersEnAttente = Math.round(this.stats.dossiersEnAttente * progress);
      this.displayStats.dossiersValides = Math.round(this.stats.dossiersValides * progress);
      this.displayStats.dossiersRefuses = Math.round(this.stats.dossiersRefuses * progress);
      this.displayStats.reservationsTotal = Math.round(this.stats.reservationsTotal * progress);
      this.displayStats.reservationsEnAttente = Math.round(this.stats.reservationsEnAttente * progress);
      this.displayStats.reservationsAcceptees = Math.round(this.stats.reservationsAcceptees * progress);
      this.displayStats.rdvTotal = Math.round(this.stats.rdvTotal * progress);
      this.displayStats.rdvValides = Math.round(this.stats.rdvValides * progress);
      this.displayStats.paiementsTotal = Math.round(this.stats.paiementsTotal * progress);
      this.displayStats.paiementsPayes = Math.round(this.stats.paiementsPayes * progress);
      this.displayStats.paiementsNonPayes = Math.round(this.stats.paiementsNonPayes * progress);
      this.displayStats.montantTotalPaye = Math.round(this.stats.montantTotalPaye * progress);
      this.displayStats.tauxRecouvrement = Math.round(this.stats.tauxRecouvrement * progress);
      this.displayStats.notificationsTotal = Math.round(this.stats.notificationsTotal * progress);
      this.displayStats.notificationsNonLues = Math.round(this.stats.notificationsNonLues * progress);
      
      if (currentStep === steps) {
        this.displayStats = { ...this.stats };
        clearInterval(interval);
      }

      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, stepDuration);
  }

  // Méthodes pour la pagination des paiements
  updatePaginationPayments(): void {
    this.totalPayments = this.paymentsList.length;
    this.totalPagesPayments = Math.ceil(this.totalPayments / this.itemsPerPagePayments);
    const startIndex = (this.currentPagePayments - 1) * this.itemsPerPagePayments;
    const endIndex = startIndex + this.itemsPerPagePayments;
    this.paginatedPayments = this.paymentsList.slice(startIndex, endIndex);
  }

  goToPagePayments(page: number): void {
    if (page >= 1 && page <= this.totalPagesPayments) {
      this.currentPagePayments = page;
      this.updatePaginationPayments();
    }
  }

  previousPagePayments(): void {
    this.goToPagePayments(this.currentPagePayments - 1);
  }

  nextPagePayments(): void {
    this.goToPagePayments(this.currentPagePayments + 1);
  }

  getPageNumbersPayments(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPagePayments - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPagesPayments, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Méthodes pour la pagination des notifications
  updatePaginationNotifications(): void {
    this.totalNotifications = this.notificationsList.length;
    this.totalPagesNotifications = Math.ceil(this.totalNotifications / this.itemsPerPageNotifications);
    const startIndex = (this.currentPageNotifications - 1) * this.itemsPerPageNotifications;
    const endIndex = startIndex + this.itemsPerPageNotifications;
    this.paginatedNotifications = this.notificationsList.slice(startIndex, endIndex);
  }

  goToPageNotifications(page: number): void {
    if (page >= 1 && page <= this.totalPagesNotifications) {
      this.currentPageNotifications = page;
      this.updatePaginationNotifications();
    }
  }

  previousPageNotifications(): void {
    this.goToPageNotifications(this.currentPageNotifications - 1);
  }

  nextPageNotifications(): void {
    this.goToPageNotifications(this.currentPageNotifications + 1);
  }

  getPageNumbersNotifications(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPageNotifications - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPagesNotifications, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Méthodes pour la recherche et la navigation
  filterStats(): void {
    if (!this.searchTerm.trim()) {
      this.filteredSections = [];
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredSections = this.sectionsList.filter(section => 
      section.includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredSections = [];
  }

  isSectionVisible(sectionName: string): boolean {
    if (!this.searchTerm.trim()) return true;
    
    const term = this.searchTerm.toLowerCase().trim();
    return sectionName.toLowerCase().includes(term) ||
           this.filteredSections.includes(sectionName);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  scrollToSection(sectionName: string): void {
    const el = document.querySelector(`[data-section="${sectionName}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  expandedPaymentId: number | null = null;

  togglePaymentDetails(payment: PaymentResponse): void {
    this.expandedPaymentId = this.expandedPaymentId === payment.id ? null : payment.id;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      await this.notificationService.markAsRead(notificationId).toPromise();
      const notification = this.notificationsList.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        this.stats.notificationsNonLues--;
        this.stats.notificationsLues++;
        this.updatePaginationNotifications();
      }
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    } finally {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await this.notificationService.markAllAsRead().toPromise();
      this.notificationsList.forEach(n => n.read = true);
      this.stats.notificationsNonLues = 0;
      this.stats.notificationsLues = this.stats.notificationsTotal;
      this.updatePaginationNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    } finally {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await this.notificationService.deleteNotification(notificationId).toPromise();
      const index = this.notificationsList.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        const notification = this.notificationsList[index];
        if (!notification.read) {
          this.stats.notificationsNonLues--;
        }
        this.notificationsList.splice(index, 1);
        this.stats.notificationsTotal--;
        this.stats.notificationsLues = this.stats.notificationsTotal - this.stats.notificationsNonLues;
        this.updatePaginationNotifications();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    } finally {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  exportStats(): void {
    const statsData = [
      ['Catégorie', 'Valeur'],
      ['Citoyens', this.displayStats.citoyens],
      ['Agents', this.displayStats.agents],
      ['Administrateurs', this.stats.admins],
      ['Total Dossiers', this.displayStats.dossiersTotal],
      ['Dossiers en attente', this.displayStats.dossiersEnAttente],
      ['Dossiers en cours', this.stats.dossiersEnCours],
      ['Dossiers validés', this.displayStats.dossiersValides],
      ['Dossiers refusés', this.displayStats.dossiersRefuses],
      ['Total Réservations', this.displayStats.reservationsTotal],
      ['Réservations en attente', this.displayStats.reservationsEnAttente],
      ['Réservations acceptées', this.displayStats.reservationsAcceptees],
      ['Total Rendez-vous', this.displayStats.rdvTotal],
      ['Rendez-vous en attente', this.stats.rdvEnAttente],
      ['Rendez-vous validés', this.displayStats.rdvValides],
      ['Total Paiements', this.displayStats.paiementsTotal],
      ['Paiements effectués', this.displayStats.paiementsPayes],
      ['Paiements en attente', this.displayStats.paiementsNonPayes],
      ['Paiements échoués', this.stats.paiementsEchoues],
      ['Montant total payé', this.displayStats.montantTotalPaye + ' FCFA'],
      ['Taux de recouvrement', this.displayStats.tauxRecouvrement + '%'],
      ['Total Notifications', this.displayStats.notificationsTotal],
      ['Notifications non lues', this.displayStats.notificationsNonLues],
      ['Biens', this.stats.biens],
      ['Services', this.stats.services],
      ['Date export', new Date().toLocaleString()]
    ];
    
    const csvContent = statsData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `statistiques_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'status-paid';
      case 'PENDING':
      case 'INITIATED':
        return 'status-pending';
      case 'FAILED':
      case 'CANCELLED':
        return 'status-failed';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'Payé';
      case 'PENDING':
      case 'INITIATED':
        return 'En attente';
      case 'FAILED':
      case 'CANCELLED':
        return 'Échoué';
      default:
        return status || 'Non payé';
    }
  }

  getPaymentMethodLabel(method: string): string {
    const methods: Record<string, string> = {
      'MIXX_YAS': 'Mixx Yas',
      'MOOV_MONEY': 'Moov Money',
      'TMONEY': 'TMoney',
      'CASH': 'Espèces',
      'CARD': 'Carte bancaire'
    };
    return methods[method] || method;
  }

  getNotificationTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'INFO': 'ℹ️',
      'SUCCESS': '✅',
      'WARNING': '⚠️',
      'ERROR': '❌',
      'PAYMENT': '💰',
      'DOSSIER': '📋',
      'RDV': '📅'
    };
    return icons[type] || '🔔';
  }

  getNotificationTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'INFO': 'notification-info',
      'SUCCESS': 'notification-success',
      'WARNING': 'notification-warning',
      'ERROR': 'notification-error',
      'PAYMENT': 'notification-payment',
      'DOSSIER': 'notification-dossier',
      'RDV': 'notification-rdv'
    };
    return classes[type] || 'notification-default';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return this.formatDate(dateString);
  }
}