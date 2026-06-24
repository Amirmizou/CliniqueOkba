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

        {/* MOBILE & TABLET FALLBACK — barre + mini-gantry (hamburger = bore) */}
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
            {/* Gantry réduit : arche claire + liseré rouge Siemens + bore sombre cliquable */}
            <div
              className="relative flex h-12 w-12 items-center justify-center"
              style={{
                borderRadius: '24px 24px 8px 8px',
                background: 'radial-gradient(120% 120% at 32% 20%, #ffffff 0%, #eee 55%, #d7d7d7 100%)',
                boxShadow: 'inset 1px 2px 3px rgba(255,255,255,1), inset -2px -3px 6px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.14)',
              }}
            >
              {/* Liseré rouge Siemens */}
              <span className="absolute right-1 top-2 bottom-2 w-[3px] rounded-full bg-[#EC0016] opacity-90 shadow-[0_0_6px_rgba(236,0,22,0.4)]" aria-hidden="true" />
              {/* Bore = bouton menu */}
              <button
                ref={menuButtonRef}
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016]"
                style={{
                  background: 'radial-gradient(circle at 50% 40%, #2a2a2a 0%, #111 100%)',
                  boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.9), 0 1px 2px rgba(255,255,255,0.85)',
                }}
              >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP (xl+) : scanner complet au repos ↔ barre compacte au scroll */}
        <div className="pointer-events-none relative mx-auto hidden h-[330px] w-full max-w-5xl xl:block">

          {/* ============ SCANNER COMPLET (au repos) ============ */}
          <div
            className={cn(
              'absolute inset-x-0 bottom-0 h-[320px] origin-top transition-all duration-500 ease-out',
              isScrolled ? 'pointer-events-none scale-95 opacity-0' : 'pointer-events-auto scale-100 opacity-100',
            )}
          >
            {/* BASE / PIÉDESTAL */}
            <div className="absolute left-[15%] right-[25%] bottom-0 h-[24px] bg-[#d5d5d5] rounded-b-xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] z-0 flex flex-col justify-end pb-1 border-b-2 border-[#b0b0b0]">
              <div className="w-full h-2 bg-[#c0c0c0] rounded-full blur-[2px] opacity-50" />
            </div>

            {/* Colonne support strié */}
            <div
              className="absolute left-[20%] right-[30%] bottom-[24px] h-[56px] z-10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1),_inset_0_-4px_10px_rgba(0,0,0,0.15)]"
              style={{
                background: 'repeating-linear-gradient(180deg, #d8d8d8, #d8d8d8 6px, #f4f4f4 6px, #f4f4f4 12px)',
                borderRadius: '4px 4px 0 0',
              }}
            />

            {/* GANTRY (anneau d'imagerie, à droite) */}
            <div
              className="absolute right-0 bottom-0 w-[340px] h-[320px] z-20 transition-transform duration-700 hover:scale-[1.01]"
              style={{
                borderRadius: '170px 170px 20px 20px',
                background: 'radial-gradient(130% 120% at 32% 18%, #ffffff 0%, #f6f6f6 32%, #e6e6e6 68%, #d4d4d4 100%)',
                boxShadow:
                  '-15px 15px 35px rgba(0,0,0,0.14), inset 5px 7px 18px rgba(255,255,255,1), inset -6px -8px 28px rgba(0,0,0,0.08), 2px 0 0 rgba(255,255,255,0.5)',
              }}
            >
              {/* Reflet glossy haut-gauche */}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-10"
                style={{
                  borderRadius: '170px 170px 20px 20px',
                  background:
                    'radial-gradient(70% 45% at 30% 12%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%)',
                }}
              />

              {/* Logo / titre */}
              <div className="absolute top-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                <span className="font-display text-sm font-extrabold text-[#006633] tracking-widest uppercase whitespace-nowrap">
                  {clinicNameText}
                </span>
                <span className="text-[8px] font-bold text-[#EC0016] tracking-[0.3em] uppercase mt-0.5 whitespace-nowrap">
                  SPECT / CT
                </span>
              </div>

              {/* Anneaux concentriques (détecteurs type CT) */}
              <div aria-hidden="true" className="absolute top-[58px] left-1/2 -translate-x-1/2 w-[224px] h-[224px] rounded-full z-20 border border-black/[0.06] shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)]" />
              <div aria-hidden="true" className="absolute top-[74px] left-1/2 -translate-x-1/2 w-[192px] h-[192px] rounded-full z-20 border border-black/[0.07]" />

              {/* Bore (tunnel) */}
              <div
                className="absolute top-[90px] left-1/2 -translate-x-1/2 w-[160px] h-[160px] rounded-full z-30"
                style={{
                  background: 'radial-gradient(circle at 50% 38%, #2a2a2a 0%, #161616 45%, #0a0a0a 100%)',
                  boxShadow:
                    'inset 0 12px 30px rgba(0,0,0,0.95), inset 0 -3px 8px rgba(255,255,255,0.06), 0 2px 6px rgba(255,255,255,0.95), inset 0 2px 3px rgba(0,0,0,0.6)',
                  border: '1px solid #3a3a3a',
                }}
              >
                {/* Halo interne du tunnel */}
                <div aria-hidden="true" className="absolute inset-[14px] rounded-full border border-white/5" />
                <div aria-hidden="true" className="absolute inset-[30px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]" />
                {/* Témoin laser rouge */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#EC0016] shadow-[0_0_10px_rgba(236,0,22,1)] animate-pulse" />
              </div>

              {/* Liseré rouge Siemens */}
              <div className="absolute right-[22px] top-[38px] bottom-[28px] w-[3px] bg-[#EC0016] rounded-full opacity-90 shadow-[0_0_8px_rgba(236,0,22,0.4)] z-30" />

              {/* Étiquette latérale */}
              <div className="absolute right-[-14px] top-[140px] z-30 bg-[#EC0016] text-white px-2 py-0.5 text-[10px] font-bold rounded-l-md rotate-90 origin-right shadow-md whitespace-nowrap">
                Clinique Okba
              </div>
            </div>

            {/* PLATEAU (table, à gauche) + menu */}
            <div
              className="absolute right-[240px] left-0 bottom-[60px] h-[100px] z-30 flex flex-col justify-end"
              style={{
                borderRadius: '50px 0 0 50px',
                background: 'linear-gradient(180deg, #fbfbfb 0%, #f4f4f4 100%)',
                boxShadow:
                  '0 4px 12px rgba(0,0,0,0.12), inset 0 2px 4px rgba(255,255,255,0.95), inset 0 -3px 10px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <div className="absolute bottom-2 left-[20px] right-0 h-[4px] bg-[#EC0016] rounded-l-full shadow-[0_2px_4px_rgba(236,0,22,0.3)]" />

              <div className="absolute inset-0 flex items-center justify-between px-8 pt-2 pb-4">
                <a href="/" className="flex items-center gap-3 shrink-0 mr-4 group">
                  <div className="relative h-12 w-12 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-105">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-[#006633] leading-none uppercase">Centre</span>
                    <span className="text-sm font-extrabold text-[#006633] leading-none uppercase mt-1">Diagnostic</span>
                  </div>
                </a>

                <nav className="flex-1 flex items-center justify-around px-4" onMouseLeave={() => setHovered(null)} aria-label="Navigation principale">
                  <NavIconLink icon={Home} label={t('center')} isActive={indicatorKey === 'about'} onClick={() => scrollToSection('#about')} onHover={() => setHovered('about')} />
                  <NavIconLink icon={User} label={t('team')} isActive={false} onClick={() => scrollToSection('/equipe')} onHover={() => setHovered('team')} />
                  <NavIconDropdown icon={Stethoscope} label={t('specialties')} isActive={indicatorKey === 'specialties'} onHover={() => setHovered('specialties')} poles={navPoles} />
                  <NavIconLink icon={ClipboardList} label={t('exams')} isActive={false} onClick={() => scrollToSection('#specialties')} onHover={() => setHovered('specialties')} />
                  <NavIconLink icon={Info} label={t('faq')} isActive={indicatorKey === 'faq'} onClick={() => scrollToSection('/faq')} onHover={() => setHovered('faq')} />
                  <NavIconLink icon={Mail} label={t('contact')} isActive={indicatorKey === 'contact'} onClick={() => scrollToSection('#contact')} onHover={() => setHovered('contact')} />
                </nav>

                <div className="shrink-0 pl-6 border-l border-gray-300">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>

          {/* ============ BARRE COMPACTE (au scroll) ============ */}
          <div
            className={cn(
              'absolute inset-x-0 top-0 transition-all duration-500 ease-out',
              isScrolled ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0',
            )}
          >
            <div
              className="relative flex h-[72px] items-center gap-4 rounded-[36px] border border-black/[0.06] pl-5 pr-2 backdrop-blur-md"
              style={{
                background: 'linear-gradient(180deg, #fbfbfb 0%, #f4f4f4 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12), inset 0 2px 4px rgba(255,255,255,0.95)',
              }}
            >
              {/* Liseré rouge plateau */}
              <div aria-hidden="true" className="absolute bottom-2 left-6 right-[88px] h-[3px] rounded-full bg-[#EC0016]/80" />

              {/* Logo */}
              <a href="/" className="flex shrink-0 items-center gap-2.5 group">
                <div className="relative h-10 w-10 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-105">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
                </div>
                <span className="hidden flex-col leading-none 2xl:flex">
                  <span className="text-xs font-extrabold uppercase text-[#006633]">Centre</span>
                  <span className="mt-0.5 text-xs font-extrabold uppercase text-[#006633]">Diagnostic</span>
                </span>
              </a>

              {/* Menu compact */}
              <nav className="flex flex-1 items-center justify-center gap-1" onMouseLeave={() => setHovered(null)} aria-label="Navigation principale (compacte)">
                <NavIconLink icon={Home} label={t('center')} isActive={indicatorKey === 'about'} onClick={() => scrollToSection('#about')} onHover={() => setHovered('about')} />
                <NavIconLink icon={User} label={t('team')} isActive={false} onClick={() => scrollToSection('/equipe')} onHover={() => setHovered('team')} />
                <NavIconDropdown icon={Stethoscope} label={t('specialties')} isActive={indicatorKey === 'specialties'} onHover={() => setHovered('specialties')} poles={navPoles} />
                <NavIconLink icon={ClipboardList} label={t('exams')} isActive={false} onClick={() => scrollToSection('#specialties')} onHover={() => setHovered('specialties')} />
                <NavIconLink icon={Info} label={t('faq')} isActive={indicatorKey === 'faq'} onClick={() => scrollToSection('/faq')} onHover={() => setHovered('faq')} />
                <NavIconLink icon={Mail} label={t('contact')} isActive={indicatorKey === 'contact'} onClick={() => scrollToSection('#contact')} onHover={() => setHovered('contact')} />
              </nav>

              <div className="flex shrink-0 items-center gap-2 pl-3 border-l border-gray-200">
                <LanguageSwitcher />
                {/* Mini-gantry décoratif (rappel du scanner) */}
                <div
                  aria-hidden="true"
                  className="relative flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    background: 'radial-gradient(120% 120% at 32% 20%, #ffffff 0%, #f0f0f0 55%, #d8d8d8 100%)',
                    boxShadow: 'inset 1px 2px 4px rgba(255,255,255,1), inset -2px -3px 7px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  <span className="absolute right-1 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[#EC0016] opacity-90" />
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 50% 40%, #2a2a2a 0%, #111 100%)',
                      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.9), 0 1px 2px rgba(255,255,255,0.85)',
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EC0016] shadow-[0_0_8px_rgba(236,0,22,1)] animate-pulse" />
                  </span>
                </div>
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
        'group relative flex flex-col items-center gap-2 rounded-xl p-2 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016]',
        isActive ? 'text-[#EC0016]' : 'text-[#2b2b2b] hover:text-[#EC0016]'
      )}
    >
      <Icon className="w-6 h-6 stroke-[1.5px]" />
      <span className="text-[11px] font-extrabold tracking-widest uppercase">{label}</span>
      {isActive && (
        <span className="absolute -bottom-2 h-1 w-6 bg-[#EC0016] rounded-full shadow-[0_0_8px_rgba(236,0,22,0.6)]" />
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
          'group relative flex flex-col items-center gap-2 rounded-xl p-2 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016]',
          isActive || open ? 'text-[#EC0016]' : 'text-[#2b2b2b] hover:text-[#EC0016]'
        )}
      >
        <Icon className="w-6 h-6 stroke-[1.5px]" />
        <span className="text-[11px] font-extrabold tracking-widest uppercase flex items-center gap-1">
          {label}
        </span>
        {(isActive || open) && (
          <span className="absolute -bottom-2 h-1 w-6 bg-[#EC0016] rounded-full shadow-[0_0_8px_rgba(236,0,22,0.6)]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[280px] z-50"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-2">
              <div className="grid grid-cols-1 gap-1">
                {poles.map((pole: any) => {
                  const PoleIcon = POLE_ICONS[pole.iconName] || Stethoscope
                  return (
                    <a
                      key={pole.slug}
                      href={`/poles/${pole.slug}`}
                      className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200 hover:bg-gray-50"
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm"
                        style={{ backgroundColor: pole.accent }}
                      >
                        <PoleIcon className="h-4 w-4" />
                      </span>
                      <span className="font-bold text-[#2b2b2b]">{pole.title}</span>
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
