import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BienService } from '../../../services/bien.service';
import { getFallbackImageByKeyword } from '../../../shared/utils/image-fallback.util';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit {
  private bienService = inject(BienService);
  private cdr = inject(ChangeDetectorRef);

  description: string = "Structure administrative et gestion du patrimoine de la commune de Lomé.";

  departements: any[] = [
    { nom: 'État Civil', description: 'Gestion des actes officiels : naissances, mariages et décès.', icone: '📜', color: '#3498db' },
    { nom: 'Urbanisme', description: 'Aménagement du territoire et délivrance des permis de construire.', icone: '🏗️', color: '#e67e22' },
    { nom: 'Affaires Sociales', description: 'Accompagnement des familles et programmes de solidarité.', icone: '🤝', color: '#e74c3c' },
    { nom: 'Digital & IT', description: 'Modernisation des services publics et maintenance technique.', icone: '💻', color: '#9b59b6' }
  ];

  // Postes reels de l'organigramme, sans identite nominative (aucune source fiable
  // en base pour associer un nom de personne a chaque poste).
  equipes: any[] = [
    { poste: 'Maire de la Commune', initiales: 'M' },
    { poste: 'Secrétaire Générale', initiales: 'SG' },
    { poste: 'Directeur Technique', initiales: 'DT' },
    { poste: 'DSI (Informatique)', initiales: 'SI' }
  ];

  // Biens municipaux reels, charges depuis l'API publique (plus de donnees simulees).
  biens: any[] = [];
  isLoading = true;

  services: string[] = [
    'Extraits de naissance',
    'Permis de bâtir',
    'Aide sociale',
    'Location de salles',
    'Plateforme E-citoyen'
  ];

  ngOnInit(): void {
    this.loadMunicipalAssets();
  }

  loadMunicipalAssets(): void {
    this.isLoading = true;
    this.bienService.getBiensDisponibles().subscribe({
      next: (data) => {
        this.biens = (data || []).slice(0, 3).map(b => ({
          nom: b.nom,
          dispo: b.disponible,
          image: b.imageUrl || getFallbackImageByKeyword(b.nom)
        }));
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement des biens municipaux', err);
        this.biens = [];
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  onServiceClick(service: string): void {
    console.log(`Navigation vers le service : ${service}`);
  }
}
