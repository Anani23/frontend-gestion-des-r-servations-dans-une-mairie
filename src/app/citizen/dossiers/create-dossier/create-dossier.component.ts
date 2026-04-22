import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DossiersService } from '../../../services/dossiers.service';
@Component({
  selector: 'app-create-dossier',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-dossier.component.html',
  styleUrls: ['./create-dossier.component.scss']
})
export class CreateDossierComponent {
  // Liste des services (Normalement récupérée d'un ServicesService créé par l'Admin)
  services = [
    { id: 1, name: 'État civil' },
    { id: 2, name: 'Urbanisme' },
    { id: 3, name: 'Fiscalité' },
  ];

  serviceId: number | null = null;
  type = '';
  description = '';
  details: any = {};
  successMessage = '';

  serviceFields: any = {
    1: [
      { label: 'Nom complet', key: 'nom', type: 'text', placeholder: 'Nom et prénom', required: true },
      { label: 'Date de naissance', key: 'dateNaissance', type: 'date', required: true },
    ],
    2: [
      { label: 'Adresse du terrain', key: 'adresse', type: 'text', placeholder: 'Quartier, N° de lot...', required: true },
    ],
    3: [
      { label: 'Numéro fiscal', key: 'numeroFiscal', type: 'text', placeholder: 'NIF', required: true },
    ]
  };

  // Injection du service Dossiers
  constructor(private dossiersService: DossiersService) {}

  get selectedServiceName(): string {
    return this.services.find(s => s.id === this.serviceId)?.name || '';
  }

  onServiceChange() {
    this.details = {};
  }

  creerDossier() {
    if (!this.serviceId || !this.type) return;

    // Création de l'objet lié
    const nouveauDossier = {
      id: Math.floor(Math.random() * 1000), // Simulation ID
      citoyen: 'Utilisateur Connecté', // Ici, on lierait l'utilisateur auth
      serviceNom: this.selectedServiceName, // Lien vers le service Admin
      type: this.type,
      date: new Date(),
      description: this.description,
      statut: 'EN ATTENTE',
      details: { ...this.details }
    };

    // APPEL AU SERVICE (Lien réel)
    this.dossiersService.ajouterDossier(nouveauDossier).subscribe(() => {
      this.successMessage = "✅ Votre dossier a été transmis à l'agent instructeur.";
      this.resetForm();
    });
  }

  resetForm() {
    this.serviceId = null;
    this.type = '';
    this.description = '';
    this.details = {};
    setTimeout(() => this.successMessage = '', 4000);
  }
}