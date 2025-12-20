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
} from './queries'

// Cache options for better performance
const cacheOptions = {
    next: { revalidate: 3600 }, // 1 hour cache
}

// Hero Slides
export async function getHeroSlides() {
    return client.fetch(heroSlidesQuery, {}, cacheOptions)
}

// Equipment
export async function getEquipment() {
    return client.fetch(equipmentQuery, {}, cacheOptions)
}

// Specialties
export async function getSpecialties() {
    return client.fetch(specialtiesQuery, {}, cacheOptions)
}

// Gallery
export async function getGallery() {
    return client.fetch(galleryQuery, {}, cacheOptions)
}

// Articles
export async function getArticles() {
    return client.fetch(articlesQuery, {}, cacheOptions)
}

export async function getArticleBySlug(slug: string) {
    return client.fetch(articleBySlugQuery, { slug }, cacheOptions)
}

// Site Settings
export async function getSiteSettings() {
    return client.fetch(siteSettingsQuery, {}, cacheOptions)
}

// Doctors
export async function getDoctors() {
    return client.fetch(doctorsQuery, {}, cacheOptions)
}

export async function getDoctorBySlug(slug: string) {
    return client.fetch(doctorBySlugQuery, { slug }, cacheOptions)
}

// FAQ
export async function getFaq() {
    return client.fetch(faqQuery, {}, cacheOptions)
}

