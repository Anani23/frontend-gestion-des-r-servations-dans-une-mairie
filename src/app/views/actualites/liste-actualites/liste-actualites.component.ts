import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-liste-actualites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-actualites.component.html',
  styleUrls: ['./liste-actualites.component.scss'],
})
export class ListeActualitesComponent implements OnInit {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/actualites`;

  actualites: any[] = [];
  isLoading = false;

  titre: string = '';
  contenu: string = '';
  imageUrl: string = '';

  ngOnInit(): void {
    this.chargerActualites();
  }

  chargerActualites() {
    this.isLoading = true;
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        this.actualites = data.sort((a, b) => 
          new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime()
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Erreur chargement actualités');
      }
    });
  }

  ajouterActualite() {
    if (!this.titre || !this.contenu) return;

    const nouvelleActu = {
      titre: this.titre,
      contenu: this.contenu,
      image: this.imageUrl || 'assets/images/default-mairie.jpg',
      published: true
    };

    this.http.post(this.API_URL, nouvelleActu).subscribe({
      next: (res: any) => {
        this.actualites.unshift(res);
        this.reinitialiserFormulaire();
      },
      error: () => alert("Erreur lors de la publication.")
    });
  }

  supprimerActualite(id: number) {
    if (confirm('Supprimer cette actualité ?')) {
      this.http.delete(`${this.API_URL}/${id}`).subscribe({
        next: () => {
          this.actualites = this.actualites.filter(a => a.id !== id);
        }
      });
    }
  }

  reinitialiserFormulaire() {
    this.titre = '';
    this.contenu = '';
    this.imageUrl = '';
  }
}