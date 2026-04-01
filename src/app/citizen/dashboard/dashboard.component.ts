import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true, // 🔥 OBLIGATOIRE
  imports: [CommonModule, RouterModule], // 🔥 IMPORTANT
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class CitizenDashboardComponent {

  nomCitoyen = "Citoyen";

}