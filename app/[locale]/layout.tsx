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
  weight: ['400', '600', '700'], // Reduced from 5 to 3 weights
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true, // Reduce CLS
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
        {/* Critical CSS inline for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *,::before,::after{box-sizing:border-box;border:0 solid}
            *{margin:0;padding:0}
            html{-webkit-text-size-adjust:100%;tab-size:4;font-family:Poppins,system-ui,arial}
            body{line-height:inherit;margin:0}
            h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
            img,video{max-width:100%;height:auto}
            button{cursor:pointer}
          `
        }} />

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
            {process.env.NEXT_PUBLIC_GA_ID && (
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* Defer Analytics and SpeedInsights to end */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

