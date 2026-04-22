import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Import de OnInit ajouté
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Import de Router et ActivatedRoute ajouté

// Imports de tes modèles et services
import { CategorieBien } from '../../models/categorie-bien.model';
import { Service } from '../../models/service.model';
import { CategorieBienService } from '../../services/categorie-bien.service';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {
  isEditing = false;
  serviceId?: number;
  categories: CategorieBien[] = [];
  imagePreview: string | null = null;
  
  // Initialisation du modèle de données
  serviceData: Omit<Service, 'id'> = {
    nom: '',
    description: '',
    piecesAFournir: [],
    actif: true,
    categorieId: 0
  };

  constructor(
    private serviceService: ServiceService,
    private catService: CategorieBienService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupération des catégories (Pole Services ID: 2)
    this.catService.getSousCategories(2).subscribe((data: CategorieBien[]) => {
      this.categories = data;
    });

    // Vérification si on est en mode édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.serviceId = +id;
      this.loadServiceData(this.serviceId);
    }
  }

  // MÉTHODE MANQUANTE : Charge les données pour l'édition
  loadServiceData(id: number): void {
    this.serviceService.getServices().subscribe((list: Service[]) => {
      const found = list.find(s => s.id === id);
      if (found) {
        this.serviceData = {
          nom: found.nom,
          description: found.description,
          piecesAFournir: [...found.piecesAFournir],
          actif: found.actif,
          categorieId: found.categorieId
        };
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addDoc(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value && !this.serviceData.piecesAFournir.includes(value)) {
      this.serviceData.piecesAFournir.push(value);
      input.value = '';
    }
  }

  removeDoc(index: number): void {
    this.serviceData.piecesAFournir.splice(index, 1);
  }

  submit(): void {
    if (!this.serviceData.nom.trim() || !this.serviceData.categorieId) {
      alert("Veuillez remplir le nom et choisir une catégorie.");
      return;
    }

    if (this.isEditing && this.serviceId) {
      this.serviceService.modifierService({ id: this.serviceId, ...this.serviceData });
    } else {
      this.serviceService.ajouterService(this.serviceData);
    }
    
    this.router.navigate(['/services']);
  }
}