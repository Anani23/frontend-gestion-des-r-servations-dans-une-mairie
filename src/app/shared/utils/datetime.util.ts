/**
 * Convertit une valeur `Date` (ou une string compatible `datetime-local`, ex: "2027-01-15T14:00")
 * en chaine "yyyy-MM-ddTHH:mm:ss" représentant l'heure LOCALE, sans decalage de fuseau horaire.
 *
 * A utiliser à la place de `date.toISOString()`, qui convertit vers UTC et fausserait donc
 * l'heure réellement saisie par l'utilisateur (le backend stocke des LocalDateTime "naïfs",
 * sans fuseau horaire, censés représenter l'heure locale telle quelle).
 */
export function toLocalIsoDateTime(value: string | Date): string {
  if (!value) {
    return '';
  }

  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) {
    return '';
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
