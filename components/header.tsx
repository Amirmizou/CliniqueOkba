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
import Link from 'next/link'

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
  const [isHidden, setIsHidden] = useState(false)
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
    
    const previous = scrollY.getPrevious() || 0
    if (latest > previous && latest > 150) {
      setIsHidden(true)
    } else if (latest < previous) {
      setIsHidden(false)
    }
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
      <header className={cn(
        "fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4 pointer-events-none transition-transform duration-500",
        isHidden && !isOpen ? "-translate-y-[150%]" : "translate-y-0"
      )}>
        
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

        {/* 3D SCANNER DESKTOP — Siemens Symbia Pro.specta */}
        <div className={cn("pointer-events-auto relative w-full max-w-5xl mx-auto h-[140px] hidden xl:block transition-all duration-700 origin-top mt-4", isScrolled ? "scale-95 -translate-y-2 opacity-95" : "scale-100 translate-y-0 opacity-100")}>
          
          {/* ═══════════════ GANTRY BASE / FLOOR MOUNT ═══════════════ */}
          <div className="absolute right-[10px] bottom-[0px] w-[170px] h-[16px] z-0 pointer-events-none" style={{
            borderRadius: '0 0 8px 8px',
            background: 'linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }} />

          {/* ═══════════════ GANTRY BODY — EXTENSION DROITE (profondeur) ═══════════════ */}
          <div className="absolute right-[5px] bottom-[12px] w-[55px] h-[120px] z-[8] pointer-events-none" style={{
            borderRadius: '0 24px 8px 0',
            background: 'linear-gradient(90deg, #e8e8e8 0%, #d8d8d8 60%, #c5c5c5 100%)',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.12), inset -2px 0 6px rgba(0,0,0,0.06)'
          }} />

          {/* ═══════════════ GANTRY ANNEAU PRINCIPAL ═══════════════ */}
          {/* Outer ring bevel — épaisseur visible */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] rounded-full z-[35] pointer-events-none" style={{
            background: 'conic-gradient(from 220deg, #e0e0e0, #f5f5f5 90deg, #ffffff 180deg, #d5d5d5 270deg, #e0e0e0)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2), inset 0 2px 6px rgba(255,255,255,0.8), inset 0 -4px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Inner bevel ring for 3D depth */}
            <div className="absolute inset-[6px] rounded-full" style={{
              background: 'conic-gradient(from 40deg, #f0f0f0, #e2e2e2 90deg, #d8d8d8 180deg, #ececec 270deg, #f0f0f0)',
              boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.08), inset 0 -2px 4px rgba(255,255,255,0.6)'
            }} />
          </div>

          {/* Gantry masque — découpe le bore (trou central plus petit ~60px) */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] rounded-full z-[38] pointer-events-none" style={{
            background: 'conic-gradient(from 220deg, #e0e0e0, #f5f5f5 90deg, #ffffff 180deg, #d5d5d5 270deg, #e0e0e0)',
            WebkitMaskImage: 'radial-gradient(circle at center, transparent 29px, black 30px)',
            maskImage: 'radial-gradient(circle at center, transparent 29px, black 30px)',
            boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.5)'
          }} />

          {/* Bore intérieur sombre */}
          <div className="absolute z-[20] rounded-full pointer-events-none" style={{
            width: '60px', height: '60px',
            right: '60px', bottom: '43px',
            background: 'radial-gradient(circle at 40% 40%, #1a1a1a 0%, #0a0a0a 60%, #000000 100%)',
            boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.95), inset 0 -2px 8px rgba(30,30,30,0.5)'
          }}>
            {/* LED indicateur intérieur */}
            <div className="absolute top-[25%] right-[15%] w-[3px] h-[3px] rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] animate-pulse" />
            {/* Reflet intérieur subtle du bore */}
            <div className="absolute inset-[4px] rounded-full opacity-20" style={{
              background: 'conic-gradient(from 180deg, transparent 0deg, rgba(255,255,255,0.15) 60deg, transparent 120deg)'
            }} />
          </div>

          {/* Liseré de bore — bord intérieur de l'ouverture */}
          <div className="absolute z-[39] rounded-full pointer-events-none" style={{
            width: '64px', height: '64px',
            right: '58px', bottom: '41px',
            boxShadow: 'inset 0 0 0 2px rgba(180,180,180,0.6), inset 0 3px 8px rgba(0,0,0,0.4)'
          }} />

          {/* ═══════════════ BADGE "SYMBIA Pro.specta" (style orange Siemens) ═══════════════ */}
          <div className="absolute z-[42] pointer-events-none" style={{ right: '18px', bottom: '30px' }}>
            <div className="bg-[#e87722] text-white px-2 py-[2px] rounded-[3px] shadow-md">
              <span className="text-[5px] font-extrabold tracking-wider uppercase leading-none">{clinicNameText}</span>
            </div>
          </div>

          {/* ═══════════════ DETECTOR HEAD (tête supérieure + bras) ═══════════════ */}
          {/* Bras de connexion courbé */}
          <div className="absolute z-[36] pointer-events-none" style={{
            right: '78px', top: '-8px', width: '24px', height: '35px',
            background: 'linear-gradient(90deg, #e8e8e8 0%, #f2f2f2 50%, #e0e0e0 100%)',
            borderRadius: '6px 6px 4px 4px',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.12), inset 1px 0 3px rgba(255,255,255,0.5), inset -1px 0 2px rgba(0,0,0,0.05)'
          }} />
          {/* Tête de détection principale */}
          <div className="absolute z-[37] pointer-events-none" style={{
            right: '55px', top: '-22px', width: '70px', height: '26px',
            borderRadius: '8px 8px 4px 4px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 30%, #e8e8e8 100%)',
            boxShadow: '0 -4px 16px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,1), inset 0 -1px 3px rgba(0,0,0,0.06)'
          }}>
            {/* Ligne rouge accent supérieure */}
            <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-[#EC0016] rounded-full shadow-[0_1px_4px_rgba(236,0,22,0.4)]" />
            {/* Texte Siemens (très discret) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[5px] font-bold text-gray-400 tracking-[0.15em] uppercase">Healthineers</span>
            </div>
          </div>

          {/* ═══════════════ TABLE / PLATEAU PATIENT ═══════════════ */}
          {/* Support mécanique (base grise du lit) */}
          <div className="absolute z-[5] pointer-events-none" style={{
            left: '12%', right: '120px', bottom: '2px', height: '28px',
            borderRadius: '6px 0 0 8px',
            background: 'linear-gradient(180deg, #c0c0c0 0%, #a8a8a8 40%, #969696 100%)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)'
          }}>
            {/* Grilles d'aération */}
            <div className="absolute top-[6px] left-[30px] right-[20px] flex gap-[3px]" aria-hidden="true">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-[12px] w-[2px] rounded-full bg-black/10" />
              ))}
            </div>
          </div>

          {/* Side rail gauche (rebord latéral) */}
          <div className="absolute z-[32] pointer-events-none" style={{
            left: '11%', right: '100px', bottom: '28px', height: '6px',
            borderRadius: '12px 0 0 0',
            background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.8)'
          }} />

          {/* Surface du plateau principal */}
          <div className="absolute z-[30] flex flex-col justify-end transition-transform duration-700 hover:-translate-x-1" style={{
            left: '13%', right: '82px', bottom: '32px', height: '50px',
            borderRadius: '20px 0 0 6px',
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 20%, #f0f0f0 60%, #e4e4e4 100%)',
            boxShadow: '0 8px 20px -4px rgba(0,0,0,0.18), inset 0 3px 10px rgba(255,255,255,1), inset 0 -2px 6px rgba(0,0,0,0.04)',
            WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
            maskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
          }}>
            {/* Bande LED cyan le long du bord inférieur (comme sur le vrai scanner) */}
            <div className="absolute bottom-[3px] left-[20px] right-0 h-[2px] rounded-l-full" style={{
              background: 'linear-gradient(90deg, #00c8ff 0%, #00e5ff 40%, rgba(0,229,255,0) 100%)',
              boxShadow: '0 0 8px rgba(0,200,255,0.5), 0 0 3px rgba(0,200,255,0.3)'
            }} />

            {/* Ligne de guidage subtile */}
            <div aria-hidden="true" className="pointer-events-none absolute top-[50%] left-[55%] right-0 h-[1px] bg-black/[0.04]" />

            {/* Ombre d'entrée dans le bore */}
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-0 w-[60px] z-10" style={{
              background: 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 100%)'
            }} />

            {/* Blur de jonction */}
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-0 w-[25px] z-20" style={{
              backdropFilter: 'blur(1.5px)'
            }} />

            {/* Contenu de la table (navigation) */}
            <div className="absolute inset-0 flex items-center px-4 pb-1">
              {/* Sélecteur de langue */}
              <div className="shrink-0 mr-4">
                <LanguageSwitcher />
              </div>

              {/* Logo Area */}
              <a href="/" className="flex items-center gap-2.5 shrink-0 mr-6 group">
                <div className="relative h-11 w-11 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-105">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-[#006633] leading-none uppercase">Centre</span>
                  <span className="text-[10px] font-extrabold text-[#006633] leading-none uppercase mt-0.5">Diagnostic</span>
                </div>
              </a>

              {/* Navigation */}
              <nav className="flex-1 flex items-center justify-start gap-4 lg:gap-8 pr-[220px]" onMouseLeave={() => setHovered(null)}>
                <NavIconLink icon={Home} label={t('center')} isActive={indicatorKey === 'about'} onClick={() => scrollToSection('#about')} onHover={() => setHovered('about')} />
                <NavIconDropdown icon={Stethoscope} label={t('specialties')} isActive={indicatorKey === 'specialties'} onHover={() => setHovered('specialties')} onClick={() => scrollToSection('#specialties')} poles={navPoles} locale={locale} />
                <NavIconLink icon={Activity} label={t('equipment')} isActive={indicatorKey === 'equipements'} onClick={() => scrollToSection('#equipements')} onHover={() => setHovered('equipements')} />
                <NavIconLink icon={Users} label={t('doctors')} isActive={indicatorKey === 'medecins'} onClick={() => scrollToSection('#medecins')} onHover={() => setHovered('medecins')} />
                <NavIconLink icon={Info} label={t('faq')} isActive={indicatorKey === 'faq'} onClick={() => scrollToSection('#faq')} onHover={() => setHovered('faq')} />
                <NavIconLink icon={Mail} label={t('contact')} isActive={indicatorKey === 'contact'} onClick={() => scrollToSection('#contact')} onHover={() => setHovered('contact')} />
              </nav>
            </div>
          </div>

          {/* ═══════════════ ROTATING SPECT HEADS ═══════════════ */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] z-[44] animate-[spin_20s_linear_infinite] pointer-events-none">
            {/* Tête 1 */}
            <div className="absolute top-[-6px] left-1/2 w-[55px] h-[22px] -translate-x-1/2 rounded-[6px]" style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 40%, #e0e0e0 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,1), inset 0 -1px 2px rgba(0,0,0,0.06)',
              border: '1px solid #d0d0d0'
            }}>
              <div className="absolute bottom-0 left-[15%] right-[15%] h-[2px] bg-[#EC0016] rounded-full" />
            </div>
            {/* Tête 2 */}
            <div className="absolute bottom-[-6px] left-1/2 w-[55px] h-[22px] -translate-x-1/2 rounded-[6px]" style={{
              background: 'linear-gradient(0deg, #ffffff 0%, #f0f0f0 40%, #e0e0e0 100%)',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.18), inset 0 -2px 4px rgba(255,255,255,1), inset 0 1px 2px rgba(0,0,0,0.06)',
              border: '1px solid #d0d0d0'
            }}>
              <div className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-[#EC0016] rounded-full" />
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
                { key: 'equipment', href: '#equipements', icon: Activity },
                { key: 'doctors', href: '#medecins', icon: Users },
                { key: 'faq', href: '#faq', icon: Info },
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

function NavIconDropdown({ icon: Icon, label, isActive, onHover, onClick, poles, locale }: any) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="relative flex justify-center"
      onMouseEnter={() => {
        setOpen(true)
        if (onHover) onHover()
      }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={(e) => {
          setOpen((v) => !v)
          if (onClick) onClick(e)
        }}
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
                    <Link
                      key={pole.slug}
                      href={`/${locale}/poles/${pole.slug}`}
                      className="group/item flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm"
                        style={{ backgroundColor: pole.accent }}
                      >
                        <PoleIcon className="h-4 w-4" />
                      </span>
                      <span className="font-bold text-gray-800">{pole.title}</span>
                    </Link>
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
