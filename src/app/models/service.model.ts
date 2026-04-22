export interface Service {
  id: number;
  nom: string;
  description: string;
  piecesAFournir: string[];
  actif: boolean;
  categorieId: number; // Ajoute cette ligne impérativement
}