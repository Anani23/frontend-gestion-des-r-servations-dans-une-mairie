import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
// Importation recommandée si tu déplaces les interfaces dans un fichier dédié
// import { Departement, Equipe, Bien } from '../../models/mairie.model';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit {
  private http = inject(HttpClient);

  description: string = "Structure administrative et gestion du patrimoine de la commune de Lomé.";

  // Données structurées pour MySQL
  departements: any[] = [
    { nom: 'État Civil', description: 'Gestion des actes officiels : naissances, mariages et décès.', icone: '📜', color: '#3498db' },
    { nom: 'Urbanisme', description: 'Aménagement du territoire et délivrance des permis de construire.', icone: '🏗️', color: '#e67e22' },
    { nom: 'Affaires Sociales', description: 'Accompagnement des familles et programmes de solidarité.', icone: '🤝', color: '#e74c3c' },
    { nom: 'Digital & IT', description: 'Modernisation des services publics et maintenance technique.', icone: '💻', color: '#9b59b6' }
  ];

  equipes: any[] = [
    { chef: 'Jean Dupont', poste: 'Maire de la Commune', initiales: 'JD' },
    { chef: 'Alice Martin', poste: 'Secrétaire Générale', initiales: 'AM' },
    { chef: 'Paul Leblanc', poste: 'Directeur Technique', initiales: 'PL' },
    { chef: 'Sophie Kossi', poste: 'DSI (Informatique)', initiales: 'SK' }
  ];

  // Ces données pourraient être fetchées dynamiquement depuis ton BienService
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

  /**
   * Chargement des biens réels depuis le backend
   */
  loadMunicipalAssets(): void {
    this.isLoading = true;
    // Simulation d'appel API ou utilisation de ton service
    // this.bienService.getBiens().subscribe(data => { this.biens = data; this.isLoading = false; });
    
    // En attendant, on garde tes données de test mais prêtes pour l'async
    setTimeout(() => {
      this.biens = [
        { nom: 'Palais des Congrès', type: 'Événementiel', dispo: true, image: 'assets/images/palais-lomé.jpg' },
        { nom: 'Terrain de Kégué', type: 'Sport & Loisirs', dispo: false, image: 'assets/images/terrain-sportif2.jpg' },
        { nom: 'Annexe Administrative', type: 'Bâtiment Public', dispo: true, image: 'assets/images/mairie-togo.jpg' }
      ];
      this.isLoading = false;
    }, 800);
  }

  onServiceClick(service: string): void {
    console.log(`Navigation vers le service : ${service}`);
    // Ici, tu pourrais rediriger vers /citizen/dossiers/create?service=${service}
  }
}