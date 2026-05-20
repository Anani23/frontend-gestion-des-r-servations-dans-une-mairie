import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorieBien } from '../models/categorie-bien.model';

@Injectable({
  providedIn: 'root'
})
export class CategorieBienService {

  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getTreeCategories(): Observable<CategorieBien[]> {
    return this.http.get<CategorieBien[]>(this.apiUrl);
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
    return this.http.get<CategorieBien[]>(`${this.apiUrl}/type/biens`);
  }

  getSousCategories(parentId: number): Observable<CategorieBien[]> {
    return this.http.get<CategorieBien[]>(`${this.apiUrl}/${parentId}`);
  }

  getCategorieById(id: number): Observable<CategorieBien> {
    return this.http.get<CategorieBien>(`${this.apiUrl}/${id}`);
  }
}
