import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Service } from '../../models/service.model';
import { CategorieBienService } from '../../services/categorie-bien.service';
import { ServiceService } from '../../services/service.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  private serviceService = inject(ServiceService);
  private catService = inject(CategorieBienService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  services: Service[] = [];
  categories: any[] = [];
  categoriesMap: { [key: number]: string } = {};

  isLoading = true;
  searchTerm = '';
  selectedCat: number | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  // =================
  // ======================
  loadData(): void {

    this.isLoading = true;

    // CATEGORIES
    this.catService.getTreeCategories().subscribe({
      next: (allCats) => {

        this.categories = (allCats ?? []).filter(c => {
          const type = c.type?.toLowerCase();
          return type === 'service' || type === 'services';
        });

        this.categories.forEach(c => {
          if (c.id) {
            this.categoriesMap[c.id] = c.nom;
          }
        });
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });

    // SERVICES
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data ?? [];
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  // =====================
  // ======================
  getCatNom(id: number | null): string {
    if (!id) return 'Service Général';
    return this.categoriesMap[id] || 'Prestation';
  }

  // ======================

  // ======================
  filterCat(id: number | null): void {
    this.selectedCat = id;
  }

  // ======================

  // ======================
  getFilteredServices(): Service[] {

    const search = this.searchTerm.toLowerCase().trim();

    return this.services.filter(s => {

      const matchSearch =
        !search ||
        s.nom?.toLowerCase().includes(search) ||
        s.description?.toLowerCase().includes(search);

      const matchCat =
        this.selectedCat === null ||
        s.categorieId === this.selectedCat;

      return matchSearch && matchCat;
    });
  }

  // ======================
  // ======================
  deleteService(id?: number): void {

    if (!id) return;

    if (!confirm('Supprimer ce service ?')) return;

    this.serviceService.supprimerService(id).subscribe({
      next: () => {
        this.services = this.services.filter(s => s.id !== id);
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: () => alert('Erreur suppression')
    });
  }

  // ======================

  // ======================
  goToEdit(id?: number): void {
    if (!id) return;
    this.router.navigate(['/admin/services/edit', id]);
  }

  getFileUrl(path: string | null | undefined): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `${environment.apiUrl}${path}`;
  }
}