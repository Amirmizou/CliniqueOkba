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

// ==========================================
// HERO & HOME
// ==========================================

export async function getHeroSlides() {
    return client.fetch(heroSlidesQuery, {}, cacheOptions)
}

export async function getVideos() {
    return client.fetch(videosQuery, {}, cacheOptions)
}

// ==========================================
// ABOUT SECTION
// ==========================================

export async function getAboutSection() {
    return client.fetch(aboutSectionQuery, {}, cacheOptions)
}

// ==========================================
// SERVICES
// ==========================================

export async function getServices() {
    return client.fetch(servicesQuery, {}, cacheOptions)
}

export async function getFeaturedServices() {
    return client.fetch(featuredServicesQuery, {}, cacheOptions)
}

export async function getServiceBySlug(slug: string) {
    return client.fetch(serviceBySlugQuery, { slug }, cacheOptions)
}

// ==========================================
// EQUIPMENT & TECHNOLOGY
// ==========================================

export async function getEquipment() {
    return client.fetch(equipmentQuery, {}, cacheOptions)
}

// ==========================================
// SPECIALTIES
// ==========================================

export async function getSpecialties() {
    return client.fetch(specialtiesQuery, {}, cacheOptions)
}

export async function getPoles() {
    return client.fetch(polesQuery, {}, cacheOptions)
}

// ==========================================
// TESTIMONIALS
// ==========================================

export async function getTestimonials() {
    return client.fetch(testimonialsQuery, {}, shortCacheOptions)
}

export async function getFeaturedTestimonials() {
    return client.fetch(featuredTestimonialsQuery, {}, shortCacheOptions)
}

// ==========================================
// HOME CARE
// ==========================================

export async function getHomeCare() {
    return client.fetch(homeCareQuery, {}, cacheOptions)
}

// ==========================================
// GALLERY
// ==========================================

export async function getGallery() {
    return client.fetch(galleryQuery, {}, cacheOptions)
}

export async function getFacilityPhotos() {
    return client.fetch(facilityPhotosQuery, {}, cacheOptions)
}

// ==========================================
// ARTICLES / BLOG
// ==========================================

export async function getArticles() {
    return client.fetch(articlesQuery, {}, shortCacheOptions)
}

export async function getArticleBySlug(slug: string) {
    return client.fetch(articleBySlugQuery, { slug }, cacheOptions)
}

// ==========================================
// ÉVÉNEMENTS
// ==========================================

export async function getEvents() {
    return client.fetch(eventsQuery, {}, shortCacheOptions)
}

export async function getEventBySlug(slug: string) {
    return client.fetch(eventBySlugQuery, { slug }, cacheOptions)
}

// ==========================================
// DOCTORS / TEAM
// ==========================================

export async function getDoctors() {
    return client.fetch(doctorsQuery, {}, cacheOptions)
}

export async function getDoctorBySlug(slug: string) {
    return client.fetch(doctorBySlugQuery, { slug }, cacheOptions)
}

// ==========================================
// FAQ
// ==========================================

export async function getFaq() {
    return client.fetch(faqQuery, {}, cacheOptions)
}

// ==========================================
// CONVENTIONS & PRISE EN CHARGE
// ==========================================

export async function getInsuranceSection() {
    return client.fetch(insuranceSectionQuery, {}, cacheOptions)
}

// ==========================================
// SITE SETTINGS
// ==========================================

export async function getSiteSettings() {
    // Config du site (numéros, WhatsApp…) : cache court pour refléter vite les changements
    return client.fetch(siteSettingsQuery, {}, shortCacheOptions)
}

// ==========================================
// SECTION CONTENT
// ==========================================

export async function getSectionContent(sectionId: string) {
    return client.fetch(sectionContentQuery, { sectionId }, cacheOptions)
}

export async function getAllSectionContents() {
    return client.fetch(allSectionContentsQuery, {}, cacheOptions)
}

// ==========================================
// FOOTER CONTENT
// ==========================================

export async function getFooterContent() {
    return client.fetch(footerContentQuery, {}, cacheOptions)
}

// ==========================================
// PAGE SEO
// ==========================================

export async function getPageSeo(page: string) {
    return client.fetch(pageSeoQuery, { page }, cacheOptions)
}

export async function getAllPageSeo() {
    return client.fetch(allPageSeoQuery, {}, cacheOptions)
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
