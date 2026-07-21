import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Services
import { BienService } from '../../services/bien.service';
import { ReservationService } from '../../services/reservation.service';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule
  ],
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.scss']
})
export class CreateReservationComponent implements OnInit {

  private fb = inject(FormBuilder);
  private bienService = inject(BienService);
  private reservationService = inject(ReservationService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  paymentForm!: FormGroup;
  biens: any[] = [];

  loading = false;
  paymentLoading = false;
  success = false;
  paymentSuccess = false;
  showPaymentForm = false;
  errorMessage = '';
  paymentErrorMessage = '';
  reservationId: number | null = null;
  selectedBien: any = null;

  ngOnInit(): void {
    this.initForm();
    this.initPaymentForm();
    this.loadBiens();
  }

  initForm(): void {
    this.form = this.fb.group({
      bienId: [null, [Validators.required]],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      motif: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  initPaymentForm(): void {
    this.paymentForm = this.fb.group({
      paymentMethod: ['MIXX_YAS', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,10}$/)]],
      amount: ['', [Validators.required, Validators.min(100)]]
    });
  }

  loadBiens(): void {
    this.bienService.getBiens().subscribe({
      next: (data) => {
        this.biens = data || [];
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement biens', err);
        this.errorMessage = "Impossible de récupérer la liste des biens municipaux.";
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  onBienChange(event: any): void {
    const bienId = Number(this.form.get('bienId')?.value);
    if (bienId) {
      this.selectedBien = this.biens.find(b => Number(b.id) === bienId) || null;
      if (this.selectedBien && this.selectedBien.prixLocation) {
        this.paymentForm.patchValue({ amount: this.selectedBien.prixLocation });
      }
    } else {
      this.selectedBien = null;
    }
  }

  private toLocalDateTime(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toISOString().slice(0, 19);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { bienId, dateDebut, dateFin, motif } = this.form.value;

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (fin <= debut) {
      this.errorMessage = "La date de fin doit être strictement après la date de début.";
      return;
    }

    const payload = {
      bienId: Number(bienId),
      dateDebut: this.toLocalDateTime(dateDebut),
      dateFin: this.toLocalDateTime(dateFin),
      motif: motif
    };

    this.loading = true;
    this.errorMessage = '';

    this.reservationService.create(payload).subscribe({
      next: (response) => {
        this.reservationId = response.id;
        this.success = true;
        this.loading = false;
        this.form.reset();
        this.showPaymentForm = true;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur lors de la création', err);

        if (err.status === 403) {
          this.errorMessage = "Session expirée. Veuillez vous reconnecter.";
        } else if (err.status === 409) {
          this.errorMessage = "Ce créneau est déjà réservé pour ce bien.";
        } else {
          this.errorMessage = "Une erreur est survenue lors de l'envoi de votre demande.";
        }
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  // CORRIGÉ: Méthode submitPayment avec gestion correcte des types
  submitPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const { paymentMethod, phoneNumber, amount } = this.paymentForm.value;

    const reservationIdValue = this.reservationId === null ? undefined : this.reservationId;

    const paymentRequest = {
      amount: Number(amount),
      currency: 'XOF',
      paymentMethod: paymentMethod as 'MIXX_YAS' | 'MOOV_MONEY' | 'TMONEY' | 'CASH' | 'CARD',
      phoneNumber: phoneNumber,
      description: `Paiement réservation bien #${this.reservationId}`,
      reservationId: reservationIdValue
    };

    this.paymentLoading = true;
    this.paymentErrorMessage = '';

    this.paymentService.initiatePayment(paymentRequest).subscribe({
      next: (response) => {
        this.paymentSuccess = true;
        this.paymentLoading = false;
        this.paymentForm.reset();
        this.cdr.markForCheck();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/citizen/reservations']);
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

  isInvalid(field: string, formGroup: FormGroup = this.form): boolean {
    const control = formGroup.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}