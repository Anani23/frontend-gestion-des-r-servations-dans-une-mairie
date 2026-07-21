import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { RdvService, Rdv } from '../../services/rdv.service';
import { DossiersService } from '../../services/dossiers.service';
import { Dossier } from '../../models/dossier.model';

@Component({
  selector: 'app-prendre-rdv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './prendre-rdv.component.html',
  styleUrls: ['./prendre-rdv.component.scss']
})
export class PrendreRdvComponent implements OnInit {

  private rdvService = inject(RdvService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dossiersService = inject(DossiersService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;
  isSuccess = false;
  errorMessage: string | null = null;
  
  // ✅ Propriété pour la date minimale (empêche de choisir une date passée)
  minDate: string = '';

  dossierId: string | null = null;
  nomPrestation: string = '';
  dossiers: Dossier[] = [];

  form = {
    dossierId: '',
    motif: '',
    dateDebut: '',
    dateFin: ''
  };

  ngOnInit(): void {
    // ✅ Définit la date minimale à aujourd'hui
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    this.loadDossiers();
    this.route.queryParams.subscribe(params => {
      this.dossierId = params['dossierId'] || null;
      this.nomPrestation = params['prestation'] || '';

      if (this.dossierId) {
        this.form.dossierId = this.dossierId;
        this.form.motif = `Dépôt des pièces physiques pour le dossier de : ${this.nomPrestation}`;
      }
    });
  }

  loadDossiers(): void {
    this.dossiersService.getMesDossiers().subscribe({
      next: (data) => {
        this.dossiers = data || [];
        console.log('📂 Dossiers chargés pour RDV:', this.dossiers);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des dossiers:', err);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  onDossierChange(): void {
    const selectedDossier = this.dossiers.find(d => d.id?.toString() === this.form.dossierId);
    if (selectedDossier) {
      this.nomPrestation = selectedDossier.typePrestation;
      this.form.motif = `Dépôt des pièces physiques pour le dossier de : ${selectedDossier.typePrestation}`;
    }
  }

  submit(): void {
    // Réinitialiser l'erreur
    this.errorMessage = null;

    // Validations
    if (!this.form.dossierId && !this.dossierId) {
      this.errorMessage = 'Veuillez sélectionner un dossier.';
      return;
    }
    if (!this.form.dateDebut) {
      this.errorMessage = 'Veuillez sélectionner une date.';
      return;
    }
    if (!this.form.motif) {
      this.errorMessage = 'Veuillez renseigner le motif de votre visite.';
      return;
    }

    this.isLoading = true;

    const dossierIdValue = this.form.dossierId || this.dossierId;

    const payload = {
      motif: this.form.motif,
      dateDebut: `${this.form.dateDebut}T08:00:00`,
      dateFin: this.form.dateFin ? `${this.form.dateFin}T09:00:00` : undefined,
      dossierId: dossierIdValue ? Number(dossierIdValue) : undefined
    };

    console.log('🚀 Envoi du rendez-vous:', payload);

    this.rdvService.createRdv(payload).subscribe({
      next: (response) => {
        console.log('✅ Rendez-vous créé avec succès:', response);
        this.isSuccess = true;
        this.isLoading = false;

        // Réinitialisation du formulaire
        this.form = {
          dossierId: '',
          motif: '',
          dateDebut: '',
          dateFin: ''
        };
        this.cdr.markForCheck();
        this.cdr.detectChanges();

        // Redirection après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/citizen/rdv/mes-rdv']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Erreur création rendez-vous:', err);
        this.isLoading = false;

        // Message d'erreur plus détaillé
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 500) {
          this.errorMessage = 'Erreur serveur (500). Vérifie que le backend Spring Boot est bien configuré.';
        } else if (err.status === 401) {
          this.errorMessage = 'Vous devez être connecté pour prendre un rendez-vous.';
        } else if (err.status === 400) {
          this.errorMessage = 'Données invalides. Vérifie les champs du formulaire.';
        } else {
          this.errorMessage = 'Erreur lors de la réservation du créneau. Veuillez réessayer.';
        }
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }
}