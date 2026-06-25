'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import { adminSections, STUDIO_URL, type AdminSection } from '@/lib/admin/sections'

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as any)[name] || Icons.Square
  return <C className={className} />
}

const GROUPS = ['Accueil', 'Équipe & Pôles', 'Contenu', 'Configuration'] as const
const FAV_KEY = 'okbaAdminFavorites'

export default function AdminHome() {
  const [query, setQuery] = useState('')
  const [favs, setFavs] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'))
    } catch {}
  }, [])

  const toggleFav = (key: string) =>
    setFavs((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next))
      } catch {}
      return next
    })

  const q = query.trim().toLowerCase()
  const match = (s: AdminSection) =>
    !q ||
    s.label.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.group.toLowerCase().includes(q)

  const favSections = adminSections.filter((s) => favs.includes(s.key) && match(s))

  const Card = ({ s }: { s: AdminSection }) => {
    const useNative = s.ready && s.href
    const href = useNative ? s.href! : STUDIO_URL
    const external = !useNative
    const isFav = favs.includes(s.key)
    return (
      <Link
        href={href}
        {...(external ? { target: '_blank' } : {})}
        className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
      >
        {/* Épingle favori */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFav(s.key)
          }}
          aria-label={isFav ? `Retirer ${s.label} des raccourcis` : `Épingler ${s.label}`}
          aria-pressed={isFav}
          className={cnFav(isFav)}
        >
          <Icons.Star className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        <div className="mb-3 flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Icon name={s.icon} className="h-5 w-5" />
          </span>
          {s.ready ? (
            <span className="me-8 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              Éditeur dédié
            </span>
          ) : (
            <span className="me-8 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Studio
            </span>
          )}
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-white">{s.label}</h3>
        <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">{s.description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {s.ready ? 'Gérer' : 'Ouvrir dans le Studio'}
          <Icons.ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* En-tête + actions rapides */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tableau de bord</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Gestion complète du contenu — épinglez vos sections les plus utilisées et recherchez en un instant.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Icons.ExternalLink className="h-4 w-4" /> Voir le site
          </Link>
          <Link
            href={STUDIO_URL}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Icons.Database className="h-4 w-4" /> Studio complet
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative mb-8">
        <Icons.Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une section (ex : médecins, horaires, hero…)"
          aria-label="Rechercher une section"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 ps-10 pe-4 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Raccourcis (favoris) */}
      {mounted && favSections.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
            <Icons.Star className="h-4 w-4 fill-amber-400 text-amber-400" /> Raccourcis
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favSections.map((s) => (
              <Card key={`fav-${s.key}`} s={s} />
            ))}
          </div>
        </section>
      )}

      {/* Groupes */}
      {GROUPS.map((group) => {
        const items = adminSections.filter((s) => s.group === group && match(s))
        if (items.length === 0) return null
        return (
          <section key={group} className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">{group}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <Card key={s.key} s={s} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Aucun résultat */}
      {q && adminSections.filter(match).length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          <Icons.SearchX className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          Aucune section ne correspond à « {query} ».
        </div>
      )}
    </div>
  )
}

/** Classe de l'étoile favori selon l'état. */
function cnFav(isFav: boolean) {
  return `absolute end-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
    isFav
      ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
      : 'text-slate-300 hover:bg-slate-100 hover:text-amber-500 dark:text-slate-600 dark:hover:bg-slate-800'
  }`
}
