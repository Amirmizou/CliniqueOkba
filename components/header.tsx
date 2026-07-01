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
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'
import { poles as localPoles } from '@/data/poles'
import GantryWordmark from '@/components/gantry-wordmark'
import SiteSearch from '@/components/site-search'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

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

  const homeHref = locale === 'ar' ? '/ar' : '/'

  // Sections indexées par la recherche (ancres sur la page d'accueil).
  const searchSections = [
    { id: 'about', label: t('center'), anchor: '#about' },
    { id: 'specialties', label: t('specialties'), anchor: '#specialties' },
    { id: 'equipements', label: t('equipment'), anchor: '#equipements' },
    { id: 'medecins', label: t('doctors'), anchor: '#medecins' },
    { id: 'faq', label: t('faq'), anchor: '#faq' },
    { id: 'contact', label: t('contact'), anchor: '#contact' },
  ]

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
        @keyframes floatGlyph {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes ecgSweep {
          0% { left: -6%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { left: 104%; opacity: 0; }
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
        
        {/* LOGO CENTRÉ DANS LA MARGE GAUCHE (Desktop) */}
        <div className="absolute inset-y-0 left-0 w-[calc(50vw-640px)] hidden xl:flex items-center justify-center pointer-events-auto z-[100]">
          <a href={homeHref} className="group relative block">
            <div className="relative h-[100px] w-[100px] 2xl:h-[140px] 2xl:w-[140px] flex items-center justify-center">
              <Image src="/logo-main.png" alt="Clinique OKBA" fill sizes="(max-width: 1536px) 100px, 140px" className="object-contain" priority />
            </div>
          </a>
        </div>

        {/* Ligne d'impulsion vitale (ECG) ultra-fine sur le bord supérieur - Identité visuelle */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden opacity-80 z-[70]">
          <motion.div
            className="h-full w-[30%]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,102,51,0.2), #00a651, rgba(0,102,51,0.2), transparent)',
              boxShadow: '0 0 12px rgba(0, 166, 81, 0.6)'
            }}
            animate={{ x: ['-200%', '400%'] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
          />
        </div>

        {/* ═══ Décor médical (remplit élégamment la bande blanche, desktop) ═══ */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden xl:block">
          {/* Lueur de marque douce — réchauffe le blanc et donne de la profondeur */}
          <div
            className="absolute inset-x-0 -top-16 h-[210px]"
            style={{ background: 'radial-gradient(ellipse 52% 100% at 36% 0%, rgba(0,102,51,0.07), transparent 72%)' }}
          />
          {/* Trame de points fine — dense sur les côtés, estompée derrière le menu */}
          <div
            className="absolute inset-0 text-[#006633]"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              opacity: 0.06,
              WebkitMaskImage: 'linear-gradient(90deg, #000, transparent 30%, transparent 70%, #000)',
              maskImage: 'linear-gradient(90deg, #000, transparent 30%, transparent 70%, #000)',
            }}
          />

          {/* Ligne ECG haute — remplit la bande, avec un point lumineux qui la parcourt */}
          <div className="absolute left-0 right-[160px] top-[15px] h-7">
            <svg className="absolute inset-0 h-full w-full text-[#006633]/[0.22]" viewBox="0 0 1200 40" preserveAspectRatio="none" fill="none">
              <path
                d="M0 20 H250 l8 -12 l7 24 l8 -19 l6 7 H470 l9 -7 l7 15 l6 -8 H700 l8 -11 l7 22 l8 -17 l6 6 H980 l9 -8 l7 16 l6 -8 H1200"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#00a651]"
              style={{ boxShadow: '0 0 8px 2px rgba(0,166,81,0.55)', animation: 'ecgSweep 7s linear infinite' }}
            />
          </div>

          {/* Glyphes médicaux flottants — comblent le vide gauche/centre (langage de la clinique pluridisciplinaire) */}
          <Heart className="absolute left-[13%] top-[20px] h-5 w-5 text-[#006633]" style={{ opacity: 0.1, animation: 'floatGlyph 6s ease-in-out infinite' }} />
          <Activity className="absolute left-[26%] top-[34px] h-6 w-6 text-[#006633]" style={{ opacity: 0.09, animation: 'floatGlyph 7s ease-in-out infinite 0.8s' }} />
          <FlaskConical className="absolute left-[40%] top-[19px] h-5 w-5 text-[#006633]" style={{ opacity: 0.09, animation: 'floatGlyph 6.5s ease-in-out infinite 1.4s' }} />
          <Stethoscope className="absolute left-[53%] top-[33px] h-5 w-5 text-[#006633]" style={{ opacity: 0.09, animation: 'floatGlyph 7.5s ease-in-out infinite 0.4s' }} />

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
            {/* Logo (sans texte HTML car inclus dans l'image) */}
            <a href={homeHref} className="group relative z-10 flex min-w-0 flex-1 items-center gap-2.5">
              <div className="relative h-[56px] w-[56px] shrink-0 transition-transform duration-300 group-active:scale-95 rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
                <Image src="/logo-main.png" alt="Logo Clinique OKBA" fill sizes="56px" className="object-cover p-1" />
              </div>
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

                {/* Intro « OKBA » — jaillit du mini-bore */}
                <GantryWordmark variant="mobile" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ COLONNE DESKTOP — bande claire (logo + recherche) au-dessus du scanner ═══ */}
        <div className="relative z-10 mx-auto hidden w-full max-w-7xl flex-col xl:flex">

        {/* ── Rangée claire : recherche + langue (centrés) ── */}
        <div className="flex items-center justify-center pt-0 pb-0">
          <div className="flex w-full max-w-xl items-center gap-3">
            <div className="flex-1">
              <SiteSearch locale={locale} sections={searchSections} className="w-full" />
            </div>
            <div className="shrink-0 pointer-events-auto">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* 3D SCANNER DESKTOP — Siemens Symbia Pro.specta */}
        <div className={cn("pointer-events-auto relative w-full h-[140px] transition-all duration-700 origin-top mt-0", isScrolled ? "scale-95 -translate-y-2 opacity-95" : "scale-100 translate-y-0 opacity-100")}>

          {/* ══ FLOOR MOUNT ══ */}
          <div className="absolute right-[10px] bottom-0 w-[174px] h-[18px] z-0 pointer-events-none" style={{
            borderRadius: '0 0 10px 10px',
            background: 'linear-gradient(180deg,#d2d2d2 0%,#a6a6a6 55%,#8e8e8e 100%)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.30),inset 0 1px 0 rgba(255,255,255,0.40)',
          }} />

          {/* ══ CORPS DROIT — panneau latéral + LED console ══ */}
          <div className="absolute right-[5px] bottom-[16px] w-[62px] h-[116px] z-[8] pointer-events-none" style={{
            borderRadius: '0 26px 10px 0',
            background: 'linear-gradient(90deg,#eeeeee 0%,#dcdcdc 55%,#c4c4c4 100%)',
            boxShadow: '5px 2px 16px rgba(0,0,0,0.16),inset -2px 0 6px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.50)',
          }}>
            <div className="absolute top-[28px] bottom-[22px] right-[10px] w-px" style={{ background:'linear-gradient(180deg,transparent,rgba(0,0,0,0.18) 20%,rgba(0,0,0,0.24) 50%,rgba(0,0,0,0.12) 80%,transparent)' }} />
            <div className="absolute bottom-[22px] right-[8px] left-[8px] h-[3px] rounded-full" style={{ background:'linear-gradient(90deg,rgba(0,102,51,0.65),rgba(0,166,81,1),rgba(0,102,51,0.65))', boxShadow:'0 0 8px 2px rgba(0,166,81,0.55)' }} />
            <div className="absolute bottom-[12px] right-[12px] left-[12px] h-[1.5px] rounded-full bg-black/10" />
          </div>

          {/* ══ OMBRE SOL — ancrage 3D (contact net + halo ambiant large) ══ */}
          <div aria-hidden="true" className="absolute z-[2] pointer-events-none" style={{
            right:'26px', bottom:'-9px', width:'130px', height:'22px',
            borderRadius:'50%',
            background:'radial-gradient(closest-side,rgba(0,0,0,0.44),rgba(0,0,0,0) 74%)',
            filter:'blur(2.5px)',
          }} />
          <div aria-hidden="true" className="absolute z-[1] pointer-events-none" style={{
            right:'2px', bottom:'-16px', width:'188px', height:'34px',
            borderRadius:'50%',
            background:'radial-gradient(closest-side,rgba(0,40,20,0.13),rgba(0,0,0,0) 78%)',
            filter:'blur(8px)',
          }} />

          {/* ══ ANNEAU — disque de base (drop shadow profond) ══ */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] rounded-full z-[35] pointer-events-none" style={{
            background:'radial-gradient(circle at 46% 42%,#f9f9f9 0%,#e4e4e4 55%,#cccccc 100%)',
            boxShadow:'0 24px 52px -6px rgba(0,0,0,0.40),0 8px 18px rgba(0,0,0,0.16),0 2px 4px rgba(0,0,0,0.10),3px 6px 14px rgba(0,0,0,0.10)',
          }} />

          {/* ══ ANNEAU — face donut (matière 3D : rim-light conic + specular) ══ */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] rounded-full z-[38] pointer-events-none overflow-hidden" style={{
            background:[
              'radial-gradient(ellipse 80% 44% at 36% 16%,rgba(255,255,255,0.98) 0%,rgba(255,255,255,0) 52%)',
              'radial-gradient(ellipse 60% 50% at 70% 84%,rgba(0,0,0,0.13) 0%,rgba(0,0,0,0) 62%)',
              'conic-gradient(from 218deg at 50% 50%,#d0d0d0 0deg,#e8e8e8 28deg,#f7f7f7 58deg,#fafafa 98deg,#f2f2f2 138deg,#e4e4e4 172deg,#d2d2d2 204deg,#c6c6c6 238deg,#d0d0d0 278deg,#e2e2e2 318deg,#d0d0d0 360deg)',
            ].join(','),
            WebkitMaskImage:'radial-gradient(circle at center,transparent 25px,black 27px)',
            maskImage:'radial-gradient(circle at center,transparent 25px,black 27px)',
            boxShadow:'inset 0 5px 10px rgba(255,255,255,0.92),inset 0 -12px 22px rgba(0,0,0,0.09),inset 11px 0 18px rgba(255,255,255,0.55),inset -8px 0 14px rgba(0,0,0,0.07)',
          }}>
            {/* Arcs speculaires SVG (reflet directionnel haut-gauche) */}
            <svg className="absolute inset-0" viewBox="0 0 150 150" fill="none" aria-hidden="true">
              <path d="M33 20 A59 59 0 0 1 117 20" stroke="rgba(255,255,255,0.95)" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M37 25 A53 53 0 0 1 113 25" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 72 A62 62 0 0 1 22 42" stroke="rgba(255,255,255,0.40)" strokeWidth="2" strokeLinecap="round"/>
              {/* AO profond vers le bore */}
              <circle cx="75" cy="75" r="28" stroke="rgba(0,0,0,0.20)" strokeWidth="10" fill="none"/>
              <circle cx="75" cy="75" r="28" stroke="rgba(0,0,0,0.08)" strokeWidth="18" fill="none"/>
            </svg>
          </div>

          {/* ══ Liseré vert signature ══ */}
          <div className="absolute z-[39] rounded-full pointer-events-none" style={{
            right:'22px', bottom:'5px', width:'136px', height:'136px',
            boxShadow:'inset 0 0 0 2px rgba(0,102,51,0.52),inset 0 0 0 4px rgba(0,102,51,0.08)',
          }} />

          {/* ══ BORE — chanfrein externe (profondeur 3D) ══ */}
          <div className="absolute z-[39] rounded-full pointer-events-none" style={{
            width:'60px', height:'60px', right:'60px', bottom:'43px',
            background:'radial-gradient(circle at 48% 38%,#dee2e8 0%,#c4cad2 55%,#abb3bd 100%)',
            boxShadow:'inset 0 4px 10px rgba(0,0,0,0.24),inset 0 -2px 5px rgba(255,255,255,0.42)',
          }} />

          {/* ══ BORE — paroi tunnel (lumière clinique bleu-blanc) ══ */}
          <div className="absolute z-[40] rounded-full overflow-hidden pointer-events-none flex items-center justify-center" style={{
            width:'50px', height:'50px', right:'65px', bottom:'48px',
            background:'radial-gradient(ellipse 72% 62% at 46% 32%,#ffffff 0%,#f2f6fb 38%,#dfe8f2 68%,#cad5e4 100%)',
            boxShadow:'inset 0 7px 20px rgba(0,20,60,0.15),inset 0 -4px 10px rgba(255,255,255,0.80),inset 0 0 32px rgba(60,120,220,0.07)',
          }}>
            <div className="absolute inset-[6px] rounded-full" style={{ border:'1px solid rgba(0,50,120,0.09)' }} />
            <div className="absolute inset-[12px] rounded-full" style={{ border:'1px solid rgba(0,50,120,0.06)' }} />
            <div className="absolute inset-[18px] rounded-full" style={{ border:'0.5px solid rgba(0,50,120,0.04)' }} />
            {/* Catchlight verre (reflet spéculaire → tunnel « verre » 3D) */}
            <div className="absolute left-[20%] top-[15%] z-[15] w-[12px] h-[7px] rounded-full pointer-events-none" style={{ background:'radial-gradient(ellipse at center,rgba(255,255,255,0.95),rgba(255,255,255,0) 72%)', transform:'rotate(-24deg)' }} />
            
            {/* Branche d'olivier au centre exact du gantry (isolée sans être coupée) */}
            <div className="absolute z-10 w-[42px] h-[34px] top-[7px] flex justify-center overflow-hidden pointer-events-none mix-blend-multiply" style={{ filter: 'contrast(1.15) brightness(1.05)' }}>
              <div className="relative w-[42px] h-[42px]">
                <Image src="/logo-main.png" alt="Branche Olivier" fill sizes="42px" className="object-contain scale-[1.4] origin-top" priority />
              </div>
            </div>

            <div className="absolute left-[8%] right-[8%] top-0 h-[3px] z-20 rounded-full bg-[#00a651] shadow-[0_0_14px_4px_rgba(0,166,81,0.65)]" style={{ animation:'scanLaser 2.6s ease-in-out infinite alternate' }} />
            <div className="absolute left-0 right-0 top-0 h-[18px] z-20 -mt-[8px] opacity-50" style={{ background:'radial-gradient(ellipse at center,rgba(0,166,81,0.32),transparent 70%)', animation:'scanLaser 2.6s ease-in-out infinite alternate' }} />
            <div className="absolute top-[25%] right-[15%] z-20 w-[3px] h-[3px] rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.88)] animate-pulse" />
          </div>

          {/* ══ BORE — anneau LED bleu Siemens (lèvre) ══ */}
          <div className="absolute z-[41] rounded-full pointer-events-none" style={{
            width:'50px', height:'50px', right:'65px', bottom:'48px',
            boxShadow:[
              'inset 0 0 0 2.5px rgba(72,152,242,0.62)',
              'inset 0 0 0 6px rgba(72,152,242,0.13)',
              'inset 0 0 20px rgba(72,152,242,0.08)',
              'inset 0 2px 5px rgba(0,0,0,0.12)',
              'inset 0 -2px 4px rgba(255,255,255,0.65)',
              '0 0 0 1px rgba(0,0,0,0.11)',
              '0 0 16px rgba(72,152,242,0.16)',
            ].join(','),
          }} />

          {/* ══ DÉCALS DU GANTRY ══ */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] rounded-full z-[42] pointer-events-none">
            {/* Lignes de panneaux (Seams) */}
            <div className="absolute top-0 bottom-[50%] left-[49.5%] right-[49.5%] bg-black/[0.04]" />
            <div className="absolute top-[49.5%] bottom-[49.5%] left-0 right-[80%] bg-black/[0.04]" />
            <div className="absolute top-[49.5%] bottom-[49.5%] left-[80%] right-0 bg-black/[0.04]" />
            
            {/* Bande signature verte (marque OKBA — aucune marque tierce) */}
            <div className="absolute right-[1px] top-[72px] w-[30px] h-[7px] overflow-hidden rounded-l-[1px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]" style={{ background: 'linear-gradient(90deg,#004d26 0%,#006633 42%,#00a651 100%)' }} />
          </div>

          {/* ══ BADGE RDV — s'efface pendant l'intro « OKBA » puis revient ══ */}
          <motion.div
            className="absolute z-[45] pointer-events-none"
            style={{ right:'22px', bottom:'66px' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0, 0, 1] }}
            transition={{ duration: 3.9, times: [0, 0.08, 0.85, 1], ease: 'easeInOut' }}
          >
            <div className="bg-[#006633] text-white px-1.5 py-[1px] rounded-[2px] shadow-sm text-[7px] font-extrabold tracking-[0.15em] uppercase">RDV</div>
          </motion.div>

          {/* ══ PLATEAU PATIENT - BASE TÉLESCOPIQUE ══ */}
          <div className={cn("absolute z-[5] pointer-events-none origin-right", isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out")} style={{
            left:'20%', right:'145px', bottom:'0px', height:'32px',
            borderRadius:'4px 4px 0 0',
            background:'linear-gradient(180deg, #fcfcfc 0%, #e6e6e6 70%, #d4d4d4 100%)',
            boxShadow:'0 6px 12px rgba(0,0,0,0.2), inset 2px 0 6px rgba(255,255,255,0.9)',
            border:'1px solid #d0d0d0', borderBottom:'none'
          }}>
            {/* Lignes de structure (panneaux) */}
            <div className="absolute top-0 bottom-0 left-[20%] w-px bg-black/10" />
            <div className="absolute top-0 bottom-0 left-[50%] w-px bg-black/10" />
            <div className="absolute top-0 bottom-0 left-[80%] w-px bg-black/10" />
            {/* Grey plinth at the bottom */}
            <div className="absolute bottom-0 left-[2%] right-[2%] h-[12px] bg-gradient-to-b from-[#a0a0a0] to-[#888888] rounded-t-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" />
          </div>

          {/* Glissière sous la table */}
          <div className={cn("absolute z-[29] pointer-events-none origin-right", isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out")} style={{
            left:'20px', right:'135px', bottom:'26px', height:'8px',
            borderRadius:'0 0 0 4px',
            background:'linear-gradient(180deg,#888 0%,#bbb 40%,#777 100%)',
            boxShadow:'inset 0 1px 3px rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.2)',
          }} />

          {/* Table Patient (Matelas + Base Blanche Principale) */}
          <div className={cn("absolute z-[30] flex flex-col justify-end origin-right hover:-translate-x-1", isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out")} style={{
            left:'10px', right:'95px', bottom:'32px', height:'64px',
            borderRadius:'12px 0 0 8px',
            background:'linear-gradient(180deg, #ffffff 0%, #f4f4f4 80%, #e8e8e8 100%)',
            boxShadow:'0 12px 24px -4px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,1)',
            border:'1px solid #eaeaea'
          }}>
            {/* Matelas (Coussin noir/gris foncé) */}
            <div className="absolute top-0 left-[2px] right-0 h-[8px] rounded-tl-[10px]" style={{ 
                background:'linear-gradient(180deg, #333 0%, #1a1a1a 100%)', 
                boxShadow:'inset 0 1px 1px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.4)' 
            }}>
              {/* Rails latéraux métalliques de la table */}
              <div className="absolute top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#888] to-[#666] opacity-50" />
            </div>
            
            {/* (Logo déplacé dans la marge globale du header) */}



            {/* Lignes de structure horizontales (fentes) */}
            <div className="absolute bottom-[16px] left-[15px] right-[5px] h-[1.5px] bg-black/[0.08] rounded-full" />
            <div className="absolute bottom-[8px] left-[15px] right-[5px] h-[1.5px] bg-black/[0.08] rounded-full" />
            
            {/* L'ombre de profondeur / d'insertion dans le gantry */}
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-0 w-[120px] z-10" style={{ background:'linear-gradient(to left,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.1) 50%,transparent 100%)' }} />
            <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-0 w-[30px] z-20" style={{ backdropFilter:'blur(2px)' }} />
          </div>

          {/* ══ NAVIGATION ══ */}
          <div
            className={cn(
              "absolute z-[34] flex items-center pl-[60px] origin-right",
              isHidden ? "translate-x-[200px] opacity-0 transition-all duration-[2000ms] ease-in-out" : "translate-x-0 opacity-100 transition-all duration-[1500ms] delay-[400ms] ease-out",
            )}
            style={{ left:'10px', right:'220px', bottom:'32px', height:'64px' }}
          >
            <nav className="flex flex-1 min-w-0 items-center justify-center gap-1 xl:gap-2 2xl:gap-6 pointer-events-auto relative" onMouseLeave={() => setHovered(null)}>
              <NavIconLink id="about" icon={Home} label={t('center')} indicatorKey={indicatorKey} activeTab={activeTab} onClick={() => scrollToSection('#about')} onHover={() => setHovered('about')} />
              <NavIconDropdown id="specialties" icon={Stethoscope} label={t('specialties')} indicatorKey={indicatorKey} activeTab={activeTab} onHover={() => setHovered('specialties')} onClick={() => scrollToSection('#specialties')} poles={navPoles} locale={locale} />
              <NavIconLink id="equipements" icon={Activity} label={t('equipment')} indicatorKey={indicatorKey} activeTab={activeTab} onClick={() => scrollToSection('#equipements')} onHover={() => setHovered('equipements')} />
              <NavIconLink id="medecins" icon={Users} label={t('doctors')} indicatorKey={indicatorKey} activeTab={activeTab} onClick={() => scrollToSection('#medecins')} onHover={() => setHovered('medecins')} />
              <NavIconLink id="faq" icon={Info} label={t('faq')} indicatorKey={indicatorKey} activeTab={activeTab} onClick={() => scrollToSection('#faq')} onHover={() => setHovered('faq')} />
              <NavIconLink id="contact" icon={Mail} label={t('contact')} indicatorKey={indicatorKey} activeTab={activeTab} onClick={() => scrollToSection('#contact')} onHover={() => setHovered('contact')} />
            </nav>
          </div>

          {/* ══ ÉCRAN DE CONTRÔLE SUSPENDU (Display Monitor) ══ */}
          <div className="absolute z-[45] pointer-events-none" style={{ right:'-15px', top:'20px' }}>
            {/* Bras de suspension plafond */}
            <div className="absolute bottom-[20px] left-[18px] w-[8px] h-[80px] bg-gradient-to-r from-[#ddd] to-[#eee] border-l border-[#bbb] shadow-md -z-10" />
            <div className="absolute bottom-[20px] left-[15px] w-[14px] h-[6px] bg-[#fff] rounded-sm shadow-sm" />
            
            {/* Câble en spirale */}
            <div className="absolute top-[28px] right-[4px] w-[4px] h-[40px] border-r-2 border-dashed border-[#888] opacity-70" style={{ borderRadius:'50%' }} />

            {/* L'écran (casing large + double dalle) */}
            <div className="relative w-[46px] h-[30px] bg-[#1a1a1a] rounded-[2px] border border-[#333] shadow-[0_10px_20px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center p-[2px]">
              {/* Contenu de l'écran avec 2 fenêtres */}
              <div className="flex-1 w-full h-full bg-[#051124] relative overflow-hidden flex gap-[2px] p-[1px]">
                {/* Panel 1 */}
                <div className="flex-1 h-full border border-[#1a3a60] relative overflow-hidden bg-[#030d1c]">
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
                {/* Logo Clinique (recadré sur l'icône) — affiché au centre de l'écran du moniteur */}
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                  <div className="relative h-[22px] w-[22px] overflow-hidden rounded-full drop-shadow-[0_0_4px_rgba(120,200,255,0.7)]">
                    <img src="/logo-main.png" alt="Clinique Okba" className="absolute top-0 left-0 w-full h-full object-cover scale-[1.75] origin-top opacity-95" />
                  </div>
                </div>

                {/* Barre de menu basse */}
                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#0a192f] flex justify-around items-center px-[2px]">
                  <div className="w-[3px] h-[1px] bg-white/40" />
                  <div className="w-[3px] h-[1px] bg-white/40" />
                  <div className="w-[3px] h-[1px] bg-white/40" />
                  <div className="w-[3px] h-[1px] bg-white/40" />
                </div>
              </div>
            </div>
          </div>

          {/* ══ TÊTES SPECT (Massives, arrondies, logo sur face externe) ══ */}
          <div className="absolute right-[15px] bottom-[-2px] w-[150px] h-[150px] z-[44] animate-[spin_32s_linear_infinite] pointer-events-none">
            {/* Tête 1 — supérieure */}
            <div className="absolute top-[-26px] left-1/2 w-[96px] h-[44px] -translate-x-1/2 flex flex-col items-center">
              {/* Base de connexion arrière (massive) */}
              <div className="w-[54px] h-[7px] bg-gradient-to-b from-[#f5f5f5] to-[#ddd] rounded-t-[8px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] z-0" />
              
              {/* Coque externe principale (blanche) */}
              <div className="w-full h-[25px] bg-gradient-to-b from-[#ffffff] to-[#f0f0f0] rounded-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_4px_8px_rgba(255,255,255,1)] border border-[#e0e0e0] z-10 flex flex-col items-center justify-center relative">
                {/* Marque OKBA sur la coque (remplace toute marque tierce) */}
                <div className="flex flex-col items-center mt-[3px]">
                  <span className="text-[4px] font-black text-[#006633] leading-none tracking-[0.18em]">OKBA</span>
                  <span className="mt-[1px] h-[0.8px] w-[10px] rounded-full bg-[#00a651]" />
                </div>
              </div>

              {/* Ligne grise de séparation + Casing inférieur (détecteur gris) */}
              <div className="w-[98%] h-[12px] bg-gradient-to-b from-[#999] to-[#777] rounded-b-[8px] border border-[#666] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] z-10 flex flex-col relative mt-[-2px]">
                {/* Bande grise claire + Numéro "1" */}
                <div className="h-[3.5px] w-full bg-[#c0c0c0] flex items-center justify-center border-b border-[#888]">
                  <div className="text-[2.5px] font-black text-[#444] leading-none">1</div>
                  <div className="w-[1.5px] h-[1px] bg-[#444] ml-[1px] mt-[0.5px]" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                </div>
                {/* Face interne (Collimateur noir) vers le patient */}
                <div className="flex-1 w-full flex justify-center items-end pb-[2px]">
                   <div className="w-[90%] h-[5px] bg-[#111] rounded-[2px] shadow-[inset_0_0_6px_rgba(0,0,0,1)] opacity-90 overflow-hidden">
                     <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_1.5px,rgba(255,255,255,0.1)_1.5px,rgba(255,255,255,0.1)_2.5px)]" />
                   </div>
                </div>
              </div>
            </div>

            {/* Tête 2 — inférieure */}
            <div className="absolute bottom-[-26px] left-1/2 w-[96px] h-[44px] -translate-x-1/2 flex flex-col items-center rotate-180">
              {/* Base de connexion arrière (massive) */}
              <div className="w-[54px] h-[7px] bg-gradient-to-b from-[#f5f5f5] to-[#ddd] rounded-t-[8px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] z-0" />
              
              {/* Coque externe principale (blanche) */}
              <div className="w-full h-[25px] bg-gradient-to-b from-[#ffffff] to-[#f0f0f0] rounded-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_4px_8px_rgba(255,255,255,1)] border border-[#e0e0e0] z-10 flex flex-col items-center justify-center relative">
              </div>

              {/* Ligne grise de séparation + Casing inférieur (détecteur gris) */}
              <div className="w-[98%] h-[12px] bg-gradient-to-b from-[#999] to-[#777] rounded-b-[8px] border border-[#666] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] z-10 flex flex-col relative mt-[-2px]">
                {/* Bande grise claire + Numéro "2" */}
                <div className="h-[3.5px] w-full bg-[#c0c0c0] flex items-center justify-center border-b border-[#888]">
                  <div className="text-[2.5px] font-black text-[#444] leading-none">2</div>
                  <div className="w-[1.5px] h-[1px] bg-[#444] ml-[1px] mt-[0.5px]" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                </div>
                {/* Face interne (Collimateur noir) vers le patient */}
                <div className="flex-1 w-full flex justify-center items-end pb-[2px]">
                   <div className="w-[90%] h-[5px] bg-[#111] rounded-[2px] shadow-[inset_0_0_6px_rgba(0,0,0,1)] opacity-90 overflow-hidden">
                     <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_1.5px,rgba(255,255,255,0.1)_1.5px,rgba(255,255,255,0.1)_2.5px)]" />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ BOUTON GANTRY — Prendre RDV ══ */}
          <button
            onClick={() => scrollToSection('#contact')}
            aria-label={t('appointment')}
            title={t('appointment')}
            className="group absolute z-[46] rounded-full pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006633] focus-visible:ring-offset-2"
            style={{ right:'15px', bottom:'-2px', width:'150px', height:'150px' }}
          >
            <span aria-hidden="true" className="absolute inset-[5px] rounded-full transition-all duration-300 group-hover:shadow-[0_0_0_3px_rgba(0,102,51,0.55),0_0_30px_rgba(0,255,136,0.45)] group-focus-visible:shadow-[0_0_0_3px_rgba(0,102,51,0.6)]" />
            <span className="pointer-events-none absolute right-full top-1/2 mr-1 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#006633] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {t('appointment')}
            </span>
          </button>

          {/* ══ INTRO « OKBA » — jaillit du bore, s'assemble, se rétracte ══ */}
          <GantryWordmark variant="desktop" />

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
                  <div className="relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-full bg-[#006633] shadow-md ring-2 ring-white/80">
                    <Image src="/logo-main.png" alt="Clinique OKBA" fill sizes="48px" className="object-cover scale-[1.75] origin-top" />
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

                {/* Recherche */}
                <div className="mb-3">
                  <SiteSearch locale={locale} sections={searchSections} variant="inline" />
                </div>

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

                {/* Paramètres (langue + apparence) — barres segmentées claires */}
                <MenuSettings />

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* Réglages du menu mobile — barres segmentées claires et lisibles
   (Apparence : Clair/Sombre, Langue : Français/العربية). Remplace les
   contrôles toggle peu lisibles dans le menu plein écran. */
