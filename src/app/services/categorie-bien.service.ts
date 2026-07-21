import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CategorieApi {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  icon?: string;
  type: string;
  parentId?: number;
  parentNom?: string;
  sousCategories?: CategorieApi[];
}

@Injectable({
  providedIn: 'root'
})
export class CategorieBienService {

  private api = `${environment.apiUrl}/api/categories`;

  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  // =========================
  // GET ALL / TREE
  // =========================
  getTreeCategories(): Observable<CategorieApi[]> {
    return this.http.get<CategorieApi[]>(`${this.api}/tree`);
  }

  getCategoriesParentes(): Observable<CategorieApi[]> {
    return this.getTreeCategories();
  }

  getCategorieById(id: number): Observable<CategorieApi> {
    return this.http.get<CategorieApi>(`${this.api}/${id}`);
  }

  getSousCategories(parentId: number): Observable<CategorieApi[]> {
    return this.getTreeCategories().pipe(
      map(tree => this.findChildren(tree, parentId))
    );
  }

  private findChildren(categories: CategorieApi[], parentId: number): CategorieApi[] {
    for (const category of categories) {
      if (category.id === parentId) {
        return category.sousCategories ?? [];
      }
      if (category.sousCategories?.length) {
        const children = this.findChildren(category.sousCategories, parentId);
        if (children.length) {
          return children;
        }
      }
    }
    return [];
  }

  // =========================
  // CREATE
  // =========================
  createCategorie(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('categorie', JSON.stringify(data));
    if (data.imageFile) {
      formData.append('file', data.imageFile);
    }
    return this.http.post(this.api, formData);
  }

  // =========================
  // UPDATE
  // =========================
  updateCategorie(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('categorie', JSON.stringify(data));
    if (data.imageFile) {
      formData.append('file', data.imageFile);
    }
    return this.http.put(`${this.api}/${data.id}`, formData);
  }

  // =========================
  // DELETE
  // =========================
  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  // =========================
  // REFRESH TRIGGER
  // =========================
  refresh(): void {
    this.refreshSubject.next();
  }
}