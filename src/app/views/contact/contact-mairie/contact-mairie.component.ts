import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-mairie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-mairie.component.html',
  styleUrls: ['./contact-mairie.component.scss'],
})
export class ContactMairieComponent {
  nom: string = '';
  email: string = '';
  objet: string = '';
  message: string = '';
  confirmation: boolean = false;

  envoyerMessage() {
    console.log({
      nom: this.nom,
      email: this.email,
      objet: this.objet,
      message: this.message
    });

    // Afficher confirmation
    this.confirmation = true;

    // Reset du formulaire
    this.nom = '';
    this.email = '';
    this.objet = '';
    this.message = '';
  }
}