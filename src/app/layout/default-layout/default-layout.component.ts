import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { adminNav, agentNav, citoyenNav, NavItem, publicNav } from './nav';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    DefaultHeaderComponent, 
    DefaultFooterComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
  
  public isAuthPage: boolean = false;
  public navItems: NavItem[] = [];

  ngOnInit(): void {
    this.updateLayout();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLayout();
    });

    this.authService.currentUser$.subscribe(() => {
      this.generateMenu();
    });
  }

  private updateLayout(): void {
    const url = this.router.url;
    this.isAuthPage = url.includes('/login') || url.includes('/register');
    this.generateMenu();
  }

  private generateMenu(): void {
    const role = this.authService.getRole();
    
    let items = [...publicNav];

    if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN') {
      items = [...items, ...adminNav];
    } 
    else if (role === 'ROLE_AGENT') {
      items = [...items, ...agentNav];
    } 
    else if (role === 'ROLE_CITOYEN') {
      items = [...items, ...citoyenNav];
    }

    this.navItems = items;
  }

  getInitials(user: any): string {
    const prenom = user.prenom || '';
    const nom = user.nom || '';
    const firstInitial = prenom.charAt(0);
    const lastInitial = nom.charAt(0);
    const initial = (firstInitial || lastInitial || 'U').toUpperCase();
    return initial;
  }
}