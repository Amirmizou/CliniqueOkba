'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
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

  const scannerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isScannerHovered, setIsScannerHovered] = useState(false)

  const handleScannerMouseMove = (e: React.MouseEvent) => {
    if (!scannerRef.current) return
    const rect = scannerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const rotateY = ((x / rect.width) - 0.5) * 20
    const rotateX = ((y / rect.height) - 0.5) * -20
    
    setTilt({ x: rotateX, y: rotateY })
  }

  const handleScannerMouseLeave = () => {
    setIsScannerHovered(false)
    setTilt({ x: 0, y: 0 })
  }

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

  const homeHref = locale === 'ar' ? '/ar' : '/'

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
      // Retour à l'accueil de la bonne langue, avec l'ancre de section.
      window.location.href = `${homeHref}${href}`
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
                <span className="hidden shrink-0 items-center gap-1.5 text-white/85 xl:flex">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{utilHours}</span>
                </span>
              )}
              {utilAddress && (
                <span className="hidden min-w-0 items-center gap-1.5 text-white/85 xl:flex">
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
          {/* Branche d'olivier discrète (à gauche) */}
          <div className="absolute left-[3%] top-1/2 -translate-y-1/2 opacity-[0.12]">
            <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true">
              {/* Tige principale */}
              <path d="M8 56 Q20 40 32 32 Q44 24 56 8" fill="none" stroke="#006633" strokeWidth="2" strokeLinecap="round" />
              {/* Feuilles gauche (au-dessus de la tige) */}
              <ellipse cx="18" cy="44" rx="6" ry="3" transform="rotate(-50 18 44)" fill="#006633" />
              <ellipse cx="25" cy="37" rx="6" ry="3" transform="rotate(-45 25 37)" fill="#006633" />
              <ellipse cx="38" cy="26" rx="6" ry="3" transform="rotate(-40 38 26)" fill="#006633" />
              <ellipse cx="46" cy="19" rx="5" ry="2.5" transform="rotate(-38 46 19)" fill="#006633" />
              {/* Feuilles droite (en dessous de la tige) */}
              <ellipse cx="22" cy="48" rx="6" ry="3" transform="rotate(40 22 48)" fill="#006633" />
              <ellipse cx="30" cy="40" rx="6" ry="3" transform="rotate(45 30 40)" fill="#006633" />
              <ellipse cx="42" cy="30" rx="5" ry="2.5" transform="rotate(50 42 30)" fill="#006633" />
              <ellipse cx="50" cy="22" rx="5" ry="2.5" transform="rotate(48 50 22)" fill="#006633" />
            </svg>
          </div>
        </div>

        {/* ─── EN-TÊTE MOBILE (xl:hidden) — clair, lisible, identité médicale ─── */}
        <div className="relative w-full max-w-7xl xl:hidden">
          <div className="relative flex items-center gap-2.5 overflow-hidden rounded-2xl border border-gray-100/80 bg-white/97 px-3 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.10)] backdrop-blur-md dark:border-white/10 dark:bg-slate-900/97">
            {/* Trame de points subtile (gauche) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-[#006633]" style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '14px 14px',
              opacity: 0.04,
              WebkitMaskImage: 'linear-gradient(90deg, #000 0%, transparent 62%)',
              maskImage: 'linear-gradient(90deg, #000 0%, transparent 62%)',
            }} />
            {/* Barre signature en bas */}
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-4 right-4 h-[2px] rounded-full" style={{
              background: 'linear-gradient(90deg, transparent, #006633 18%, #4caf6e 48%, #FDE68A 68%, #006633 88%, transparent)',
            }} />

            {/* Logo + marque — prend tout l'espace disponible (plus de troncature) */}
            <a href={homeHref} className="group relative z-10 flex min-w-0 flex-1 items-center gap-2.5">
              <div className="relative h-10 w-10 shrink-0 transition-transform duration-300 group-active:scale-95">
                <svg className="pointer-events-none absolute inset-[-6px] animate-[spin_8s_linear_infinite]" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                  <circle cx="26" cy="26" r="24" stroke="rgba(0,102,51,0.30)" strokeWidth="1.5" strokeDasharray="24 52" strokeLinecap="round" />
                </svg>
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white shadow-md ring-1 ring-gray-100 dark:ring-white/10">
                  <Image src="/logo.png" alt="Logo Clinique OKBA" fill sizes="40px" className="object-contain p-1.5" />
                </div>
              </div>
              <span className="flex min-w-0 flex-col gap-[3px]">
                <span className="truncate text-[14px] font-black uppercase leading-none tracking-tight text-[#006633]">{clinicNameText}</span>
                <span className="truncate text-[9px] font-semibold uppercase leading-none tracking-wide text-[#EC0016]">{t('tagline')}</span>
              </span>
            </a>

            {/* Contrôles — menu + mini-scanner RDV (langue dispo dans le menu) */}
            <div className="relative z-10 flex shrink-0 items-center gap-1.5">
              <button
                ref={menuButtonRef}
                aria-label="Ouvrir le menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#006633] text-white shadow-sm transition-all hover:bg-[#004d26] active:scale-95"
                onClick={() => setIsOpen((v) => !v)}
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>

              {/* ═══ MINI GANTRY SCANNER — bouton « Prendre RDV » (identité imagerie) ═══ */}
              <button
                onClick={() => scrollToSection('#contact')}
                aria-label={t('appointment')}
                title={t('appointment')}
                className="group relative h-[58px] w-[58px] shrink-0 cursor-pointer focus-visible:outline-none"
              >
                {/* Ombre de contact au sol */}
                <span aria-hidden="true" className="absolute bottom-[2px] left-1/2 h-[8px] w-[44px] -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(0,0,0,0.28), transparent 75%)', filter: 'blur(2px)' }} />

                {/* Plateau patient — entre dans le bore depuis la gauche */}
                <span aria-hidden="true" className="absolute left-[1px] top-1/2 h-[7px] w-[20px] -translate-y-1/2 rounded-l-[3px]" style={{ background: 'linear-gradient(180deg,#ffffff,#e6e6e6)', boxShadow: '0 2px 4px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.9)' }}>
                  <span className="absolute bottom-[1px] left-0 right-[3px] h-[1.5px] rounded-full" style={{ background: 'linear-gradient(90deg,#006633,rgba(0,166,81,0))' }} />
                </span>

                {/* Disque gantry (base) */}
                <span aria-hidden="true" className="absolute right-0 top-1/2 h-[54px] w-[54px] -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(125% 125% at 36% 20%, #fff 0%, #f3f3f3 46%, #e2e2e2 78%, #cdcdcd 100%)', boxShadow: '0 6px 16px -4px rgba(0,0,0,0.30), 0 2px 5px rgba(0,0,0,0.12)' }} />

                {/* Face donut trouée (tunnel) */}
                <span aria-hidden="true" className="absolute right-0 top-1/2 h-[54px] w-[54px] -translate-y-1/2 overflow-hidden rounded-full" style={{ background: 'radial-gradient(130% 130% at 36% 18%, #fff 0%, #f4f4f4 44%, #e4e4e4 74%, #d2d2d2 100%)', WebkitMaskImage: 'radial-gradient(circle at center, transparent 11px, black 12px)', maskImage: 'radial-gradient(circle at center, transparent 11px, black 12px)', boxShadow: 'inset 0 1px 4px rgba(255,255,255,0.9), inset 0 -4px 9px rgba(0,0,0,0.10)' }} />

                {/* Liseré signature vert */}
                <span aria-hidden="true" className="absolute right-[2px] top-1/2 h-[50px] w-[50px] -translate-y-1/2 rounded-full" style={{ boxShadow: 'inset 0 0 0 1.5px rgba(0,102,51,0.55)' }} />

                {/* Bore illuminé + laser + LED */}
                <span aria-hidden="true" className="absolute right-[15px] top-1/2 h-[24px] w-[24px] -translate-y-1/2 overflow-hidden rounded-full" style={{ background: 'radial-gradient(circle at 50% 35%, #fff 0%, #eef1f4 55%, #d6dbe1 100%)', boxShadow: 'inset 0 3px 7px rgba(0,0,0,0.12), inset 0 -1px 4px rgba(255,255,255,0.7)' }}>
                  <span className="absolute inset-[3px] rounded-full border border-black/[0.06]" />
                  <span className="absolute left-[10%] right-[10%] top-0 h-[2px] rounded-full bg-[#00a651] shadow-[0_0_6px_2px_rgba(0,166,81,0.6)]" style={{ animation: 'scanLaserMobile 2.6s ease-in-out infinite alternate' }} />
                  <span className="absolute right-[16%] top-[24%] h-[2px] w-[2px] rounded-full bg-red-500 shadow-[0_0_4px_1px_rgba(239,68,68,0.8)] animate-pulse" />
                </span>

                {/* Têtes SPECT rotatives */}
                <span aria-hidden="true" className="absolute right-0 top-1/2 h-[54px] w-[54px] -translate-y-1/2 animate-[spin_32s_linear_infinite]">
                  <span className="absolute left-1/2 top-[-3px] h-[10px] w-[24px] -translate-x-1/2 rounded-[4px]" style={{ background: 'linear-gradient(180deg,#fff,#e6e6e6)', border: '1px solid #d0d0d0', boxShadow: '0 2px 5px rgba(0,0,0,0.18)' }}>
                    <span className="absolute left-[6%] right-[6%] top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-[#b0b0b0]" />
                    <span className="absolute bottom-[1px] left-[15%] right-[15%] h-[1px] rounded-full bg-[#EC0016]/70" />
                  </span>
                  <span className="absolute bottom-[-3px] left-1/2 h-[10px] w-[24px] -translate-x-1/2 rounded-[4px]" style={{ background: 'linear-gradient(0deg,#fff,#e6e6e6)', border: '1px solid #d0d0d0', boxShadow: '0 -2px 5px rgba(0,0,0,0.18)' }}>
                    <span className="absolute left-[6%] right-[6%] top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-[#b0b0b0]" />
                    <span className="absolute top-[1px] left-[15%] right-[15%] h-[1px] rounded-full bg-[#EC0016]/70" />
                  </span>
                </span>

                {/* Halo vert au tap/focus + micro-badge RDV */}
                <span aria-hidden="true" className="absolute right-0 top-1/2 h-[54px] w-[54px] -translate-y-1/2 rounded-full transition-all duration-300 group-active:shadow-[0_0_0_2px_rgba(0,102,51,0.55),0_0_16px_rgba(0,255,136,0.45)] group-focus-visible:shadow-[0_0_0_2px_rgba(0,102,51,0.6)]" />
                <span aria-hidden="true" className="absolute right-[3px] top-[3px] z-10 rounded-[2px] bg-[#006633] px-[3px] py-[1px] text-[6px] font-extrabold uppercase leading-none tracking-[0.12em] text-white shadow-sm">RDV</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3D SCANNER DESKTOP — Siemens Symbia Pro.specta (FRONT VIEW) */}
        <div className={cn("pointer-events-auto relative w-full max-w-7xl mx-auto h-[140px] hidden xl:block transition-all duration-700 origin-top mt-4", isScrolled ? "scale-95 -translate-y-2 opacity-95" : "scale-100 translate-y-0 opacity-100")}>
          <div
            ref={scannerRef}
            onMouseMove={handleScannerMouseMove}
            onMouseEnter={() => setIsScannerHovered(true)}
            onMouseLeave={handleScannerMouseLeave}
            className="w-full h-full relative"
            style={{
              transition: isScannerHovered ? 'transform 0.1s ease-out' : 'transform 0.7s ease-in-out',
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
            }}
          >

          {/* ══ LIGNE DE BASE (Ancrage visuel de la navigation) ══ */}
          <div className="absolute z-[5] pointer-events-none" style={{
            left:'20px', right:'180px', bottom:'26px', height:'4px',
            borderRadius:'2px',
            background:'linear-gradient(90deg, transparent 0%, #d0d0d0 10%, #d0d0d0 90%, transparent 100%)',
          }} />
          <div className="absolute z-[5] pointer-events-none" style={{
            left:'20px', right:'180px', bottom:'20px', height:'2px',
            borderRadius:'1px',
            background:'linear-gradient(90deg, transparent 0%, rgba(0,102,51,0.5) 20%, rgba(0,102,51,0.5) 80%, transparent 100%)',
          }} />

          {/* ══ GANTRY BASE (Pied) ══ */}
          <div className="absolute right-[40px] bottom-[0px] w-[100px] h-[20px] z-[10] pointer-events-none" style={{
            background: 'linear-gradient(180deg,#e0e0e0 0%,#c0c0c0 100%)',
            borderRadius: '10px 10px 0 0',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.8)'
          }} />

          {/* ══ TÊTES SPECT ROTATIVES (Vue de face, derrière l'anneau) ══ */}
          <div className="absolute right-[25px] bottom-[5px] w-[130px] h-[130px] z-[15] pointer-events-none animate-[spin_32s_linear_infinite]">
            {/* Tête Supérieure */}
            <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-[80px] h-[40px] flex flex-col items-center">
              <div className="w-full h-[25px] bg-gradient-to-b from-[#fff] to-[#eee] rounded-t-[16px] border border-[#ccc] shadow-lg flex justify-center pt-1">
                <span className="text-[3px] font-black text-[#0099b9] leading-none tracking-widest">SIEMENS</span>
              </div>
              <div className="w-[90%] h-[15px] bg-gradient-to-b from-[#888] to-[#666] rounded-b-[8px] border border-[#555] flex flex-col items-center justify-end pb-1 shadow-inner">
                <div className="w-[80%] h-[4px] bg-[#111] rounded-[2px]" />
              </div>
            </div>
            {/* Tête Inférieure */}
            <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-[80px] h-[40px] flex flex-col items-center rotate-180">
              <div className="w-full h-[25px] bg-gradient-to-b from-[#fff] to-[#eee] rounded-t-[16px] border border-[#ccc] shadow-lg flex justify-center pt-1">
              </div>
              <div className="w-[90%] h-[15px] bg-gradient-to-b from-[#888] to-[#666] rounded-b-[8px] border border-[#555] flex flex-col items-center justify-end pb-1 shadow-inner">
                <div className="w-[80%] h-[4px] bg-[#111] rounded-[2px]" />
              </div>
            </div>
          </div>

          {/* ══ GANTRY RING (Anneau principal, vue de face) ══ */}
          <div className="absolute right-[20px] bottom-[0px] w-[140px] h-[140px] z-[20] pointer-events-none rounded-full" style={{
            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #e6e6e6 40%, #cccccc 80%, #b3b3b3 100%)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3), inset 0 4px 10px rgba(255,255,255,1), inset 0 -4px 15px rgba(0,0,0,0.1)'
          }}>
            {/* Liseré vert signature */}
            <div className="absolute inset-[6px] rounded-full border-[1.5px] border-[#006633] opacity-60" />
            
            {/* Décal orange Symbia */}
            <div className="absolute right-[8px] top-[66px] w-[25px] h-[6px] bg-[#E2610A] rounded-[1px] flex items-center pl-1 shadow-sm">
              <span className="text-[2px] font-black text-white">SYMBIA Pro.specta</span>
            </div>
          </div>

          {/* ══ TUNNEL (Bore) ══ */}
          <div className="absolute right-[50px] bottom-[30px] w-[80px] h-[80px] z-[25] pointer-events-none rounded-full overflow-hidden" style={{
            background: 'radial-gradient(circle at 50% 50%, #d0d5dc 0%, #b8c0c8 60%, #9aa3ae 100%)',
            boxShadow: 'inset 0 10px 25px rgba(0,0,0,0.4), 0 2px 4px rgba(255,255,255,0.8)'
          }}>
            {/* Lumière annulaire bleue */}
            <div className="absolute inset-0 rounded-full border-[3px] border-[#4898f2] opacity-40 shadow-[0_0_15px_#4898f2,inset_0_0_15px_#4898f2]" />
            {/* Laser de scan */}
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-[#00a651] shadow-[0_0_10px_3px_rgba(0,166,81,0.6)]" style={{ animation: 'scanLaserMobile 2.6s ease-in-out infinite alternate' }} />
          </div>

          {/* ══ LIT PATIENT (Venant vers nous) ══ */}
          <div className="absolute right-[65px] bottom-[-10px] w-[50px] h-[60px] z-[30] pointer-events-none flex flex-col items-center" style={{
            transform: 'perspective(200px) rotateX(45deg)',
            transformOrigin: 'top center'
          }}>
            {/* Matelas */}
            <div className="w-full h-full bg-[#222] rounded-[8px] border-x border-t border-[#444] shadow-[0_20px_30px_rgba(0,0,0,0.5)] flex justify-center">
              {/* Ligne lumineuse au centre */}
              <div className="w-[2px] h-full bg-white opacity-10" />
            </div>
          </div>

          {/* ══ ÉCRAN DE CONTRÔLE SUSPENDU (Display Monitor) ══ */}
          <div className="absolute z-[45] pointer-events-none" style={{ right:'0px', top:'10px' }}>
            {/* Bras de suspension plafond */}
            <div className="absolute bottom-[15px] left-[18px] w-[6px] h-[60px] bg-gradient-to-r from-[#ddd] to-[#eee] border-l border-[#bbb] shadow-md -z-10" />
            <div className="absolute bottom-[15px] left-[15px] w-[12px] h-[5px] bg-[#fff] rounded-sm shadow-sm" />
            
            {/* Câble en spirale */}
            <div className="absolute top-[20px] right-[6px] w-[3px] h-[30px] border-r-2 border-dashed border-[#888] opacity-70" style={{ borderRadius:'50%' }} />

            {/* L'écran (casing large + double dalle) */}
            <div className="relative w-[40px] h-[26px] bg-[#1a1a1a] rounded-[2px] border border-[#333] shadow-[0_10px_20px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center p-[2px]">
              {/* Contenu de l'écran avec 2 fenêtres */}
              <div className="flex-1 w-full h-full bg-[#051124] relative overflow-hidden flex gap-[2px] p-[1px]">
                {/* Panel 1 */}
                <div className="flex-1 h-full border border-[#1a3a60] relative overflow-hidden bg-[#030d1c]">
                   {/* Logo Clinique */}
                   <div className="absolute top-[2px] left-[2px] z-10 opacity-70">
                     <img src="/logo.png" alt="Clinique Okba" className="w-[5px] h-[5px] object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]" />
                   </div>
                   <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="#4898f2" strokeWidth="2" />
                  </svg>
                </div>
                {/* Panel 2 */}
                <div className="flex-1 h-full border border-[#1a3a60] relative overflow-hidden bg-[#030d1c]">
                   <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 Q25,70 50,50 T100,50" fill="none" stroke="#4898f2" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ══ BADGE RDV ══ */}
          <div className="absolute z-[45] pointer-events-none" style={{ right:'22px', bottom:'66px' }}>
            <div className="bg-[#006633] text-white px-1.5 py-[1px] rounded-[2px] shadow-sm text-[7px] font-extrabold tracking-[0.15em] uppercase">RDV</div>
          </div>

          {/* ══ BOUTON GANTRY — Prendre RDV ══ */}
          <button
            onClick={() => scrollToSection('#contact')}
            aria-label={t('appointment')}
            title={t('appointment')}
            className="group absolute z-[46] rounded-full pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006633] focus-visible:ring-offset-2"
            style={{ right:'20px', bottom:'0px', width:'140px', height:'140px' }}
          >
            <span aria-hidden="true" className="absolute inset-[5px] rounded-full transition-all duration-300 group-hover:shadow-[0_0_0_3px_rgba(0,102,51,0.55),0_0_30px_rgba(0,255,136,0.45)] group-focus-visible:shadow-[0_0_0_3px_rgba(0,102,51,0.6)]" />
            <span className="pointer-events-none absolute right-full top-1/2 mr-1 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#006633] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {t('appointment')}
            </span>
          </button>

          {/* ══ NAVIGATION ══ */}
          <div
            className={cn(
              "absolute z-[34] flex items-center pl-7 origin-right",
              isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out",
            )}
            style={{ left:'10px', right:'220px', bottom:'32px', height:'64px' }}
          >
            <div className="shrink-0 mr-2 md:mr-4 pointer-events-auto">
              <LanguageSwitcher />
            </div>
            <a href={homeHref} className="flex items-center gap-3 shrink-0 mr-4 md:mr-6 group pointer-events-auto">
              <div className="relative h-14 w-14 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="Logo" fill sizes="40px" className="object-contain p-1" />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-[12px] md:text-[14px] font-extrabold text-[#006633] leading-none uppercase">Clinique</span>
                <span className="text-[12px] md:text-[14px] font-extrabold text-[#006633] leading-none uppercase mt-0.5">Okba</span>
              </div>
            </a>
            <nav className="flex flex-1 min-w-0 items-center justify-center gap-1 xl:gap-2 2xl:gap-6 pointer-events-auto overflow-hidden" onMouseLeave={() => setHovered(null)}>
              <NavIconLink icon={Home} label={t('center')} isActive={indicatorKey === 'about'} onClick={() => scrollToSection('#about')} onHover={() => setHovered('about')} />
              <NavIconDropdown icon={Stethoscope} label={t('specialties')} isActive={indicatorKey === 'specialties'} onHover={() => setHovered('specialties')} onClick={() => scrollToSection('#specialties')} poles={navPoles} locale={locale} />
              <NavIconLink icon={Activity} label={t('equipment')} isActive={indicatorKey === 'equipements'} onClick={() => scrollToSection('#equipements')} onHover={() => setHovered('equipements')} />
              <NavIconLink icon={Users} label={t('doctors')} isActive={indicatorKey === 'medecins'} onClick={() => scrollToSection('#medecins')} onHover={() => setHovered('medecins')} />
              <NavIconLink icon={Info} label={t('faq')} isActive={indicatorKey === 'faq'} onClick={() => scrollToSection('#faq')} onHover={() => setHovered('faq')} />
              <NavIconLink icon={Mail} label={t('contact')} isActive={indicatorKey === 'contact'} onClick={() => scrollToSection('#contact')} onHover={() => setHovered('contact')} />
            </nav>
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
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[90] flex flex-col bg-white xl:hidden dark:bg-slate-950"
          >
            {/* ── Branding header vert foncé ── */}
            <div
              className="shrink-0 px-5 pb-5 pt-12"
              style={{ background: 'linear-gradient(135deg, #006633 0%, #004422 100%)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/15 ring-1 ring-white/20">
                    <Image src="/logo.png" alt="Clinique OKBA" fill sizes="32px" className="object-contain p-1.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-black uppercase leading-none tracking-tight text-white">
                      {clinicNameText}
                    </p>
                    <p className="mt-1 text-[10px] font-medium leading-none text-[#FDE68A]/85">
                      {t('tagline')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer le menu"
                  className="ml-3 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-all hover:bg-white/25 active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* ── Corps défilant ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="px-4 pt-3 pb-6">

                {/* Urgences */}
                {utilPhone && (
                  <a
                    href={utilPhoneHref}
                    className="mb-3 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 transition-all active:scale-[0.98] dark:border-red-900/30 dark:bg-red-950/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm">
                      <Siren className="h-5 w-5 animate-pulse" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-red-400">
                        Urgences 24h/24
                      </span>
                      <span className="block text-base font-bold text-gray-900 dark:text-white" dir="ltr">
                        {utilPhone}
                      </span>
                    </span>
                    <Phone className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                  </a>
                )}

                {/* Navigation principale */}
                <nav className="flex flex-col">
                  {[
                    { key: 'center', href: '#about', icon: Home },
                    { key: 'specialties', href: '#specialties', icon: Stethoscope },
                    { key: 'equipment', href: '#equipements', icon: Activity },
                    { key: 'doctors', href: '#medecins', icon: Users },
                    { key: 'faq', href: '#faq', icon: Info },
                    { key: 'contact', href: '#contact', icon: Mail },
                  ].map((item, i) => (
                    <motion.button
                      key={item.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.04, duration: 0.2, ease: 'easeOut' }}
                      onClick={() => scrollToSection(item.href)}
                      className="group flex items-center gap-3.5 rounded-xl px-3 py-3.5 text-start transition-all hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#006633] dark:text-emerald-400" style={{ background: 'rgba(0,102,51,0.08)' }}>
                        <item.icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="flex-1 text-[15px] font-semibold text-gray-800 dark:text-gray-100">
                        {t(item.key)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 dark:text-gray-600" />
                    </motion.button>
                  ))}
                </nav>

                {/* Pôles d'excellence */}
                {navPoles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.34, duration: 0.2 }}
                    className="mt-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {t('ourPoles')}
                    </p>
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
                            <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {pole.title}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Paramètres (langue + apparence) */}
                <div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="mb-1 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Paramètres
                  </p>
                  <div className="flex items-center justify-between px-1 py-2.5">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Langue</span>
                    <LanguageSwitcher />
                  </div>
                  <div className="mx-1 h-px bg-gray-200 dark:bg-slate-700" />
                  <div className="flex items-center justify-between px-1 py-2.5">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Apparence</span>
                    <ThemeToggle />
                  </div>
                </div>

              </div>
            </div>
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
