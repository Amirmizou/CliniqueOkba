import { getLocale } from 'next-intl/server'
import Header from '@/components/header'
import { getPoles, getSiteSettings } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'

/**
 * Wrapper serveur du Header : récupère les pôles (pour le menu déroulant)
 * et les transmet au Header client. `siteSettings` peut être fourni par la
 * page (pour éviter un double fetch) ou récupéré ici.
 * Le contenu Sanity est localisé (FR/AR) selon la locale courante.
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

    const poles = localizeSanityData(polesRaw, locale)
    // `siteSettings` reçu en prop est déjà localisé par la page ; sinon on localise ici.
    const settings = siteSettings ? settingsRaw : localizeSanityData(settingsRaw, locale)

    return <Header siteSettings={settings} poles={poles} />
}
