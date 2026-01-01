import heroSlide from './heroSlide'
import equipment from './equipment'
import specialty from './specialty'
import galleryImage from './galleryImage'
import article from './article'
import siteSettings from './siteSettings'
import doctor from './doctor'
import faq from './faq'
// Nouveaux schemas pour contrôle CMS complet
import aboutSection from './aboutSection'
import service from './service'
import testimonial from './testimonial'
import homeCare from './homeCare'
import sectionContent from './sectionContent'
import footerContent from './footerContent'
import pageSeo from './pageSeo'

export const schemaTypes = [
    // Configuration Générale
    siteSettings,
    pageSeo,

    // Contenu des Sections
    heroSlide,
    aboutSection,
    sectionContent,

    // Services & Spécialités
    service,
    specialty,
    equipment,
    homeCare,

    // Équipe & Avis
    doctor,
    testimonial,

    // Média & Contenu
    galleryImage,
    article,
    faq,

    // Footer
    footerContent,
]
