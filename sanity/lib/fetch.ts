import { client } from './client'
import {
    heroSlidesQuery,
    equipmentQuery,
    specialtiesQuery,
    galleryQuery,
    facilityPhotosQuery,
    polesQuery,
    articlesQuery,
    articleBySlugQuery,
    eventsQuery,
    eventBySlugQuery,
    siteSettingsQuery,
    doctorsQuery,
    doctorBySlugQuery,
    faqQuery,
    insuranceSectionQuery,
    videosQuery,
    // Nouvelles queries
    aboutSectionQuery,
    servicesQuery,
    featuredServicesQuery,
    serviceBySlugQuery,
    testimonialsQuery,
    featuredTestimonialsQuery,
    homeCareQuery,
    sectionContentQuery,
    allSectionContentsQuery,
    footerContentQuery,
    pageSeoQuery,
    allPageSeoQuery,
    labResultsQuery,
} from './queries'

// En développement : revalidation quasi immédiate (1 s) → les changements publiés
// dans Sanity apparaissent au simple rafraîchissement de la page.
// En production : ISR pour la performance.
const isDev = process.env.NODE_ENV === 'development'

const cacheOptions = isDev 
    ? { cache: 'no-store' as const }
    : { next: { revalidate: 3600 } }

const shortCacheOptions = isDev
    ? { cache: 'no-store' as const }
    : { next: { revalidate: 60 } }

/**
 * Garde-fou réseau : si Sanity est injoignable (timeout, coupure, quota),
 * on retourne un repli (`[]` ou `null`) au lieu de laisser l'exception
 * remonter et faire planter toute la page. Les composants disposent déjà
 * de données locales de secours — la dégradation reste gracieuse.
 */
async function safeFetch<T>(promise: Promise<T>, fallback: T): Promise<T> {
    try {
        return await promise
    } catch (error) {
        console.error('[sanity] fetch failed, using fallback:', (error as Error)?.message)
        return fallback
    }
}

// ==========================================
// HERO & HOME
// ==========================================

export async function getHeroSlides() {
    return safeFetch(client.fetch(heroSlidesQuery, {}, cacheOptions), [])
}

export async function getVideos() {
    return safeFetch(client.fetch(videosQuery, {}, cacheOptions), [])
}

// ==========================================
// ABOUT SECTION
// ==========================================

export async function getAboutSection() {
    return safeFetch(client.fetch(aboutSectionQuery, {}, cacheOptions), null)
}

// ==========================================
// SERVICES
// ==========================================

export async function getServices() {
    return safeFetch(client.fetch(servicesQuery, {}, cacheOptions), [])
}

export async function getFeaturedServices() {
    return safeFetch(client.fetch(featuredServicesQuery, {}, cacheOptions), [])
}

export async function getServiceBySlug(slug: string) {
    return safeFetch(client.fetch(serviceBySlugQuery, { slug }, cacheOptions), null)
}

// ==========================================
// EQUIPMENT & TECHNOLOGY
// ==========================================

export async function getEquipment() {
    return safeFetch(client.fetch(equipmentQuery, {}, cacheOptions), [])
}

// ==========================================
// SPECIALTIES
// ==========================================

export async function getSpecialties() {
    return safeFetch(client.fetch(specialtiesQuery, {}, cacheOptions), [])
}

export async function getPoles() {
    return safeFetch(client.fetch(polesQuery, {}, cacheOptions), [])
}

// ==========================================
// TESTIMONIALS
// ==========================================

export async function getTestimonials() {
    return safeFetch(client.fetch(testimonialsQuery, {}, shortCacheOptions), [])
}

export async function getFeaturedTestimonials() {
    return safeFetch(client.fetch(featuredTestimonialsQuery, {}, shortCacheOptions), [])
}

// ==========================================
// HOME CARE
// ==========================================

export async function getHomeCare() {
    return safeFetch(client.fetch(homeCareQuery, {}, cacheOptions), null)
}

