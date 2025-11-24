'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import LanguageSwitcher from '@/components/language-switcher'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function Header() {
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Détecter le scroll pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: t('home'), href: '#home' },
    { label: t('about'), href: '#about' },
    { label: t('specialties'), href: '#specialties' },
    { label: t('services'), href: '#services' },
    { label: t('gallery'), href: '#gallery' },
    { label: t('testimonials'), href: '#testimonials' },
    { label: t('contact'), href: '#contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'glass-panel border-b border-white/20'
        : 'bg-background/0 border-transparent'
        }`}
      role='banner'
      aria-label='Navigation principale'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 sm:h-20 items-center justify-between'>
          {/* Logo */}
          <div
            className='group flex cursor-pointer items-center gap-4'
            onClick={() => scrollToSection('#home')}
          >
            <motion.div
              className='relative h-12 w-12 sm:h-14 sm:w-14'
              initial={{ scale: 0.9, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              whileHover={{ scale: 1.06, rotate: 2 }}
              whileTap={{ scale: 0.96 }}
            >
              <Image
                src='/logo.png'
                alt='Clinique OKBA Logo'
                fill
                sizes="56px"
                className='object-contain'
                priority
              />
              {/* halo animé autour du logo */}
              <motion.span
                className='absolute inset-0 rounded-full'
                style={{ boxShadow: '0 0 0px rgba(37,99,235,0.0)' }}
                animate={{ boxShadow: ['0 0 0px rgba(37,99,235,0.0)', '0 0 20px rgba(37,99,235,0.25)', '0 0 0px rgba(37,99,235,0.0)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <div className='hidden sm:block'>
              <p className='text-primary group-hover:text-primary/80 text-base font-semibold transition-colors'>
                Clinique
              </p>
              <p className='text-muted-foreground group-hover:text-muted-foreground/80 text-sm transition-colors'>
                OKBA
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav
            className='hidden gap-2 md:flex'
            role='navigation'
            aria-label='Menu principal'
          >
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className='relative text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-medium px-4 py-2 rounded-full hover:bg-primary/10'
                style={{ animationDelay: `${index * 100}ms` }}
                aria-label={`Aller à la section ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className='hidden items-center gap-3 md:flex'>
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant='default'
              size='sm'
              className='glass-button rounded-full px-6'
              onClick={() => scrollToSection('#contact')}
            >
              <Phone className='mr-2 h-4 w-4' />
              {t('emergency')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='hover:bg-muted focus:ring-primary rounded-lg p-2 transition-colors duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none md:hidden'
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            aria-controls='mobile-menu'
          >
            <div className='relative h-6 w-6'>
              <Menu
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
              />
              <X
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id='mobile-menu'
          className={`glass-panel mt-2 rounded-xl overflow-hidden transition-all duration-300 md:hidden ${isOpen ? 'max-h-[500px] opacity-100 shadow-xl' : 'max-h-0 opacity-0'
            }`}
          aria-hidden={!isOpen}
        >
          <nav
            className='space-y-1 p-3 sm:p-4'
            role='navigation'
            aria-label='Menu mobile'
          >
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className='text-foreground hover:bg-primary/10 hover:text-primary focus:ring-primary touch-target block min-h-[44px] w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-300 hover:translate-x-2 focus:ring-2 focus:ring-offset-2 focus:outline-none'
                style={{ animationDelay: `${index * 50}ms` }}
                aria-label={`Aller à la section ${item.label}`}
              >
                {item.label}
              </button>
            ))}
            <div className='space-y-4 pt-4 border-t border-border/50'>
              <div className='flex justify-center gap-4'>
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <Button
                variant='default'
                className='glass-button w-full'
                onClick={() => scrollToSection('#contact')}
              >
                <Phone className='mr-2 h-4 w-4' />
                Urgences
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
