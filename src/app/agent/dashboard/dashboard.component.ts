import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DossiersService } from '../../services/dossiers.service';
import { RdvService } from '../../services/rdv.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Utilisation de inject() pour une injection plus propre en Standalone
  private rdvService = inject(RdvService);
  private dossiersService = inject(DossiersService);

  agentNom: string = "M. Koffi";
  today: Date = new Date();

  // Initialisation des propriétés pour éviter les erreurs TS2339 dans le HTML
  stats = {
    dossiersEnAttente: 0,
    rdvAujourdHui: 0,
    dossiersTraites: 0
  };

  prochainsRdvs: any[] = [];
  alertesDossiers: any[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // 1. Récupération des Rendez-vous via le service
    this.rdvService.getRdvs().subscribe({
      next: (allRdvs) => {
        const todayStr = this.today.toISOString().split('T')[0];
        
        // On filtre pour n'avoir que les RDV confirmés de ce jour
        this.prochainsRdvs = allRdvs
          .filter(r => r.date.includes(todayStr) && r.status === 'Confirmé')
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 3); // Top 3 pour le dashboard

        this.stats.rdvAujourdHui = this.prochainsRdvs.length;
      },
      error: (err) => console.error('Erreur RDV:', err)
    });

    // 2. Récupération des Dossiers via le service
    this.dossiersService.getDossiersObservable().subscribe({
      next: (docs) => {
        const enAttente = docs.filter(d => d.statut === 'EN ATTENTE');
        
        this.stats.dossiersEnAttente = enAttente.length;
        this.stats.dossiersTraites = docs.filter(d => d.statut !== 'EN ATTENTE').length;
        
        // On prépare les 2 dossiers les plus urgents pour l'affichage "Actions urgentes"
        this.alertesDossiers = enAttente.slice(0, 2);
      },
      error: (err) => console.error('Erreur Dossiers:', err)
    });
  }
}