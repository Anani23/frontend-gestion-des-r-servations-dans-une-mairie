export interface Bien {
  id: number;
  nom: string;
  type: string;
  categorieId: number;
  dispo: boolean;
  description?: string;
  caracteristiques?: string[];
  lieu?: string;
  superficie?: string;
  capacite?: string;
  telephone?: string;
  horaires?: string;
  coordonnees?: {
    lat: number;
    lng: number;
  };
  images?: string[];
}
