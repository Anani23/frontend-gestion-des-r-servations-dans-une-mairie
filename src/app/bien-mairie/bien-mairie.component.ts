import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BienService } from '../services/bien.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-bien-mairie',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bien-mairie.component.html',
  styleUrls: ['./bien-mairie.component.scss']
})
export class BienMairieComponent implements OnInit {

  private bienService = inject(BienService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  biens: any[] = [];
  loading = true;

  searchBien = '';

  selectedBien: any = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.bienService.getBiensDisponibles().pipe(
      catchError(err => {
        console.error('Erreur API Biens:', err);
        return of([]);
      })
    ).subscribe({
      next: (res: any) => {
        this.biens = res || [];
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

  // ===================== BIENS =====================
  getFilteredBiens() {
    const term = this.searchBien.toLowerCase().trim();
    return this.biens.filter(b =>
      !term || b.nom?.toLowerCase().includes(term)
    );
  }

  // ===================== MODAL BIEN =====================
  openBienModal(bien: any): void {
    this.selectedBien = bien;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedBien = null;
    document.body.style.overflow = '';
  }

  reserverBien(bien: any): void {
    this.closeModal();
    this.router.navigate(['/citizen/reservations/create'], {
      queryParams: { bienId: bien.id }
    });
  }

  // ===================== IMAGES =====================
  getImg(b: any): string {
    const baseUrl = `${environment.apiUrl}/uploads/`;

    if (!b) return 'assets/images/mairie-centrale.jpg';

    if (b.imageUrl) return b.imageUrl;

    if (b.image) return baseUrl + b.image;

    return 'assets/images/mairie-centrale.jpg';
  }

  onImgErr(event: Event): void {
    const img = event.target as HTMLImageElement;
    const fallbackSrc = 'assets/images/mairie-centrale.jpg';
    if (img.src !== window.location.origin + '/' + fallbackSrc) {
      img.src = fallbackSrc;
    }
  }
}
