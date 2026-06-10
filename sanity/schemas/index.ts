import heroSlide from './heroSlide'
import equipment from './equipment'
import specialty from './specialty'
import galleryImage from './galleryImage'
import facilityPhoto from './facilityPhoto'
import article from './article'
import event from './event'
import siteSettings from './siteSettings'
import doctor from './doctor'
import faq from './faq'
// Nouveaux schemas pour contrôle CMS complet
import aboutSection from './aboutSection'
import service from './service'
import pole from './pole'
import testimonial from './testimonial'
import homeCare from './homeCare'
import sectionContent from './sectionContent'
import footerContent from './footerContent'
import pageSeo from './pageSeo'
import insuranceSection from './insurance'

export const schemaTypes = [
    // Configuration Générale
    siteSettings,
    pageSeo,

    // Contenu des Sections
    heroSlide,
    aboutSection,
    sectionContent,

    // Services & Spécialités
    pole,
    service,
    specialty,
    equipment,
    homeCare,
    insuranceSection,

    // Équipe & Avis
    doctor,
    testimonial,

    // Média & Contenu
    galleryImage,
    facilityPhoto,
    article,
    event,
    faq,

    // Footer
    footerContent,
]
