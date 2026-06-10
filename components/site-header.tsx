import Header from '@/components/header'
import { getPoles, getSiteSettings } from '@/sanity/lib/fetch'

/**
 * Wrapper serveur du Header : récupère les pôles (pour le menu déroulant)
 * et les transmet au Header client. `siteSettings` peut être fourni par la
 * page (pour éviter un double fetch) ou récupéré ici.
 */
export default async function SiteHeader({
    siteSettings,
}: {
    siteSettings?: any
}) {
    const [poles, settings] = await Promise.all([
        getPoles(),
        siteSettings ? Promise.resolve(siteSettings) : getSiteSettings(),
    ])

    return <Header siteSettings={settings} poles={poles} />
}
