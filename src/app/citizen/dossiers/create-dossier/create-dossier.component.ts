import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-dossier',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-dossier.component.html',
  styleUrls: ['./create-dossier.component.scss']
})
export class CreateDossierComponent {

  services = [
    { id: 1, name: 'État civil' },
    { id: 2, name: 'Urbanisme' },
    { id: 3, name: 'Fiscalité' },
  ];

  serviceId: number | null = null;
  type = '';
  description = '';
  details: any = {};

  serviceFields: any = {
    1: [
      { label: 'Nom complet', key: 'nom', type: 'text', placeholder: 'Nom et prénom' },
      { label: 'Date de naissance', key: 'dateNaissance', type: 'date' },
      { label: 'Lieu de naissance', key: 'lieuNaissance', type: 'text' },
    ],
    2: [
      { label: 'Adresse du terrain', key: 'adresse', type: 'text', placeholder: 'Adresse complète' },
      { label: 'Type de projet', key: 'typeProjet', type: 'text' },
    ],
    3: [
      { label: 'Numéro fiscal', key: 'numeroFiscal', type: 'text' },
      { label: 'Année fiscale', key: 'annee', type: 'number', placeholder: 'Ex: 2026' },
    ]
  };

  get selectedServiceName(): string {
    const s = this.services.find(s => s.id === this.serviceId);
    return s ? s.name : '';
  }

  creerDossier() {
    if (!this.serviceId) {
      alert('Veuillez sélectionner un service.');
      return;
    }

    const dossier = {
      service: this.selectedServiceName,
      type: this.type,
      description: this.description,
      details: this.details
    };

    console.log(dossier);
    alert('Dossier créé !');
  }
}