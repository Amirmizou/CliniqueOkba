import { groq } from 'next-sanity'

// Hero Slides
export const heroSlidesQuery = groq`
  *[_type == "heroSlide" && active == true] | order(order asc) {
    _id,
    title,
    subtitle,
    image,
    order
  }
`

// Equipment
export const equipmentQuery = groq`
  *[_type == "equipment"] | order(order asc) {
    _id,
    name,
    brand,
    model,
    category,
    description,
    icon,
    image,
    features
  }
`

// Specialties
export const specialtiesQuery = groq`
  *[_type == "specialty"] | order(order asc) {
    _id,
    name,
    description,
    icon,
    image
  }
`

// Gallery Images
export const galleryQuery = groq`
  *[_type == "galleryImage"] | order(order asc) {
    _id,
    image,
    caption,
    category
  }
`

// Articles
export const articlesQuery = groq`
  *[_type == "article" && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    image,
    publishedAt
  }
`

// Single Article
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    image,
    publishedAt
  }
`

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    clinicName,
    description,
    logo,
    phone,
    email,
    address,
    coordinates,
    hours,
    social
  }
`
