import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {
  private authService = inject(AuthService);
  
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  isLoading = false;
  
  // Nouveaux champs pour l'ajout (Besoin de l'email pour l'interface User)
  nouveauNom = '';
  nouveauPrenom = '';
  nouvelEmail = '';
  nouveauRole: 'ROLE_ADMIN' | 'ROLE_AGENT' | 'ROLE_CITOYEN' = 'ROLE_CITOYEN';
  
  modalOuvert = false;
  
  // Correction TS2741 : Initialisation avec l'email obligatoire
  userModifie: User = { nom: '', prenom: '', email: '', role: 'ROLE_CITOYEN' };
  indexModifie = -1;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.isLoading = true;
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(u => 
      u.nom.toLowerCase().includes(term) || 
      (u.email && u.email.toLowerCase().includes(term)) || 
      u.role.toLowerCase().includes(term)
    );
  }

  validerCompte(id: number | undefined): void {
    if (!id) return;
    if (confirm("Voulez-vous valider ce compte pour l'Hôtel de Ville de Lomé ?")) {
      this.authService.validateUser(id).subscribe({
        next: () => {
          alert("Compte activé avec succès !");
          this.refresh();
        },
        error: () => alert("Erreur lors de la validation")
      });
    }
  }

  ajouter(): void {
    // Vérification des champs obligatoires
    if (!this.nouveauNom.trim() || !this.nouvelEmail.trim()) {
      alert("Le nom et l'email sont obligatoires.");
      return;
    }

    // Correction TS2345 : Envoi de l'objet User complet
    const nouvelUtilisateur: User = {
      nom: this.nouveauNom,
      prenom: this.nouveauPrenom,
      email: this.nouvelEmail,
      role: this.nouveauRole,
      password: 'DefaultPassword123!', // Mot de passe par défaut
      enabled: true
    };

    this.authService.createUserAsAdmin(nouvelUtilisateur).subscribe({
      next: () => {
        this.resetFormulaire();
        this.refresh();
      },
      error: (err) => alert("Erreur lors de l'ajout : " + err.error?.message)
    });
  }

  supprimer(id: number | undefined): void {
    if (!id) return;
    if (confirm("Supprimer cet utilisateur ?")) {
      this.authService.deleteUser(id).subscribe(() => this.refresh());
    }
  }

  ouvrirModal(user: User, index: number): void {
    this.userModifie = { ...user };
    this.indexModifie = index;
    this.modalOuvert = true;
  }

  fermerModal(): void { 
    this.modalOuvert = false; 
  }

  enregistrer(): void {
    this.authService.updateUser(this.userModifie).subscribe({
      next: () => {
        this.refresh();
        this.fermerModal();
      },
      error: () => alert("Erreur lors de la modification")
    });
  }

  private resetFormulaire(): void {
    this.nouveauNom = '';
    this.nouveauPrenom = '';
    this.nouvelEmail = '';
    this.nouveauRole = 'ROLE_CITOYEN';
  }
}