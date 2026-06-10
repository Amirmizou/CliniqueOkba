// Utilitaires pour la prise de rendez-vous via WhatsApp.

/**
 * Nettoie un numéro pour l'API wa.me (chiffres uniquement, format international).
 * - retire espaces, tirets, parenthèses, +
 * - convertit un 0 initial (numéro local algérien) en préfixe 213
 */
export function sanitizeWhatsAppNumber(raw?: string): string {
  if (!raw) return ''
  // Si plusieurs numéros sont fournis (séparés par / ou ,), on prend le premier
  const first = raw.split(/[/,]/)[0]
  let n = first.replace(/[^\d+]/g, '').replace(/^\+/, '')
  if (n.startsWith('0')) n = '213' + n.slice(1)
  return n
}

/**
 * Construit l'URL wa.me avec un message pré-rempli.
 * Retourne une chaîne vide si aucun numéro valide.
 */
export function buildWhatsAppUrl(number: string | undefined, message: string): string {
  const n = sanitizeWhatsAppNumber(number)
  if (!n) return ''
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`
}
