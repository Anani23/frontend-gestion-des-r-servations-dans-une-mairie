import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  // Correction : Ajout de categorieId et typage explicite de piecesAFournir
  private services: Service[] = [
    { 
      id: 1, 
      nom: 'Etat civil', 
      description: 'Gestion des actes de naissance, mariages et décès.', 
      piecesAFournir: [] as string[], 
      actif: true,
      categorieId: 1 // <--- Cette valeur est maintenant obligatoire
    },
  ];

  private servicesSubject = new BehaviorSubject<Service[]>(this.services);

  /**
   * Récupère la liste des services sous forme d'Observable
   */
  getServices(): Observable<Service[]> {
    return this.servicesSubject.asObservable();
  }

  /**
   * Ajoute un nouveau service
   */
  ajouterService(service: Omit<Service, 'id'>): void {
    const newService: Service = { 
      id: Date.now(), 
      ...service 
    };
    this.services = [newService, ...this.services];
    this.servicesSubject.next(this.services);
  }

  /**
   * Modifie un service existant
   */
  modifierService(service: Service): void {
    const index = this.services.findIndex(s => s.id === service.id);
    if (index !== -1) {
      // On crée une copie pour garantir l'immuabilité et la détection de changement
      this.services[index] = { ...service };
      this.servicesSubject.next([...this.services]);
    }
  }

  /**
   * Supprime un service
   */
  supprimerService(id: number): void {
    this.services = this.services.filter(s => s.id !== id);
    this.servicesSubject.next([...this.services]);
  }
}