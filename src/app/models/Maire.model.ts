export interface Maire {
    id?: number;
    nom: string;
    prenom: string;
    biographie: string;
    photoUrl: string;
    debutMandat: string;
    finMandat: string;
}

export interface Departement {
    id?: number;
    nom: string;
    description: string;
    responsableNom: string;
    telephone: string;
}