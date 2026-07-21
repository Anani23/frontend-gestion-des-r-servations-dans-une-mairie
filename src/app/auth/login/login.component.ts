import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  isLoading = false;

  login(): void {

    const email = this.email.trim().toLowerCase();
    const password = this.password.trim();

    if (!email || !password) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(email, password).subscribe({

      next: (user) => {

        this.isLoading = false;

        if (!user) {
          this.error = 'Utilisateur invalide';
          return;
        }

        const role = (user.role || '').toUpperCase().trim();

        console.log('LOGIN OK ROLE:', role);

        this.redirectByRole(role);
      },

      error: (err) => {

        this.isLoading = false;

        console.error('Login error:', err);

        this.error =
          err?.error?.message ||
          err?.error ||
          'Erreur serveur';
      }
    });
  }

  private redirectByRole(role: string): void {

    const routes: Record<string, string> = {
      'ROLE_SUPER_ADMIN': '/admin/dashboard',
      'ROLE_ADMIN': '/admin/dashboard',
      'ROLE_AGENT': '/agent/dashboard',
      'ROLE_CITOYEN': '/citizen/dashboard'
    };

    const target = routes[role] || '/accueil';

    this.router.navigateByUrl(target);
  }
}