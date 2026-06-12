import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

import path from 'path'

const withNextIntl = createNextIntlPlugin(path.join(process.cwd(), 'i18n.ts'))

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF en premier pour meilleure compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
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
  eslint: { ignoreDuringBuilds: true },
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
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://vercel.live https://vercel.com; style-src 'self' 'unsafe-inline' https://vercel.live https://vercel.com; img-src 'self' blob: data: https://www.googletagmanager.com https://*.googleapis.com https://*.gstatic.com https://cdn.sanity.io https://vercel.live https://vercel.com; font-src 'self' data: https://vercel.live https://vercel.com; connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com https://www.googletagmanager.com https://*.sanity.io https://*.api.sanity.io wss://*.sanity.io wss://*.api.sanity.io https://registry.npmjs.org https://vercel.live wss://vercel.live https://vercel.com wss://*.pusher.com; frame-src 'self' https://www.google.com https://maps.google.com https://vercel.live https://vercel.com;",
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
