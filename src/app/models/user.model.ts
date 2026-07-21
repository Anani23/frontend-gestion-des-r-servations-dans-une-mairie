export interface User {

  id?: number;

  nom: string;

  prenom?: string;

  email: string;

  role:
    | 'ROLE_SUPER_ADMIN'
    | 'ROLE_ADMIN'
    | 'ROLE_AGENT'
    | 'ROLE_CITOYEN';

  password?: string;

  enabled?: boolean;

  telephone?: string;

  token?: string;
}