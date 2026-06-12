import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

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
 *        - URL    : https://cliniqueokba.com/api/revalidate?secret=LE_SECRET
 *        - Dataset: production
 *        - Trigger: Create, Update, Delete
 *        - HTTP method: POST
 *
 * Test manuel : POST https://cliniqueokba.com/api/revalidate?secret=LE_SECRET
 */

export const dynamic = 'force-dynamic'

const LOCALES = ['fr', 'ar']

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return false
  const provided =
    req.nextUrl.searchParams.get('secret') ||
    req.headers.get('x-revalidate-secret')
  return provided === secret
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ revalidated: false, error: 'Secret invalide' }, { status: 401 })
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

// Permet un test rapide dans le navigateur (GET) — ne revalide pas, informe.
export async function GET(req: NextRequest) {
  return NextResponse.json({
    ok: true,
    authorized: isAuthorized(req),
    hint: 'Utilisez POST avec ?secret=... pour revalider. Configurez un webhook Sanity.',
  })
}
