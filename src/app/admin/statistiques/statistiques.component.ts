import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BienService } from '../../services/bien.service';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.scss']
})
export class StatistiquesComponent implements OnInit {
  
  stats = {
    users: 120, 
    agents: 10,
    biens: 0,
    services: 0
  };

  constructor(
    private bienService: BienService,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.loadRealTimeStats();
  }

  loadRealTimeStats(): void {
    // Nombre de biens
    this.bienService.getBiens().subscribe({
      next: (data) => this.stats.biens = data.length,
      error: (err) => console.error('Erreur stats biens', err)
    });

    // Nombre de services
    this.serviceService.getServices().subscribe({
      next: (data) => this.stats.services = data.length,
      error: (err) => console.error('Erreur stats services', err)
    });
  }
}