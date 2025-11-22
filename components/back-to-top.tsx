'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BackToTop() {
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
      className='bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-primary fixed right-8 bottom-8 z-40 h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:outline-none'
      aria-label='Retour en haut de la page'
    >
      <ArrowUp className='h-5 w-5' aria-hidden='true' />
    </Button>
  )
}

