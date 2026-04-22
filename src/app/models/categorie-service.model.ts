export interface CategorieService {
  id?: number;
  nom: string;
  description: string;
  image: string; // Stockera le nom du fichier ou le base64
  actif: boolean;
}