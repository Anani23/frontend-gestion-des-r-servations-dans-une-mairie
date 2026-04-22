import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  isLoggedIn: boolean = false;
  userName: string = '';
  role: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkUserStatus();
  }

  /**
   * Vérifie l'état de l'utilisateur au chargement
   */
  checkUserStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName();
      this.role = this.authService.getRole();
    }
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}