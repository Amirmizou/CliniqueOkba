import { createHash, timingSafeEqual } from 'node:crypto'
import { ATTACK_UA_RE, BOT_UA_RE, SCANNER_EXT_RE, SCANNER_PATH_RE } from './bot-signatures'

export { SCANNER_EXT_RE, SCANNER_PATH_RE }

/**
 * Primitives de sécurité partagées par les routes API publiques.
 *
 * L'objectif est de rendre coûteux (ou inefficace) l'usage automatisé du site
 * par des robots : spam de formulaire, brute-force du mot de passe admin,
 * gonflage des compteurs, énumération de données personnelles.
 */

/* -------------------------------------------------------------------------- */
/* Identification du client                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Nombre de proxys de confiance devant l'application. Chaque proxy AJOUTE une
 * entrée à `x-forwarded-for` ; les entrées de gauche sont fournies par le
 * client et donc falsifiables. On lit donc à partir de la DROITE.
 * Hostinger/nginx = 1. Derrière Cloudflare + nginx = 2.
 */
const TRUSTED_PROXY_HOPS = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS) || 1)

/**
 * IP réelle du client, résistante à l'usurpation d'en-tête.
 *
 * Un robot qui envoie `x-forwarded-for: 1.2.3.4` à chaque requête contournait
 * l'intégralité des limitations de débit : la clé changeait à chaque appel.
 * On privilégie donc les en-têtes ÉCRASÉS par l'infrastructure
 * (`cf-connecting-ip`, `x-real-ip`), et sinon on prend l'entrée de `x-forwarded-for`
 * correspondant au dernier proxy de confiance.
 */
export function getClientIp(headers: Headers): string {
  const single =
    headers.get('cf-connecting-ip')?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    headers.get('x-vercel-forwarded-for')?.trim()
  if (single && isIpLike(single)) return single

  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const hops = xff
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    // Entrée ajoutée par le proxy de confiance le plus externe.
    const idx = Math.max(0, hops.length - TRUSTED_PROXY_HOPS)
    const candidate = hops[idx]
    if (candidate && isIpLike(candidate)) return candidate
  }

  // Aucune IP exploitable : on retombe sur une empreinte du client plutôt que
  // sur un seau « unknown » unique qui bloquerait tous les visiteurs à la fois.
  return `fp:${fingerprint(headers)}`
}

function isIpLike(v: string): boolean {
  return /^[0-9a-fA-F:.]+$/.test(v) && v.length <= 45
}

/** Empreinte grossière et non identifiante, utilisée seulement comme clé de débit. */
export function fingerprint(headers: Headers): string {
  const raw = [
    headers.get('user-agent') || '',
    headers.get('accept-language') || '',
    headers.get('accept-encoding') || '',
  ].join('|')
  return createHash('sha256').update(raw).digest('hex').slice(0, 16)
}

/* -------------------------------------------------------------------------- */
/* Détection de robots                                                         */
/* -------------------------------------------------------------------------- */

export function isBotUserAgent(ua: string | null | undefined): boolean {
  const s = (ua || '').trim()
  if (!s) return true // aucun user-agent = client non navigateur
  return BOT_UA_RE.test(s)
}

export function isAttackToolUserAgent(ua: string | null | undefined): boolean {
  return ATTACK_UA_RE.test((ua || '').trim())
}

/**
 * Heuristique « ce n'est pas un navigateur » : les navigateurs envoient
 * toujours `accept` et `accept-language`, et un user-agent contenant Mozilla.
 * Sert de garde-fou léger sur les endpoints d'écriture publics.
 */
