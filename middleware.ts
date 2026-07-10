import { withAuth } from "next-auth/middleware"
import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'
import { NextRequest, NextResponse } from 'next/server'

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

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

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
  // Traite toutes les pages sauf les API, les assets Next et les fichiers.
  // /admin et /studio sont désormais inclus pour être protégés par NextAuth.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
