'use client'

import dynamic from 'next/dynamic'

export const LogoIntroWrapper = dynamic(
  () => import('./logo-intro').then((m) => ({ default: m.LogoIntro })),
  { ssr: false }
)
