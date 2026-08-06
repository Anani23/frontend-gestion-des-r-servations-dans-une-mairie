import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-default-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss']
})
export class DefaultHeaderComponent implements OnInit {
  
  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn: boolean = false;
  userName: string = '';
  role: string = '';

  ngOnInit(): void {
    // Écoute les changements d'utilisateur en temps réel
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.userName = this.authService.getUserName();
        this.role = user.role;
      } else {
        this.userName = '';
        this.role = '';
      }
    });
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  /** Identite visuelle par role, cohérente avec la nav (default-layout). */
  get roleThemeClass(): string {
    if (this.role === 'ROLE_ADMIN' || this.role === 'ROLE_SUPER_ADMIN') return 'theme-admin';
    if (this.role === 'ROLE_AGENT') return 'theme-agent';
    if (this.role === 'ROLE_CITOYEN') return 'theme-citoyen';
    return '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}