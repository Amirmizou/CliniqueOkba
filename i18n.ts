import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['fr', 'en', 'ar'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  console.log('i18n getRequestConfig locale:', locale)

  let validLocale = locale as string;
  if (!locales.includes(locale as any)) {
    console.log('i18n validation failed for:', locale)
    validLocale = 'fr'; // Fallback
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  }
})
