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

// Hero Slides
export async function getHeroSlides() {
    return client.fetch(heroSlidesQuery)
}

// Equipment
export async function getEquipment() {
    return client.fetch(equipmentQuery)
}

// Specialties
export async function getSpecialties() {
    return client.fetch(specialtiesQuery)
}

// Gallery
export async function getGallery() {
    return client.fetch(galleryQuery)
}

// Articles
export async function getArticles() {
    return client.fetch(articlesQuery)
}

export async function getArticleBySlug(slug: string) {
    return client.fetch(articleBySlugQuery, { slug })
}

// Site Settings
export async function getSiteSettings() {
    return client.fetch(siteSettingsQuery)
}

// Doctors
export async function getDoctors() {
    return client.fetch(doctorsQuery)
}

export async function getDoctorBySlug(slug: string) {
    return client.fetch(doctorBySlugQuery, { slug })
}

// FAQ
export async function getFaq() {
    return client.fetch(faqQuery)
}

