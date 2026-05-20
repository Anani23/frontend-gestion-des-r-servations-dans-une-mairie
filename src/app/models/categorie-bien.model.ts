export interface CategorieBien {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  icon?: string;
  type?: string;
  parentId?: number;
  sousCategories?: CategorieBien[];
}