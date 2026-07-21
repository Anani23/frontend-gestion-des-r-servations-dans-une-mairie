import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  notifications: Notification[] = [];
  unreadCount = 0;
  isOpen = false;
  isLoading = false;

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.getUserNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications:', err);
        this.isLoading = false;
      }
    });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du compteur:', err);
      }
    });
  }

  toggleNotifications(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadNotifications();
    }
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.loadUnreadCount();
      },
      error: (err) => {
        console.error('Erreur lors du marquage comme lu:', err);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
      },
      error: (err) => {
        console.error('Erreur lors du marquage de toutes comme lues:', err);
      }
    });
  }

  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        if (!notification.read) {
          this.unreadCount--;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
      }
    });
  }

  navigateToLink(notification: Notification): void {
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
      this.markAsRead(notification);
      this.isOpen = false;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'DOSSIER_CREATED':
        return '📄';
      case 'DOSSIER_VALIDATED':
        return '✅';
      case 'DOSSIER_REJECTED':
        return '❌';
      case 'RDV_CONFIRMED':
        return '📅';
      case 'RDV_CANCELLED':
        return '🗓️';
      case 'PAYMENT_RECEIVED':
        return '💳';
      case 'PAYMENT_FAILED':
        return '💰';
      default:
        return '🔔';
    }
  }

  closeNotifications(): void {
    this.isOpen = false;
  }
}
