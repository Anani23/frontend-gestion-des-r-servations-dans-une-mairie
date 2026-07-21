export interface PieceJointe {
  id?: number;
  nom: string;
  typeDocument?: string;
  fileUrl?: string;
}

export interface Dossier {
  id?: number;
  reference?: string;
  numeroDossier?: string;
  typePrestation: string;
  description: string;
  details?: any;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'VALIDE' | 'REJETE';
  dateSoumission?: string;
  dateCreation?: string;
  createdAt?: string;  // ✅ Ajouté
  updatedAt?: string;
  nomCitoyen?: string;
  citoyen?: string;
  userNom?: string;
  userPrenom?: string;
  userEmail?: string;
  agentEnCharge?: string;
  commentaireAgent?: string;
  piecesJointes?: PieceJointe[];
}