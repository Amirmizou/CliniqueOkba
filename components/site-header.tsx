import { getLocale } from 'next-intl/server'
import Header from '@/components/header'
import { getPoles, getSiteSettings } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'

/**
 * Wrapper serveur du Header : récupère les pôles (pour le menu déroulant)
 * et les transmet au Header client.
 *
 * IMPORTANT : on transmet les pôles BRUTS (avec `title`/`title_ar`), sans les
 * localiser ici. La localisation est faite dans le composant client Header
 * via `useLocale()`, qui renvoie toujours la bonne langue — contrairement à
 * `getLocale()` côté serveur qui, en rendu statique, peut retomber sur la
 * locale par défaut (fr) et faire apparaître les pôles en français en arabe.
 */
export default async function SiteHeader({
    siteSettings,
}: {
    siteSettings?: any
}) {
    const [locale, polesRaw, settingsRaw] = await Promise.all([
        getLocale(),
        getPoles(),
        siteSettings ? Promise.resolve(siteSettings) : getSiteSettings(),
    ])

    // `siteSettings` reçu en prop est déjà localisé par la page ; sinon on localise ici.
    const settings = siteSettings ? settingsRaw : localizeSanityData(settingsRaw, locale)

    return <Header siteSettings={settings} poles={polesRaw} />
}
