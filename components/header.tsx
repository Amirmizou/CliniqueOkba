'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  X,
  ChevronDown,
  Newspaper,
  CalendarDays,
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
  Home,
  User,
  ClipboardList,
  Info,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
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

function resolveNavPoles(data: any[] | undefined, locale: string): NavPole[] {
  const source = data && data.length > 0 ? data : localPoles
  return source.map((p: any, i: number) => {
    const slug = p.slug?.current || p.slug || String(i)
    const local = localPoles.find((lp) => lp.slug === slug)

    let title = (locale === 'ar' && p.title_ar) ? p.title_ar : (p.title || '')
    const hasArabicChars = /[؀-ۿ]/.test(title)

    if (locale === 'ar' && !hasArabicChars && local?.title_ar) {
      title = local.title_ar
    }

    let badge = (locale === 'ar' && p.badge_ar) ? p.badge_ar : (p.badge || undefined)
    const badgeHasArabic = badge ? /[؀-ۿ]/.test(badge) : false
    if (locale === 'ar' && badge && !badgeHasArabic && local?.badge_ar) {
      badge = local.badge_ar
    }

    return {
      slug,
      title,
      iconName: p.iconName || local?.iconName || 'Stethoscope',
      accent: p.accentColor || p.accent || local?.accent || '#006633',
      badge,
    }
  })
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
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [hovered, setHovered] = useState<string | null>(null)
  const { scrollY } = useScroll()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    const sections = ['home', 'about', 'specialties', 'equipements', 'medecins', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id)
        })
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' },
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          setActiveTab(hash.replace('#', ''))
        }
      }, 100)
    }
  }, [])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 24)
  })

  const scrollToSection = (href: string) => {
    setIsOpen(false)
    const isHomepage = window.location.pathname === '/' || window.location.pathname === '/ar'
    if (isHomepage) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        setActiveTab(href.replace('#', ''))
      }
    } else {
      window.location.href = `/${href}`
    }
  }

  const indicatorKey = hovered ?? activeTab

  const clinicNameText = siteSettings?.clinicName && (locale !== 'ar' || /[؀-ۿ]/.test(siteSettings.clinicName))
    ? siteSettings.clinicName
    : (locale === 'ar' ? 'المصحة الطبية عقبة' : 'Clinique OKBA')

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4 pointer-events-none">
        
        {/* MOBILE & TABLET FALLBACK */}
        <div className="pointer-events-auto w-full max-w-7xl flex items-center justify-between rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 px-4 py-3 xl:hidden">
          <a href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
            </div>
            <span className="font-extrabold text-[#006633] text-sm uppercase leading-none flex flex-col">
              <span>{clinicNameText}</span>
              <span className="text-[9px] text-[#EC0016] mt-0.5 tracking-widest">{t('tagline')}</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              ref={menuButtonRef}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              onClick={() => setIsOpen((v) => !v)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 3D SCANNER DESKTOP (Echelle réduite) */}
        <div className={cn("pointer-events-auto relative w-full max-w-4xl mx-auto h-[110px] hidden xl:block transition-all duration-700 origin-top mt-4", isScrolled ? "scale-95 -translate-y-2 opacity-95" : "scale-100 translate-y-0 opacity-100")}>
          
          {/* BASE / PEDESTAL */}
          <div className="absolute left-[15%] right-[25%] bottom-[0px] h-[30px] z-0 flex flex-col justify-end items-center">
            {/* Accordéon */}
            <div className="w-[80%] h-[20px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                 style={{ background: 'repeating-linear-gradient(180deg, #d4d4d4, #d4d4d4 3px, #e8e8e8 3px, #e8e8e8 6px)' }} />
            {/* Socle */}
            <div className="w-[85%] h-[10px] bg-gradient-to-b from-[#e0e0e0] to-[#c5c5c5] rounded-b-lg shadow-[0_10px_20px_rgba(0,0,0,0.15)]" />
          </div>

          {/* GANTRY (Anneau à droite) */}
          <div className="absolute right-[20px] bottom-[5px] w-[140px] h-[110px] z-10 transition-transform duration-700 hover:scale-[1.02]" style={{
            borderRadius: '70px 70px 10px 10px',
            background: 'radial-gradient(120% 120% at 30% 20%, #ffffff 0%, #e8e8e8 60%, #c4c4c4 100%)',
            boxShadow: '-8px 8px 15px rgba(0,0,0,0.15), inset 3px 5px 10px rgba(255,255,255,1), inset -3px -3px 10px rgba(0,0,0,0.1)'
          }}>
            {/* Logo */}
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 flex flex-col items-center leading-none">
              <span className="text-[7px] font-extrabold text-[#006633] tracking-widest uppercase whitespace-nowrap">{clinicNameText}</span>
              <span className="text-[6px] font-bold text-[#EC0016] mt-[1px] uppercase tracking-[0.2em]">Scanner 3D</span>
            </div>

            {/* Ouverture centrale (Bore) */}
            <div className="absolute top-[35px] left-1/2 -translate-x-1/2 w-[55px] h-[55px] rounded-full" style={{
              background: 'radial-gradient(circle at center, #000000 0%, #2a2a2a 100%)',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.9), 0 1px 2px rgba(255,255,255,0.8)'
            }}>
                <div className="absolute top-[40%] right-2 w-1 h-1 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,1)] animate-pulse" />
            </div>

            {/* Liseré rouge contour */}
            <div className="absolute right-[8px] top-[15px] bottom-[10px] w-[1.5px] bg-[#EC0016] rounded-full shadow-[0_0_4px_rgba(236,0,22,0.3)]" />

            {/* Badge */}
            <div className="absolute right-[-8px] top-[60px] bg-[#EC0016] text-white px-1.5 py-[1px] text-[6px] font-bold rounded-l-sm rotate-90 origin-right shadow-sm whitespace-nowrap">
              Clinique Okba
            </div>
          </div>

          {/* TABLE (Plateau à gauche) */}
          <div className="absolute left-[40px] right-[100px] bottom-[20px] h-[60px] z-20 flex flex-col justify-end transition-transform duration-700 hover:-translate-x-1" style={{
            borderRadius: '30px 0 0 30px',
            background: 'linear-gradient(180deg, #ffffff 0%, #fcfcfc 40%, #e0e0e0 100%)',
            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2), inset 0 3px 8px rgba(255,255,255,1), inset 0 -3px 8px rgba(0,0,0,0.05)'
          }}>
            {/* Ligne d'accentuation rouge */}
            <div className="absolute bottom-[4px] left-[15px] right-0 h-[2px] bg-[#EC0016] rounded-l-full shadow-[0_1px_2px_rgba(236,0,22,0.3)]" />

            {/* Contenu de la table */}
            <div className="absolute inset-0 flex items-center justify-between px-6 pb-1">
              
              {/* Logo Area */}
              <a href="/" className="flex items-center gap-2 shrink-0 mr-4 group">
                <div className="relative h-8 w-8 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-105">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#006633] leading-none uppercase">Centre</span>
                  <span className="text-[10px] font-extrabold text-[#006633] leading-none uppercase mt-0.5">Diagnostic</span>
                </div>
              </a>

              {/* Navigation */}
              <nav className="flex-1 flex items-center justify-center gap-4 lg:gap-8" onMouseLeave={() => setHovered(null)}>
                <NavIconLink icon={Home} label={t('center')} isActive={indicatorKey === 'about'} onClick={() => scrollToSection('#about')} onHover={() => setHovered('about')} />
                <NavIconLink icon={User} label={t('team')} isActive={false} onClick={() => scrollToSection('/equipe')} onHover={() => setHovered('team')} />
                <NavIconDropdown icon={Stethoscope} label={t('specialties')} isActive={indicatorKey === 'specialties'} onHover={() => setHovered('specialties')} poles={navPoles} />
                <NavIconLink icon={ClipboardList} label={t('exams')} isActive={false} onClick={() => scrollToSection('#specialties')} onHover={() => setHovered('specialties')} />
                <NavIconLink icon={Info} label={t('faq')} isActive={indicatorKey === 'faq'} onClick={() => scrollToSection('/faq')} onHover={() => setHovered('faq')} />
                <NavIconLink icon={Mail} label={t('contact')} isActive={indicatorKey === 'contact'} onClick={() => scrollToSection('#contact')} onHover={() => setHovered('contact')} />
              </nav>

              <div className="shrink-0 pl-4 border-l border-gray-300">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FULL SCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] overflow-y-auto bg-white/95 px-6 pb-12 pt-24 backdrop-blur-xl xl:hidden"
          >
            <motion.nav
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              className="mx-auto flex max-w-md flex-col gap-2"
            >
              {[
                { key: 'center', href: '#about', icon: Home },
                { key: 'specialties', href: '#specialties', icon: Stethoscope },
                { key: 'equipements', href: '#equipements', icon: Activity },
                { key: 'medecins', href: '#medecins', icon: Users },
                { key: 'contact', href: '#contact', icon: Mail },
              ].map((item) => (
                <motion.button
                  key={item.key}
                  onClick={() => scrollToSection(item.href)}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-[#EC0016]/30 hover:bg-[#EC0016]/5"
                >
                  <item.icon className="h-6 w-6 text-[#006633]" />
                  <span className="text-lg font-bold text-gray-800">{t(item.key)}</span>
                </motion.button>
              ))}

              <div className="mt-4 border-t pt-4 border-gray-200">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">{t('settings')}</p>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <span className="font-bold text-gray-800">{t('appearance')}</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavIconLink({ icon: Icon, label, isActive, onClick, onHover }: any) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        'group relative flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none',
        isActive ? 'text-[#EC0016]' : 'text-gray-600 hover:text-[#EC0016]'
      )}
    >
      <Icon className="w-5 h-5 stroke-[1.5px]" />
      <span className="text-[10px] font-extrabold tracking-wide uppercase">{label}</span>
      {isActive && (
        <span className="absolute -bottom-1 h-[2px] w-5 bg-[#EC0016] rounded-full shadow-[0_0_4px_rgba(236,0,22,0.6)]" />
      )}
    </button>
  )
}

