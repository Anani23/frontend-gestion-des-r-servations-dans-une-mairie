import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  nom = '';
  password = '';

  error = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    if (!this.nom.trim() || !this.password.trim()) {
      this.error = "Veuillez remplir tous les champs.";
      return;
    }

    this.isLoading = true;
    this.error = '';

    setTimeout(() => {
      const user = this.authService.login(this.nom, this.password);

      this.isLoading = false;

      if (!user) {
        this.error = "Nom d'utilisateur ou mot de passe incorrect.";
        return;
      }

      this.redirectByRole(user.role);

    }, 300); // simulation loading UI
  }

  private redirectByRole(role: string): void {
    const routes: Record<string, string> = {
      ADMIN: '/admin',
      AGENT: '/agent',
      CITOYEN: '/citizen'
    };

    this.router.navigate([routes[role] || '/accueil']);
  }
}