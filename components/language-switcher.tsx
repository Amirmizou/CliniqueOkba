'use client'

import * as React from 'react'
import { useRouter, usePathname } from '@/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = () => {
    const nextLocale = locale === 'fr' ? 'ar' : 'fr'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="relative h-9 px-3 rounded-full border-border/50 hover:border-primary/50 transition-all duration-300 font-medium font-sans"
    >
      {locale === 'fr' ? 'ع' : 'FR'}
    </Button>
  )
}
