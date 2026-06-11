'use client'

import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  Phone,
  Calendar,
  CalendarDays,
  ChevronDown,
  Newspaper,
  Users,
  HelpCircle,
  ScanLine,
  Smile,
  Stethoscope,
  Siren,
  FlaskConical,
  Eye,
  ScanEye,
  Heart,
  Baby,
  Pill,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Link, useRouter } from '@/navigation'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'
import { poles as localPoles } from '@/data/poles'

const POLE_ICONS: Record<string, LucideIcon> = {
  ScanLine,
  Smile,
  Stethoscope,
  Siren,
  FlaskConical,
  Eye,
  ScanEye,
  Heart,
  Baby,
  Pill,
  Activity,
}

interface NavPole {
  slug: string
  title: string
  iconName: string
  accent: string
  badge?: string
}

/** Pôles du menu : Sanity prioritaire, repli sur les données locales */
function resolveNavPoles(data: any[] | undefined, locale: string): NavPole[] {
  if (!data || data.length === 0) {
    return localPoles.map((p) => ({
      slug: p.slug,
      title: locale === 'ar' && p.title_ar ? p.title_ar : p.title,
      iconName: p.iconName,
      accent: p.accent,
      badge: p.badge,
    }))
  }
  return data.map((p, i) => ({
    slug: p.slug?.current || p.slug || String(i),
    title: p.title || '',
    iconName: p.iconName || 'Stethoscope',
    accent: p.accentColor || '#006633',
    badge: p.badge || undefined,
  }))
}

interface SiteSettings {
  clinicName?: string
  phone?: string
  logo?: any
}

interface HeaderProps {
  siteSettings?: SiteSettings
  poles?: any[]
}

