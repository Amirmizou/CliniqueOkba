'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import * as Icons from 'lucide-react'
import { adminSections, STUDIO_URL } from '@/lib/admin/sections'
import { cn } from '@/lib/utils'

const GROUPS = ['Accueil', 'Équipe & Pôles', 'Contenu', 'Configuration'] as const

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as any)[name] || Icons.Square
  return <C className={className} />
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  const query = q.trim().toLowerCase()
  const matches = (s: (typeof adminSections)[number]) =>
    !query || s.label.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)

  const NavLinks = () => (
    <nav className="flex flex-col gap-6">
      {/* Recherche rapide */}
      <div className="relative">
        <Icons.Search className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher…"
          aria-label="Rechercher une section"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 ps-8 pe-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      {GROUPS.map((group) => {
        const items = adminSections.filter((s) => s.group === group && matches(s))
        if (items.length === 0) return null
        return (
          <div key={group}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group}
            </p>
            <div className="flex flex-col gap-0.5">
              {items.map((s) => {
                const useNative = s.ready && s.href
                const href = useNative ? s.href! : STUDIO_URL
                const active = useNative ? pathname === s.href : false
                return (
                  <Link
                    key={s.key}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                    )}
                  >
                    <Icon name={s.icon} className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{s.label}</span>
                    {!s.ready && (
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        Studio
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Topbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Icons.Menu className="h-5 w-5" />
          </button>
          <Link href="/admin" className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Icons.HeartPulse className="h-4 w-4" />
            </span>
            <span className="text-sm">Clinique OKBA · Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex"
          >
            <Icons.ExternalLink className="h-4 w-4" />
            Voir le site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Icons.LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-screen-2xl">
        {/* Sidebar desktop */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:block">
          <NavLinks />
        </aside>

        {/* Sidebar mobile (overlay) */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 start-0 w-72 overflow-y-auto bg-white p-4 shadow-xl dark:bg-slate-900">
              <NavLinks />
            </aside>
          </div>
        )}

        {/* Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
