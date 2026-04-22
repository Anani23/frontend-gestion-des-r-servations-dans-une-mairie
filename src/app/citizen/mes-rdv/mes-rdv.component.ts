import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Nécessaire pour [(ngModel)]
import { RouterModule } from '@angular/router';
import { RdvService } from '../../services/rdv.service';

@Component({
  selector: 'app-mes-rdv',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mes-rdv.component.html',
  styleUrls: ['./mes-rdv.component.scss']
})
export class MesRdvComponent implements OnInit {
  private rdvService = inject(RdvService);

  allRdvs: any[] = [];
  filteredRdvs: any[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.rdvService.getRdvs().subscribe(data => {
      // Tri par date décroissante
      this.allRdvs = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredRdvs = [...this.allRdvs];
    });
  }

  filterRdvs() {
    this.filteredRdvs = this.allRdvs.filter(r => 
      r.service.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getStatus(dateStr: string): string {
    const today = new Date();
    const rdvDate = new Date(dateStr);
    today.setHours(0,0,0,0);
    rdvDate.setHours(0,0,0,0);

    if (rdvDate.getTime() === today.getTime()) return 'Aujourd’hui';
    return rdvDate > today ? 'À venir' : 'Passé';
  }

  getBadgeClass(status: string): string {
    if (status === 'Aujourd’hui') return 'badge-today';
    return status === 'À venir' ? 'badge-upcoming' : 'badge-past';
  }

  voirDetail(rdv: any) {
    console.log("Détails du RDV:", rdv);
  }
}