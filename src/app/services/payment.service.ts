import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: 'MIXX_YAS' | 'MOOV_MONEY' | 'TMONEY' | 'CASH' | 'CARD';
  phoneNumber: string;
  description: string;
  dossierId?: number;
  reservationId?: number;
}

export interface PaymentResponse {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  phoneNumber: string;
  transactionId: string;
  description: string;
  dossierId?: number;
  reservationId?: number;
  createdAt: string;
  message: string;
  nomCitoyen?: string;
  referenceDossier?: string;
  nomBien?: string;
  /** URL CinetPay vers laquelle rediriger le citoyen pour finaliser le paiement. */
  paymentUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/payments`;

  initiatePayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/initiate`, request);
  }

  getPaymentById(id: number): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/${id}`);
  }

  getPaymentByReference(reference: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/reference/${reference}`);
  }

  getUserPayments(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.apiUrl}/user`);
  }

  // Vue d'ensemble de tous les paiements (admin)
  getAllPayments(): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${environment.apiUrl}/api/admin/payments`);
  }

  getDossierPayments(dossierId: number): Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.apiUrl}/dossier/${dossierId}`);
  }

  verifyPayment(transactionId: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/verify/${transactionId}`, {});
  }

  /**
   * Revérifie le statut réel d'une transaction auprès de la passerelle (CinetPay),
   * à appeler quand le citoyen revient de la page de paiement hébergée.
   */
  getStatutByTransactionId(transactionId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.apiUrl}/statut/${transactionId}`);
  }
}