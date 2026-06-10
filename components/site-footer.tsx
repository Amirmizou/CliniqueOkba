import Footer from '@/components/footer'
import { getFooterContent, getSiteSettings } from '@/sanity/lib/fetch'

/**
 * Wrapper serveur du Footer : récupère le contenu éditable du pied de page
 * (description, copyright) et le transmet au Footer client.
 */
export default async function SiteFooter({
    siteSettings,
}: {
    siteSettings?: any
}) {
    const [footerContent, settings] = await Promise.all([
        getFooterContent(),
        siteSettings ? Promise.resolve(siteSettings) : getSiteSettings(),
    ])

    return <Footer siteSettings={settings} footerContent={footerContent} />
}
