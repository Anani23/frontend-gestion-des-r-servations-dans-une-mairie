/**
 * Choisit une image existante dans assets/images/ en fonction de mots-cles presents
 * dans un nom de bien/motif, pour eviter les references vers des fichiers qui
 * n'existent pas dans le projet (ex: "stade.jpg", "mariage.jpg", "default.jpg"...).
 * Utilise uniquement des fichiers reellement presents dans assets/images/.
 */
export function getFallbackImageByKeyword(text: string | undefined | null): string {
  const t = (text || '').toLowerCase();

  if (t.includes('salle') || t.includes('mariage') || t.includes('fete') || t.includes('fête')) {
    return 'assets/images/salle-fete-2.jpg';
  }
  if (t.includes('terrain') || t.includes('stade') || t.includes('sport')) {
    return 'assets/images/terrain-sportif.jpg';
  }
  if (t.includes('musee') || t.includes('musée') || t.includes('culture')) {
    return 'assets/images/musee.jpg';
  }
  if (t.includes('cimeti')) {
    return 'assets/images/cimetiere-2.jpg';
  }
  if (t.includes('palais') || t.includes('congres') || t.includes('congrès')) {
    return 'assets/images/palais-lomé.jpg';
  }
  if (t.includes('naissance') || t.includes('acte') || t.includes('etat civil') || t.includes('état civil') || t.includes('legalisation') || t.includes('légalisation') || t.includes('document')) {
    return 'assets/images/legalisation.jpg';
  }

  return 'assets/images/mairie-centrale.jpg';
}
