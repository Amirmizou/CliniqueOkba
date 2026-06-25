import { notFound } from 'next/navigation'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import PolePageContent, {
    type PolePhoto,
    type PolePageData,
} from '@/components/pole-page-content'
import LabResults from '@/components/lab-results'
import { getSiteSettings, getPoles, getFacilityPhotos, getEquipment, getLabResults } from '@/sanity/lib/fetch'
import { setRequestLocale } from 'next-intl/server'
import { localizeSanityData } from '@/sanity/lib/localize'
import { urlFor } from '@/sanity/lib/image'
import { poles as localPoles, getPoleBySlug, CLINIC_PHONE } from '@/data/poles'
import { equipements } from '@/data/equipements'
import { imagingEquipment } from '@/data/imaging-equipment'

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
function resolvePole(slug: string, locale: string, sanityPoles?: any[]) {
    const local = getPoleBySlug(slug)
    const sanity = (sanityPoles || []).find((p) => p.slug === slug)
    if (!local && !sanity) return null

    let title = sanity?.title || ''
    const hasArabicTitle = /[\u0600-\u06FF]/.test(title)
    if (locale === 'ar' && local?.title_ar && !hasArabicTitle) {
        title = local.title_ar
    } else if (!title && local) {
        title = locale === 'ar' && local.title_ar ? local.title_ar : local.title
    }

    let description = sanity?.description || ''
    const hasArabicDesc = /[\u0600-\u06FF]/.test(description)
    if (locale === 'ar' && local?.description_ar && !hasArabicDesc) {
        description = local.description_ar
    } else if (!description && local) {
        description = locale === 'ar' && local.description_ar ? local.description_ar : local.description
    }

    let intro = sanity?.intro || undefined
    const hasArabicIntro = intro ? /[\u0600-\u06FF]/.test(intro) : false
    if (locale === 'ar' && local?.intro_ar && intro && !hasArabicIntro) {
        intro = local.intro_ar
    } else if (!intro && local) {
        intro = locale === 'ar' && local.intro_ar ? local.intro_ar : local.intro
    }

    let badge = sanity?.badge || undefined
    const hasArabicBadge = badge ? /[\u0600-\u06FF]/.test(badge) : false
    if (locale === 'ar' && local?.badge_ar && badge && !hasArabicBadge) {
        badge = local.badge_ar
    } else if (!badge && local) {
        badge = locale === 'ar' && local.badge_ar ? local.badge_ar : local.badge
    }

    let items = sanity?.items || []
    const itemsHaveArabic = items.some((item: string) => /[\u0600-\u06FF]/.test(item))
    if (locale === 'ar' && local?.items_ar && items.length > 0 && !itemsHaveArabic) {
        items = local.items_ar
    } else if (items.length === 0 && local) {
        items = locale === 'ar' && local.items_ar && local.items_ar.length > 0 ? local.items_ar : local.items
    }

    const pole: PolePageData = {
        slug,
        title,
        description,
        intro,
        items,
        iconName: sanity?.iconName || local?.iconName || 'Stethoscope',
        accent: sanity?.accentColor || local?.accent || '#006633',
        badge,
        urgent: sanity?.urgent ?? local?.urgent ?? false,
        aiBoosted: sanity?.aiBoosted ?? local?.aiBoosted ?? false,
        videos: Array.isArray(sanity?.videos) && sanity.videos.length > 0
            ? sanity.videos.filter((v: any) => v?.videoUrl)
            : local?.videos,
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
    params: Promise<{ slug: string; locale: string }>
}) {
    const { slug, locale } = await params
    const local = getPoleBySlug(slug)
    if (!local) return { title: 'Pôle | Clinique OKBA' }

    const title = locale === 'ar' && local.title_ar ? local.title_ar : local.title
    const desc = locale === 'ar' && local.description_ar ? local.description_ar : local.description

    return {
        title: `${title} | Clinique OKBA`,
        description: desc,
    }
}

export default async function PolePage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>
}) {
    const { slug, locale } = await params
    setRequestLocale(locale)

    const [siteSettingsRaw, sanityPolesRaw, facilityPhotosRaw, equipmentsRaw, labResultsRaw] = await Promise.all([
        getSiteSettings(),
        getPoles(),
        getFacilityPhotos(),
        getEquipment(),
        slug === 'laboratoire' ? getLabResults() : Promise.resolve(null),
    ])

    // Localisation FR/AR du contenu Sanity (repli sur le français)
    const siteSettings = localizeSanityData(siteSettingsRaw, locale)
    const sanityPoles = localizeSanityData(sanityPolesRaw, locale)
    const facilityPhotos = localizeSanityData(facilityPhotosRaw, locale)
    const equipments = localizeSanityData(equipmentsRaw, locale)
    const labResults = localizeSanityData(labResultsRaw, locale)

    const resolved = resolvePole(slug, locale, sanityPoles)
    if (!resolved) notFound()

    const photos = buildPhotos(resolved.categories, facilityPhotos)
    const phone = siteSettings?.phone || CLINIC_PHONE

    // Filter equipments if the pole has an equipment category match
    // 'imagerie' -> 'imaging', 'laboratoire' -> 'laboratory', etc.
    let poleEquipments: any[] = []
    if (slug === 'imagerie' || slug === 'urgences' || slug === 'chirurgie' || slug === 'laboratoire') {
        const catMap: Record<string, string> = {
            'imagerie': 'imaging',
            'laboratoire': 'laboratory',
            'chirurgie': 'surgery',
            'urgences': 'facility'
        }
        const mappedCat = catMap[slug]
        poleEquipments = equipments?.filter((eq: any) => eq.category === mappedCat || (slug === 'laboratoire' && eq.category === 'laboratoire')) || []
    }

    // Repli local documenté (plateforme Siemens Healthineers) si aucun équipement
    // n'est encore renseigné dans Sanity pour ce pôle (imagerie & médecine nucléaire).
    if (poleEquipments.length === 0 && imagingEquipment[slug]) {
        poleEquipments = localizeSanityData(imagingEquipment[slug], locale)
    }

    return (
        <>
            <SiteHeader siteSettings={siteSettings} />
            <main className="min-h-screen pt-8">
                <PolePageContent 
                    pole={resolved.pole} 
                    photos={photos} 
                    phone={phone} 
                    equipments={poleEquipments}
                />
                {slug === 'laboratoire' && <LabResults locale={locale} data={labResults} />}
            </main>
            <SiteFooter siteSettings={siteSettings} />
        </>
    )
}
