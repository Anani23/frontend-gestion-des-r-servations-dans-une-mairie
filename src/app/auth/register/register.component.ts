import { CommonModule } from '@angular/common'; // Pour *ngIf
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Pour ngModel et ngForm
import { Router, RouterModule } from '@angular/router'; // Pour routerLink
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true, // Ton composant est probablement standalone
  imports: [CommonModule, FormsModule, RouterModule], // ✅ CRITIQUE : On ajoute les imports ici
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  password = '';
  confirmPassword = '';
  role: 'ROLE_CITOYEN' | 'ROLE_AGENT' = 'ROLE_CITOYEN';
  
  availableRoles = [
    { value: 'ROLE_CITOYEN' as const, label: 'Citoyen' },
    { value: 'ROLE_AGENT' as const, label: 'Agent Municipal' }
  ];
  
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    // Validation du formulaire
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = "Le mot de passe doit contenir au moins 8 caractères.";
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    if (!this.role) {
      this.errorMessage = "Veuillez sélectionner un rôle.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Utilise le rôle sélectionné par l'utilisateur
    const registerData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      role: this.role,
      password: this.password
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription.";
      }
    });
  }
}