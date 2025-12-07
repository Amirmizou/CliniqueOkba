import { withAuth } from "next-auth/middleware"
import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'never',
  localeDetection: false
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
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth')
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isStudioRoute = req.nextUrl.pathname.startsWith('/studio')
  const isAdminDashboard = req.nextUrl.pathname.startsWith('/admin/dashboard') ||
    req.nextUrl.pathname.startsWith('/admin/api')

  // Auth, admin, and studio routes should not be processed by intl middleware
  if (isAuthRoute || isAdminRoute || isStudioRoute) {
    // Only apply auth middleware to dashboard
    if (isAdminDashboard) {
      return (authMiddleware as any)(req)
    }
    // For /admin, /auth, and /studio, no middleware
    return
  }

  return intlMiddleware(req)
}

export const config = {
  // Match only internationalized pathnames, exclude auth, admin, and studio routes
  matcher: ['/((?!api|auth|admin|studio|_next|.*\\..*).*)', '/studio/:path*']
}