export function looksLikeHeadlessClient(headers: Headers): boolean {
  const ua = headers.get('user-agent') || ''
  if (!ua || !/mozilla\//i.test(ua)) return true
  if (!headers.get('accept')) return true
  return false
}

/* -------------------------------------------------------------------------- */
/* Origine des requêtes (anti-CSRF / anti-script)                              */
/* -------------------------------------------------------------------------- */

function allowedHosts(): string[] {
  const hosts = new Set<string>()
  for (const v of [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ]) {
    if (!v) continue
    try {
      hosts.add(new URL(v).host.toLowerCase())
    } catch {
      /* variable mal formée : ignorée */
    }
  }
  hosts.add('cliniqueokba.com')
  hosts.add('www.cliniqueokba.com')
  return [...hosts]
}

/**
 * Vérifie que la requête provient bien d'une page du site (même origine).
 * Les robots qui appellent l'API directement n'envoient généralement aucun
 * `origin`/`referer`, ou une valeur étrangère.
 */
export function isSameOriginRequest(request: Request): boolean {
  const headers = request.headers
  const origin = headers.get('origin')
  const referer = headers.get('referer')
  const hostHeader = (headers.get('host') || '').toLowerCase()
  const allowed = new Set([...allowedHosts(), hostHeader].filter(Boolean))

  const hostOf = (value: string | null) => {
    if (!value) return null
    try {
      return new URL(value).host.toLowerCase()
    } catch {
      return null
    }
  }

  const originHost = hostOf(origin)
  if (originHost) return allowed.has(originHost)

  const refererHost = hostOf(referer)
  if (refererHost) return allowed.has(refererHost)

  // Ni origin ni referer : requête hors navigateur (fetch d'un script, curl…).
  return false
}

/** Réponse 403 uniforme, sans détail exploitable. */
export function forbidden(message = 'Requête refusée.') {
  return Response.json({ error: message }, { status: 403 })
}

/* -------------------------------------------------------------------------- */
/* Comparaison de secrets                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Comparaison à temps constant. Une comparaison `===` sur une chaîne fuit la
 * longueur du préfixe commun et permet, en théorie, de reconstruire un secret
 * caractère par caractère à coups de milliers de requêtes automatisées.
 */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

/* -------------------------------------------------------------------------- */
/* Anti-spam de formulaire                                                     */
/* -------------------------------------------------------------------------- */

/** Délai minimal plausible entre l'affichage du formulaire et l'envoi. */
export const MIN_FORM_FILL_MS = 3_000
/** Au-delà, l'horodatage est considéré comme rejoué (formulaire trop vieux). */
export const MAX_FORM_AGE_MS = 6 * 60 * 60 * 1000

export interface HumanCheckInput {
  /** Champ piège : rempli uniquement par un robot. */
  honeypot?: unknown
  /** Horodatage (ms) de l'affichage du formulaire, envoyé par le client. */
  startedAt?: unknown
}

export type HumanCheckResult = { ok: true } | { ok: false; reason: string }

/**
 * Contrôles anti-robot d'un envoi de formulaire.
 *
 * Le honeypot était jusqu'ici vérifié uniquement côté client : un robot qui
 * postait directement sur l'API le contournait entièrement. La vérification
 * doit être serveur.
 */
export function checkHumanSignals(input: HumanCheckInput): HumanCheckResult {
  if (typeof input.honeypot === 'string' && input.honeypot.trim() !== '') {
    return { ok: false, reason: 'honeypot' }
  }
  if (input.honeypot != null && typeof input.honeypot !== 'string') {
    return { ok: false, reason: 'honeypot-type' }
  }

  const startedAt = Number(input.startedAt)
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt
    if (elapsed < MIN_FORM_FILL_MS) return { ok: false, reason: 'too-fast' }
    if (elapsed > MAX_FORM_AGE_MS) return { ok: false, reason: 'stale' }
  }

  return { ok: true }
}

const SPAM_WORDS =
  /\b(viagra|cialis|casino|porn|xxx|bitcoin|crypto\s*invest|forex|loan\s*offer|seo\s*service|backlink|cheap\s*meds|escort|hacked?\s*by|binary\s*option|payday\s*loan|earn\s*\$)\b/i
const URL_RE = /https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}/gi
const BBCODE_RE = /\[url[=\]]|\[\/url\]|<a\s+href=/i
const CYRILLIC_RE = /[Ѐ-ӿ]{4,}/
const CJK_RE = /[぀-ヿ一-鿿]{4,}/

/**
 * Détection de contenu manifestement automatisé (spam SEO / injection de liens).
 * Volontairement conservateur : on ne bloque que des signaux nets, un patient
 * mécontent doit toujours pouvoir écrire.
 */
export function looksLikeSpamContent(...parts: Array<string | undefined | null>): boolean {
  const text = parts.filter(Boolean).join('\n')
  if (!text) return false

  if (SPAM_WORDS.test(text)) return true
  if (BBCODE_RE.test(text)) return true

  const links = text.match(URL_RE) || []
  if (links.length >= 3) return true

  // Message majoritairement composé d'un alphabet sans rapport avec un site
  // francophone/arabophone algérien : signature typique des robots de spam.
  if (CYRILLIC_RE.test(text) || CJK_RE.test(text)) return true

  // Répétition d'un même caractère sur une longue plage (bourrage).
  if (/(.)\1{25,}/.test(text)) return true

  // Aucune espace sur une très longue chaîne = charge générée.
  const longest = text.split(/\s+/).reduce((m, w) => Math.max(m, w.length), 0)
  if (longest > 120) return true

  return false
}

/**
 * En-têtes anti-indexation/anti-cache pour les réponses d'API sensibles.
 */
export const NO_STORE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
}