// ==========================================
// GALLERY
// ==========================================

export async function getGallery() {
    return safeFetch(client.fetch(galleryQuery, {}, cacheOptions), [])
}

export async function getFacilityPhotos() {
    return safeFetch(client.fetch(facilityPhotosQuery, {}, cacheOptions), [])
}

// ==========================================
// ARTICLES / BLOG
// ==========================================

export async function getArticles() {
    return safeFetch(client.fetch(articlesQuery, {}, shortCacheOptions), [])
}

export async function getArticleBySlug(slug: string) {
    return safeFetch(client.fetch(articleBySlugQuery, { slug }, cacheOptions), null)
}

// ==========================================
// ÉVÉNEMENTS
// ==========================================

export async function getEvents() {
    return safeFetch(client.fetch(eventsQuery, {}, shortCacheOptions), [])
}

export async function getEventBySlug(slug: string) {
    return safeFetch(client.fetch(eventBySlugQuery, { slug }, cacheOptions), null)
}

// ==========================================
// DOCTORS / TEAM
// ==========================================

export async function getDoctors() {
    return safeFetch(client.fetch(doctorsQuery, {}, cacheOptions), [])
}

export async function getDoctorBySlug(slug: string) {
    return safeFetch(client.fetch(doctorBySlugQuery, { slug }, cacheOptions), null)
}

// ==========================================
// FAQ
// ==========================================

export async function getFaq() {
    return safeFetch(client.fetch(faqQuery, {}, cacheOptions), [])
}

// ==========================================
// CONVENTIONS & PRISE EN CHARGE
// ==========================================

export async function getInsuranceSection() {
    return safeFetch(client.fetch(insuranceSectionQuery, {}, cacheOptions), null)
}

// ==========================================
// SITE SETTINGS
// ==========================================

export async function getSiteSettings() {
    // Config du site (numéros, WhatsApp…) : cache court pour refléter vite les changements
    return safeFetch(client.fetch(siteSettingsQuery, {}, shortCacheOptions), null)
}

// ==========================================
// SECTION CONTENT
// ==========================================

export async function getSectionContent(sectionId: string) {
    return safeFetch(client.fetch(sectionContentQuery, { sectionId }, cacheOptions), null)
}

export async function getAllSectionContents() {
    return safeFetch(client.fetch(allSectionContentsQuery, {}, cacheOptions), [])
}

// ==========================================
// FOOTER CONTENT
// ==========================================

export async function getFooterContent() {
    return safeFetch(client.fetch(footerContentQuery, {}, cacheOptions), null)
}

// ==========================================
// PAGE SEO
// ==========================================

export async function getPageSeo(page: string) {
    return safeFetch(client.fetch(pageSeoQuery, { page }, cacheOptions), null)
}

export async function getAllPageSeo() {
    return safeFetch(client.fetch(allPageSeoQuery, {}, cacheOptions), [])
}

// ==========================================
// UTILITY: Get all data for homepage
// ==========================================

export async function getHomePageData() {
    const [
        heroSlides,
        aboutSection,
        services,
        specialties,
        equipment,
        testimonials,
        gallery,
        siteSettings,
        homeCare,
        sectionContents,
    ] = await Promise.all([
        getHeroSlides(),
        getAboutSection(),
        getFeaturedServices(),
        getSpecialties(),
        getEquipment(),
        getFeaturedTestimonials(),
        getGallery(),
        getSiteSettings(),
        getHomeCare(),
        getAllSectionContents(),
    ])

    return {
        heroSlides,
        aboutSection,
        services,
        specialties,
        equipment,
        testimonials,
        gallery,
        siteSettings,
        homeCare,
        sectionContents,
    }
}

// ==========================================
// LABORATOIRE
// ==========================================

export async function getLabResults() {
    return safeFetch(client.fetch(labResultsQuery, {}, cacheOptions), null)
}
