import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BienService } from '../../services/bien.service';
import { ServiceService } from '../../services/service.service';

interface DashboardCard {
  title: string;
  count: string | number;
  link: string;
  icon: string;
  color: string;
  desc: string;
  category: 'stats' | 'action';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private bienService = inject(BienService);
  private serviceService = inject(ServiceService);
  private cdr = inject(ChangeDetectorRef);

  adminNom = "Administrateur";
  today = new Date();
  searchTerm = '';
  isLoading = true;

  allCards: DashboardCard[] = [];
  filteredCards: DashboardCard[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      biens: this.bienService.getBiens().pipe(catchError(() => of([]))),
      services: this.serviceService.getServices().pipe(catchError(() => of([])))
    })
    .pipe(finalize(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }))
    .subscribe({
      next: (res) => {
        this.allCards = [
          {
            title: 'Patrimoine',
            count: res.biens.length,
            link: '/admin/biens',
            icon: '🏢',
            color: '#6366f1',
            desc: 'Gestion des infrastructures et bâtiments.',
            category: 'stats'
          },
          {
            title: 'Services',
            count: res.services.length,
            link: '/admin/services',
            icon: '🤝',
            color: '#10b981',
            desc: 'Catalogue des prestations municipales.',
            category: 'stats'
          },
          {
            title: 'Actualités',
            count: 'Voir',
            link: '/actualites',
            icon: '📢',
            color: '#f43f5e',
            desc: 'Articles et communication citoyenne.',
            category: 'action'
          },
          {
            title: 'Catégories',
            count: 'Organiser',
            link: '/admin/categories',
            icon: '📁',
            color: '#64748b',
            desc: 'Classification des domaines.',
            category: 'action'
          },
          {
            title: 'Nouveau Bien',
            count: '+',
            link: '/admin/biens/create',
            icon: '🏗️',
            color: '#8b5cf6',
            desc: 'Ajouter une unité au patrimoine.',
            category: 'action'
          },
          {
            title: 'Nouveau Service',
            count: '+',
            link: '/admin/services/create',
            icon: '✨',
            color: '#06b6d4',
            desc: 'Créer une nouvelle prestation.',
            category: 'action'
          }
        ];
        this.filteredCards = [...this.allCards];
      }
    });
  }

  filterCards(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCards = this.allCards.filter(card =>
      card.title.toLowerCase().includes(term) || 
      card.desc.toLowerCase().includes(term)
    );
  }
}