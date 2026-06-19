import type { ReactNode } from 'react'
import { lemonMilk, montserrat, montserratArabic } from './fonts'
import { getLocale } from 'next-intl/server'
import './globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={`${lemonMilk.variable} ${montserrat.variable} ${montserratArabic.variable}`} data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'window.puter = window.puter || {}; window.puter.quiet = true;' }} />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className={`${locale === 'ar' ? montserratArabic.className : 'font-sans'} antialiased`}>
        {children}
      </body>
    </html>
  )
}
