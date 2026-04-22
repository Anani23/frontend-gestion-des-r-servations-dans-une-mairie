export interface User {
  id: number;
  nom: string;
  role: 'ADMIN' | 'AGENT' | 'CITOYEN';
  token?: string;
}