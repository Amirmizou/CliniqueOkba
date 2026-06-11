import { getRequestConfig } from 'next-intl/server'

export const locales = ['fr', 'ar'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  const validLocale: string = typeof locale === 'string' && locales.includes(locale as Locale) ? locale : 'fr'

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  }
})