function NavIconDropdown({ icon: Icon, label, isActive, onHover, poles }: any) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="relative flex justify-center"
      onMouseEnter={() => {
        setOpen(true)
        onHover()
      }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        onFocus={onHover}
        className={cn(
          'group relative flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none',
          isActive || open ? 'text-[#EC0016]' : 'text-gray-600 hover:text-[#EC0016]'
        )}
      >
        <Icon className="w-5 h-5 stroke-[1.5px]" />
        <span className="text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-0.5">
          {label}
        </span>
        {(isActive || open) && (
          <span className="absolute -bottom-1 h-[2px] w-5 bg-[#EC0016] rounded-full shadow-[0_0_4px_rgba(236,0,22,0.6)]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[280px] z-50"
          >
            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-2">
              <div className="grid grid-cols-1 gap-1">
                {poles.map((pole: any) => {
                  const PoleIcon = POLE_ICONS[pole.iconName] || Stethoscope
                  return (
                    <a
                      key={pole.slug}
                      href={`/poles/${pole.slug}`}
                      className="group/item flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-gray-50"
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm"
                        style={{ backgroundColor: pole.accent }}
                      >
                        <PoleIcon className="h-4 w-4" />
                      </span>
                      <span className="font-bold text-gray-800">{pole.title}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
