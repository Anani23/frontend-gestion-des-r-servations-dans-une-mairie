import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private API = `${environment.apiUrl}/api/admin/services-municipaux`;
  private PUBLIC_API = `${environment.apiUrl}/api/publics/prestations/catalogue`;
  private FILE_API = `${environment.apiUrl}/api/files/upload-pdf`;

  constructor(private http: HttpClient) {}

  getServices() {
    return this.http.get<Service[]>(this.API);
  }

  // Catalogue public des services actifs (espace citoyen, sans authentification)
  getServicesPublics() {
    return this.http.get<Service[]>(this.PUBLIC_API);
  }

  getServiceById(id: number) {
    return this.http.get<Service>(`${this.API}/${id}`);
  }

  ajouterService(service: Service) {
    return this.http.post<Service>(this.API, service);
  }

  modifierService(id: number, service: Service) {
    return this.http.put<Service>(`${this.API}/${id}`, service);
  }

  supprimerService(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  uploadPdf(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.FILE_API, formData, { responseType: 'text' });
  }
}