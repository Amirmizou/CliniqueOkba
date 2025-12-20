'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone, Calendar, ChevronDown, Newspaper, Users, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Link, useRouter } from '@/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Header() {
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Intersection Observer for active section detection
  useEffect(() => {
    const sections = ['home', 'about', 'specialties', 'services', 'gallery', 'contact']

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Handle hash on page load
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      // Wait a bit for the page to render
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          setActiveTab(hash.replace('#', ''))
        }
      }, 100)
    }
  }, [])

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
    setIsOpen(false)

    // Check if we're on the homepage
    const isHomepage = window.location.pathname === '/'

    if (isHomepage) {
      // On homepage, just scroll
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setActiveTab(href.replace('#', ''))
      }
    } else {
      // On another page, navigate to homepage with hash
      window.location.href = `/${href}`
    }
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
          <a
            href='/'
            className='group flex cursor-pointer items-center gap-3'
          >
            <motion.div
              className='relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-xl bg-white/90 p-1 shadow-sm ring-1 ring-black/5'
              whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: ["0px 2px 4px rgba(0,0,0,0.05)", "0px 4px 8px rgba(0,0,0,0.1)", "0px 2px 4px rgba(0,0,0,0.05)"],
                y: [0, -1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
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
          </a>

          {/* Desktop Navigation - The "Island" */}
          <nav className='hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-full border border-white/10'>
            {navItems.map((item) => {
              const isActive = activeTab === item.id || activeTab === item.id.replace('#', '')

              return (
                <button
                  key={item.label} // Changed key to label to be safe
                  onClick={() => scrollToSection(item.href || '#')}
                  onMouseEnter={() => {
                    // Optional: Pre-select on hover for snappier feel
                    // setActiveTab(item.id) 
                  }}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full flex items-center gap-2 group z-10',
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {/* Active Indicator (The "Liquid Pill") - Improved */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-white shadow-sm rounded-full z-[-1] dark:bg-white/10 ring-1 ring-black/5"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Text Content */}
                  <span className="relative z-10 font-medium tracking-wide">{item.label}</span>

                  {/* Hover Glow Effect */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </button>
              )
            })}

            <div className="hidden md:block w-px h-6 bg-border/50 mx-1" /> {/* Divider */}
            {/* Dropdown for additional pages */}
            <div className="relative group z-20">
              <button
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full text-muted-foreground hover:text-primary flex items-center gap-1 hover:bg-white/5"
              >
                Plus
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:-rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 pt-2">
                <div className="glass-card p-2 rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-2xl">
                  <div className="space-y-1">
                    <a href="/actualites" className="flex items-center gap-4 px-4 py-3 text-sm rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 group/item">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors shadow-sm">
                        <Newspaper className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover/item:text-primary">Actualités</span>
                        <span className="text-[10px] opacity-70">Dernières nouvelles</span>
                      </div>
                    </a>
                    <a href="/equipe" className="flex items-center gap-4 px-4 py-3 text-sm rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 group/item">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors shadow-sm">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover/item:text-primary">Équipe Médicale</span>
                        <span className="text-[10px] opacity-70">Nos spécialistes</span>
                      </div>
                    </a>
                    <a href="/faq" className="flex items-center gap-4 px-4 py-3 text-sm rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 group/item">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors shadow-sm">
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover/item:text-primary">FAQ</span>
                        <span className="text-[10px] opacity-70">Questions fréquentes</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            {/* Theme toggle visible on all screens */}
            <div className="flex items-center gap-1 pr-2 border-r border-border/50 mr-2">
              <ThemeToggle />
            </div>

            {/* Modern Emergency Button with Animated Pulse Rings */}
            <motion.div
              className="relative overflow-hidden rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated pulse rings - contained within button */}
              <div className="absolute inset-0 rounded-full pointer-events-none">
                <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: '2s' }}></span>
                <span className="absolute inset-0 rounded-full bg-red-500/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></span>
              </div>

              <Button
                size='sm'
                className={cn(
                  "relative rounded-full font-semibold shadow-2xl transition-all duration-300 overflow-hidden group border-0 z-10",
                  "bg-gradient-to-r from-red-600 via-red-500 to-orange-500",
                  "hover:from-red-500 hover:via-red-400 hover:to-orange-400",
                  "hover:shadow-red-500/50 hover:shadow-2xl",
                  isScrolled ? "h-9 px-4" : "h-10 px-5"
                )}
                onClick={() => scrollToSection('#contact')}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                {/* Heartbeat icon with animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <Phone className="w-4 h-4 mr-2 drop-shadow-lg" />
                </motion.div>

                <span className="relative z-10 hidden sm:inline drop-shadow-lg tracking-wide">
                  {t('emergency')}
                </span>

                {/* Small pulse indicator */}
                <span className="absolute top-1 right-1 flex h-2 w-2 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </Button>
            </motion.div>

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

              {/* Additional Pages */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-border/30"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">Plus</p>
                <div className="space-y-2">
                  <a href="/actualites" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <span className="font-medium">Actualités</span>
                  </a>
                  <a href="/equipe" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">Équipe Médicale</span>
                  </a>
                  <a href="/faq" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">FAQ</span>
                  </a>
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
