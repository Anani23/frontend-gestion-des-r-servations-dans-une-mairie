export const environment = {
  production: true,

  // ✅ IMPORTANT
  // PAS DE /api ici
  // Vide = même origine que le site : les requêtes /api/... sont automatiquement
  // redirigées vers le backend Railway via le rewrite proxy défini dans vercel.json.
  // Ça permet d'avoir une seule adresse publique pour tout (frontend + backend).
  apiUrl: ''
};
