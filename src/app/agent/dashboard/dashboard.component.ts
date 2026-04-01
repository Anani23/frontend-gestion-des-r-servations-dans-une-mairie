import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  agentNom = "Agent";

  stats = {
    dossiersEnAttente: 5,
    rdvAujourdHui: 3,
    dossiersTraites: 12
  };

  rdvs = [
    { nom: 'Jean', heure: '10:00' },
    { nom: 'Paul', heure: '11:30' }
  ];

}