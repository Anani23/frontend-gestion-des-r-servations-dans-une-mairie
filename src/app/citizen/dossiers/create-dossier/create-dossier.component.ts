import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DossiersService } from '../../../services/dossiers.service';
import { CategorieBienService } from '../../../services/categorie-bien.service';
import { CategorieBien } from '../../../models/categorie-bien.model';

interface DynamicField {
  label: string;
  key: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

@Component({
  selector: 'app-create-dossier',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-dossier.component.html',
  styleUrls: ['./create-dossier.component.scss']
})
export class CreateDossierComponent implements OnInit {

  services: CategorieBien[] = [];
  selectedService: CategorieBien | null = null;
  type = '';
  description = '';
  details: Record<string, string> = {};
  successMessage = '';
  dynamicFields: DynamicField[] = [];

  private fieldsByServiceName: Record<string, DynamicField[]> = {
    'URBANISATION': [
      { label: 'Zone du terrain', key: 'zone', type: 'text', placeholder: 'Ex: Zone résidentielle', required: true },
      { label: 'Surface (m²)', key: 'surface', type: 'text', placeholder: 'Ex: 500', required: true },
      { label: 'Quartier', key: 'quartier', type: 'text', placeholder: 'Ex: Bè, Agoè...', required: true },
      { label: 'Adresse du terrain', key: 'adresse', type: 'text', placeholder: 'Quartier, N° de lot...', required: true },
    ],
    'ÉTAT CIVIL': [
      { label: 'Nom complet', key: 'nom', type: 'text', placeholder: 'Nom et prénom', required: true },
      { label: 'Date de naissance', key: 'dateNaissance', type: 'date', required: true },
      { label: 'Nationalité', key: 'nationalite', type: 'text', placeholder: 'Ex: Togolaise', required: true },
      { label: 'Nom du père', key: 'nomPere', type: 'text', placeholder: 'Nom complet du père' },
      { label: 'Nom de la mère', key: 'nomMere', type: 'text', placeholder: 'Nom complet de la mère' },
    ],
    'ACTE DE NAISSANCE': [
      { label: 'Nom complet', key: 'nom', type: 'text', placeholder: 'Nom et prénom', required: true },
      { label: 'Date de naissance', key: 'dateNaissance', type: 'date', required: true },
      { label: 'Nationalité', key: 'nationalite', type: 'text', placeholder: 'Ex: Togolaise', required: true },
      { label: 'Nom du père', key: 'nomPere', type: 'text', placeholder: 'Nom complet du père' },
      { label: 'Nom de la mère', key: 'nomMere', type: 'text', placeholder: 'Nom complet de la mère' },
    ],
    'FISCALITÉ': [
      { label: 'Numéro fiscal (NIF)', key: 'numeroFiscal', type: 'text', placeholder: 'NIF', required: true },
      { label: 'Année fiscale', key: 'anneeFiscale', type: 'text', placeholder: 'Ex: 2026' },
    ],
  };

  private defaultFields: DynamicField[] = [
    { label: 'Nom complet', key: 'nom', type: 'text', placeholder: 'Nom et prénom', required: true },
    { label: 'Motif de la demande', key: 'motif', type: 'text', placeholder: 'Précisez votre demande' },
  ];

  constructor(
    private dossiersService: DossiersService,
    private categorieService: CategorieBienService
  ) {}

  ngOnInit(): void {
    this.categorieService.getCategoriesServices().subscribe({
      next: (data) => this.services = data || [],
      error: (err) => console.error('Erreur chargement services', err)
    });
  }

  get selectedServiceName(): string {
    return this.selectedService?.nom || '';
  }

  onServiceChange(): void {
    this.details = {};
    if (this.selectedService) {
      const nomUpper = this.selectedService.nom.toUpperCase();
      this.dynamicFields = this.fieldsByServiceName[nomUpper] || this.defaultFields;
    } else {
      this.dynamicFields = [];
    }
  }

  creerDossier(): void {
    if (!this.selectedService || !this.type) return;

    const nouveauDossier = {
      id: Math.floor(Math.random() * 1000),
      citoyen: 'Utilisateur Connecté',
      serviceNom: this.selectedService.nom,
      serviceId: this.selectedService.id,
      type: this.type,
      date: new Date(),
      description: this.description,
      statut: 'EN ATTENTE',
      details: { ...this.details }
    };

    this.dossiersService.ajouterDossier(nouveauDossier).subscribe(() => {
      this.successMessage = "Votre dossier a été transmis à l'agent instructeur.";
      this.resetForm();
    });
  }

  resetForm(): void {
    this.selectedService = null;
    this.type = '';
    this.description = '';
    this.details = {};
    this.dynamicFields = [];
    setTimeout(() => this.successMessage = '', 4000);
  }
}
