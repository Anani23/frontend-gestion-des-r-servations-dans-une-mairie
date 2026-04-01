import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mes-rdv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-rdv.component.html',
  styleUrls: ['./mes-rdv.component.scss']
})
export class MesRdvComponent {

  rdvs = [
    { service: 'Etat civil', date: '2026-04-01', heure: '10:00' },
    { service: 'Urbanisme', date: '2026-04-02', heure: '14:30' },
    { service: 'Fiscalité', date: '2026-04-03', heure: '09:00' },
    { service: 'Etat civil', date: '2026-04-05', heure: '11:00' },
    { service: 'Urbanisme', date: '2026-04-06', heure: '15:00' }
  ];

  page = 1;
  pageSize = 3;

  Math = Math;

  get paginatedRdvs() {
    const start = (this.page - 1) * this.pageSize;
    return this.rdvs.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.page * this.pageSize) < this.rdvs.length) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }
}