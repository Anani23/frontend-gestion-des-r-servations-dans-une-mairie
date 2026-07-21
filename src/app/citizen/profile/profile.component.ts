import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  isSaving = false;
  success = false;

  selectedImage: string | ArrayBuffer | null = null;

  user = {
    nom: 'Sidoine Barrigah',
    prenom: 'Ariel',
    email: 'citoyen@lome.tg',
    telephone: '+228 90 00 00 00',
    adresse: 'Lomé, Togo',
    photo: null as string | null
  };

  onImageSelected(event: any): void {

    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result;
      this.user.photo = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  saveProfile(): void {

    this.isSaving = true;

    setTimeout(() => {

      this.isSaving = false;
      this.success = true;

      setTimeout(() => this.success = false, 3000);

    }, 1200);
  }
}