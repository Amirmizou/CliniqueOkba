import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Chemin RELATIF requis : Next 16 build avec Turbopack, qui (via next-intl)
// n'accepte pas les chemins absolus pour le fichier de config i18n.
const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF en premier pour meilleure compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    qualities: [25, 50, 75, 80, 90, 100],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 an pour images statiques
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'next-intl'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://vercel.live https://vercel.com https://www.youtube.com https://s.ytimg.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://vercel.live https://vercel.com; img-src 'self' blob: data: https://www.googletagmanager.com https://*.googleapis.com https://*.gstatic.com https://cdn.sanity.io https://vercel.live https://vercel.com https://i.ytimg.com https://*.ytimg.com https://*.fbcdn.net https://*.supabase.co; media-src 'self' https://cdn.sanity.io blob:; font-src 'self' data: https://vercel.live https://vercel.com; connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com https://www.googletagmanager.com https://*.sanity.io https://*.api.sanity.io wss://*.sanity.io wss://*.api.sanity.io https://registry.npmjs.org https://vercel.live wss://vercel.live https://vercel.com wss://*.pusher.com https://*.youtube.com https://*.supabase.co; frame-src 'self' https://*.supabase.co https://www.google.com https://maps.google.com https://vercel.live https://vercel.com https://www.youtube.com https://www.youtube-nocookie.com https://www.facebook.com https://web.facebook.com https://player.vimeo.com;",
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ],
    },
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}

export default withNextIntl(nextConfig)
