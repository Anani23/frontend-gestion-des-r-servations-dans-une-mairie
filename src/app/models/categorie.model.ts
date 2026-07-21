export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  icon?: string;
  type: string;
  parentId?: number;
  parentNom?: string;
  sousCategories?: Categorie[];
}
