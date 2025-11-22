import type { Metadata } from 'next'

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
        url: '/modern-medical-clinic-facade-architecture.png',
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
    images: ['/modern-medical-clinic-facade-architecture.png'],
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
    image: `${baseUrl}/modern-medical-clinic-facade-architecture.png`,
    telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+213 555 123 456',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@cliniqueokba.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nouvelle ville Ali Mendjeli',
      addressLocality: 'Constantine',
      addressCountry: 'DZ',
      postalCode: '25000',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.3651,
      longitude: 6.6144,
    },
    openingHours: ['Mo-Fr 08:00-18:00', 'Sa 08:00-14:00'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '14:00',
      },
    ],
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
