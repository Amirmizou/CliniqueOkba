import { NextResponse } from 'next/server'
import { recordView, detectDevice } from '@/lib/visits'
import { trackRateLimiter } from '@/lib/rate-limit'
import {
  getClientIp,
  isAttackToolUserAgent,
  isBotUserAgent,
  isSameOriginRequest,
  looksLikeHeadlessClient,
} from '@/lib/security'

/**
 * Point d'entrée public du compteur de visites (voir lib/visits.ts).
 * Appelé par <VisitTracker /> à chaque changement de page.
 *
 * Endpoint d'écriture non authentifié : il doit être blindé, sinon un simple
 * script gonfle indéfiniment les statistiques, sature le dictionnaire de
 * chemins et provoque une réécriture disque continue (le flush est déclenché à
 * chaque modification).
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** 60 pages vues par minute et par IP : très au-delà d'une navigation humaine. */
const MAX_VIEWS_PER_MINUTE = 60
/** Corps attendu : un chemin et un booléen. Tout le reste est un abus. */
const MAX_BODY_BYTES = 2 * 1024

/** Réponse neutre : le compteur ne renvoie jamais d'information exploitable. */
const noContent = () => new NextResponse(null, { status: 204 })

export async function POST(request: Request) {
  const ua = request.headers.get('user-agent') || ''

  // 1. Robots et clients non navigateur : ignorés silencieusement (ils ne
  //    doivent pas apparaître dans les statistiques).
  if (!ua || isBotUserAgent(ua) || isAttackToolUserAgent(ua)) return noContent()
  if (looksLikeHeadlessClient(request.headers)) return noContent()

  // 2. L'appel doit provenir d'une page du site. Un `fetch` de script ou un
  //    `curl` n'envoie ni `origin` ni `referer` valide.
  if (!isSameOriginRequest(request)) return noContent()

  // 3. Débit : plafonne le gonflage artificiel ET les écritures disque.
  const ip = getClientIp(request.headers)
  const rl = await trackRateLimiter.check(ip, MAX_VIEWS_PER_MINUTE)
  if (!rl.success) return noContent()

  try {
    if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
      return noContent()
    }
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) return noContent()

    const body = JSON.parse(raw) as { path?: unknown; newVisit?: unknown }

    // 4. Le chemin est une clé de compteur persistée : il doit ressembler à une
    //    URL du site, sans caractère de contrôle, et rester court.
    //    Les slugs arabes (encodés ou non) restent acceptés : on refuse
    //    seulement les caractères de contrôle et les métacaractères HTML.
    const rawPath = typeof body?.path === 'string' ? body.path : '/'
    const path =
      rawPath.startsWith('/') &&
      rawPath.length <= 512 &&
      !/[\x00-\x1f\x7f<>"'`\\{}|^]/.test(rawPath)
        ? rawPath
        : '/'

    await recordView(path, body?.newVisit === true, detectDevice(ua))
  } catch {
    // Un compteur ne doit jamais casser la navigation : on ignore l'erreur.
  }

  return noContent()
}
