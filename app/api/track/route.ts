import { NextResponse } from 'next/server'
import { recordView } from '@/lib/visits'

/**
 * Point d'entrée public du compteur de visites (voir lib/visits.ts).
 * Appelé par <VisitTracker /> à chaque changement de page.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Filtre grossier des robots : ils ne doivent pas gonfler les compteurs. */
const BOT_RE = /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|headlesschrome|lighthouse|pingdom|uptime|curl|wget|python-requests/i

export async function POST(request: Request) {
  const ua = request.headers.get('user-agent') || ''
  if (!ua || BOT_RE.test(ua)) return new NextResponse(null, { status: 204 })

  try {
    const body = await request.json()
    const path = typeof body?.path === 'string' ? body.path : '/'
    const newVisit = body?.newVisit === true
    await recordView(path, newVisit)
  } catch {
    // Un compteur ne doit jamais casser la navigation : on ignore l'erreur.
  }

  return new NextResponse(null, { status: 204 })
}
