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
  Phone,
  MapPin,
  Clock,
  Facebook,
  Instagram,
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
  address?: string
  hours?: { emergency?: string; weekdays?: string; saturday?: string }
  social?: { facebook?: string; instagram?: string }
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

  /* Barre utilitaire — infos essentielles (depuis Sanity siteSettings) */
  const utilPhone = (siteSettings?.phone || '').split('/')[0].trim()
  const utilPhoneHref = `tel:${utilPhone.replace(/[^+\d]/g, '')}`
  const utilHours = siteSettings?.hours?.weekdays || ''
  const utilAddress = siteSettings?.address || ''
  const utilFacebook = siteSettings?.social?.facebook
  const utilInstagram = siteSettings?.social?.instagram

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanLaser {
          0% { transform: translateY(2px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(56px); opacity: 0; }
        }
        @keyframes scanLaserMobile {
          0% { transform: translateY(2px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(28px); opacity: 0; }
        }
      `}} />
      {/* ═══ BARRE UTILITAIRE (desktop) — infos essentielles (dans le flux) ═══ */}
      <div className="relative z-[60] hidden xl:block">
        <div className="bg-[#006633] text-white">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 overflow-hidden px-5 text-[12px]">
            {/* Gauche : Urgences + Infos (Phone, Hours, Address) */}
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex shrink-0 items-center gap-2 whitespace-nowrap font-bold tracking-wide text-[#FDE68A]">
                <Siren className="h-3.5 w-3.5 shrink-0 animate-pulse text-red-400" />
                Urgences, Imagerie et Pédiatrie 24h/24
              </span>

              {utilPhone && (
                <a href={utilPhoneHref} className="flex shrink-0 items-center gap-1.5 font-medium transition-colors hover:text-[#FDE68A]">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span dir="ltr" className="whitespace-nowrap">{utilPhone}</span>
                </a>
              )}
              {utilHours && (
                <span className="hidden shrink-0 items-center gap-1.5 text-white/85 2xl:flex">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{utilHours}</span>
                </span>
              )}
              {utilAddress && (
                <span className="hidden min-w-0 items-center gap-1.5 text-white/85 2xl:flex">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{utilAddress}</span>
                </span>
              )}
            </div>

            {/* Droite : Réseaux sociaux */}
            <div className="flex shrink-0 items-center gap-3">
              {utilFacebook && (
                <a href={utilFacebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors hover:text-[#FDE68A]">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {utilInstagram && (
                <a href={utilInstagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-[#FDE68A]">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <header className="relative z-[60] flex justify-center px-4 py-3 bg-white/95 backdrop-blur-md border-b border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.06)] dark:bg-slate-950/90 dark:border-white/10">

        {/* ═══ Décor médical subtil (réduit le vide de la bande, desktop) ═══ */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden xl:block">
          {/* Trame de points fine — dense sur les côtés, estompée derrière le menu */}
          <div
            className="absolute inset-0 text-[#006633]"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              opacity: 0.05,
              WebkitMaskImage: 'linear-gradient(90deg, #000, transparent 28%, transparent 72%, #000)',
              maskImage: 'linear-gradient(90deg, #000, transparent 28%, transparent 72%, #000)',
            }}
          />
          {/* Ligne ECG / pouls fine en bas (langage visuel médical, vert identité) */}
          <svg
            className="absolute bottom-1.5 left-0 h-6 w-full text-[#006633]/15"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0 20 H360 l10 -13 l9 26 l9 -20 l7 7 H545 l13 -9 l9 18 l7 -9 H760 l10 -12 l9 24 l9 -18 l7 6 H1200"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Petite croix médicale discrète (à gauche) */}
          <div className="absolute left-[3%] top-1/2 -translate-y-1/2 text-[#006633]/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />
            </svg>
          </div>
        </div>

        {/* ─── MOBILE GANTRY SCANNER (xl:hidden) — Siemens Symbia ~0.55× ─── */}
        <div className="relative w-full max-w-7xl h-[76px] xl:hidden" style={{ overflow: 'visible' }}>

          {/* Pill — fond visible, overflow:hidden pour que les décos restent dans la pilule */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:bg-slate-900/95 dark:border-white/10">
            {/* Trame de points (côté gauche seulement, le gantry occupe le côté droit) */}
            <div className="absolute inset-0 text-[#006633]" style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '14px 14px',
              opacity: 0.05,
              WebkitMaskImage: 'linear-gradient(90deg, #000 0%, transparent 55%)',
              maskImage: 'linear-gradient(90deg, #000 0%, transparent 55%)',
            }} />
            {/* ECG fine */}
            <svg className="absolute bottom-1 left-0 h-4 w-full text-[#006633]/12" viewBox="0 0 400 24" preserveAspectRatio="none" fill="none">
              <path d="M0 12 H100 l6 -8 l5 16 l5 -11 l4 3 H180 l7 -5 l5 10 l4 -5 H280 l6 -7 l5 14 l5 -10 l4 3 H400" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* ═══ BASE / SOCLE ═══ */}
          <div className="absolute z-0 pointer-events-none" style={{
            right: '4px', bottom: '0px', width: '94px', height: '9px',
            borderRadius: '0 0 5px 5px',
            background: 'linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 100%)',
            boxShadow: '0 3px 8px rgba(0,0,0,0.25)',
          }} />

          {/* ═══ EXTENSION DROITE (profondeur) ═══ */}
          <div className="absolute z-[8] pointer-events-none" style={{
            right: '2px', bottom: '7px', width: '30px', height: '64px',
            borderRadius: '0 14px 5px 0',
            background: 'linear-gradient(90deg, #e8e8e8 0%, #d8d8d8 60%, #c5c5c5 100%)',
            boxShadow: '3px 3px 8px rgba(0,0,0,0.12), inset -1px 0 4px rgba(0,0,0,0.06)',
          }} />

          {/* ═══ OMBRE DE CONTACT ═══ */}
          <div aria-hidden="true" className="absolute z-[2] pointer-events-none" style={{
            right: '13px', bottom: '-3px', width: '73px', height: '12px',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(0,0,0,0.30), rgba(0,0,0,0) 76%)',
            filter: 'blur(2px)',
          }} />

          {/* ═══ ANNEAU GANTRY — disque base ═══ */}
          <div className="absolute rounded-full z-[35] pointer-events-none" style={{
            right: '8px', bottom: '-2px', width: '82px', height: '82px',
            background: 'radial-gradient(125% 125% at 36% 20%, #ffffff 0%, #f3f3f3 46%, #e2e2e2 78%, #cdcdcd 100%)',
            boxShadow: '0 10px 24px -6px rgba(0,0,0,0.30), 0 3px 7px rgba(0,0,0,0.12)',
          }} />

          {/* Face avant (donut) — trouée pour le tunnel */}
          <div className="absolute rounded-full z-[38] pointer-events-none overflow-hidden" style={{
            right: '8px', bottom: '-2px', width: '82px', height: '82px',
            background: 'radial-gradient(130% 130% at 36% 18%, #ffffff 0%, #f4f4f4 44%, #e4e4e4 74%, #d2d2d2 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, transparent 16px, black 17px)',
            maskImage: 'radial-gradient(circle at center, transparent 16px, black 17px)',
            boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.9), inset 0 -6px 12px rgba(0,0,0,0.10)',
          }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(55% 38% at 33% 12%, rgba(255,255,255,0.85), rgba(255,255,255,0) 62%)' }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
              width: '50px', height: '50px',
              boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.04), inset 0 4px 10px rgba(0,0,0,0.20), inset 0 -1px 3px rgba(255,255,255,0.5)',
            }} />
          </div>

          {/* Liseré signature vert */}
          <div className="absolute z-[39] rounded-full pointer-events-none" style={{
            right: '12px', bottom: '3px', width: '74px', height: '74px',
            boxShadow: 'inset 0 0 0 1.5px rgba(0,102,51,0.55)',
          }} />

          {/* ═══ BORE — tunnel illuminé ═══ */}
          <div className="absolute z-[40] rounded-full overflow-hidden pointer-events-none" style={{
            width: '34px', height: '34px', right: '32px', bottom: '22px',
            background: 'radial-gradient(circle at 50% 35%, #ffffff 0%, #eef1f4 55%, #d6dbe1 100%)',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.12), inset 0 -2px 6px rgba(255,255,255,0.7)',
          }}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.10)' }} />
            <div className="absolute inset-[4px] rounded-full border border-black/[0.07]" />
            <div className="absolute inset-[8px] rounded-full border border-black/[0.05]" />
            {/* Laser */}
            <div className="absolute left-[8%] right-[8%] top-0 h-[2px] rounded-full bg-[#00a651] shadow-[0_0_8px_3px_rgba(0,166,81,0.6)]" style={{ animation: 'scanLaserMobile 2.6s ease-in-out infinite alternate' }} />
            <div className="absolute left-0 right-0 top-0 h-[10px] -mt-[4px] opacity-55" style={{ background: 'radial-gradient(ellipse at center, rgba(0,166,81,0.30), transparent 70%)', animation: 'scanLaserMobile 2.6s ease-in-out infinite alternate' }} />
            {/* LED rouge */}
            <div className="absolute top-[25%] right-[15%] w-[2px] h-[2px] rounded-full bg-red-500 shadow-[0_0_5px_1px_rgba(239,68,68,0.8)] animate-pulse" />
          </div>

          {/* Lèvre bore — biseau 3D */}
          <div className="absolute z-[41] rounded-full pointer-events-none" style={{
            width: '34px', height: '34px', right: '32px', bottom: '22px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.10), inset 0 -1px 3px rgba(255,255,255,0.7), 0 0 0 1px rgba(0,0,0,0.10)',
          }} />

          {/* Badge RDV */}
          <div className="absolute z-[45] pointer-events-none" style={{ right: '12px', bottom: '36px' }}>
            <div className="bg-[#006633] text-white px-1 py-[1px] rounded-[2px] shadow-sm text-[6px] font-extrabold tracking-[0.15em] uppercase">RDV</div>
          </div>

          {/* ═══ SPECT HEADS ROTATIFS ═══ */}
          <div className="absolute z-[44] animate-[spin_32s_linear_infinite] pointer-events-none" style={{
            right: '8px', bottom: '-2px', width: '82px', height: '82px',
          }}>
            {/* Tête 1 */}
            <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 rounded-[5px]" style={{
              width: '36px', height: '14px',
              background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 40%, #e0e0e0 100%)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.18), inset 0 1px 3px rgba(255,255,255,1)',
              border: '1px solid #d0d0d0',
            }}>
              <div className="absolute top-[50%] left-[5%] right-[5%] h-[2px] -translate-y-1/2 bg-[#b0b0b0] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]" />
              <div className="absolute bottom-[1px] left-[15%] right-[15%] h-[1px] bg-[#EC0016]/75 rounded-full" />
            </div>
            {/* Tête 2 */}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 rounded-[5px]" style={{
              width: '36px', height: '14px',
              background: 'linear-gradient(0deg, #ffffff 0%, #f0f0f0 40%, #e0e0e0 100%)',
              boxShadow: '0 -3px 8px rgba(0,0,0,0.18), inset 0 -1px 3px rgba(255,255,255,1)',
              border: '1px solid #d0d0d0',
            }}>
              <div className="absolute top-[50%] left-[5%] right-[5%] h-[2px] -translate-y-1/2 bg-[#b0b0b0] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]" />
              <div className="absolute top-[1px] left-[15%] right-[15%] h-[1px] bg-[#EC0016]/75 rounded-full" />
            </div>
          </div>

          {/* ═══ BOUTON GANTRY → Prendre RDV ═══ */}
          <button
            onClick={() => scrollToSection('#contact')}
            aria-label={t('appointment')}
            title={t('appointment')}
            className="group absolute z-[46] rounded-full pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006633] focus-visible:ring-offset-2"
            style={{ right: '8px', bottom: '-2px', width: '82px', height: '82px' }}
          >
            <span aria-hidden="true" className="absolute inset-[3px] rounded-full transition-all duration-300 group-hover:shadow-[0_0_0_2px_rgba(0,102,51,0.55),0_0_20px_rgba(0,255,136,0.45)] group-focus-visible:shadow-[0_0_0_2px_rgba(0,102,51,0.6)]" />
            <span className="pointer-events-none absolute right-full top-1/2 mr-1 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#006633] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {t('appointment')}
            </span>
          </button>

          {/* ═══ CONTENU — logo + contrôles ═══ */}
          <div className="absolute inset-0 z-50 flex items-center" style={{ paddingLeft: '14px', paddingRight: '96px' }}>
            <a href="/" className="flex items-center gap-2 group min-w-0">
              <div className="relative h-9 w-9 shrink-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100 transition-transform duration-300 group-hover:scale-105 active:scale-95 dark:ring-white/10">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <span className="font-extrabold text-[#006633] text-[12px] uppercase leading-none flex flex-col min-w-0">
                <span className="truncate">{clinicNameText}</span>
                <span className="text-[8px] text-[#EC0016] mt-0.5 tracking-widest font-bold">{t('tagline')}</span>
              </span>
            </a>

            <div className="ml-auto flex items-center gap-1 shrink-0">
              {utilPhone && (
                <a
                  href={utilPhoneHref}
                  aria-label="Appeler la clinique — urgences"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006633] text-white shadow-sm transition-all active:scale-95 hover:bg-[#004d26]"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
              )}
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                ref={menuButtonRef}
                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 active:scale-95 dark:bg-slate-800 dark:text-gray-300"
                onClick={() => setIsOpen((v) => !v)}
              >
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3D SCANNER DESKTOP — Siemens Symbia Pro.specta */}
        <div className={cn("pointer-events-auto relative w-full max-w-7xl mx-auto h-[140px] hidden xl:block transition-all duration-700 origin-top mt-4", isScrolled ? "scale-95 -translate-y-2 opacity-95" : "scale-100 translate-y-0 opacity-100")}>
          
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

          {/* ═══════════════ OMBRE DE CONTACT AU SOL (ancrage réaliste) ═══════════════ */}
          <div aria-hidden="true" className="absolute z-[2] pointer-events-none" style={{
            right: '24px', bottom: '-5px', width: '132px', height: '22px',
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(0,0,0,0.30), rgba(0,0,0,0) 76%)',
            filter: 'blur(2px)',
          }} />

          {/* ═══════════════ GANTRY ANNEAU — face plastique mate ═══════════════ */}
          {/* Disque de base : épaisseur + ombre portée douce */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] rounded-full z-[35] pointer-events-none" style={{
            background: 'radial-gradient(125% 125% at 36% 20%, #ffffff 0%, #f3f3f3 46%, #e2e2e2 78%, #cdcdcd 100%)',
            boxShadow: '0 16px 36px -10px rgba(0,0,0,0.30), 0 4px 10px rgba(0,0,0,0.12)',
          }} />

          {/* Face avant (donut) — trouée pour révéler le tunnel */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] rounded-full z-[38] pointer-events-none overflow-hidden" style={{
            background: 'radial-gradient(130% 130% at 36% 18%, #ffffff 0%, #f4f4f4 44%, #e4e4e4 74%, #d2d2d2 100%)',
            WebkitMaskImage: 'radial-gradient(circle at center, transparent 30px, black 31px)',
            maskImage: 'radial-gradient(circle at center, transparent 30px, black 31px)',
            boxShadow: 'inset 0 3px 7px rgba(255,255,255,0.9), inset 0 -10px 18px rgba(0,0,0,0.10)',
          }}>
            {/* Reflet large et doux (lumière de plafond, haut-gauche) */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(55% 38% at 33% 12%, rgba(255,255,255,0.85), rgba(255,255,255,0) 62%)' }} />
            {/* Chanfrein annulaire vers le bore (occlusion ambiante) */}
            <div className="absolute left-1/2 top-1/2 h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{
              boxShadow: 'inset 0 0 0 5px rgba(0,0,0,0.04), inset 0 7px 16px rgba(0,0,0,0.20), inset 0 -2px 5px rgba(255,255,255,0.5)',
            }} />
          </div>

          {/* Liseré signature vert — anneau fin près du bord externe (forme façon Siemens) */}
          <div className="absolute z-[39] rounded-full pointer-events-none" style={{
            right: '22px', bottom: '5px', width: '136px', height: '136px',
            boxShadow: 'inset 0 0 0 2px rgba(0,102,51,0.55)',
          }} />

          {/* ═══════════════ BORE — tunnel clair (illuminé, façon SOMATOM) ═══════════════ */}
          <div className="absolute z-[40] rounded-full overflow-hidden pointer-events-none" style={{
            width: '64px', height: '64px',
            right: '58px', bottom: '41px',
            background: 'radial-gradient(circle at 50% 35%, #ffffff 0%, #eef1f4 55%, #d6dbe1 100%)',
            boxShadow: 'inset 0 6px 16px rgba(0,0,0,0.12), inset 0 -3px 10px rgba(255,255,255,0.7)',
          }}>
            {/* Ombrage doux du pourtour (profondeur du tunnel clair) */}
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 0 14px rgba(0,0,0,0.10)' }} />
            {/* Anneaux détecteurs internes (suggérés) */}
            <div className="absolute inset-[8px] rounded-full border border-black/[0.07]" />
            <div className="absolute inset-[16px] rounded-full border border-black/[0.05]" />

            {/* Effet Laser / Scanning Beam (vert visible sur fond clair) */}
            <div className="absolute left-[8%] right-[8%] top-0 h-[3px] rounded-full bg-[#00a651] shadow-[0_0_12px_4px_rgba(0,166,81,0.6)]" style={{ animation: 'scanLaser 2.6s ease-in-out infinite alternate' }} />
            {/* Lueur diffuse qui suit le faisceau */}
            <div className="absolute left-0 right-0 top-0 h-[16px] -mt-[7px] opacity-55" style={{ background: 'radial-gradient(ellipse at center, rgba(0,166,81,0.30), transparent 70%)', animation: 'scanLaser 2.6s ease-in-out infinite alternate' }} />

            {/* LED indicateur intérieur */}
            <div className="absolute top-[25%] right-[15%] w-[3px] h-[3px] rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] animate-pulse" />
          </div>

          {/* Lèvre du bore — biseau 3D doux (tunnel clair) */}
          <div className="absolute z-[41] rounded-full pointer-events-none" style={{
            width: '64px', height: '64px',
            right: '58px', bottom: '41px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.10), inset 0 -2px 5px rgba(255,255,255,0.7), 0 0 0 1px rgba(0,0,0,0.10)',
          }} />

          {/* ═══════════════ REPÈRE « RDV » (signale que le gantry est cliquable) ═══════════════ */}
          <div className="absolute z-[45] pointer-events-none" style={{ right: '22px', bottom: '66px' }}>
            <div className="bg-[#006633] text-white px-1.5 py-[1px] rounded-[2px] shadow-sm text-[7px] font-extrabold tracking-[0.15em] uppercase">RDV</div>
          </div>

          {/* ═══════════════ TABLE / PLATEAU PATIENT ═══════════════ */}
          {/* Piédestal blanc à nervures verticales (inspiré du SOMATOM go.Top) */}
          <div className={cn("absolute z-[5] pointer-events-none origin-right", isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out")} style={{
            left: '46%', right: '158px', bottom: '3px', height: '30px',
            borderRadius: '10px 10px 3px 3px',
            background: 'linear-gradient(180deg, #fdfdfd 0%, #f1f1f1 55%, #dcdcdc 100%)',
            boxShadow: '0 9px 20px -5px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,0.95), inset 0 -3px 7px rgba(0,0,0,0.08)'
          }}>
            {/* Nervures verticales courbes (signature de la colonne SOMATOM) */}
            <div className="absolute inset-x-3 top-[5px] bottom-[7px]" aria-hidden="true" style={{
              background: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 9px)',
              borderRadius: '4px',
              WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 28%, #000 78%, transparent)',
              maskImage: 'linear-gradient(180deg, transparent, #000 28%, #000 78%, transparent)'
            }} />
            {/* Reflet vertical doux au centre de la colonne */}
            <div className="absolute inset-y-2 left-1/2 w-1/3 -translate-x-1/2" aria-hidden="true" style={{
              background: 'radial-gradient(60% 80% at 50% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0) 70%)'
            }} />
            {/* Base évasée (pied au sol) */}
            <div className="absolute -bottom-[3px] -left-[10px] -right-[10px] h-[6px] rounded-b-md" aria-hidden="true" style={{
              background: 'linear-gradient(180deg, #e2e2e2, #c6c6c6)',
              boxShadow: '0 5px 12px rgba(0,0,0,0.20)'
            }} />
          </div>

          {/* Side rail gauche (rebord latéral) */}
          <div className={cn("absolute z-[32] pointer-events-none origin-right", isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out")} style={{
            left: '11%', right: '145px', bottom: '28px', height: '6px',
            borderRadius: '12px 0 0 0',
            background: 'linear-gradient(180deg, #f0f0f0 0%, #d8d8d8 100%)',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.8)'
          }} />

          {/* Surface du plateau principal */}
          <div className={cn("absolute z-[30] flex flex-col justify-end origin-right hover:-translate-x-1", isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out")} style={{
            left: '10%', right: '95px', bottom: '32px', height: '64px',
            borderRadius: '20px 0 0 6px',
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 20%, #f0f0f0 60%, #e4e4e4 100%)',
            boxShadow: '0 8px 20px -4px rgba(0,0,0,0.18), inset 0 3px 10px rgba(255,255,255,1), inset 0 -2px 6px rgba(0,0,0,0.04)',
            WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)',
            maskImage: 'linear-gradient(to right, black 70%, transparent 100%)'
          }}>
            {/* Liseré latéral net (façon bande Siemens, en vert identité) */}
            <div className="absolute bottom-[5px] left-[22px] right-0 h-[2px] rounded-l-full" style={{
              background: 'linear-gradient(90deg, #006633 0%, #00a651 55%, rgba(0,166,81,0) 100%)',
              boxShadow: '0 0 5px rgba(0,166,81,0.35)'
            }} />

            {/* Ligne de guidage subtile */}
            <div aria-hidden="true" className="pointer-events-none absolute top-[50%] left-[55%] right-0 h-[1px] bg-black/[0.04]" />

            {/* Ombre d'entrée dans le bore — la table s'enfonce dans le tunnel */}
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-0 w-[95px] z-10" style={{
              background: 'linear-gradient(to left, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.28) 48%, transparent 100%)'
            }} />
            {/* Liseré vert qui file du plateau vers le bore (continuité visuelle) */}
            <div aria-hidden="true" className="pointer-events-none absolute bottom-[3px] right-0 h-[2px] w-[90px] z-[11]" style={{
              background: 'linear-gradient(to right, rgba(0,255,136,0.6) 0%, rgba(0,102,51,0) 100%)'
            }} />

            {/* Blur de jonction */}
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-0 w-[25px] z-20" style={{
              backdropFilter: 'blur(1.5px)'
            }} />

          </div>

          {/* ═══════════════ NAVIGATION (calque net, hors du masque de fondu) ═══════════════ */}
          {/* Placé à gauche de l'anneau (right-[195px]) → aucun item sous le gantry, aucun estompage */}
          <div
            className={cn(
              "absolute z-[34] flex items-center pl-7 origin-right",
              isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out",
            )}
            style={{ left: '10%', right: '220px', bottom: '32px', height: '64px' }}
          >
            {/* Sélecteur de langue */}
            <div className="shrink-0 mr-2 md:mr-4 pointer-events-auto">
              <LanguageSwitcher />
            </div>

            {/* Logo Area */}
            <a href="/" className="flex items-center gap-3 shrink-0 mr-4 md:mr-6 group pointer-events-auto">
              <div className="relative h-14 w-14 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-[12px] md:text-[14px] font-extrabold text-[#006633] leading-none uppercase">Clinique</span>
                <span className="text-[12px] md:text-[14px] font-extrabold text-[#006633] leading-none uppercase mt-0.5">Okba</span>
              </div>
            </a>

            {/* Navigation */}
            <nav className="flex flex-1 min-w-0 items-center justify-between gap-1 pointer-events-auto" onMouseLeave={() => setHovered(null)}>
              <NavIconLink icon={Home} label={t('center')} isActive={indicatorKey === 'about'} onClick={() => scrollToSection('#about')} onHover={() => setHovered('about')} />
              <NavIconDropdown icon={Stethoscope} label={t('specialties')} isActive={indicatorKey === 'specialties'} onHover={() => setHovered('specialties')} onClick={() => scrollToSection('#specialties')} poles={navPoles} locale={locale} />
              <NavIconLink icon={Activity} label={t('equipment')} isActive={indicatorKey === 'equipements'} onClick={() => scrollToSection('#equipements')} onHover={() => setHovered('equipements')} />
              <NavIconLink icon={Users} label={t('doctors')} isActive={indicatorKey === 'medecins'} onClick={() => scrollToSection('#medecins')} onHover={() => setHovered('medecins')} />
              <NavIconLink icon={Info} label={t('faq')} isActive={indicatorKey === 'faq'} onClick={() => scrollToSection('#faq')} onHover={() => setHovered('faq')} />
              <NavIconLink icon={Mail} label={t('contact')} isActive={indicatorKey === 'contact'} onClick={() => scrollToSection('#contact')} onHover={() => setHovered('contact')} />
            </nav>
          </div>

          {/* ═══════════════ ROTATING SPECT HEADS ═══════════════ */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] z-[44] animate-[spin_32s_linear_infinite] pointer-events-none">
            {/* Tête 1 */}
            <div className="absolute top-[-10px] left-1/2 w-[65px] h-[26px] -translate-x-1/2 rounded-[8px]" style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 40%, #e0e0e0 100%)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,1), inset 0 -1px 2px rgba(0,0,0,0.06)',
              border: '1px solid #d0d0d0'
            }}>
              {/* Collimator fente */}
              <div className="absolute top-[50%] left-[5%] right-[5%] h-[3px] -translate-y-1/2 bg-[#b0b0b0] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]" />
              <div className="absolute bottom-[2px] left-[15%] right-[15%] h-[2px] bg-[#EC0016]/75 rounded-full" />
            </div>
            {/* Tête 2 */}
            <div className="absolute bottom-[-10px] left-1/2 w-[65px] h-[26px] -translate-x-1/2 rounded-[8px]" style={{
              background: 'linear-gradient(0deg, #ffffff 0%, #f0f0f0 40%, #e0e0e0 100%)',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.18), inset 0 -2px 4px rgba(255,255,255,1), inset 0 1px 2px rgba(0,0,0,0.06)',
              border: '1px solid #d0d0d0'
            }}>
              {/* Collimator fente */}
              <div className="absolute top-[50%] left-[5%] right-[5%] h-[3px] -translate-y-1/2 bg-[#b0b0b0] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]" />
              <div className="absolute top-[2px] left-[15%] right-[15%] h-[2px] bg-[#EC0016]/75 rounded-full" />
            </div>
          </div>

          {/* ═══════════════ GANTRY = BOUTON « PRENDRE RENDEZ-VOUS » (fonctionnel) ═══════════════ */}
          <button
            onClick={() => scrollToSection('#contact')}
            aria-label={t('appointment')}
            title={t('appointment')}
            className="group absolute z-[46] rounded-full pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006633] focus-visible:ring-offset-2"
            style={{ right: '15px', bottom: '-2px', width: '150px', height: '150px' }}
          >
            {/* Halo vert au survol/focus (le scanner « s'active ») */}
            <span aria-hidden="true" className="absolute inset-[5px] rounded-full transition-all duration-300 group-hover:shadow-[0_0_0_3px_rgba(0,102,51,0.55),0_0_30px_rgba(0,255,136,0.45)] group-focus-visible:shadow-[0_0_0_3px_rgba(0,102,51,0.6)]" />
            {/* Infobulle */}
            <span className="pointer-events-none absolute right-full top-1/2 mr-1 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#006633] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {t('appointment')}
            </span>
          </button>

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
              {/* Urgences CTA */}
              {utilPhone && (
                <a
                  href={utilPhoneHref}
                  className="mb-1 flex items-center justify-between rounded-2xl bg-[#006633] p-4 text-white shadow-md transition-all active:scale-[0.98]"
                >
                  <span className="flex items-center gap-3">
                    <Siren className="h-5 w-5 shrink-0 animate-pulse text-[#FDE68A]" aria-hidden="true" />
                    <span>
                      <span className="block text-[10px] font-semibold uppercase tracking-widest text-[#FDE68A]/80">
                        Urgences 24h/24
                      </span>
                      <span className="block text-base font-bold" dir="ltr">{utilPhone}</span>
                    </span>
                  </span>
                  <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                </a>
              )}

              {/* Navigation principale */}
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
                  className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-start transition-all hover:border-[#006633]/20 hover:bg-[#006633]/5 dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#006633]/10 text-[#006633]">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="text-base font-bold text-gray-800 dark:text-gray-100">{t(item.key)}</span>
                </motion.button>
              ))}

              {/* Pôles d'excellence */}
              {navPoles.length > 0 && (
                <div className="mt-1 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('ourPoles')}</p>
                  <div className="flex flex-col gap-0.5">
                    {navPoles.map((pole) => {
                      const PoleIcon = POLE_ICONS[pole.iconName] || Stethoscope
                      return (
                        <Link
                          key={pole.slug}
                          href={`/${locale}/poles/${pole.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white dark:hover:bg-slate-700"
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: pole.accent }}
                          >
                            <PoleIcon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{pole.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
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
        'group relative flex flex-row items-center gap-1 rounded-xl px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none whitespace-nowrap',
        isActive ? 'text-[#006633]' : 'text-gray-600 hover:text-[#006633]'
      )}
    >
      <Icon className="w-3.5 h-3.5 stroke-[2px] shrink-0" />
      <span className="text-[9px] md:text-[10px] xl:text-[11px] font-extrabold tracking-wide uppercase truncate">{label}</span>
      {isActive && (
        <span className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#006633] rounded-full shadow-[0_0_4px_rgba(0,102,51,0.6)]" />
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
          'group relative flex flex-row items-center gap-1 rounded-xl px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none whitespace-nowrap',
          isActive || open ? 'text-[#006633]' : 'text-gray-600 hover:text-[#006633]'
        )}
      >
        <Icon className="w-3.5 h-3.5 stroke-[2px] shrink-0" />
        <span className="text-[9px] md:text-[10px] xl:text-[11px] font-extrabold tracking-wide uppercase truncate">{label}</span>
        {(isActive || open) && (
          <span className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[#006633] rounded-full shadow-[0_0_4px_rgba(0,102,51,0.6)]" />
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
