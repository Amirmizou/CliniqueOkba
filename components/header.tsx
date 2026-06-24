'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  X,
  CalendarHeart,
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
  type LucideIcon,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Link } from '@/navigation'
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

/** Pôles du menu : Sanity prioritaire (brut, avec title_ar), repli sur les
 *  données locales. La langue est choisie ici via la locale client (fiable). */
function resolveNavPoles(data: any[] | undefined, locale: string): NavPole[] {
  const source = data && data.length > 0 ? data : localPoles
  return source.map((p: any, i: number) => {
    const slug = p.slug?.current || p.slug || String(i)
    const local = localPoles.find((lp) => lp.slug === slug)

    let title = (locale === 'ar' && p.title_ar) ? p.title_ar : (p.title || '')
    const hasArabicChars = /[؀-ۿ]/.test(title)

    // Si on est en arabe mais que le texte n'a pas de caractères arabes,
    // on va chercher dans les données locales.
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

/* --------------------------------------------------------------------------
 * Onde IRM — ligne fine + balayage scanner intégrés dans la navbar.
 * Effets purement CSS (transform / stroke-dashoffset), neutralisés par
 * `prefers-reduced-motion` (voir globals.css). Décoratif → aria-hidden.
 * ------------------------------------------------------------------------ */
function IrmWave({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-6 overflow-hidden rounded-b-[inherit]"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      {/* Tracé d'onde (sinusoïde douce, signature « imagerie ») */}
      <svg
        className="absolute inset-x-0 bottom-1 h-4 w-full text-primary/40"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          className="irm-trace"
          d="M0 12 Q30 4 60 12 T120 12 T180 12 T240 12 T300 12 T360 12 T420 12 T480 12 T540 12 T600 12 T660 12 T720 12 T780 12 T840 12 T900 12 T960 12 T1020 12 T1080 12 T1140 12 T1200 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Halo de balayage gauche → droite */}
      <div
        className={cn(
          'absolute bottom-0 left-0 h-full w-28 blur-[2px] transition-opacity duration-500',
          active ? 'opacity-90' : 'opacity-60',
        )}
      >
        <div className="irm-scan h-full w-full bg-[linear-gradient(90deg,transparent,rgba(0,102,51,0.55)_45%,rgba(253,230,138,0.9)_50%,rgba(0,102,51,0.55)_55%,transparent)]" />
      </div>
    </div>
  )
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

  // Liens principaux (centrés). Câblés sur les ancres réelles du site.
  const navItems = [
    { key: 'center', href: '#about', id: 'about' },
    { key: 'exams', href: '#specialties', id: 'specialties' },
    { key: 'equipment', href: '#equipements', id: 'equipements' },
    { key: 'doctors', href: '#medecins', id: 'medecins' },
    { key: 'contact', href: '#contact', id: 'contact' },
  ]

  // Verrou de scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fermeture clavier (Échap) + restauration du focus
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

  // Détection de la section active (surligne le bon lien)
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

  // Gestion du hash au chargement
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

  // Compactage au scroll (remplace l'ancien masquage) : plus opaque + ombre
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

  // L'indicateur lumineux suit le lien survolé, sinon la section active
  const indicatorKey = hovered ?? activeTab

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-2 pt-2 sm:px-4 sm:pt-4 pointer-events-none">
        {/* L'ensemble Scanner (Table + Gantry) */}
        <div className="pointer-events-auto relative w-full max-w-7xl flex items-center justify-end transition-all duration-500 ease-out">
          
          {/* Plateau (Table) - S'étend vers la gauche */}
          <div
            className={cn(
              'relative flex flex-1 items-center justify-between z-10 transition-all duration-500 ease-out',
              'rounded-l-2xl sm:rounded-l-3xl border border-white/60 dark:border-white/10',
              'bg-[#f8f9fa] dark:bg-slate-900',
              // Effet lévitation et matérialité
              'shadow-[0_15px_35px_-5px_rgba(0,0,0,0.1),_inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.4),_inset_0_2px_4px_rgba(255,255,255,0.05)]',
              // Recouvre un peu le gantry pour fusionner
              'mr-[-1.5rem] sm:mr-[-2rem] pl-2 sm:pl-4 pr-7 sm:pr-10',
              isScrolled ? 'h-14 sm:h-16 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.15)]' : 'h-16 sm:h-20'
            )}
          >
            {/* Logo (gauche) */}
            <a href="/" className="group flex shrink-0 cursor-pointer items-center gap-3" aria-label="Clinique OKBA — accueil">
              <motion.div
                className={cn(
                  'relative overflow-hidden rounded-full bg-white p-1 shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-all duration-500',
                  isScrolled ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-12 sm:w-12',
                )}
                whileHover={{ scale: 1.05, rotate: 4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/logo.png" alt="Clinique OKBA" fill sizes="48px" className="object-contain p-0.5" priority />
              </motion.div>
              <div className="hidden flex-col leading-none xl:flex">
                <span className="font-display text-sm font-extrabold tracking-tight text-foreground">
                  {siteSettings?.clinicName && (locale !== 'ar' || /[؀-ۿ]/.test(siteSettings.clinicName))
                    ? siteSettings.clinicName
                    : (locale === 'ar' ? 'المصحة الطبية عقبة' : 'Clinique OKBA')}
                </span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#EC0016]">{t('tagline')}</span>
              </div>
            </a>

            {/* Menu centré (flux flex : occupe l'espace central) */}
            <nav
              aria-label="Navigation principale"
              className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex"
              onMouseLeave={() => setHovered(null)}
            >
              {/* Le Centre */}
              <NavLink
                label={t('center')}
                isActive={indicatorKey === 'about'}
                onClick={() => scrollToSection('#about')}
                onHover={() => setHovered('about')}
              />

              {/* Spécialités — déroulant des pôles */}
              <NavDropdown
                label={t('specialties')}
                isActive={indicatorKey === 'specialties'}
                onHover={() => setHovered('specialties')}
                align="center"
                width="w-[22rem]"
              >
                <div className="grid grid-cols-1 gap-1">
                  {navPoles.map((pole) => {
                    const Icon = POLE_ICONS[pole.iconName] || Stethoscope
                    return (
                      <Link
                        key={pole.slug}
                        href={`/poles/${pole.slug}`}
                        className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200 hover:bg-[#EC0016]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016]"
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm transition-transform group-hover/item:scale-110"
                          style={{ backgroundColor: pole.accent }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex flex-col">
                          <span className="font-semibold leading-tight text-foreground">{pole.title}</span>
                          {pole.badge && <span className="text-[10px] font-medium opacity-70">{pole.badge}</span>}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </NavDropdown>

              {/* Examens (→ section Pôles) */}
              <NavLink
                label={t('exams')}
                isActive={false}
                onClick={() => scrollToSection('#specialties')}
                onHover={() => setHovered('specialties')}
              />

              {/* Équipements */}
              <NavLink
                label={t('equipment')}
                isActive={indicatorKey === 'equipements'}
                onClick={() => scrollToSection('#equipements')}
                onHover={() => setHovered('equipements')}
              />

              {/* Médecins */}
              <NavLink
                label={t('doctors')}
                isActive={indicatorKey === 'medecins'}
                onClick={() => scrollToSection('#medecins')}
                onHover={() => setHovered('medecins')}
              />

              {/* Contact */}
              <NavLink
                label={t('contact')}
                isActive={indicatorKey === 'contact'}
                onClick={() => scrollToSection('#contact')}
                onHover={() => setHovered('contact')}
              />

              {/* Plus — pages secondaires */}
              <NavDropdown
                label={t('more')}
                isActive={false}
                onHover={() => setHovered(null)}
                align="end"
                width="w-64"
              >
                <div className="space-y-1">
                  <MorePageLink href="/actualites" icon={Newspaper} title={t('news')} desc={t('newsDesc')} />
                  <MorePageLink href="/evenements" icon={CalendarDays} title={t('events')} desc={t('eventsDesc')} />
                  <MorePageLink href="/equipe" icon={Users} title={t('team')} desc={t('teamDesc')} />
                  <MorePageLink href="/faq" icon={HelpCircle} title={t('faq')} desc={t('faqDesc')} />
                </div>
              </NavDropdown>
            </nav>

            {/* Actions (droite de la table) */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <div className="flex items-center">
                <LanguageSwitcher />
              </div>

              {/* CTA — Prendre rendez-vous */}
              <button
                onClick={() => scrollToSection('#contact')}
                className={cn(
                  'group relative hidden sm:inline-flex h-9 sm:h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-[#1a1a1a] dark:bg-white font-semibold text-white dark:text-black shadow-md transition-all duration-300 hover:bg-[#EC0016] dark:hover:bg-[#EC0016] hover:text-white dark:hover:text-white hover:shadow-lg hover:shadow-[#EC0016]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016] focus-visible:ring-offset-2 active:scale-[0.98] touch-target',
                  'px-3 sm:px-4 ml-1 sm:ml-2',
                )}
              >
                <span className="absolute inset-0 -translate-x-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[200%]" />
                <CalendarHeart className="relative h-4 w-4" />
                <span className="relative hidden tracking-wide lg:inline text-sm">{t('appointment')}</span>
              </button>
            </div>

            {/* Onde IRM signature encastrée dans la table */}
            <IrmWave active={hovered !== null} />
          </div>

          {/* Gantry (Anneau) - Droite */}
          <div
            className={cn(
              'relative z-20 flex shrink-0 items-center justify-center overflow-hidden transition-all duration-500 ease-out',
              'rounded-l-[40px] rounded-r-[20px] sm:rounded-full border-[3px] border-white dark:border-slate-800',
              'bg-gradient-to-br from-white via-gray-100 to-gray-300 dark:from-slate-700 dark:via-slate-800 dark:to-slate-950',
              'shadow-[12px_0_35px_-10px_rgba(0,0,0,0.25),_-5px_0_15px_-5px_rgba(0,0,0,0.1)] dark:shadow-[10px_0_40px_-10px_rgba(0,0,0,0.6)]',
              isScrolled ? 'h-16 w-[4.5rem] sm:h-20 sm:w-20' : 'h-20 w-[5rem] sm:h-24 sm:w-24'
            )}
          >
            {/* Liseré rouge Siemens */}
            <div className="absolute left-[20%] sm:left-[15%] top-0 bottom-0 w-1 sm:w-1.5 bg-gradient-to-b from-[#EC0016] via-[#ff3b4e] to-[#EC0016] shadow-[0_0_12px_rgba(236,0,22,0.6)]" />
            
            {/* Trou central du bore (sombre) */}
            <div
              className={cn(
                'relative flex items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-black shadow-[inset_0_5px_20px_rgba(0,0,0,0.9)] border border-gray-600/20',
                isScrolled ? 'h-10 w-10 sm:h-12 sm:w-12 ml-2 sm:ml-0' : 'h-12 w-12 sm:h-14 sm:w-14 ml-2 sm:ml-0'
              )}
            >
              {/* Le bouton hamburger trouve logiquement sa place au centre du Gantry sur mobile */}
              <button
                ref={menuButtonRef}
                className="flex h-full w-full cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016] xl:hidden touch-target"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <div className="relative h-5 w-5 sm:h-6 sm:w-6">
                  <Menu className={cn('absolute inset-0 transition-all duration-300', isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100')} />
                  <X className={cn('absolute inset-0 transition-all duration-300', isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0')} />
                </div>
              </button>
              
              {/* Indicateur lumineux interne sur desktop (simule l'activité du scanner) */}
              <div className="hidden xl:block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/40" />
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/*  Menu mobile plein écran                                           */}
      {/* ------------------------------------------------------------------ */}
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
            className="fixed inset-0 z-[90] overflow-y-auto bg-background/95 px-6 pb-12 pt-24 backdrop-blur-xl xl:hidden"
          >
            {/* Onde IRM en haut du menu mobile (identité) */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-20 h-8 overflow-hidden">
              <svg className="h-full w-full text-primary/30" viewBox="0 0 1200 24" preserveAspectRatio="none" fill="none">
                <path
                  className="irm-trace"
                  d="M0 12 Q30 4 60 12 T120 12 T180 12 T240 12 T300 12 T360 12 T420 12 T480 12 T540 12 T600 12 T660 12 T720 12 T780 12 T840 12 T900 12 T960 12 T1020 12 T1080 12 T1140 12 T1200 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <motion.nav
              aria-label="Navigation mobile"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ delay: 0.08 }}
              className="mx-auto flex max-w-md flex-col gap-2"
            >
              {navItems.map((item, i) => (
                <motion.button
                  key={item.key}
                  autoFocus={i === 0}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => scrollToSection(item.href)}
                  className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card/50 p-4 transition-all hover:border-[#EC0016]/30 hover:bg-[#EC0016]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016] touch-friendly"
                >
                  <span className="text-xl font-medium transition-colors group-hover:text-[#EC0016]">{t(item.key)}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition-transform group-hover:scale-110">
                    <span className="h-2 w-2 rounded-full bg-[#EC0016]/30 transition-colors group-hover:bg-[#EC0016]" />
                  </span>
                </motion.button>
              ))}

              {/* Pôles */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="border-t border-border/30 pt-4">
                <p className="mb-2 px-2 text-xs uppercase tracking-wider text-muted-foreground">{t('ourPoles')}</p>
                <div className="grid grid-cols-1 gap-2">
                  {navPoles.map((pole) => {
                    const Icon = POLE_ICONS[pole.iconName] || Stethoscope
                    return (
                      <a
                        key={pole.slug}
                        href={`/poles/${pole.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-3 transition-all hover:border-[#EC0016]/30 hover:bg-[#EC0016]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016] touch-friendly"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm" style={{ backgroundColor: pole.accent }}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="text-lg font-medium">{pole.title}</span>
                      </a>
                    )
                  })}
                </div>
              </motion.div>

              {/* Pages secondaires */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="border-t border-border/30 pt-4">
                <p className="mb-2 px-2 text-xs uppercase tracking-wider text-muted-foreground">{t('more')}</p>
                <div className="space-y-2">
                  <MobilePageLink href="/actualites" icon={Newspaper} label={t('news')} onClick={() => setIsOpen(false)} />
                  <MobilePageLink href="/evenements" icon={CalendarDays} label={t('events')} onClick={() => setIsOpen(false)} />
                  <MobilePageLink href="/equipe" icon={Users} label={t('team')} onClick={() => setIsOpen(false)} />
                  <MobilePageLink href="/faq" icon={HelpCircle} label={t('faq')} onClick={() => setIsOpen(false)} />
                </div>
              </motion.div>

              {/* Apparence */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="safe-area-inset-bottom border-t border-border/30 pb-8 pt-4">
                <p className="mb-2 px-2 text-xs uppercase tracking-wider text-muted-foreground">{t('settings')}</p>
                <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4">
                  <span className="font-medium">{t('appearance')}</span>
                  <ThemeToggle />
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Lien de navigation + indicateur lumineux (onde réactive Siemens)          */
/* -------------------------------------------------------------------------- */
function NavLink({
  label,
  isActive,
  onClick,
  onHover,
}: {
  label: string
  isActive: boolean
  onClick: () => void
  onHover: () => void
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        'relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016] focus-visible:ring-offset-2',
        isActive ? 'text-[#EC0016] drop-shadow-[0_0_8px_rgba(236,0,22,0.3)]' : 'text-foreground/85 hover:text-[#EC0016] hover:drop-shadow-[0_0_8px_rgba(236,0,22,0.3)]',
      )}
    >
      <span className="relative z-10 tracking-wide">{label}</span>
      <NavIndicator show={isActive} />
    </button>
  )
}

/* Indicateur : point lumineux encastré (style LED Siemens) */
function NavIndicator({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          layoutId="irm-nav-indicator"
          className="absolute inset-x-2 -bottom-0.5 z-0 flex justify-center"
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          <span className="relative h-1 w-6 rounded-full bg-gradient-to-r from-[#EC0016] to-[#ff4d5e]">
            <span className="irm-pulse absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#EC0016]/80 shadow-[0_0_10px_rgba(236,0,22,0.8)]" />
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------- */
/*  Déroulant de navigation (survol + clavier)                                */
/* -------------------------------------------------------------------------- */
function NavDropdown({
  label,
  isActive,
  onHover,
  align,
  width,
  children,
}: {
  label: string
  isActive: boolean
  onHover: () => void
  align: 'center' | 'end'
  width: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setOpen(true)
        onHover()
      }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        onFocus={onHover}
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          'relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC0016] focus-visible:ring-offset-2',
          isActive ? 'text-[#EC0016] drop-shadow-[0_0_8px_rgba(236,0,22,0.3)]' : 'text-foreground/85 hover:text-[#EC0016] hover:drop-shadow-[0_0_8px_rgba(236,0,22,0.3)]',
        )}
      >
        <span className="relative z-10 tracking-wide">{label}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform duration-300', open && 'rotate-180')} />
        <NavIndicator show={isActive} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={cn(
              'absolute top-full pt-4',
              align === 'center' ? 'left-1/2 -translate-x-1/2' : 'end-0',
              width,
            )}
          >
            <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Liens du déroulant « Plus » (desktop) */
function MorePageLink({ href, icon: Icon, title, desc }: { href: string; icon: LucideIcon; title: string; desc: string }) {
  return (
    <a
      href={href}
      className="group/item flex items-center gap-4 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="rounded-lg bg-primary/10 p-2 text-primary shadow-sm transition-colors group-hover/item:bg-primary group-hover/item:text-white">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex flex-col">
        <span className="font-semibold text-foreground group-hover/item:text-primary">{title}</span>
        <span className="text-[10px] opacity-70">{desc}</span>
      </span>
    </a>
  )
}

/* Liens de pages (menu mobile) */
function MobilePageLink({ href, icon: Icon, label, onClick }: { href: string; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-3 transition-all hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-medium">{label}</span>
    </a>
  )
}
