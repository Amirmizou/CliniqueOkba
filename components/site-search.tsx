'use client'

import { useState, useMemo, useRef, useEffect, useId } from 'react'
import {
  Search,
  X,
  Stethoscope,
  User,
  Activity,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { poles as localPoles } from '@/data/poles'
import { doctors as localDoctors } from '@/data/doctors'
import { usePathname } from 'next/navigation'

/**
 * SiteSearch — recherche fonctionnelle (pôles, services, médecins, sections).
 *
 * Index construit à partir des données locales (poles/doctors) + des sections
 * passées par le header. Suggestions en direct, navigation :
 *  - pôle / service  → page dédiée /poles/<slug>
 *  - médecin / section → ancre sur la page d'accueil (#medecins, #about, …)
 *
 * Insensible à la casse et aux accents. Clavier : ↑ ↓ Entrée Échap.
 */

interface SectionItem {
  id: string
  label: string
  anchor: string // ex : '#about'
}

interface Props {
  locale: string
  sections?: SectionItem[]
  placeholder?: string
  className?: string
  /** Rendu compact (mobile) : liste ancrée dans le flux plutôt qu'en overlay. */
  variant?: 'bar' | 'inline'
}

type Kind = 'pole' | 'service' | 'doctor' | 'section'

interface Result {
  key: string
  label: string
  sub?: string
  kind: Kind
  icon: LucideIcon
  href?: string // pages (pôles)
  anchor?: string // ancres accueil
  haystack: string
}

const KIND_ICON: Record<Kind, LucideIcon> = {
  pole: Stethoscope,
  service: Activity,
  doctor: User,
  section: Search,
}

const KIND_LABEL: Record<string, Record<Kind, string>> = {
  fr: { pole: 'Pôle', service: 'Service', doctor: 'Médecin', section: 'Page' },
  ar: { pole: 'قسم', service: 'خدمة', doctor: 'طبيب', section: 'صفحة' },
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // accents latins
    .replace(/[ً-ٰٟ]/g, '') // diacritiques arabes
    .trim()
}

export default function SiteSearch({
  locale,
  sections = [],
  placeholder,
  className,
  variant = 'bar',
}: Props) {
  const isAr = locale === 'ar'
  const homeBase = isAr ? '/ar' : ''
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const ph =
    placeholder ?? (isAr ? 'ابحث عن خدمة أو طبيب…' : 'Rechercher un service, un médecin…')

  // ── Index de recherche (construit une fois) ──
  const index = useMemo<Result[]>(() => {
    const out: Result[] = []

    for (const p of localPoles) {
      const title = isAr && p.title_ar ? p.title_ar : p.title
      out.push({
        key: `pole-${p.slug}`,
        label: title,
        sub: isAr ? 'قسم' : 'Pôle d’excellence',
        kind: 'pole',
        icon: KIND_ICON.pole,
        href: `${homeBase}/poles/${p.slug}`,
        haystack: normalize(`${p.title} ${p.title_ar ?? ''} ${p.items.join(' ')}`),
      })
      const items = isAr && p.items_ar ? p.items_ar : p.items
      items.forEach((it, i) => {
        out.push({
          key: `service-${p.slug}-${i}`,
          label: it,
          sub: title,
          kind: 'service',
          icon: KIND_ICON.service,
          href: `${homeBase}/poles/${p.slug}`,
          haystack: normalize(`${it} ${p.title}`),
        })
      })
    }

    for (const d of localDoctors) {
      const name = isAr && d.name_ar ? d.name_ar : d.name
      const spec = isAr && d.specialty_ar ? d.specialty_ar : d.specialty
      out.push({
        key: `doctor-${d.id}`,
        label: name,
        sub: spec,
        kind: 'doctor',
        icon: KIND_ICON.doctor,
        anchor: '#medecins',
        haystack: normalize(`${d.name} ${d.specialty} ${d.specialty_ar ?? ''} ${d.name_ar ?? ''}`),
      })
    }

    for (const s of sections) {
      out.push({
        key: `section-${s.id}`,
        label: s.label,
        kind: 'section',
        icon: KIND_ICON.section,
        anchor: s.anchor,
        haystack: normalize(s.label),
      })
    }

    return out
  }, [isAr, homeBase, sections])

  const results = useMemo<Result[]>(() => {
    const q = normalize(query)
    if (q.length < 2) return []
    const terms = q.split(/\s+/).filter(Boolean)
    const scored = index
      .map((r) => {
        let score = 0
        for (const t of terms) {
          const at = r.haystack.indexOf(t)
          if (at === -1) return null
          score += at === 0 ? 3 : r.haystack.includes(` ${t}`) ? 2 : 1
        }
        // Priorité : pôles > médecins > services > sections
        score += r.kind === 'pole' ? 2 : r.kind === 'doctor' ? 1.5 : 0
        return { r, score }
      })
      .filter((x): x is { r: Result; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
    return scored.map((x) => x.r)
  }, [query, index])

  useEffect(() => setActive(0), [query])

  // Fermer au clic extérieur
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const go = (r: Result) => {
    setOpen(false)
    setQuery('')
    if (r.href) {
      window.location.href = r.href
      return
    }
    if (r.anchor) {
      const isHome = pathname === '/' || pathname === '/ar'
      if (isHome) {
        document.querySelector(r.anchor)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = `${homeBase}/${r.anchor}`
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[active]) go(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const showPanel = open && results.length > 0

  return (
    <div ref={rootRef} className={className} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="relative">
        <div
          className={`flex items-center gap-2 rounded-full border bg-white px-4 shadow-sm transition-all dark:bg-slate-900 ${
            showPanel
              ? 'border-[#006633] ring-2 ring-[#006633]/15'
              : 'border-gray-200 dark:border-white/10'
          } ${variant === 'inline' ? 'h-11' : 'h-10'}`}
        >
          <Search className="h-4 w-4 shrink-0 text-[#006633]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            value={query}
            placeholder={ph}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100"
          />
          {query && (
            <button
              type="button"
              aria-label={isAr ? 'Effacer' : 'Effacer'}
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="shrink-0 rounded-full p-0.5 text-gray-400 transition-colors hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showPanel && (
          <ul
            id={listId}
            role="listbox"
            className={`${
              variant === 'inline' ? 'relative mt-2' : 'absolute left-0 right-0 top-full z-[80] mt-2'
            } max-h-[min(60vh,380px)] overflow-y-auto overscroll-contain rounded-2xl border border-gray-100 bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)] dark:border-white/10 dark:bg-slate-900`}
          >
            {results.map((r, i) => {
              const Icon = r.icon
              const isActive = i === active
              return (
                <li key={r.key} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start transition-colors ${
                      isActive ? 'bg-[#006633]/8' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isActive ? 'bg-[#006633] text-white' : 'bg-[#006633]/10 text-[#006633]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                        {r.label}
                      </span>
                      {r.sub && (
                        <span className="block truncate text-[11px] text-gray-500">{r.sub}</span>
                      )}
                    </span>
                    <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-500 dark:bg-white/10">
                      {KIND_LABEL[isAr ? 'ar' : 'fr'][r.kind]}
                    </span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 shrink-0 text-[#006633] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'} ${isAr ? 'rotate-180' : ''}`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
