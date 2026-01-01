import { groq } from 'next-sanity'

// ==========================================
// HERO & HOME
// ==========================================

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

// ==========================================
// ABOUT SECTION
// ==========================================

export const aboutSectionQuery = groq`
  *[_type == "aboutSection"][0] {
    title,
    subtitle,
    description,
    mission,
    vision,
    values[] {
      title,
      description,
      icon
    },
    stats[] {
      value,
      label,
      icon
    },
    image,
    certifications
  }
`

// ==========================================
// SERVICES
// ==========================================

export const servicesQuery = groq`
  *[_type == "service" && active == true] | order(order asc) {
    _id,
    name,
    slug,
    description,
    fullDescription,
    icon,
    image,
    features,
    price,
    duration,
    category,
    featured
  }
`

export const featuredServicesQuery = groq`
  *[_type == "service" && active == true && featured == true] | order(order asc) {
    _id,
    name,
    slug,
    description,
    icon,
    image
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    fullDescription,
    icon,
    image,
    features,
    price,
    duration,
    category
  }
`

// ==========================================
// EQUIPMENT & TECHNOLOGY
// ==========================================

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

// ==========================================
// SPECIALTIES
// ==========================================

export const specialtiesQuery = groq`
  *[_type == "specialty"] | order(order asc) {
    _id,
    name,
    description,
    icon,
    image
  }
`

// ==========================================
// TESTIMONIALS
// ==========================================

export const testimonialsQuery = groq`
  *[_type == "testimonial" && active == true] | order(order asc) {
    _id,
    name,
    avatar,
    rating,
    comment,
    service,
    date,
    verified,
    featured
  }
`

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && active == true && featured == true] | order(rating desc)[0...5] {
    _id,
    name,
    avatar,
    rating,
    comment,
    service,
    verified
  }
`

// ==========================================
// HOME CARE
// ==========================================

export const homeCareQuery = groq`
  *[_type == "homeCare" && active == true][0] {
    title,
    subtitle,
    description,
    image,
    services[] {
      name,
      description,
      icon,
      price
    },
    benefits,
    callToAction {
      text,
      phone
    },
    availability
  }
`

// ==========================================
// GALLERY
// ==========================================

export const galleryQuery = groq`
  *[_type == "galleryImage"] | order(order asc) {
    _id,
    image,
    caption,
    category
  }
`

// ==========================================
// ARTICLES / BLOG
// ==========================================

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

// ==========================================
// DOCTORS / TEAM
// ==========================================

export const doctorsQuery = groq`
  *[_type == "doctor" && active == true] | order(order asc) {
    _id,
    name,
    slug,
    specialty,
    title,
    image,
    bio,
    qualifications,
    languages,
    consultationDays
  }
`

export const doctorBySlugQuery = groq`
  *[_type == "doctor" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    specialty,
    title,
    image,
    bio,
    qualifications,
    languages,
    consultationDays
  }
`

// ==========================================
// FAQ
// ==========================================

export const faqQuery = groq`
  *[_type == "faq" && active == true] | order(order asc) {
    _id,
    question,
    answer,
    category
  }
`

// ==========================================
// SITE SETTINGS
// ==========================================

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    clinicName,
    description,
    logo,
    phone,
    email,
    address,
    coordinates {
      lat,
      lng
    },
    hours {
      emergency,
      weekdays,
      saturday
    },
    social {
      facebook,
      instagram
    }
  }
`

// ==========================================
// SECTION CONTENT (Titres, sous-titres)
// ==========================================

export const sectionContentQuery = groq`
  *[_type == "sectionContent" && sectionId == $sectionId][0] {
    sectionId,
    badge,
    title,
    subtitle,
    description,
    ctaText,
    ctaLink
  }
`

export const allSectionContentsQuery = groq`
  *[_type == "sectionContent"] {
    sectionId,
    badge,
    title,
    subtitle,
    description,
    ctaText,
    ctaLink
  }
`

// ==========================================
// FOOTER CONTENT
// ==========================================

export const footerContentQuery = groq`
  *[_type == "footerContent"][0] {
    description,
    quickLinks[] {
      label,
      href
    },
    servicesLinks[] {
      label,
      href
    },
    legalLinks[] {
      label,
      href
    },
    copyright,
    newsletterTitle,
    newsletterDescription,
    showNewsletter
  }
`

// ==========================================
// PAGE SEO
// ==========================================

export const pageSeoQuery = groq`
  *[_type == "pageSeo" && page == $page][0] {
    page,
    metaTitle,
    metaDescription,
    ogImage,
    keywords,
    canonicalUrl,
    noIndex
  }
`

export const allPageSeoQuery = groq`
  *[_type == "pageSeo"] {
    page,
    metaTitle,
    metaDescription,
    ogImage,
    keywords
  }
`
