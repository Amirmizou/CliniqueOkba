import type React from 'react'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme-provider'
import { GoogleAnalytics } from '@/lib/analytics'
import { defaultMetadata } from '@/lib/seo'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import PageTransition from '@/components/page-transition'
import { ServiceWorkerRegistration as SWRegistrationComponent } from '@/components/service-worker-registration'
import { AuraBackground } from '@/components/ui/aura-background'
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  ...defaultMetadata,
  other: {
    ...defaultMetadata.other,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Always use French locale since app is French-only
  const locale = 'fr'
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} className={poppins.className} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <AuraBackground>
              <PageTransition>
                {children}
              </PageTransition>
            </AuraBackground>
            <SWRegistrationComponent />
            <Analytics />
            <SpeedInsights />
            {process.env.NEXT_PUBLIC_GA_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

