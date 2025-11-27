'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Header() {
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setIsScrolled(latest > 20)
  })

  const navItems = [
    { label: t('home'), href: '#home', id: 'home' },
    { label: t('about'), href: '#about', id: 'about' },
    { label: t('specialties'), href: '#specialties', id: 'specialties' },
    { label: t('services'), href: '#services', id: 'services' },
    { label: t('gallery'), href: '#gallery', id: 'gallery' },
    { label: t('contact'), href: '#contact', id: 'contact' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveTab(href.replace('#', ''))
    }
    setIsOpen(false)
  }

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 px-4 pointer-events-none"
      >
        <div className={cn(
          "pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full transition-all duration-500 ease-out border shadow-lg backdrop-blur-xl",
          isScrolled
            ? "bg-background/80 border-border/40 shadow-primary/5 w-full max-w-5xl"
            : "bg-background/60 border-transparent shadow-none w-full max-w-7xl mt-2"
        )}>
          {/* Logo Section */}
          <div
            className='group flex cursor-pointer items-center gap-3'
            onClick={() => scrollToSection('#home')}
          >
            <motion.div
              className='relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-xl bg-white/90 p-1 shadow-sm ring-1 ring-black/5'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src='/logo.png'
                alt='Clinique OKBA'
                fill
                sizes="40px"
                className='object-contain p-0.5'
                priority
              />
            </motion.div>
            <div className={cn("hidden sm:flex flex-col leading-none transition-opacity duration-300", isScrolled ? "opacity-100" : "opacity-100")}>
              <span className='text-sm font-bold text-foreground tracking-tight'>Clinique OKBA</span>
              <span className='text-[10px] text-muted-foreground font-medium tracking-wider uppercase'>Excellence Médicale</span>
            </div>
          </div>

          {/* Desktop Navigation - The "Island" */}
          <nav className='hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-full border border-white/10'>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.href)}
                onMouseEnter={() => setActiveTab(item.id)}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full",
                  activeTab === item.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-full shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            <div className="hidden md:flex items-center gap-1 pr-2 border-r border-border/50 mr-2">
              <ThemeToggle />
            </div>

            <Button
              size='sm'
              className={cn(
                "rounded-full font-medium shadow-lg shadow-primary/20 transition-all duration-300",
                isScrolled ? "h-9 px-4" : "h-10 px-5"
              )}
              onClick={() => scrollToSection('#contact')}
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t('emergency')}</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className='md:hidden p-2 rounded-full hover:bg-secondary transition-colors'
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className='relative w-6 h-6'>
                <Menu className={cn("absolute inset-0 transition-all duration-300", isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0")} />
                <X className={cn("absolute inset-0 transition-all duration-300", isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90")} />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-background/60 md:hidden pt-24 px-6"
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-2"
            >
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                >
                  <span className="text-lg font-medium group-hover:text-primary transition-colors">{item.label}</span>
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  </div>
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-4 mt-6 p-4 rounded-2xl bg-secondary/30"
              >
                <ThemeToggle />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
