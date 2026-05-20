import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieBien } from '../models/categorie-bien.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategorieBienService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getTreeCategories(): Observable<CategorieBien[]> {
    return this.http.get<CategorieBien[]>(this.apiUrl);
  }

  getCategoriesBiens(): Observable<CategorieBien[]> {
    return this.http.get<CategorieBien[]>(`${this.apiUrl}/biens`);
  }

  getCategoriesServices(): Observable<CategorieBien[]> {
    return this.http.get<CategorieBien[]>(`${this.apiUrl}/services`);
  }

  getCategoriesByType(type: string): Observable<CategorieBien[]> {
    return this.http.get<CategorieBien[]>(`${this.apiUrl}/type/${type}`);
  }

  ajouterCategorie(categorie: Partial<CategorieBien>): Observable<CategorieBien> {
    return this.http.post<CategorieBien>(this.apiUrl, categorie);
  }

  modifierCategorie(categorie: CategorieBien): Observable<CategorieBien> {
    return this.http.put<CategorieBien>(`${this.apiUrl}/${categorie.id}`, categorie);
  }

  supprimerCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategoriesParentes(): Observable<CategorieBien[]> {
    return this.http.get<CategorieBien[]>(this.apiUrl);
  }

  getCategorieById(id: number): Observable<CategorieBien> {
    return this.http.get<CategorieBien>(`${this.apiUrl}/${id}`);
  }
}
