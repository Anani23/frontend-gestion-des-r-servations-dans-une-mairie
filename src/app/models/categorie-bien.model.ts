export interface CategorieBien {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  icon?: string;
  type?: 'BIEN' | 'SERVICE';
  parentId?: number;
  sousCategories?: CategorieBien[];
}
