import { withAuth } from "next-auth/middleware"
import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'
import { NextRequest, NextResponse } from 'next/server'
import {
  ATTACK_UA_RE,
  SCANNER_EXT_RE,
  SCANNER_PATH_RE,
  UNWANTED_CRAWLER_RE,
} from './lib/bot-signatures'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: false
})

const authMiddleware = withAuth(
  // Note: If you need to augment the request for the intlMiddleware, do it here.
  function onSuccess(req) {
    if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/studio')) {
      return NextResponse.next()
    }
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null
    },
    pages: {
      signIn: '/auth/signin'
    }
  }
)

/** Requête vers un fichier (extension présente) : pas d'internationalisation. */
const HAS_EXTENSION = /\.[a-zA-Z0-9]{1,8}$/

/**
 * Réponse minimale pour les robots : aucun rendu React, aucun contenu utile,
 * et surtout aucun indice sur ce qui existe ou non.
 */
function shutDown(status: number) {
  return new NextResponse(null, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ua = req.headers.get('user-agent') || ''

  /* ---------------------------------------------------------------------- */
  /* Bouclier anti-robots (avant tout traitement applicatif)                */
  /* ---------------------------------------------------------------------- */

  // 1. Chemins de scan automatisé : /wp-login.php, /.env, /.git/config,
  //    /phpmyadmin, /backup.sql… Ils représentent l'essentiel du trafic
  //    hostile d'un site public. Les laisser atteindre Next.js déclenche le
  //    rendu complet d'une page 404 React : du CPU offert à l'attaquant.
  if (SCANNER_PATH_RE.test(pathname) || SCANNER_EXT_RE.test(pathname)) {
    return shutDown(404)
  }

  // 2. Outils d'attaque identifiés (sqlmap, nikto, nuclei, wpscan…).
  if (ATTACK_UA_RE.test(ua)) {
    return shutDown(403)
  }

  // 3. Aspirateurs SEO / IA sans intérêt pour une clinique locale, gros
  //    consommateurs de bande passante. Les moteurs de recherche (Google,
  //    Bing…) ne sont PAS concernés : ils restent autorisés.
  if (UNWANTED_CRAWLER_RE.test(ua)) {
    return shutDown(403)
  }

  /* ---------------------------------------------------------------------- */
  /* Routage applicatif                                                     */
  /* ---------------------------------------------------------------------- */

  // Les routes API et les fichiers gèrent eux-mêmes leur sécurité : ils ne
  // doivent pas passer par l'internationalisation.
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || HAS_EXTENSION.test(pathname)) {
    return NextResponse.next()
  }

  // Strip locale from admin/studio routes and redirect to the unlocalized path
  const localePrefixMatch = pathname.match(/^\/(fr|ar)\/(admin|studio)(.*)$/)
  if (localePrefixMatch) {
    const url = req.nextUrl.clone()
    url.pathname = `/${localePrefixMatch[2]}${localePrefixMatch[3]}`
    return NextResponse.redirect(url)
  }

  // La page de connexion reste publique
  if (pathname.startsWith('/auth')) {
    return
  }

  // Tout /admin (dashboard + panneau) et /studio exige une authentification
  // côté serveur : les non-connectés sont redirigés vers /auth/signin AVANT
  // que la page ne se rende (défense au-delà du contrôle client).
  if (pathname.startsWith('/admin') || pathname.startsWith('/studio')) {
    return (authMiddleware as any)(req)
  }

  // Pages publiques → internationalisation
  return intlMiddleware(req)
}

export const config = {
  // Le middleware voit désormais TOUTES les requêtes (y compris /api et les
  // chemins avec extension) : c'est indispensable pour intercepter les sondages
  // de type /wp-login.php ou /.env, qui étaient auparavant exclus du matcher et
  // atteignaient donc directement l'application.
  // Seuls les assets générés par Next sont exclus (aucun risque, volume élevé).
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
