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
// PÔLES D'EXCELLENCE
// ==========================================

export const polesQuery = groq`
  *[_type == "pole" && active == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    items,
    iconName,
    accentColor,
    galleryCategories,
    badge,
    urgent
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

// Galerie « Plateau technique & espaces »
export const facilityPhotosQuery = groq`
  *[_type == "facilityPhoto" && active == true] | order(order asc) {
    _id,
    image,
    title,
    description,
    category,
    featured
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
    category,
    author,
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
    category,
    author,
    publishedAt
  }
`

// ==========================================
// ÉVÉNEMENTS
// ==========================================

export const eventsQuery = groq`
  *[_type == "event" && published == true] | order(startDate asc) {
    _id,
    title,
    slug,
    eventType,
    description,
    startDate,
    endDate,
    location,
    image,
    registrationDeadline,
    contact
  }
`

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    eventType,
    description,
    content,
    startDate,
    endDate,
    location,
    image,
    registrationDeadline,
    contact
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
    subtitle,
    image,
    bio,
    experience,
    services,
    qualifications,
    languages,
    consultationDays,
    consultationHours,
    accentColor,
    iconName
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
// CONVENTIONS & PRISE EN CHARGE
// ==========================================

export const insuranceSectionQuery = groq`
  *[_type == "insuranceSection" && active == true][0] {
    badge,
    title,
    subtitle,
    providers[] {
      name,
      description,
      logo
    },
    note,
    ctaText
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
    whatsappNumber,
    appointmentMessage,
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
    },
    heroStats[] {
      value,
      label
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
    ctaLink,
    "videoUrl": videoFile.asset->url,
    videoPoster
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
    ctaLink,
    "videoUrl": videoFile.asset->url,
    videoPoster
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
