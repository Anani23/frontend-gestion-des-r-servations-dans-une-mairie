export interface CategorieBien {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: number; // Permet de savoir si c'est une sous-catégorie
  sousCategories?: CategorieBien[]; // Pour stocker les enfants après traitement
}