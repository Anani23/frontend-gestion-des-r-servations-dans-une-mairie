import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    // 1. Validation de base
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas";
      return;
    }

    // 2. Création de l'objet utilisateur (Rôle CITOYEN par défaut)
    const newUser: User = {
      nom: this.name,
      email: this.email,
      password: this.password,
      role: 'CITOYEN'
    };

    // 3. Appel au service
    const success = this.authService.register(newUser);

    if (success) {
      alert("Compte créé avec succès ! Connectez-vous maintenant.");
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = "Ce nom d'utilisateur est déjà utilisé";
    }
  }
}