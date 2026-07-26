import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { revalidateRateLimiter } from '@/lib/rate-limit'
import { getClientIp, safeEqual, NO_STORE_HEADERS } from '@/lib/security'

/**
 * Revalidation à la demande (ISR) déclenchée par un webhook Sanity.
 *
 * Sans cette route, le contenu publié dans Sanity n'apparaît sur le site
 * (Hostinger) qu'au bout du délai ISR (revalidate = 1 h) ou après un rebuild.
 * Avec ce webhook, chaque publication rafraîchit le site en quelques secondes.
 *
 * Configuration (une seule fois) :
 *   1. Définir SANITY_REVALIDATE_SECRET dans .env ET dans les variables
 *      d'environnement Hostinger (une chaîne secrète au choix).
 *   2. Sanity → manage.sanity.io → API → Webhooks → Create webhook :
 *        - URL         : https://cliniqueokba.com/api/revalidate
 *        - Dataset     : production
 *        - Trigger     : Create, Update, Delete
 *        - HTTP method : POST
 *        - Headers     : x-revalidate-secret: LE_SECRET   ← préféré (n'apparaît pas dans les logs)
 *          (Alternative dépréciée : ?secret=LE_SECRET dans l'URL)
 *
 * Test manuel : POST https://cliniqueokba.com/api/revalidate -H "x-revalidate-secret: LE_SECRET"
 */

export const dynamic = 'force-dynamic'

const LOCALES = ['fr', 'ar']

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return false
  const provided =
    req.nextUrl.searchParams.get('secret') ||
    req.headers.get('x-revalidate-secret')
  // Comparaison à temps constant : `===` s'arrête au premier caractère
  // différent, ce qui laisse mesurer le préfixe correct et reconstruire le
  // secret par requêtes automatisées répétées.
  return safeEqual(provided, secret)
}

/**
 * Cet endpoint invalide TOUT le cache ISR du site. Rejoué en boucle par un
 * robot (même sans le secret, pour tester des valeurs), il force la
 * régénération de chaque page à chaque visite : c'est un déni de service par
 * épuisement CPU. On limite donc le débit avant même de vérifier le secret.
 */
async function tooManyRequests(req: NextRequest) {
  const rl = await revalidateRateLimiter.check(getClientIp(req.headers), 10)
  if (rl.success) return null
  return NextResponse.json(
    { revalidated: false, error: 'Trop de requêtes.' },
    { status: 429, headers: { ...NO_STORE_HEADERS, 'Retry-After': '60' } },
  )
}

export async function POST(req: NextRequest) {
  const limited = await tooManyRequests(req)
  if (limited) return limited

  if (!isAuthorized(req)) {
    return NextResponse.json(
      { revalidated: false, error: 'Secret invalide' },
      { status: 401, headers: NO_STORE_HEADERS },
    )
  }

  try {
    // Rafraîchit l'ensemble des pages partageant le layout racine (toutes les
    // pages du site, dans les deux langues). Suffisant et fiable pour un site
    // de contenu : la prochaine visite régénère la page avec le contenu Sanity.
    revalidatePath('/', 'layout')
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}`, 'layout')
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Site revalidé. Le nouveau contenu Sanity est en ligne.',
    })
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, error: err instanceof Error ? err.message : 'Erreur inconnue' },
      { status: 500 },
    )
  }
}

/**
 * Test de disponibilité (GET) — ne revalide pas.
 *
 * L'ancienne version renvoyait `authorized: true/false` : c'était un oracle de
 * validation du secret, testable en masse sans aucun effet de bord (donc sans
 * trace visible). Le GET ne révèle plus rien sur le secret.
 */
export async function GET(req: NextRequest) {
  const limited = await tooManyRequests(req)
  if (limited) return limited

  return NextResponse.json(
    {
      ok: true,
      hint: 'POST avec l’en-tête x-revalidate-secret pour revalider (webhook Sanity).',
    },
    { headers: NO_STORE_HEADERS },
  )
}
