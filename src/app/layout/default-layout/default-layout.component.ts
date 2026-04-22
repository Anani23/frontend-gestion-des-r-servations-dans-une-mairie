import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

// Importations des composants de layout
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';

// Importations des services et menus
import { AuthService } from '../../services/auth.service';
import { adminNav, agentNav, citoyenNav, publicNav } from './nav';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule, // Indispensable pour [routerLink]
    DefaultHeaderComponent,
    DefaultFooterComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  navItems: any[] = [];
  role: string = 'Citoyen';
  isHomePage = false;
  isAuthPage = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Écoute des changements de route pour adapter le layout
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        
        // Définition des états de page
        this.isHomePage = url === '/' || url === '/accueil' || url === '/home';
        this.isAuthPage = url.includes('/login') || url.includes('/register');

        this.updateMenu();
      });
  }

  ngOnInit(): void {
    this.role = this.authService.getRole() || 'Citoyen';
    this.updateMenu();
  }

  updateMenu(): void {
    // Si on est sur l'accueil ou login, on ne montre pas la barre de navigation
    if (this.isHomePage || this.isAuthPage) {
      this.navItems = [];
      return;
    }

    // Assignation des menus selon le rôle
    const roleMenus: Record<string, any[]> = {
      'Citoyen': [...citoyenNav],
      'Agent': [...agentNav],
      'Admin': [...adminNav]
    };

    const items = roleMenus[this.role] || publicNav;
    
    // On filtre pour éviter les doublons si nécessaire
    this.navItems = items.filter(item => item.name !== 'Accueil');
  }
}