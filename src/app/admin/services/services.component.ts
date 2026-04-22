import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Service } from '../../models/service.model';
import { CategorieBienService } from '../../services/categorie-bien.service';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, AfterViewInit {
  services: Service[] = [];
  categoriesMap: { [key: number]: string } = {};

  constructor(
    private serviceService: ServiceService,
    private catService: CategorieBienService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // 1. Charger les noms des pôles (Catégories du domaine Services)
    this.catService.getSousCategories(2).subscribe(cats => {
      cats.forEach(c => this.categoriesMap[c.id] = c.nom);
    });

    // 2. Charger les services
    this.serviceService.getServices().subscribe(data => {
      this.services = data;
    });
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'visible');
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      const cards = this.el.nativeElement.querySelectorAll('.service-card');
      cards.forEach((card: any) => observer.observe(card));
    }, 300);
  }

  getCatNom(id: number): string {
    return this.categoriesMap[id] || 'Service Municipal';
  }

  getIllustration(s: Service): string {
    const nom = s.nom.toLowerCase();
    if (nom.includes('naissance') || nom.includes('acte') || nom.includes('civil')) return 'assets/images/legalisation.jpg';
    if (nom.includes('permis') || nom.includes('plan') || nom.includes('foncier')) return 'assets/images/urbanisme.jpg';
    return 'assets/images/mairie-centrale.jpg';
  }

  delete(id: number) {
    if (confirm('⚠️ Supprimer définitivement cette prestation ?')) {
      this.serviceService.supprimerService(id);
      // Re-fetch si le service ne gère pas de BehaviorSubject
      this.serviceService.getServices().subscribe(data => this.services = data);
    }
  }

  goToEdit(id: number) {
    this.router.navigate(['/admin/create-service', id]);
  }
}