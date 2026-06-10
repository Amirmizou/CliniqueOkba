import type React from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme-provider'
import { GoogleAnalytics } from '@/lib/analytics'
import { defaultMetadata, generateStructuredData } from '@/lib/seo'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import PageTransition from '@/components/page-transition'
import { ServiceWorkerRegistration as SWRegistrationComponent } from '@/components/service-worker-registration'
import { AuraBackground } from '@/components/ui/aura-background'

export const metadata: Metadata = {
  ...defaultMetadata,
  other: {
    ...defaultMetadata.other,
  },
}

// Le wrapper <html>/<body> est fourni par le layout racine (app/layout.tsx).
// Ici on n'ajoute que les providers (i18n, thème, etc.) pour éviter un <html> imbriqué.
export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Always use French locale since app is French-only
  const locale = 'fr'
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Données structurées MedicalOrganization (SEO local + fiche Google) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData()),
        }}
      />
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

      {/* Analytics et SpeedInsights différés */}
      <Analytics />
      <SpeedInsights />
    </NextIntlClientProvider>
  )
}
