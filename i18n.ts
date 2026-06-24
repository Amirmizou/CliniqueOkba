import { getRequestConfig } from 'next-intl/server'

export const locales = ['fr', 'ar'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl v4 : la locale arrive via `requestLocale` (Promise), alimentée par
  // le middleware et `setRequestLocale`. L'ancienne signature `{ locale }` était
  // toujours `undefined` ici → repli systématique sur `fr`, ce qui faisait
  // apparaître les composants serveur (getTranslations) en français même en arabe.
  const requested = await requestLocale
  const validLocale: string =
    typeof requested === 'string' && locales.includes(requested as Locale) ? requested : 'fr'

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  }
})

