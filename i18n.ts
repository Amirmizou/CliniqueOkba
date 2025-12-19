import { getRequestConfig } from 'next-intl/server'

export const locales = ['fr'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // Since app is French-only, always use 'fr'
  const validLocale = 'fr'

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  }
})

