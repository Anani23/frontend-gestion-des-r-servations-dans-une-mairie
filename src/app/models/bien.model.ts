export interface Bien {
  id?: number;

  nom: string;
  description: string;
  localisation: string;

  categorieId: number;

  prixLocation: number;
  disponible: boolean;

  images?: string[]; // uniquement pour affichage UI
}