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
  const [activeTab, setActiveTab] = useState('about')
  const [hovered, setHovered] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const NAVBAR_CONFIG = {
    language: { left: '2%', top: '55%' },
    logo: { left: '10%', top: '55%' },
    links: [
      { id: 'about', label: t('center'), action: () => scrollToSection('#about'), left: '23%', top: '55%' },
      { id: 'team', label: t('team'), action: () => scrollToSection('/equipe'), left: '33%', top: '55%' },
      { id: 'specialties', label: t('specialties'), dropdown: true, left: '43%', top: '55%' },
      { id: 'exams', label: t('exams'), action: () => scrollToSection('#specialties'), left: '55%', top: '55%' },
      { id: 'faq', label: t('faq'), action: () => scrollToSection('/faq'), left: '65%', top: '55%' },
      { id: 'contact', label: t('contact'), action: () => scrollToSection('#contact'), left: '74%', top: '55%' },
    ]
  }

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

        {/* 3D SCANNER DESKTOP (IMAGE BASED) */}
        <div 
          className={cn("pointer-events-auto relative w-full max-w-[1000px] mx-auto aspect-[2.4/1] hidden xl:block transition-all duration-700 origin-top mt-4", isScrolled ? "scale-95 -translate-y-2 opacity-95" : "scale-100 translate-y-0 opacity-100")}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg)`,
            transformStyle: 'preserve-3d',
            transition: mousePos.x === 0 && mousePos.y === 0 ? 'transform 0.5s ease-out' : 'none'
          }}
        >
          {/* BACKGROUND IMAGE */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image 
              src="/Scannernavbar.png" 
              alt="Scanner Navbar Background" 
              fill 
              className="object-contain object-bottom"
              priority
            />
          </div>

          {/* OVERLAY HTML LINKS */}
          <div className="absolute inset-0 z-10" onMouseLeave={() => setHovered(null)}>
            
            {/* SÉLECTEUR DE LANGUE */}
            <div 
              className="absolute -translate-y-1/2 flex items-center justify-center pointer-events-auto"
              style={{ left: NAVBAR_CONFIG.language.left, top: NAVBAR_CONFIG.language.top }}
            >
              <LanguageSwitcher />
            </div>

            {/* LOGO CLINIQUE */}
            <a 
              href="/" 
              className="absolute -translate-y-1/2 flex items-center gap-2 group pointer-events-auto"
              style={{ left: NAVBAR_CONFIG.logo.left, top: NAVBAR_CONFIG.logo.top }}
            >
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#006633] leading-none uppercase">Centre</span>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#006633] leading-none uppercase mt-[2px]">Diagnostic</span>
              </div>
            </a>

            {/* LIENS DU MENU */}
            {NAVBAR_CONFIG.links.map((link) => {
              const isCurrent = indicatorKey === link.id
              return (
                <div 
                  key={link.id}
                  className="absolute -translate-y-1/2 -translate-x-1/2 pointer-events-auto"
                  style={{ left: link.left, top: link.top }}
                  onMouseEnter={() => setHovered(link.id)}
                >
                  {link.dropdown ? (
                    <div className="group relative">
                      <button className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-[#2b2b2b] transition-colors hover:text-[#EC0016]">
                        {link.label}
                        <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isCurrent ? "rotate-180 text-[#EC0016]" : "")} />
                      </button>
                      
                      {/* Active indicator */}
                      <div className={cn("absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#EC0016] transition-all duration-300", isCurrent ? "opacity-100 scale-100" : "opacity-0 scale-0")} />

                      {/* Dropdown menu */}
                      <div className={cn("absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 rounded-xl bg-white p-2 shadow-xl ring-1 ring-gray-100 transition-all duration-300", isCurrent ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0")}>
                        {navPoles.map((pole) => {
                          const Icon = POLE_ICONS[pole.iconName] || Stethoscope
                          return (
                            <a key={pole.slug} href={`/poles/${pole.slug}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: `${pole.accent}15`, color: pole.accent }}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-semibold text-gray-700">{pole.title}</span>
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={link.action}
                      className="group relative px-3 py-2 text-xs sm:text-sm font-bold text-[#2b2b2b] transition-colors hover:text-[#EC0016]"
                    >
                      {link.label}
                      <div className={cn("absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#EC0016] transition-all duration-300", isCurrent ? "opacity-100 scale-100" : "opacity-0 scale-0")} />
                    </button>
                  )}
                </div>
              )
            })}
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
