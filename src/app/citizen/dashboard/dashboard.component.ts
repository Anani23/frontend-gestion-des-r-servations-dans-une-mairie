import { ChangeDetectorRef, Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize, timeout, catchError } from 'rxjs/operators';
import { of, Subscription, timer } from 'rxjs';
import { DossiersService } from '../../services/dossiers.service';
import { ReservationService } from '../../services/reservation.service';
import { RdvService } from '../../services/rdv.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService, PaymentResponse } from '../../services/payment.service';
import { NotificationService, Notification } from '../../services/notification.service';

interface DashboardStat {
  icon: string;
  iconClass: string;
  value: number;
  label: string;
}

interface QuickAction {
  icon: string;
  label: string;
  desc: string;
  route: string;
  keywords: string[];
}

interface NotificationItem {
  id: number;
  icon: string;
  iconClass: string;
  text: string;
  time: string;
  link?: string;
  read: boolean;
}

interface SearchResult {
  type: 'action' | 'dossier' | 'payment' | 'service';
  title: string;
  description: string;
  icon: string;
  route: string;
  score: number;
}

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class CitizenDashboardComponent implements OnInit, OnDestroy {
  
  private dossiersService = inject(DossiersService);
  private reservationService = inject(ReservationService);
  private rdvService = inject(RdvService);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  loadingError = false;
  errorMessage = '';
  dateDuJour: Date = new Date();
  nomCitoyen = '';
  prenomCitoyen = '';
  reservationsCount = 0;
  rdvCount = 0;
  paymentsCount = 0;
  unpaidCount = 0;
  
  // Recherche
  searchTerm = '';
  searchResults: SearchResult[] = [];
  showSearchResults = false;

  stats: DashboardStat[] = [];
  actions: QuickAction[] = [];
  notifications: NotificationItem[] = [];
  recentDossiers: any[] = [];
  recentPayments: PaymentResponse[] = [];
  allDossiers: any[] = [];
  
  private subscriptions: Subscription[] = [];
  private completedCalls = 0;
  private totalCalls = 5;
  
  // Propriétés calculées pour le template
  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
  
  get hasUnreadNotifications(): boolean {
    return this.unreadNotificationsCount > 0;
  }

  ngOnInit(): void {
    this.initQuickActions();
    this.loadDashboardData();
    
    // Timeout de sécurité pour éviter le chargement infini
    timer(15000).subscribe(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.loadingError = true;
        this.errorMessage = 'Le chargement des données prend plus de temps que prévu. Vérifiez votre connexion.';
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initQuickActions(): void {
    this.actions = [
      {
        icon: 'fa-regular fa-file-lines',
        label: 'Nouveau dossier',
        desc: 'Soumettre une nouvelle demande administrative.',
        route: '/citizen/dossiers/create',
        keywords: ['dossier', 'nouveau', 'créer', 'demande', 'administratif', 'document']
      },
      {
        icon: 'fa-regular fa-calendar-plus',
        label: 'Nouvelle réservation',
        desc: 'Réserver un bien municipal (salle, terrain).',
        route: '/citizen/reservations/create',
        keywords: ['réservation', 'nouvelle', 'bien', 'municipal', 'salle', 'terrain', 'réserver']
      },
      {
        icon: 'fa-regular fa-calendar-check',
        label: 'Prendre RDV',
        desc: 'Planifier un rendez-vous en mairie.',
        route: '/citizen/rdv/nouveau',
        keywords: ['rdv', 'rendez-vous', 'prendre', 'planifier', 'mairie', 'rencontre']
      },
      {
        icon: 'fa-solid fa-money-bill-wave',
        label: 'Effectuer un paiement',
        desc: 'Payer vos factures et services en ligne.',
        route: '/citizen/payment',
        keywords: ['paiement', 'payer', 'facture', 'transaction', 'argent', 'carte']
      },
      {
        icon: 'fa-regular fa-user',
        label: 'Mon profil',
        desc: 'Gérer vos informations personnelles.',
        route: '/citizen/profile',
        keywords: ['profil', 'compte', 'informations', 'personnelles', 'modifier']
      }
    ];
  }

  private checkCompletion(): void {
    this.completedCalls++;
    console.log(`Appels API terminés: ${this.completedCalls}/${this.totalCalls}`);
    if (this.completedCalls >= this.totalCalls) {
      this.isLoading = false;
      console.log('Tous les appels API sont terminés');
    }
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.loadingError = false;
    this.completedCalls = 0;

    // Récupérer l'utilisateur connecté
    const currentUser = this.authService.getCurrentUser();
    this.nomCitoyen = currentUser?.nom || 'Cher Citoyen';
    this.prenomCitoyen = currentUser?.prenom || '';

    // 1. Récupérer les dossiers
    this.dossiersService.getMesDossiers()
      .pipe(
        timeout(10000),
        catchError(err => {
          console.error('Erreur chargement dossiers:', err);
          return of([]);
        }),
        finalize(() => this.checkCompletion())
      )
      .subscribe({
        next: (dossiers: any[]) => {
          const safeDossiers = dossiers ?? [];
          this.allDossiers = safeDossiers;
          this.recentDossiers = safeDossiers.slice(0, 3);
          
          const total = safeDossiers.length;
          const enAttente = safeDossiers.filter((d: any) => d.statut === 'EN_ATTENTE' || d.statut === 'EN_COURS').length;
          const approuves = safeDossiers.filter((d: any) => d.statut === 'VALIDE').length;

          this.stats = [
            { 
              icon: 'fa-solid fa-folder-open', 
              iconClass: 'total',
              value: total, 
              label: 'Total Demandes' 
            },
            { 
              icon: 'fa-regular fa-clock', 
              iconClass: 'pending',
              value: enAttente, 
              label: 'En traitement' 
            },
            { 
              icon: 'fa-regular fa-circle-check', 
              iconClass: 'validated',
              value: approuves, 
              label: 'Dossiers Validés' 
            }
          ];

          this.generateNotifications(safeDossiers);
        },
        error: () => {
          this.stats = [
            { icon: 'fa-solid fa-folder-open', iconClass: 'total', value: 0, label: 'Total Demandes' },
            { icon: 'fa-regular fa-clock', iconClass: 'pending', value: 0, label: 'En traitement' },
            { icon: 'fa-regular fa-circle-check', iconClass: 'validated', value: 0, label: 'Dossiers Validés' }
          ];
        }
      });

    // 2. Récupérer les réservations
    this.reservationService.getReservations()
      .pipe(
        timeout(10000),
        catchError(err => {
          console.error('Erreur chargement réservations:', err);
          return of([]);
        }),
        finalize(() => this.checkCompletion())
      )
      .subscribe({
        next: (reservations: any[]) => {
          this.reservationsCount = reservations?.length || 0;
        }
      });

    // 3. Récupérer les rendez-vous (avec gestion d'erreur spécifique)
    this.rdvService.getRendezVous()
      .pipe(
        timeout(10000),
        catchError(err => {
          console.error('Erreur chargement rendez-vous (API non disponible):', err);
          return of([]);
        }),
        finalize(() => this.checkCompletion())
      )
      .subscribe({
        next: (rdvs: any[]) => {
          this.rdvCount = rdvs?.length || 0;
          console.log('Rendez-vous chargés:', this.rdvCount);
        },
        error: (err) => {
          console.error('Erreur dans le subscribe des rendez-vous:', err);
          this.rdvCount = 0;
        }
      });

    // 4. Récupérer les paiements
    this.paymentService.getUserPayments()
      .pipe(
        timeout(10000),
        catchError(err => {
          console.error('Erreur chargement paiements:', err);
          return of([]);
        }),
        finalize(() => this.checkCompletion())
      )
      .subscribe({
        next: (payments: PaymentResponse[]) => {
          const safePayments = payments ?? [];
          this.paymentsCount = safePayments.length;
          this.unpaidCount = safePayments.filter(p => p.status === 'PENDING' || p.status === 'INITIATED').length;
          this.recentPayments = safePayments.slice(0, 3);
          this.generatePaymentNotifications(safePayments);
        }
      });

    // 5. Récupérer les notifications
    this.notificationService.getUserNotifications()
      .pipe(
        timeout(10000),
        catchError(err => {
          console.error('Erreur chargement notifications:', err);
          return of([]);
        }),
        finalize(() => this.checkCompletion())
      )
      .subscribe({
        next: (notifications: Notification[]) => {
          const safeNotifs = notifications ?? [];
          this.addNotificationItems(safeNotifs);
        }
      });
  }

  // ================= MÉTHODES DE RECHERCHE =================
  
  onSearchInput(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (term.length < 2) {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }
    
    this.searchResults = [];
    this.showSearchResults = true;
    
    // Recherche dans les actions rapides
    this.actions.forEach(action => {
      let score = 0;
      const labelMatch = action.label.toLowerCase().includes(term);
      const descMatch = action.desc.toLowerCase().includes(term);
      const keywordMatch = action.keywords.some(kw => kw.toLowerCase().includes(term));
      
      if (labelMatch) score += 10;
      if (descMatch) score += 5;
      if (keywordMatch) score += 3;
      
      if (score > 0) {
        this.searchResults.push({
          type: 'action',
          title: action.label,
          description: action.desc,
          icon: action.icon,
          route: action.route,
          score: score
        });
      }
    });
    
    // Recherche dans les dossiers récents
    this.allDossiers.slice(0, 5).forEach((dossier: any) => {
      let score = 0;
      const typeMatch = dossier.typePrestation?.toLowerCase().includes(term);
      const refMatch = dossier.reference?.toLowerCase().includes(term);
      const idMatch = dossier.id?.toString().includes(term);
      
      if (typeMatch) score += 8;
      if (refMatch) score += 6;
      if (idMatch) score += 4;
      
      if (score > 0) {
        this.searchResults.push({
          type: 'dossier',
          title: dossier.typePrestation || 'Dossier administratif',
          description: `Réf: ${dossier.reference || 'N°' + dossier.id} - ${this.getStatusText(dossier.statut)}`,
          icon: 'fa-regular fa-file-lines',
          route: '/citizen/dossiers',
          score: score
        });
      }
    });
    
    // Recherche dans les paiements récents
    this.recentPayments.forEach((payment: PaymentResponse) => {
      let score = 0;
      const refMatch = payment.reference?.toLowerCase().includes(term);
      const descMatch = payment.description?.toLowerCase().includes(term);
      
      if (refMatch) score += 8;
      if (descMatch) score += 5;
      
      if (score > 0) {
        this.searchResults.push({
          type: 'payment',
          title: `Paiement - ${payment.reference}`,
          description: `${this.formatMontant(payment.amount)} - ${this.getPaymentStatusText(payment.status)}`,
          icon: 'fa-solid fa-money-bill-wave',
          route: '/citizen/payment',
          score: score
        });
      }
    });
    
    // Trier par score (plus haut d'abord)
    this.searchResults.sort((a, b) => b.score - a.score);
    this.searchResults = this.searchResults.slice(0, 8);
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }
  
  selectSearchResult(result: SearchResult): void {
    this.clearSearch();
    this.navigateTo(result.route);
  }
  
  // ================= FIN MÉTHODES DE RECHERCHE =================

  private generateNotifications(dossiers: any[]): void {
    const existingIds = new Set(this.notifications.map(n => n.id));
    
    dossiers.slice(0, 3).forEach((d: any, index: number) => {
      const notifId = -index - 1;
      if (!existingIds.has(notifId)) {
        if (d.statut === 'VALIDE') {
          this.notifications.unshift({
            id: notifId,
            icon: 'fa-regular fa-circle-check',
            iconClass: 'success',
            text: `Votre demande "${d.typePrestation}" a été validée avec succès.`,
            time: 'Récemment',
            link: '/citizen/dossiers',
            read: false
          });
        } else if (d.statut === 'REJETE') {
          this.notifications.unshift({
            id: notifId,
            icon: 'fa-solid fa-triangle-exclamation',
            iconClass: 'warning',
            text: `Votre dossier "${d.reference || d.id}" nécessite des corrections.`,
            time: 'À vérifier',
            link: '/citizen/dossiers',
            read: false
          });
        } else if (d.statut === 'EN_ATTENTE') {
          this.notifications.unshift({
            id: notifId,
            icon: 'fa-regular fa-bell',
            iconClass: 'info',
            text: `Votre demande "${d.typePrestation}" est en cours d'examen.`,
            time: 'En cours',
            link: '/citizen/dossiers',
            read: false
          });
        }
      }
    });
  }

  private generatePaymentNotifications(payments: PaymentResponse[]): void {
    const existingIds = new Set(this.notifications.map(n => n.id));
    
    payments.slice(0, 2).forEach((p: PaymentResponse, index: number) => {
      const notifId = -100 - index;
      if (!existingIds.has(notifId) && p.status === 'SUCCESS') {
        this.notifications.unshift({
          id: notifId,
          icon: 'fa-solid fa-circle-check',
          iconClass: 'success',
          text: `Paiement de ${this.formatMontant(p.amount)} effectué avec succès. Réf: ${p.reference}`,
          time: 'Récemment',
          link: '/citizen/payment',
          read: false
        });
      } else if (!existingIds.has(notifId) && p.status === 'PENDING') {
        this.notifications.unshift({
          id: notifId,
          icon: 'fa-regular fa-clock',
          iconClass: 'warning',
          text: `Paiement de ${this.formatMontant(p.amount)} en attente de confirmation.`,
          time: 'En attente',
          link: '/citizen/payment',
          read: false
        });
      }
    });

    if (this.notifications.length === 0) {
      this.notifications.push({
        id: 0,
        icon: 'fa-regular fa-bell',
        iconClass: 'info',
        text: 'Bienvenue sur votre nouvel espace citoyen sécurisé.',
        time: 'Maintenant',
        link: undefined,
        read: false
      });
    }

    this.notifications.sort((a, b) => {
      if (a.time === 'Maintenant') return -1;
      if (b.time === 'Maintenant') return 1;
      return 0;
    });
  }

  private addNotificationItems(notifications: Notification[]): void {
    notifications.forEach(notif => {
      const exists = this.notifications.some(n => n.id === notif.id);
      if (!exists) {
        this.notifications.push({
          id: notif.id,
          icon: this.getNotificationIcon(notif.type),
          iconClass: this.getNotificationClass(notif.type),
          text: notif.message,
          time: this.getRelativeTime(notif.createdAt),
          link: notif.link,
          read: notif.read
        });
      }
    });
    
    this.notifications.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return 0;
    });
  }

  private getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'INFO': 'fa-regular fa-bell',
      'SUCCESS': 'fa-regular fa-circle-check',
      'WARNING': 'fa-solid fa-triangle-exclamation',
      'ERROR': 'fa-solid fa-circle-exclamation',
      'PAYMENT': 'fa-solid fa-money-bill-wave',
      'DOSSIER': 'fa-regular fa-file-lines',
      'RDV': 'fa-regular fa-calendar-check'
    };
    return icons[type] || 'fa-regular fa-bell';
  }

  private getNotificationClass(type: string): string {
    const classes: Record<string, string> = {
      'INFO': 'info',
      'SUCCESS': 'success',
      'WARNING': 'warning',
      'ERROR': 'danger',
      'PAYMENT': 'success',
      'DOSSIER': 'info',
      'RDV': 'info'
    };
    return classes[type] || 'info';
  }

  private getRelativeTime(dateString: string): string {
    if (!dateString) return 'Récemment';
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
    return date.toLocaleDateString('fr-FR');
  }

  async markNotificationAsRead(notificationId: number, link?: string): Promise<void> {
    if (notificationId > 0) {
      try {
        await this.notificationService.markAsRead(notificationId).toPromise();
        const notif = this.notifications.find(n => n.id === notificationId);
        if (notif) notif.read = true;
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    }
    if (link) {
      this.navigateTo(link);
    }
  }

  formatMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }

  getInitials(name: string): string {
    if (!name) return 'C';
    if (this.prenomCitoyen) {
      return (this.prenomCitoyen.charAt(0) + name.charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  getFullName(): string {
    if (this.prenomCitoyen) {
      return `${this.prenomCitoyen} ${this.nomCitoyen}`;
    }
    return this.nomCitoyen;
  }

  getStatusClass(statut: string): string {
    switch(statut) {
      case 'VALIDE': return 'status-validated';
      case 'REJETE': return 'status-rejected';
      case 'EN_ATTENTE': return 'status-pending';
      default: return 'status-pending';
    }
  }

  getStatusText(statut: string): string {
    switch(statut) {
      case 'VALIDE': return 'Validé';
      case 'REJETE': return 'Rejeté';
      case 'EN_ATTENTE': return 'En attente';
      default: return 'En cours';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch(status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'status-paid';
      case 'PENDING':
      case 'INITIATED':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }

  getPaymentStatusText(status: string): string {
    switch(status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'Payé';
      case 'PENDING':
      case 'INITIATED':
        return 'En attente';
      default:
        return 'Non payé';
    }
  }

  getDossierStatusClass(statut: string): string {
    switch(statut) {
      case 'VALIDE': return 'recent-icon success';
      case 'REJETE': return 'recent-icon danger';
      default: return 'recent-icon warning';
    }
  }

  getDossierIcon(statut: string): string {
    switch(statut) {
      case 'VALIDE': return 'fa-regular fa-circle-check';
      case 'REJETE': return 'fa-solid fa-circle-xmark';
      default: return 'fa-regular fa-hourglass-half';
    }
  }

  getResultIcon(type: string): string {
    switch(type) {
      case 'action': return 'fa-solid fa-bolt';
      case 'dossier': return 'fa-regular fa-file-lines';
      case 'payment': return 'fa-solid fa-money-bill-wave';
      default: return 'fa-solid fa-search';
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  retryLoading(): void {
    this.loadDashboardData();
  }
}