import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {

  services = ['État civil', 'Urbanisme'];

  nouveau = '';

  ajouter() {
    if (this.nouveau) {
      this.services.push(this.nouveau);
      this.nouveau = '';
    }
  }

  supprimer(i: number) {
    this.services.splice(i, 1);
  }
}