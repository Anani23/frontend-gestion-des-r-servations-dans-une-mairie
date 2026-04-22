import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BienService } from '../../services/bien.service';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  adminNom = "Administrateur";
  today = new Date();
  searchTerm = '';
  isLoading = true;

  allCards: any[] = [];
  filteredCards: any[] = [];

  constructor(
    private router: Router,
    private bienService: BienService,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // forkJoin avec catchError pour chaque service pour éviter de bloquer si l'API est hors ligne
    forkJoin({
      biens: this.bienService.getBiens().pipe(catchError(() => of([]))),
      services: this.serviceService.getServices().pipe(catchError(() => of([])))
    }).subscribe(res => {
      this.allCards = [
        { title: 'Patrimoine', count: res.biens.length || 0, link: '/admin/liste-biens', icon: '🏢', color: '#6366f1', desc: 'Gérer les infrastructures.' },
        { title: 'Services', count: res.services.length || 0, link: '/services', icon: '🤝', color: '#10b981', desc: 'Pôles de compétences.' },
        { title: 'Agents', count: 12, link: '/admin/utilisateurs', icon: '👥', color: '#f59e0b', desc: 'Équipe et accès.' },
        { title: 'Rendez-vous', count: 45, link: '/admin/statistiques', icon: '📅', color: '#ec4899', desc: 'Flux des citoyens.' },
        { title: 'Nouveau Bien', count: '+', link: '/admin/create-bien', icon: '🏗️', color: '#8b5cf6', desc: 'Enregistrer un bâtiment.' },
        { title: 'Nouveau Service', count: '+', link: '/admin/create-service', icon: '✨', color: '#06b6d4', desc: 'Créer une prestation.' },
        { title: 'Catégories', count: 'Fix', link: '/admin/create-categorie', icon: '📁', color: '#64748b', desc: 'Organiser les domaines.' }
      ];
      this.filterCards();
      this.isLoading = false;
    });
  }

  filterCards(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCards = this.allCards.filter(c => 
      c.title.toLowerCase().includes(term) || c.desc.toLowerCase().includes(term)
    );
  }

  goTo(link: string): void {
    this.router.navigate([link]);
  }
}