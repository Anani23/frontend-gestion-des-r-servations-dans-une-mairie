import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contact-mairie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-mairie.component.html',
  styleUrls: ['./contact-mairie.component.scss']
})
export class ContactMairieComponent {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/contacts`;

  contact = {
    nom: '',
    email: '',
    objet: '',
    message: ''
  };

  isSubmitting = false;
  confirmation = false;
  errorMessage = '';

  envoyerMessage() {
    if (!this.contact.email || !this.contact.message) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      ...this.contact,
      dateEnvoi: new Date().toISOString(),
      statut: 'NON_LU'
    };

    this.http.post(this.API_URL, payload)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.confirmation = true;
          this.resetForm();
          setTimeout(() => this.confirmation = false, 5000);
        },
        error: (err) => {
          console.error('Erreur lors de l\'envoi', err);
          this.errorMessage = "Impossible d'envoyer votre message pour le moment. Veuillez réessayer.";
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
  }

  private resetForm() {
    this.contact = { nom: '', email: '', objet: '', message: '' };
  }
}