function MenuSettings() {
  const locale = useLocale()
  const isAr = locale === 'ar'
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && theme === 'dark'

  const localizedPath = (target: string) => {
    if (!pathname) return target === 'fr' ? '/' : `/${target}`
    const seg = pathname.split('/')
    const hasPrefix = seg[1] === 'fr' || seg[1] === 'ar'
    if (hasPrefix) {
      if (target === 'fr') {
        seg.splice(1, 1)
        return seg.join('/') || '/'
      }
      seg[1] = target
      return seg.join('/')
    }
    return target === 'fr' ? pathname : `/${target}${pathname === '/' ? '' : pathname}`
  }
  const switchLang = (target: string) => {
    if (target !== locale) router.replace(localizedPath(target), { scroll: false })
  }

  const seg = (active: boolean) =>
    cn(
      'flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-bold transition-all duration-200',
      active
        ? 'bg-white text-[#006633] shadow-sm ring-1 ring-black/5 dark:bg-slate-900 dark:text-emerald-400'
        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
    )

  return (
    <div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
      <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {isAr ? 'الإعدادات' : 'Paramètres'}
      </p>

      {/* Apparence */}
      <p className="mb-1.5 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
        {isAr ? 'المظهر' : 'Apparence'}
      </p>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-200/70 p-1 dark:bg-slate-700/50">
        <button type="button" onClick={() => setTheme('light')} aria-pressed={!isDark} className={seg(!isDark)}>
          <Sun className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'فاتح' : 'Clair'}
        </button>
        <button type="button" onClick={() => setTheme('dark')} aria-pressed={isDark} className={seg(isDark)}>
          <Moon className="h-4 w-4" aria-hidden="true" />
          {isAr ? 'داكن' : 'Sombre'}
        </button>
      </div>

      {/* Langue */}
      <p className="mb-1.5 mt-3 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
        {isAr ? 'اللغة' : 'Langue'}
      </p>
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-200/70 p-1 dark:bg-slate-700/50">
        <button type="button" onClick={() => switchLang('fr')} aria-pressed={!isAr} className={seg(!isAr)}>
          Français
        </button>
        <button type="button" onClick={() => switchLang('ar')} aria-pressed={isAr} className={seg(isAr)}>
          العربية
        </button>
      </div>
    </div>
  )
}

