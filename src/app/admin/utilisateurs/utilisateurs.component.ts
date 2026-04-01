import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent {

  users = [
    { nom: 'Admin', role: 'ADMIN' },
    { nom: 'Agent 1', role: 'AGENT' },
    { nom: 'Jean', role: 'CITOYEN' }
  ];

  nouveauNom = '';
  nouveauRole = 'CITOYEN';

  ajouter() {
    this.users.push({
      nom: this.nouveauNom,
      role: this.nouveauRole
    });

    this.nouveauNom = '';
  }

  supprimer(i: number) {
    this.users.splice(i, 1);
  }
}