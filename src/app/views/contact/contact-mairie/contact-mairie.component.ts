import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-mairie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-mairie.component.html',
  styleUrls: ['./contact-mairie.component.scss']
})
export class ContactMairieComponent {
  // Objet de formulaire unique pour plus de clarté
  contact = {
    nom: '',
    email: '',
    objet: '',
    message: ''
  };

  isSubmitting: boolean = false;
  confirmation: boolean = false;

  async envoyerMessage() {
    this.isSubmitting = true;
    
    // Simulation d'un appel API avec un délai
    await new Promise(resolve => setTimeout(resolve, 1500));

    const payload = {
      ...this.contact,
      dateEnvoi: new Date().toISOString()
    };

    console.log('Message transmis au service municipal :', payload);

    this.isSubmitting = false;
    this.confirmation = true;
    this.resetForm();

    // Fermeture automatique du toast
    setTimeout(() => this.confirmation = false, 6000);
  }

  private resetForm() {
    this.contact = { nom: '', email: '', objet: '', message: '' };
  }
}