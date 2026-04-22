import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class CitizenDashboardComponent implements OnInit {

  nomCitoyen = "Sidoine"; // Dans le futur, à récupérer via un AuthService
  dateDuJour = new Date();

  stats = [
    { label: 'Rendez-vous', value: 3, icon: '📅' },
    { label: 'Dossiers', value: 5, icon: '📄' },
    { label: 'Validés', value: 2, icon: '✅' },
    { label: 'En attente', value: 3, icon: '⏳' }
  ];

  notifications = [
    { text: "Votre rendez-vous a été confirmé", time: "Il y a 2h", icon: "✅" },
    { text: "Un dossier a été validé", time: "Hier", icon: "📄" },
    { text: "Nouvelle actualité : Travaux à Lomé II", time: "2 jours", icon: "🚧" }
  ];

  actions = [
    { label: 'Prendre un RDV', desc: 'Réserver un créneau', route: '/citizen/prendre-rdv', icon: '📅', class: 'primary' },
    { label: 'Mes rendez-vous', desc: 'Gérer vos réservations', route: '/citizen/mes-rdv', icon: '📋', class: 'secondary' },
    { label: 'Créer un dossier', desc: 'Nouvelle demande', route: '/citizen/dossier/create', icon: '📄', class: 'success' },
    { label: 'Mes dossiers', desc: 'Suivre vos demandes', route: '/citizen/dossiers', icon: '📁', class: 'info' }
  ];

  ngOnInit(): void {
    // Logique d'initialisation si nécessaire
  }
}