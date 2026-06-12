import { getLocale } from 'next-intl/server'
import Footer from '@/components/footer'
import { getFooterContent, getSiteSettings, getPoles } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'

/**
 * Wrapper serveur du Footer : récupère le contenu éditable du pied de page
 * (description, copyright) et le transmet au Footer client.
 * Accepte des données pré-localisées depuis le parent (page.tsx) pour garantir
 * la cohérence de la locale (FR/AR).
 */
export default async function SiteFooter({
    siteSettings,
    footerContent: footerContentProp,
    poles: polesProp,
}: {
    siteSettings?: any
    footerContent?: any
    poles?: any[]
}) {
    // Si les données pré-localisées sont fournies par le parent, les utiliser directement.
    // Sinon, les récupérer et les localiser ici (fallback pour les pages secondaires).
    if (footerContentProp && polesProp) {
        return <Footer siteSettings={siteSettings} footerContent={footerContentProp} sanityPoles={polesProp} />
    }

    const [locale, footerContentRaw, settingsRaw, polesRaw] = await Promise.all([
        getLocale(),
        getFooterContent(),
        siteSettings ? Promise.resolve(siteSettings) : getSiteSettings(),
        getPoles(),
    ])

    const footerContent = localizeSanityData(footerContentRaw, locale)
    const settings = siteSettings ? settingsRaw : localizeSanityData(settingsRaw, locale)
    const sanityPoles = localizeSanityData(polesRaw, locale)

    return <Footer siteSettings={settings} footerContent={footerContent} sanityPoles={sanityPoles} />
}
