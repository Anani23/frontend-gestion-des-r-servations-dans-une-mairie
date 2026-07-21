export interface Service {
  id?: number;

  nom: string;
  description: string;
  actif: boolean;

  categorieId: number | null;
  categorieNom?: string | null;

  piecesPath?: string | null;
  prix?: number;
  moyensPaiement?: string | null;
}