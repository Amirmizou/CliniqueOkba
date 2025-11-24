'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Languages, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇩🇿', rtl: true },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLocale: string) => {
    if (locale === newLocale) return

    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    const newPath = newLocale === 'fr' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`

    router.push(newPath)
    router.refresh()
  }

  const currentLanguage = languages.find((lang) => lang.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='h-11 w-11 sm:h-9 sm:w-9 touch-target'
          aria-label="Change language"
        >
          <Languages className='h-5 w-5 sm:h-4 sm:w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuLabel className='text-xs text-muted-foreground'>
          Select Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`cursor-pointer ${locale === lang.code ? 'bg-accent' : ''} ${lang.rtl ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex items-center justify-between w-full ${lang.rtl ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${lang.rtl ? 'flex-row-reverse' : ''}`}>
                <span className='text-lg'>{lang.flag}</span>
                <span className='font-medium'>{lang.nativeName}</span>
              </div>
              {locale === lang.code && (
                <Check className='h-4 w-4 text-primary' />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
