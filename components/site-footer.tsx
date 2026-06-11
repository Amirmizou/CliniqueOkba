import { getLocale } from 'next-intl/server'
import Footer from '@/components/footer'
import { getFooterContent, getSiteSettings } from '@/sanity/lib/fetch'
import { localizeSanityData } from '@/sanity/lib/localize'

/**
 * Wrapper serveur du Footer : récupère le contenu éditable du pied de page
 * (description, copyright) et le transmet au Footer client.
 * Le contenu Sanity est localisé (FR/AR) selon la locale courante.
 */
export default async function SiteFooter({
    siteSettings,
}: {
    siteSettings?: any
}) {
    const [locale, footerContentRaw, settingsRaw] = await Promise.all([
        getLocale(),
        getFooterContent(),
        siteSettings ? Promise.resolve(siteSettings) : getSiteSettings(),
    ])

    const footerContent = localizeSanityData(footerContentRaw, locale)
    const settings = siteSettings ? settingsRaw : localizeSanityData(settingsRaw, locale)

    return <Footer siteSettings={settings} footerContent={footerContent} />
}
