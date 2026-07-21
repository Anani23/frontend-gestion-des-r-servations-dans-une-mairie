import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestationService {
  private apiUrl = `${environment.apiUrl}/publics/prestations`;

  constructor(private http: HttpClient) {}

  // Appelle GET /api/publics/prestations/catalogue
  getCatalogue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogue`);
  }
}