export default function Header({ siteSettings, poles }: HeaderProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const navPoles = resolveNavPoles(poles, locale)
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
    const sections = ['home', 'about', 'specialties', 'equipements', 'contact']

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
    { label: t('gallery'), href: '#equipements', id: 'equipements' },
    { label: t('contact'), href: '#contact', id: 'contact' },
  ]

  const scrollToSection = (href: string) => {
    setIsOpen(false)

    // Check if we're on the homepage
    const isHomepage = window.location.pathname === '/' || window.location.pathname === '/ar'

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
          "pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 px-3 py-2 rounded-full transition-all duration-500 ease-out border shadow-2xl backdrop-blur-2xl w-full max-w-6xl",
          isScrolled
            ? "bg-background/70 border-border/40 shadow-primary/5"
            : "bg-background/40 border-white/20 dark:border-white/10 shadow-black/5"
        )}>
          {/* Logo Section */}
          <a
            href='/'
            className='group flex cursor-pointer items-center gap-3'
          >
            <motion.div
              className='relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-full bg-white p-1 shadow-md ring-1 ring-black/10 flex-shrink-0'
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src='/logo.png'
                alt='Clinique OKBA'
                fill
                sizes="44px"
                className='object-contain p-0.5'
                priority
              />
            </motion.div>
            <div className="hidden sm:flex flex-col leading-none transition-all duration-300 opacity-100">
              <span className='font-display text-sm font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight'>Clinique OKBA</span>
              <span className='text-[9px] text-primary font-bold tracking-widest uppercase mt-0.5'>{t('tagline')}</span>
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
                  {/* Active Indicator (The "Liquid Pill") - Premium */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-primary/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full z-[-1] border border-primary/20"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
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

            {/* Dropdown : Pôles */}
            <div className="relative group z-30">
              <button
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full text-muted-foreground hover:text-primary flex items-center gap-1 hover:bg-white/5"
              >
                {t('poles')}
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:-rotate-180" />
              </button>

              <div className="absolute top-full start-1/2 -translate-x-1/2 mt-4 w-[22rem] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 pt-2">
                <div className="glass-card p-2 rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-2xl">
                  <div className="grid grid-cols-1 gap-1">
                    {navPoles.map((pole) => {
                      const Icon = POLE_ICONS[pole.iconName] || Stethoscope
                      return (
                        <Link
                          key={pole.slug}
                          href={`/poles/${pole.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-primary/5 transition-all duration-200 group/item"
                        >
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm transition-transform group-hover/item:scale-110"
                            style={{ backgroundColor: pole.accent }}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground leading-tight">
                              {pole.title}
                            </span>
                            {pole.badge && (
                              <span className="text-[10px] font-medium opacity-70">
                                {pole.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown for additional pages */}
            <div className="relative group z-20">
              <button
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full text-muted-foreground hover:text-primary flex items-center gap-1 hover:bg-white/5"
              >
                {t('more')}
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:-rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full end-0 mt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-[100%] scale-95 group-hover:scale-100 pt-2">
                <div className="glass-card p-2 rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-2xl">
                  <div className="space-y-1">
                    <a href="/actualites" className="flex items-center gap-4 px-4 py-3 text-sm rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 group/item">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors shadow-sm">
                        <Newspaper className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover/item:text-primary">{t('news')}</span>
                        <span className="text-[10px] opacity-70">{t('newsDesc')}</span>
                      </div>
                    </a>
                    <a href="/evenements" className="flex items-center gap-4 px-4 py-3 text-sm rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 group/item">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors shadow-sm">
                        <CalendarDays className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover/item:text-primary">{t('events')}</span>
                        <span className="text-[10px] opacity-70">{t('eventsDesc')}</span>
                      </div>
                    </a>
                    <a href="/equipe" className="flex items-center gap-4 px-4 py-3 text-sm rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 group/item">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors shadow-sm">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover/item:text-primary">{t('team')}</span>
                        <span className="text-[10px] opacity-70">{t('teamDesc')}</span>
                      </div>
                    </a>
                    <a href="/faq" className="flex items-center gap-4 px-4 py-3 text-sm rounded-xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 group/item">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors shadow-sm">
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground group-hover/item:text-primary">{t('faq')}</span>
                        <span className="text-[10px] opacity-70">{t('faqDesc')}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            {/* Theme & Language toggle */}
            <div className="flex items-center gap-1 pe-2 border-e border-border/50 me-2">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <div className="scale-90 sm:scale-100">
                <ThemeToggle />
              </div>
            </div>

            {/* Modern Emergency Button with Animated Pulse Rings */}
            <motion.div
              className="relative overflow-hidden rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Premium Pulsating Glow */}
              <div className="absolute inset-0 rounded-full pointer-events-none">
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-md animate-pulse"></div>
                <span className="absolute inset-0 rounded-full border border-red-500/50 animate-ping" style={{ animationDuration: '2.5s' }}></span>
              </div>

              <Button
                size='sm'
                className={cn(
                  "relative rounded-full font-semibold shadow-2xl transition-all duration-300 overflow-hidden group border-0 z-10",
                  "bg-gradient-to-r from-red-600 via-red-500 to-orange-500",
                  "hover:from-red-500 hover:via-red-400 hover:to-orange-400",
                  "hover:shadow-red-500/50 hover:shadow-2xl h-10 px-5"
                )}
                onClick={() => scrollToSection('#contact')}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                {/* Icône statique */}
                <span className="relative z-10">
                  <Phone className="w-4 h-4 mr-2 drop-shadow-lg" />
                </span>

                <span className="relative z-10 hidden sm:inline drop-shadow-lg tracking-wide">
                  {t('emergency')}
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
            className="fixed inset-0 z-40 bg-background/60 md:hidden pt-24 px-6 overflow-y-auto"
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-2 pb-8"
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

              {/* Pôles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="pt-4 border-t border-border/30"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">{t('ourPoles')}</p>
                <div className="grid grid-cols-1 gap-2">
                  {navPoles.map((pole) => {
                    const Icon = POLE_ICONS[pole.iconName] || Stethoscope
                    return (
                      <a
                        key={pole.slug}
                        href={`/poles/${pole.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all"
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm"
                          style={{ backgroundColor: pole.accent }}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{pole.title}</span>
                      </a>
                    )
                  })}
                </div>
              </motion.div>

              {/* Additional Pages */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-border/30"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">{t('more')}</p>
                <div className="space-y-2">
                  <a href="/actualites" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('news')}</span>
                  </a>
                  <a href="/evenements" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('events')}</span>
                  </a>
                  <a href="/equipe" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('team')}</span>
                  </a>
                  <a href="/faq" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('faq')}</span>
                  </a>
                </div>
              </motion.div>

              {/* Apparence et Langue (Mobile) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="pt-4 border-t border-border/30 pb-10"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-2">{t('settings')}</p>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                  <span className="font-medium">{t('appearance')}</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 mt-2">
                  <span className="font-medium">{t('language')}</span>
                  <LanguageSwitcher />
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
