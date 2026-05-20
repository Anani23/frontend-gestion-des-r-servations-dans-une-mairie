import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieService } from '../models/categorie-service.model';

@Injectable({
  providedIn: 'root',
})
export class CategorieServiceService {

  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CategorieService[]> {
    return this.http.get<CategorieService[]>(`${this.apiUrl}/type/services`);
  }

  create(categorie: Partial<CategorieService>): Observable<CategorieService> {
    return this.http.post<CategorieService>(this.apiUrl, {
      ...categorie,
      type: 'services'
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
