import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { DossiersService } from '../../../services/dossiers.service';
import { ServiceService } from '../../../services/service.service';
import { PaymentService } from '../../../services/payment.service';
import { Dossier } from '../../../models/dossier.model';

@Component({
  selector: 'app-create-dossier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-dossier.component.html',
  styleUrls: ['./create-dossier.component.scss']
})
export class CreateDossierComponent implements OnInit {

  private authService = inject(AuthService);
  private dossiersService = inject(DossiersService);
  private serviceService = inject(ServiceService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  services: any[] = [];
  serviceId: number | null = null;
  description = '';
  details: any = {};
  selectedFile: File | null = null;
  dossierCreeId: number | null = null;

  isLoading = false;
  paymentLoading = false;
  isCreated = false;
  showPaymentForm = false;
  paymentSuccess = false;
  successMessage = '';
  paymentErrorMessage = '';

  // Formulaire de paiement
  paymentMethod = 'MIXX_YAS';
  phoneNumber = '';
  paymentAmount = 0;

  serviceFields: any = {
    1: [
      { key: 'nomEnfant', label: "Nom de l'enfant", type: 'text', required: true },
      { key: 'dateNaissance', label: 'Date de naissance', type: 'date', required: true }
    ],
    2: [
      { key: 'numParcelle', label: 'Numéro de parcelle', type: 'text', required: true },
      { key: 'quartier', label: 'Quartier', type: 'text', required: true }
    ],
    3: [
      { key: 'typeDocument', label: 'Nature du document', type: 'text', required: true }
    ],
    4: [
      { key: 'motif', label: "Motif de l'intervention", type: 'textarea', required: true }
    ]
  };

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Vous devez être connecté pour créer un dossier.');
      this.router.navigate(['/login']);
      return;
    }
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.services = data;
        } else if (data?.content) {
          this.services = data.content;
        } else {
          this.services = [];
        }
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement services : ', err);
        this.services = [];
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  get selectedService(): any {
    return this.services.find((s: any) => s.id === this.serviceId);
  }

  get selectedServiceName(): string {
    return this.selectedService?.nom || this.selectedService?.name || '';
  }

  get currentFields(): any[] {
    return this.serviceFields[this.serviceId || 0] || [];
  }

  onServiceChange(): void {
    this.details = {};
    if (this.selectedService) {
      this.paymentAmount = this.selectedService.prix > 0 ? this.selectedService.prix : 0;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Le fichier est trop volumineux. Taille max: 100MB.');
        event.target.value = '';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  creerDossier(): void {
    if (!this.serviceId) {
      alert('Veuillez sélectionner un service municipal.');
      return;
    }
    if (!this.selectedFile) {
      alert('Veuillez joindre une pièce justificative.');
      return;
    }

    const dossier: Dossier = {
      typePrestation: this.selectedServiceName,
      description: this.description,
      details: this.details,
      statut: 'EN_ATTENTE'
    };

    console.log('📤 Envoi du dossier:', dossier);

    this.isLoading = true;

    this.dossiersService.ajouterDossier(dossier, this.selectedFile).subscribe({
      next: (res: Dossier) => {
        console.log('✅ Dossier créé:', res);
        this.isLoading = false;
        this.isCreated = true;
        this.successMessage = 'Votre demande a été enregistrée avec succès. Vous pouvez maintenant procéder au paiement.';
        this.dossierCreeId = res.id || null;
        this.cdr.markForCheck();
        this.cdr.detectChanges();

        // Faire défiler jusqu'au message de succès
        setTimeout(() => {
          const successElement = document.querySelector('.success-message');
          if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();

        if (err.status === 401 || err.status === 403) {
          alert('Session expirée. Veuillez vous reconnecter.');
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }

        const errorMsg = err?.error?.message || 'Erreur lors de l\'envoi du dossier. Veuillez réessayer.';
        alert(errorMsg);
      }
    });
  }

  submitPayment(): void {
    if (!this.phoneNumber && this.paymentMethod !== 'CASH') {
      this.paymentErrorMessage = 'Veuillez entrer un numéro de téléphone.';
      return;
    }

    const dossierIdValue = this.dossierCreeId === null ? undefined : this.dossierCreeId;

    const paymentRequest = {
      amount: this.paymentAmount,
      currency: 'XOF',
      paymentMethod: this.paymentMethod as 'MIXX_YAS' | 'MOOV_MONEY' | 'TMONEY' | 'CASH' | 'CARD',
      phoneNumber: this.phoneNumber,
      description: `Paiement dossier #${this.dossierCreeId} - ${this.selectedServiceName}`,
      dossierId: dossierIdValue
    };

    this.paymentLoading = true;
    this.paymentErrorMessage = '';

    this.paymentService.initiatePayment(paymentRequest).subscribe({
      next: (response) => {
        this.paymentSuccess = true;
        this.paymentLoading = false;
        this.successMessage = 'Paiement effectué avec succès !';
        this.cdr.markForCheck();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/citizen/dossiers']);
        }, 3000);
      },
      error: (err) => {
        this.paymentLoading = false;
        console.error('Erreur lors du paiement', err);
        this.paymentErrorMessage = "Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.";
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  allerVersRdv(): void {
    this.router.navigate(['/citizen/rdv/nouveau'], {
      queryParams: {
        dossierId: this.dossierCreeId,
        prestation: this.selectedServiceName
      }
    });
  }

  retourAuDashboard(): void {
    this.router.navigate(['/citizen/dashboard']);
  }
}