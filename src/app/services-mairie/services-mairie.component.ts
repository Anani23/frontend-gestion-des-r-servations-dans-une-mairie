import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ServiceService } from '../services/service.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-services-mairie',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './services-mairie.component.html',
  styleUrls: ['./services-mairie.component.scss']
})
export class ServicesMairieComponent implements OnInit {

  private serviceService = inject(ServiceService);
  private cdr = inject(ChangeDetectorRef);

  services: any[] = [];
  loading = true;

  searchService = '';
  selectedService: any = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.serviceService.getServicesPublics().pipe(
      catchError(err => {
        console.error('Erreur API Services:', err);
        return of([]);
      })
    ).subscribe({
      next: (res: any) => {
        this.services = (res || []).filter((s: any) => s.actif !== false);
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  getFilteredServices() {
    const term = this.searchService.toLowerCase().trim();
    return this.services.filter(s =>
      !term || s.nom?.toLowerCase().includes(term)
    );
  }

  openServiceModal(service: any): void {
    this.selectedService = service;
    document.body.style.overflow = 'hidden';
  }

  closeServiceModal(): void {
    this.selectedService = null;
    document.body.style.overflow = '';
  }

  getPiecesPathUrl(path: string | null | undefined): string {
    if (!path) return '';
    return path.startsWith('http') ? path : `${environment.apiUrl}${path}`;
  }
}
