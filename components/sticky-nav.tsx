'use client'

import { useState } from 'react'
import {
  Menu,
  Phone,
  ChevronDown,
  Stethoscope,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Barre de navigation compacte, révélée après le header.
 *
 * Le header d'accueil (scène du scanner) est `relative` : passé ~240px de
 * défilement il quitte l'écran et le site n'a plus aucune navigation. Cette
 * barre prend le relais sans rien retirer au header — même bande verte pâle,
 * même filet vert → or en bas, mêmes libellés — simplement compressée sur
 * une seule ligne de 60px.
 */

export interface StickyNavPole {
  slug: string
  title: string
  iconName: string
  accent: string
  badge?: string
}

interface StickyNavProps {
  visible: boolean
  locale: string
  homeHref: string
  clinicName: string
  activeTab: string
  poles: StickyNavPole[]
  poleIcons: Record<string, LucideIcon>
  phone: string
  phoneHref: string
  appointmentHref?: string
  onNavigate: (anchor: string) => void
  onOpenMenu: () => void
}

export default function StickyNav({
  visible,
  locale,
  homeHref,
  clinicName,
  activeTab,
  poles,
  poleIcons,
  phone,
  phoneHref,
  appointmentHref,
  onNavigate,
  onOpenMenu,
}: StickyNavProps) {
  const t = useTranslations('nav')
  const [polesOpen, setPolesOpen] = useState(false)

  const links = [
    { id: 'about', label: t('center'), anchor: '#about' },
    { id: 'equipements', label: t('equipment'), anchor: '#equipements' },
    { id: 'medecins', label: t('doctors'), anchor: '#medecins' },
    { id: 'faq', label: t('faq'), anchor: '#faq' },
    { id: 'contact', label: t('contact'), anchor: '#contact' },
  ]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-x-0 top-0 z-[90] print:hidden"
        >
          <div className="relative bg-gradient-to-b from-[#f2f9f5]/95 to-[#e4f1ea]/95 shadow-[0_2px_18px_rgba(0,102,51,0.13)] backdrop-blur-xl dark:from-slate-950/92 dark:to-[#04120b]/92">
            {/* Filet identitaire vert → or : le même que sous le header */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]"
              style={{
                background:
                  'linear-gradient(90deg, #006633 0%, #4caf6e 45%, #FDE68A 75%, #006633 100%)',
              }}
            />

            <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[60px] lg:px-8">
              {/* ── Marque ── */}
              <a
                href={homeHref}
                className="group flex shrink-0 items-center gap-2.5"
                aria-label={clinicName}
              >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[#006633]/15 transition-transform duration-300 group-hover:scale-105 dark:bg-white/95">
                  <Image
                    src="/logo-mark.png"
                    alt=""
                    aria-hidden="true"
                    width={36}
                    height={36}
                    className="h-full w-full object-contain p-[9%]"
                  />
                </span>
                <span className="hidden text-[13px] font-bold uppercase leading-none tracking-[0.06em] text-[#00532a] sm:inline dark:text-white">
                  {clinicName}
                </span>
              </a>

              {/* ── Liens (desktop) ── */}
              <nav
                className="ms-auto hidden items-center gap-1 xl:flex"
                aria-label={t('specialties')}
              >
                <StickyLink
                  id="about"
                  label={t('center')}
                  active={activeTab === 'about'}
                  onClick={() => onNavigate('#about')}
                />

                {/* Spécialités — déroulant des pôles */}
                <div
                  className="relative"
                  onMouseEnter={() => setPolesOpen(true)}
                  onMouseLeave={() => setPolesOpen(false)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={polesOpen}
                    onClick={() => onNavigate('#specialties')}
                    className={navLinkClass(activeTab === 'specialties')}
                  >
                    {t('specialties')}
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        polesOpen && 'rotate-180',
                      )}
                    />
                    <NavUnderline show={activeTab === 'specialties'} />
                  </button>

                  <AnimatePresence>
                    {polesOpen && poles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16 }}
                        className="absolute start-0 top-full w-[300px] pt-2"
                      >
                        <div className="overflow-hidden rounded-2xl border border-[#006633]/10 bg-white p-2 shadow-xl shadow-[#006633]/10 dark:border-white/10 dark:bg-slate-900">
                          {poles.map((pole) => {
                            const PoleIcon = poleIcons[pole.iconName] || Stethoscope
                            return (
                              <Link
                                key={pole.slug}
                                href={`/${locale}/poles/${pole.slug}`}
                                onClick={() => setPolesOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-[#006633]/[0.06] dark:hover:bg-white/5"
                              >
                                <span
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                                  style={{ backgroundColor: pole.accent }}
                                >
                                  <PoleIcon className="h-3.5 w-3.5" />
                                </span>
                                <span className="flex-1 text-[13px] font-semibold text-gray-800 dark:text-gray-100">
                                  {pole.title}
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {links.slice(1).map((l) => (
                  <StickyLink
                    key={l.id}
                    id={l.id}
                    label={l.label}
                    active={activeTab === l.id}
                    onClick={() => onNavigate(l.anchor)}
                  />
                ))}
              </nav>

              {/* ── Actions ── */}
              <div className="ms-auto flex shrink-0 items-center gap-2 xl:ms-4">
                {phone && (
                  <a
                    href={phoneHref}
                    className="hidden items-center gap-2 rounded-full border border-[#006633]/20 px-3 py-1.5 text-[13px] font-semibold text-[#006633] transition-colors hover:bg-[#006633]/[0.07] lg:flex dark:border-white/15 dark:text-white"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span dir="ltr">{phone}</span>
                  </a>
                )}

                {appointmentHref && (
                  <a
                    href={appointmentHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-[#006633] px-3.5 py-2 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-[#004d26] sm:px-4"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('appointment')}</span>
                    <span className="sm:hidden">RDV</span>
                  </a>
                )}

                {/* Menu complet — mobile et tablette */}
                <button
                  type="button"
                  aria-label={t('more')}
                  onClick={onOpenMenu}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#006633]/20 bg-white/80 text-[#006633] shadow-sm transition-colors active:scale-95 xl:hidden dark:border-white/15 dark:bg-slate-800/80 dark:text-white"
                >
                  <Menu className="h-5 w-5" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function navLinkClass(active: boolean) {
  return cn(
    'relative flex items-center gap-1 rounded-lg px-3 py-2 text-[12.5px] font-bold uppercase tracking-[0.04em] transition-colors',
    active
      ? 'text-[#006633] dark:text-emerald-400'
      : 'text-[#00532a]/70 hover:text-[#006633] dark:text-white/70 dark:hover:text-white',
  )
}

function NavUnderline({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <motion.span
      layoutId="sticky-nav-underline"
      className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full"
      style={{ background: 'linear-gradient(90deg, #006633, #FDE68A)' }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    />
  )
}

function StickyLink({
  label,
  active,
  onClick,
}: {
  id: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className={navLinkClass(active)}>
      {label}
      <NavUnderline show={active} />
    </button>
  )
}
