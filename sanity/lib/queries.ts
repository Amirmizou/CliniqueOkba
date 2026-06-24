import { groq } from 'next-sanity'

// ==========================================
// HERO & HOME
// ==========================================

// Hero Slides
export const heroSlidesQuery = groq`
  *[_type == "heroSlide" && active == true] | order(order asc) {
    _id,
    title,
    title_ar,
    subtitle,
    subtitle_ar,
    image,
    "videoUrl": videoFile.asset->url,
    order
  }
`

// ==========================================
// ABOUT SECTION
// ==========================================

export const aboutSectionQuery = groq`
  *[_type == "aboutSection"][0] {
    title,
    title_ar,
    subtitle,
    subtitle_ar,
    description,
    description_ar,
    mission,
    mission_ar,
    vision,
    vision_ar,
    values[] {
      ...,
    },
    values_ar[] {
      title,
    title_ar,
      description,
    description_ar,
      icon
    },
    stats[] {
      ...,
    },
    stats_ar[] {
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
    name_ar,
    slug,
    description,
    description_ar,
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
    name_ar,
    slug,
    description,
    description_ar,
    icon,
    image
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    name,
    name_ar,
    slug,
    description,
    description_ar,
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
    name_ar,
    brand,
    model,
    category,
    description,
    description_ar,
    icon,
    image,
    features,
    features_ar
  }
`

// ==========================================
// PÔLES D'EXCELLENCE
// ==========================================

export const polesQuery = groq`
  *[_type == "pole" && active == true] | order(order asc) {
    _id,
    title,
    title_ar,
    "slug": slug.current,
    description,
    description_ar,
    items,
    items_ar,
    iconName,
    accentColor,
    "imageUrl": image.asset->url,
    galleryCategories,
    "videos": videos[]{
      title,
      title_ar,
      "videoUrl": videoFile.asset->url,
      poster
    },
    badge,
    badge_ar,
    urgent,
    featured
  }
`

// ==========================================
// SPECIALTIES
// ==========================================

export const specialtiesQuery = groq`
  *[_type == "specialty"] | order(order asc) {
    _id,
    name,
    name_ar,
    description,
    description_ar,
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
    name_ar,
    avatar,
    rating,
    comment,
    comment_ar,
    service,
    service_ar,
    date,
    verified,
    featured
  }
`

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && active == true && featured == true] | order(rating desc)[0...5] {
    _id,
    name,
    name_ar,
    avatar,
    rating,
    comment,
    comment_ar,
    service,
    service_ar,
    verified
  }
`

// ==========================================
// HOME CARE
// ==========================================

export const homeCareQuery = groq`
  *[_type == "homeCare" && active == true][0] {
    title,
    title_ar,
    badge,
    badge_ar,
    subtitle,
    subtitle_ar,
    description,
    description_ar,
    image,
    services[] {
      ...,
    },
    services_ar[] {
      name,
    name_ar,
      description,
    description_ar,
      icon,
      price
    },
    benefits,
    benefits_ar,
    callToAction {
      text,
      phone
    },
    callToAction_ar {
      text,
      phone
    },
    availability,
    availability_ar,
    availabilityTitle,
    availabilityTitle_ar,
    contactPrompt,
    contactPrompt_ar
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
    title_ar,
    description,
    description_ar,
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
    title_ar,
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
    title_ar,
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
    title_ar,
    slug,
    eventType,
    description,
    description_ar,
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
    title_ar,
    slug,
    eventType,
    description,
    description_ar,
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
    name_ar,
    slug,
    specialty,
    specialty_ar,
    title,
    title_ar,
    subtitle,
    subtitle_ar,
    image,
    bio,
    bio_ar,
    experience,
    experience_ar,
    services,
    services_ar,
    qualifications,
    qualifications_ar,
    languages,
    languages_ar,
    consultationDays,
    consultationDays_ar,
    consultationHours,
    consultationHours_ar,
    accentColor,
    iconName
  }
`

export const doctorBySlugQuery = groq`
  *[_type == "doctor" && slug.current == $slug][0] {
    _id,
    name,
    name_ar,
    slug,
    specialty,
    specialty_ar,
    title,
    title_ar,
    image,
    bio,
    bio_ar,
    qualifications,
    qualifications_ar,
    languages,
    languages_ar,
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
    question_ar,
    answer,
    answer_ar,
    category
  }
`

// ==========================================
// VIDÉOTHÈQUE
// ==========================================

export const videosQuery = groq`
  *[_type == "video" && active == true] | order(order asc) {
    _id,
    title,
    title_ar,
    description,
    description_ar,
    category,
    "videoUrl": coalesce(externalUrl, videoFile.asset->url),
    externalUrl,
    poster
  }
`

// ==========================================
// CONVENTIONS & PRISE EN CHARGE
// ==========================================

export const insuranceSectionQuery = groq`
  *[_type == "insuranceSection" && active == true][0] {
    badge,
    badge_ar,
    title,
    title_ar,
    subtitle,
    subtitle_ar,
    providers[] {
      name,
    name_ar,
      description,
    description_ar,
      logo
    },
    note,
    note_ar,
    ctaText,
    ctaText_ar
  }
`

// ==========================================
// SITE SETTINGS
// ==========================================

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    clinicName,
    clinicName_ar,
    description,
    description_ar,
    logo,
    phone,
    whatsappNumber,
    appointmentMessage,
    appointmentMessage_ar,
    email,
    address,
    address_ar,
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
      ...,
    },
    heroStats_ar[] {
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
    badge_ar,
    title,
    title_ar,
    subtitle,
    subtitle_ar,
    description,
    description_ar,
    ctaText,
    ctaText_ar,
    ctaLink,
    accentColor,
    "videoUrl": videoFile.asset->url,
    videoPoster
  }
`

export const allSectionContentsQuery = groq`
  *[_type == "sectionContent"] {
    sectionId,
    badge,
    badge_ar,
    title,
    title_ar,
    subtitle,
    subtitle_ar,
    description,
    description_ar,
    ctaText,
    ctaText_ar,
    ctaLink,
    accentColor,
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
    description_ar,
    quickLinks[] {
      ...,
    },
    quickLinks_ar[] {
      label,
      href
    },
    servicesLinks[] {
      ...,
    },
    servicesLinks_ar[] {
      label,
      href
    },
    legalLinks[] {
      ...,
    },
    legalLinks_ar[] {
      label,
      href
    },
    copyright,
    copyright_ar,
    newsletterTitle,
    newsletterTitle_ar,
    newsletterDescription,
    newsletterDescription_ar,
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
