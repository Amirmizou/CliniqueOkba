import { notFound } from 'next/navigation'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import PolePageContent, {
    type PolePhoto,
    type PolePageData,
} from '@/components/pole-page-content'
import { getSiteSettings, getPoles, getFacilityPhotos } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { poles as localPoles, getPoleBySlug, CLINIC_PHONE } from '@/data/poles'
import { equipements } from '@/data/equipements'

export const revalidate = 3600

export async function generateStaticParams() {
    return localPoles.map((p) => ({ slug: p.slug }))
}

// Construit la liste de photos d'un pôle (Sanity sinon repli local)
function buildPhotos(categories: string[], facility?: any[]): PolePhoto[] {
    if (!categories || categories.length === 0) return []
    if (facility && facility.length > 0) {
        return facility
            .filter((d) => d?.image && categories.includes(d.category))
            .map((d) => ({
                id: d._id,
                src: urlFor(d.image).width(1200).height(900).url(),
                title: d.title || '',
                description: d.description || '',
            }))
    }
    return equipements
        .filter((e) => categories.includes(e.category))
        .map((e) => ({
            id: e.id,
            src: e.src,
            title: e.title,
            description: e.description,
        }))
}

// Résout les métadonnées du pôle (Sanity prioritaire, repli local)
function resolvePole(slug: string, sanityPoles?: any[]) {
    const local = getPoleBySlug(slug)
    const sanity = (sanityPoles || []).find((p) => p.slug === slug)
    if (!local && !sanity) return null

    const pole: PolePageData = {
        slug,
        title: sanity?.title || local?.title || '',
        description: sanity?.description || local?.description || '',
        intro: local?.intro || sanity?.description || undefined,
        items:
            sanity?.items && sanity.items.length > 0
                ? sanity.items
                : local?.items || [],
        iconName: sanity?.iconName || local?.iconName || 'Stethoscope',
        accent: sanity?.accentColor || local?.accent || '#006633',
        badge: sanity?.badge || local?.badge,
        urgent: sanity?.urgent ?? local?.urgent ?? false,
    }
    const categories: string[] =
        sanity?.galleryCategories && sanity.galleryCategories.length > 0
            ? sanity.galleryCategories
            : local?.galleryCategories || []

    return { pole, categories }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const local = getPoleBySlug(slug)
    if (!local) return { title: 'Pôle | Clinique OKBA' }
    return {
        title: `${local.title} | Clinique OKBA`,
        description: local.description,
    }
}

export default async function PolePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const [siteSettings, sanityPoles, facilityPhotos] = await Promise.all([
        getSiteSettings(),
        getPoles(),
        getFacilityPhotos(),
    ])

    const resolved = resolvePole(slug, sanityPoles)
    if (!resolved) notFound()

    const photos = buildPhotos(resolved.categories, facilityPhotos)
    const phone = siteSettings?.phone || CLINIC_PHONE

    return (
        <>
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-20">
                <PolePageContent pole={resolved.pole} photos={photos} phone={phone} />
            </main>
            <SiteFooter siteSettings={siteSettings} />
        </>
    )
}
