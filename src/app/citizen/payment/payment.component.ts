import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService, PaymentRequest, PaymentResponse } from '../../services/payment.service';
import { DossiersService } from '../../services/dossiers.service';

type PaymentView = 'form' | 'redirecting' | 'pending' | 'success' | 'failed';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private dossiersService = inject(DossiersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  paymentRequest: PaymentRequest = {
    amount: 0,
    currency: 'XOF',
    paymentMethod: 'MIXX_YAS',
    phoneNumber: '',
    description: '',
    dossierId: undefined,
    reservationId: undefined
  };

  paymentResponse: PaymentResponse | null = null;
  view: PaymentView = 'form';
  isLoading = false;
  errorMessage = '';

  get isSuccess(): boolean {
    return this.view === 'success';
  }

  paymentMethods = [
    { value: 'MIXX_YAS' as const, label: 'Mixx Yas', icon: '💳' },
    { value: 'MOOV_MONEY' as const, label: 'Moov Money', icon: '📱' },
    { value: 'TMONEY' as const, label: 'T-Money', icon: '💰' }
  ];

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;

    // Retour depuis la page de paiement hébergée CinetPay : on revérifie le statut réel.
    const transactionId = params.get('transactionId') || params.get('transaction_id');
    if (transactionId) {
      this.checkReturnStatus(transactionId);
      return;
    }

    const amount = params.get('amount');
    const description = params.get('description');
    const dossierId = params.get('dossierId');
    const reservationId = params.get('reservationId');

    if (amount) {
      this.paymentRequest.amount = parseFloat(amount);
    }
    if (description) {
      this.paymentRequest.description = description;
    }
    if (dossierId) {
      this.paymentRequest.dossierId = Number(dossierId);
    }
    if (reservationId) {
      this.paymentRequest.reservationId = Number(reservationId);
    }
  }

  private checkReturnStatus(transactionId: string): void {
    this.isLoading = true;
    this.view = 'pending';

    this.paymentService.getStatutByTransactionId(transactionId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.applyStatus(response);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors de la vérification du paiement:', err);
        this.isLoading = false;
        this.view = 'failed';
        this.errorMessage = "Impossible de vérifier le statut du paiement. Contactez la mairie avec votre référence de transaction.";
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  private applyStatus(response: PaymentResponse): void {
    this.paymentResponse = response;

    if (response.status === 'COMPLETED') {
      this.view = 'success';
      if (response.dossierId) {
        this.dossiersService.updateStatut(response.dossierId, 'VALIDE', 'Paiement effectué').subscribe({
          next: () => console.log('Dossier validé après paiement'),
          error: (err) => console.error('Erreur lors de la validation du dossier:', err)
        });
      }
    } else if (response.status === 'FAILED') {
      this.view = 'failed';
      this.errorMessage = response.description || "Le paiement n'a pas abouti auprès de l'opérateur.";
    } else {
      // PENDING : paiement en espèces (à confirmer au guichet) ou mobile money pas encore validé côté opérateur.
      this.view = 'pending';
    }
  }

  initiatePayment(): void {
    if (!this.paymentRequest.phoneNumber || this.paymentRequest.phoneNumber.length < 8) {
      this.errorMessage = 'Veuillez entrer un numéro de téléphone valide (8 chiffres minimum).';
      return;
    }

    if (this.paymentRequest.amount <= 0) {
      this.errorMessage = 'Le montant doit être supérieur à 0.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.paymentService.initiatePayment(this.paymentRequest).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.paymentUrl) {
          // Paiement réel : on quitte l'application pour la page de paiement CinetPay
          // (choix de l'opérateur, saisie OTP, etc. gérés par la passerelle elle-même).
          this.paymentResponse = response;
          this.view = 'redirecting';
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          window.location.href = response.paymentUrl;
          return;
        }

        this.applyStatus(response);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du paiement:', err);
        this.errorMessage = 'Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.';
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  retryPayment(): void {
    this.view = 'form';
    this.paymentResponse = null;
    this.errorMessage = '';
  }

  cancelPayment(): void {
    this.router.navigate(['/citizen/dashboard']);
  }

  imprimerRecu(): void {
    window.print();
  }

  getSelectedPaymentMethodIcon(): string {
    const method = this.paymentMethods.find(m => m.value === this.paymentRequest.paymentMethod);
    return method ? method.icon : '💳';
  }
}
