'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BackToTop() {
  const tc = useTranslations('common')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      className='bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-primary fixed right-4 bottom-24 z-40 h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:outline-none md:right-8 md:bottom-8'
      aria-label={tc('backToTop')}
    >
      <ArrowUp className='h-5 w-5' aria-hidden='true' />
    </Button>
  )
}

