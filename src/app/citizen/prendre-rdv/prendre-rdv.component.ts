import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../services/rdv.service';

@Component({
  selector: 'app-prendre-rdv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prendre-rdv.component.html',
  styleUrls: ['./prendre-rdv.component.scss']
})
export class PrendreRdvComponent {

  service: string = '';
  date: string = '';
  heure: string = '';

  services: string[] = [
    'Acte de naissance',
    'Carte nationale',
    'Mariage',
    'Légalisation'
  ];

  constructor(private rdvService: RdvService) {}

  prendreRdv() {
    const rdv = {
      service: this.service,
      date: this.date,
      heure: this.heure
    };

    this.rdvService.ajouterRdv(rdv);

    console.log('RDV ajouté', rdv);

    this.service = '';
    this.date = '';
    this.heure = '';
  }
}