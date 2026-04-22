import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  nouveauNom = '';
  nouveauRole: 'ADMIN' | 'AGENT' | 'CITOYEN' = 'CITOYEN';

  modalOuvert = false;
  userModifie: User = { nom: '', role: 'CITOYEN' };
  indexModifie = -1;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.users = this.authService.getUsers();
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredUsers = this.users.filter(u => 
      u.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  ajouter(): void {
    if (!this.nouveauNom.trim()) return;

    const ok = this.authService.register({
      nom: this.nouveauNom,
      role: this.nouveauRole,
      password: '1234'
    });

    if (!ok) {
      alert('Cet utilisateur existe déjà');
      return;
    }

    this.nouveauNom = '';
    this.refresh();
  }

  supprimer(nom: string): void {
    if (confirm(`Voulez-vous vraiment supprimer l'utilisateur ${nom} ?`)) {
      this.authService.deleteUser(nom);
      this.refresh();
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
    if (this.indexModifie === -1) return;
    this.authService.updateUser(this.indexModifie, this.userModifie);
    this.refresh();
    this.fermerModal();
  }
}