function NavIconLink({ icon: Icon, label, id, indicatorKey, activeTab, onClick, onHover }: any) {
  const isHighlighted = indicatorKey === id;
  const isCurrent = activeTab === id;
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        'group relative flex flex-row items-center gap-1.5 rounded-full px-3 py-2 transition-all duration-300 focus-visible:outline-none whitespace-nowrap',
        isHighlighted ? 'text-[#006633]' : 'text-gray-600 hover:text-[#006633]'
      )}
    >
      {isHighlighted && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-full bg-[#006633]/10 dark:bg-[#00a651]/15"
          initial={false}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="relative z-10 w-4 h-4 stroke-[2px] shrink-0" />
      <span className="relative z-10 text-[10px] md:text-[11px] xl:text-[12px] font-extrabold tracking-wide uppercase truncate">{label}</span>
      {isCurrent && !isHighlighted && (
        <span className="absolute -bottom-1 left-4 right-4 h-[2px] bg-[#006633]/40 rounded-full" />
      )}
    </button>
  )
}

function NavIconDropdown({ icon: Icon, label, id, indicatorKey, activeTab, onHover, onClick, poles, locale }: any) {
  const [open, setOpen] = useState(false)
  const isHighlighted = indicatorKey === id || open;
  const isCurrent = activeTab === id;
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
          'group relative flex flex-row items-center gap-1.5 rounded-full px-3 py-2 transition-all duration-300 focus-visible:outline-none whitespace-nowrap',
          isHighlighted ? 'text-[#006633]' : 'text-gray-600 hover:text-[#006633]'
        )}
      >
        {isHighlighted && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute inset-0 rounded-full bg-[#006633]/10 dark:bg-[#00a651]/15"
            initial={false}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <Icon className="relative z-10 w-4 h-4 stroke-[2px] shrink-0" />
        <span className="relative z-10 text-[10px] md:text-[11px] xl:text-[12px] font-extrabold tracking-wide uppercase truncate">{label}</span>
        {isCurrent && !isHighlighted && (
          <span className="absolute -bottom-1 left-4 right-4 h-[2px] bg-[#006633]/40 rounded-full" />
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
            <div className="overflow-hidden rounded-xl bg-white/95 backdrop-blur-md shadow-[0_10px_40px_rgba(0,102,51,0.08)] ring-1 ring-black/5 p-2 border-t-[3px] border-[#006633] dark:bg-slate-900/95 dark:border-[#00a651]">
              <div className="grid grid-cols-1 gap-1 relative z-10">
                {poles.map((pole: any) => {
                  const PoleIcon = POLE_ICONS[pole.iconName] || Stethoscope
                  return (
                    <Link
                      key={pole.slug}
                      href={`/${locale}/poles/${pole.slug}`}
                      className="group/item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-[#006633]/5 dark:hover:bg-white/5"
                      onClick={() => setOpen(false)}
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-md text-white shadow-sm transition-transform group-hover/item:scale-110"
                        style={{ backgroundColor: pole.accent }}
                      >
                        <PoleIcon className="h-4 w-4" />
                      </span>
                      <span className="font-bold text-gray-800 transition-colors group-hover/item:text-[#006633] dark:text-gray-200 dark:group-hover/item:text-[#00a651]">{pole.title}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* Filigrane identité visuelle dans le menu déroulant */}
              <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06] translate-x-1/4 translate-y-1/4">
                 <svg width="150" height="150" viewBox="0 0 64 64" fill="currentColor" className="text-[#006633] dark:text-[#00a651]">
                    <path d="M32 0 L64 16 L64 48 L32 64 L0 48 L0 16 Z" />
                 </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
