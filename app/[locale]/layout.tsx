import type React from 'react'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { GoogleAnalytics } from '@/lib/analytics'
import { defaultMetadata, generateStructuredData } from '@/lib/seo'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import PageTransition from '@/components/page-transition'
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = defaultMetadata

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  console.log('LocaleLayout params:', locale)
  console.log('Available locales:', locales)

  if (!locales.includes(locale as any)) {
    console.log('Locale not found in locales list')
    notFound()
  }

  const messages = await getMessages({ locale })
  // const structuredData = generateStructuredData()

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        <PageTransition>
          {children}
        </PageTransition>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
