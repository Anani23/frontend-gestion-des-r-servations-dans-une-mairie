import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: string;
  link?: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/notifications`;

  /**
   * Récupérer toutes les notifications de l'utilisateur connecté
   */
  getUserNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  /**
   * Récupérer les notifications non lues
   */
  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread`);
  }

  /**
   * Récupérer le nombre de notifications non lues
   */
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread/count`);
  }

  /**
   * Marquer une notification comme lue
   */
  markAsRead(notificationId: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read-all`, {});
  }

  /**
   * Supprimer une notification
   */
  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
  }

  /**
   * Créer une nouvelle notification
   */
  create(notification: Partial<CreateNotificationRequest>): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  /**
   * Créer une notification de succès de paiement
   */
  notifyPaymentSuccess(rdvId: number, amount: number): Observable<Notification> {
    return this.create({
      title: '💰 Paiement réussi',
      message: `Le paiement de ${amount} FCFA pour le rendez-vous #${rdvId} a été effectué avec succès.`,
      type: 'PAYMENT_SUCCESS',
      link: '/citizen/rdv/mes-rdv'
    });
  }

  /**
   * Créer une notification d'échec de paiement
   */
  notifyPaymentFailed(rdvId: number, amount: number): Observable<Notification> {
    return this.create({
      title: '⚠️ Échec du paiement',
      message: `Le paiement de ${amount} FCFA pour le rendez-vous #${rdvId} a échoué. Veuillez réessayer.`,
      type: 'PAYMENT_FAILED',
      link: '/citizen/rdv/mes-rdv'
    });
  }

  /**
   * Créer une notification pour un rendez-vous créé
   */
  notifyRdvCreated(rdvId: number, date: string): Observable<Notification> {
    return this.create({
      title: '📅 Rendez-vous créé',
      message: `Votre rendez-vous #${rdvId} du ${new Date(date).toLocaleDateString('fr-FR')} a été enregistré avec succès.`,
      type: 'RDV_CREATED',
      link: '/citizen/rdv/mes-rdv'
    });
  }

  /**
   * Créer une notification pour un rendez-vous confirmé
   */
  notifyRdvConfirmed(rdvId: number, date: string): Observable<Notification> {
    return this.create({
      title: '✅ Rendez-vous confirmé',
      message: `Votre rendez-vous #${rdvId} du ${new Date(date).toLocaleDateString('fr-FR')} a été confirmé par nos services.`,
      type: 'RDV_CONFIRMED',
      link: '/citizen/rdv/mes-rdv'
    });
  }

  /**
   * Créer une notification pour un rendez-vous annulé
   */
  notifyRdvCancelled(rdvId: number): Observable<Notification> {
    return this.create({
      title: '❌ Rendez-vous annulé',
      message: `Votre rendez-vous #${rdvId} a été annulé. Pour plus d'informations, veuillez contacter nos services.`,
      type: 'RDV_CANCELLED',
      link: '/citizen/rdv/mes-rdv'
    });
  }
}