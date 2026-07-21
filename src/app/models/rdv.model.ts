export interface Rdv {
  id?: number;

  bienId?: number;
  nomBien?: string;

  userId?: number;
  nomCitoyen?: string;

  dateDebut: string;   // ISO string recommandé côté API
  dateFin?: string;

  statut: 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE';

  motif?: string;

  prixTotal?: number;
}