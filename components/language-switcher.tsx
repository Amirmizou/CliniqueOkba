'use client'

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  
  const [activeLocale, setActiveLocale] = React.useState(locale)

  React.useEffect(() => {
    setActiveLocale(locale)
  }, [locale])

  const getLocalizedPath = (targetLocale: string) => {
    if (!pathname) return targetLocale === 'fr' ? '/' : `/${targetLocale}`;
    
    const segments = pathname.split('/');
    const currentPrefix = segments[1];
    const hasLocalePrefix = currentPrefix === 'fr' || currentPrefix === 'ar';

    if (hasLocalePrefix) {
      if (targetLocale === 'fr') {
        segments.splice(1, 1);
        return segments.join('/') || '/';
      } else {
        segments[1] = targetLocale;
        return segments.join('/');
      }
    } else {
      if (targetLocale === 'fr') {
        return pathname;
      } else {
        return `/${targetLocale}${pathname === '/' ? '' : pathname}`;
      }
    }
  }

  const switchLanguage = (target: string) => {
    if (activeLocale === target) return
    setActiveLocale(target)
    router.replace(getLocalizedPath(target), { scroll: false })
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner border border-gray-200">
      <button
        onClick={() => switchLanguage('fr')}
        className={cn(
          "px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-200",
          activeLocale === 'fr' 
            ? "bg-white text-[#EC0016] shadow-sm ring-1 ring-gray-200" 
            : "text-[#2b2b2b] hover:bg-gray-200/50"
        )}
      >
        FR
      </button>
      <div className="w-[1px] h-3 bg-gray-300 mx-0.5" />
      <button
        onClick={() => switchLanguage('ar')}
        className={cn(
          "px-2.5 py-1 text-[12px] font-bold rounded-full transition-all duration-200",
          activeLocale === 'ar' 
            ? "bg-white text-[#EC0016] shadow-sm ring-1 ring-gray-200" 
            : "text-[#2b2b2b] hover:bg-gray-200/50"
        )}
      >
        ع
      </button>
    </div>
  )
}
