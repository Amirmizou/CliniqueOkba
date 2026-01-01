import { client } from './client'
import {
    heroSlidesQuery,
    equipmentQuery,
    specialtiesQuery,
    galleryQuery,
    articlesQuery,
    articleBySlugQuery,
    siteSettingsQuery,
    doctorsQuery,
    doctorBySlugQuery,
    faqQuery,
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

// Cache options for better performance
const cacheOptions = {
    next: { revalidate: 3600 }, // 1 hour cache
}

const shortCacheOptions = {
    next: { revalidate: 60 }, // 1 minute cache for frequently updated content
}

// ==========================================
// HERO & HOME
// ==========================================

export async function getHeroSlides() {
    return client.fetch(heroSlidesQuery, {}, cacheOptions)
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
// SITE SETTINGS
// ==========================================

export async function getSiteSettings() {
    return client.fetch(siteSettingsQuery, {}, cacheOptions)
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
