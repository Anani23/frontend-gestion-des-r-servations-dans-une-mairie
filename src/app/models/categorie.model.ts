export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  image?: string; // Pour l'affichage en cartes (Cards)
  icon?: string;  // Pour les icônes CoreUI ou FontAwesome
  parentId?: number;
  sousCategories?: Categorie[];
}