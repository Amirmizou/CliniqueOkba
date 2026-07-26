import { MetadataRoute } from 'next'

/**
 * Robots d'aspiration (SEO commercial, entraînement d'IA) explicitement
 * refusés. `robots.txt` n'est qu'une convention — le blocage réel est fait
 * dans `middleware.ts` (voir UNWANTED_CRAWLER_RE) — mais les robots qui la
 * respectent s'arrêtent avant même de consommer de la bande passante.
 */
const DISALLOWED_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'CCBot',
  'Google-Extended',
  'anthropic-ai',
  'Applebot-Extended',
  'Amazonbot',
  'Bytespider',
  'ImagesiftBot',
  'Omgilibot',
  'SemrushBot',
  'AhrefsBot',
  'MJ12bot',
  'DotBot',
  'BLEXBot',
  'PetalBot',
  'DataForSeoBot',
  'SerpstatBot',
  'ZoominfoBot',
]

/** Chemins qui ne doivent jamais être indexés ni sondés. */
const PRIVATE_PATHS = ['/api/', '/admin/', '/studio/', '/auth/', '/_next/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: DISALLOWED_BOTS,
        disallow: '/',
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://cliniqueokba.com'}/sitemap.xml`,
  }
}
