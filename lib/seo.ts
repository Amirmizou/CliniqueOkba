import type { Metadata } from 'next'
import { siteConfig } from '@/data/site-config'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cliniqueokba.com'
const siteName = 'Clinique OKBA'
const description =
  'Clinique médicale multidisciplinaire moderne à Constantine, Algérie. Soins de qualité avec équipe de spécialistes expérimentés, urgences 24h/24, imagerie médicale et laboratoire.'

export const defaultMetadata: Metadata = {
  title: {
    default: `${siteName} - Constantine, Algérie`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    'clinique médicale',
    'Constantine',
    'Algérie',
    'Ali Mendjeli',
    'médecin',
    'spécialiste',
    'urgences',
    'consultation médicale',
    'imagerie médicale',
    'laboratoire',
    'cardiologie',
    'pneumologie',
    'dermatologie',
    'gynécologie',
    'pédiatrie',
    'neurologie',
    'dentisterie',
    'rhumatologie',
    'ophtalmologie',
    'ORL',
    'chirurgie',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
    languages: {
      'fr-DZ': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_DZ',
    url: baseUrl,
    title: `${siteName} - Constantine, Algérie`,
    description,
    siteName,
    images: [
      {
        url: '/uploads/hero/1763825620251-Gemini_Generated_Image_gzjk7ygzjk7ygzjk.png',
        width: 1200,
        height: 630,
        alt: 'Façade de la Clinique OKBA à Constantine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Constantine, Algérie`,
    description,
    images: ['/uploads/hero/1763825620251-Gemini_Generated_Image_gzjk7ygzjk7ygzjk.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'medical',
}

export const generateStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: siteName,
    alternateName: 'Clinique OKBA Constantine',
    description,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/uploads/hero/1763825620251-Gemini_Generated_Image_gzjk7ygzjk7ygzjk.png`,
    telephone:
      process.env.NEXT_PUBLIC_CONTACT_PHONE ||
      siteConfig.contact.phone.split('/')[0].trim(),
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nouvelle ville Ali Mendjeli, extension ouest',
      addressLocality: 'Constantine',
      addressCountry: 'DZ',
      postalCode: '25000',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.contact.coordinates.lat,
      longitude: siteConfig.contact.coordinates.lng,
    },
    // Semaine de travail algérienne : samedi au jeudi, urgences 24h/24
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    availableService: {
      '@type': 'EmergencyService',
      name: 'Urgences médicales 24h/24 - 7j/7',
    },
    medicalSpecialty: [
      'Cardiologie',
      'Pneumologie',
      'Médecine interne',
      'Dermatologie',
      'Gynécologie',
      'Obstétrique',
      'Pédiatrie',
      'Neurologie',
      'Dentisterie',
      'Rhumatologie',
      'Ophtalmologie',
      'ORL',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services médicaux',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalProcedure',
            name: 'Consultations médicales',
            description: 'Consultations avec nos spécialistes',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalProcedure',
            name: "Service d'urgences",
            description: 'Urgences médicales 24h/24 - 7j/7',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalProcedure',
            name: 'Imagerie médicale',
            description: 'IRM, scanner, mammographie',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'MedicalProcedure',
            name: 'Laboratoire',
            description: 'Analyses médicales (hématologie, biochimie)',
          },
        },
      ],
    },
    sameAs: [
      'https://www.facebook.com/p/Clinique-OKBA-61576965629601/',
      'https://instagram.com/clinique_okba',
    ],
  }
}

/**
 * Données structurées schema.org « Physician » pour la page Équipe.
 * Génère une liste (ItemList) de médecins rattachés à la clinique, à partir
 * des données Sanity. Les URLs d'image doivent être pré-résolues par l'appelant
 * (via urlFor) pour éviter une dépendance Sanity dans ce module.
 */
interface PhysicianInput {
  name?: string
  title?: string
  specialty?: string
  imageUrl?: string
  slug?: string
  languages?: string[]
}

export const generatePhysiciansStructuredData = (doctors: PhysicianInput[]) => {
  const list = (doctors || []).filter((d) => d?.name)
  if (list.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: list.map((doc, index) => {
      const fullName = [doc.title, doc.name].filter(Boolean).join(' ').trim()
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Physician',
          name: fullName,
          ...(doc.specialty ? { medicalSpecialty: doc.specialty } : {}),
          ...(doc.imageUrl ? { image: doc.imageUrl } : {}),
          ...(doc.languages && doc.languages.length > 0
            ? { knowsLanguage: doc.languages }
            : {}),
          worksFor: {
            '@type': 'MedicalOrganization',
            name: siteName,
            url: baseUrl,
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Constantine',
            addressCountry: 'DZ',
          },
        },
      }
    }),
  }
}
