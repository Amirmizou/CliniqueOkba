import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

import path from 'path'

const withNextIntl = createNextIntlPlugin(path.join(process.cwd(), 'i18n.ts'))

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF en premier pour meilleure compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
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
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons', 'date-fns', 'next-intl'],
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
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.googletagmanager.com https://*.googleapis.com https://*.gstatic.com https://cdn.sanity.io; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com https://www.googletagmanager.com https://*.sanity.io https://*.api.sanity.io; frame-src 'self' https://www.google.com https://maps.google.com;",
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
