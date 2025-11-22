import { withAuth } from "next-auth/middleware"
import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: true
})

const authMiddleware = withAuth(
  // Note: If you need to augment the request for the intlMiddleware, do it here.
  function onSuccess(req) {
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
  // Exclude API routes from intl middleware but keep them for auth if needed
  // For now, we only protect /admin routes with auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/admin')

  if (isAuthPage) {
    return (authMiddleware as any)(req)
  }

  return intlMiddleware(req)
}

export const config = {
  // Match only internationalized pathnames and admin routes
  matcher: ['/((?!api|_next|.*\\..*).*)', '/admin/:path*']
}
