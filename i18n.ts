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

  // Imports explicites (pas de template littéral) : webpack/Next émet des chunks
  // nommés fiables. Évite l'erreur dev « Cannot find module ./_rsc_messages_*_json.js ».
  const messages =
    validLocale === 'ar'
      ? (await import('./messages/ar.json')).default
      : (await import('./messages/fr.json')).default

  return {
    locale: validLocale,
    messages,
  }
})

