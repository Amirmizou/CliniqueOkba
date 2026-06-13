'use client'

import Link from 'next/link'
import * as Icons from 'lucide-react'
import { adminSections, STUDIO_URL } from '@/lib/admin/sections'

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as any)[name] || Icons.Square
  return <C className={className} />
}

const GROUPS = ['Accueil', 'Équipe & Pôles', 'Contenu', 'Configuration'] as const

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tableau de bord</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Gérez le contenu du site. Les sections marquées « Studio » s'ouvrent dans
          l'éditeur Sanity en attendant leur éditeur dédié.
        </p>
      </div>

      {GROUPS.map((group) => {
        const items = adminSections.filter((s) => s.group === group)
        if (items.length === 0) return null
        return (
          <section key={group} className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              {group}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => {
                const useNative = s.ready && s.href
                const href = useNative ? s.href! : STUDIO_URL
                const external = !useNative
                return (
                  <Link
                    key={s.key}
                    href={href}
                    {...(external ? { target: '_blank' } : {})}
                    className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        <Icon name={s.icon} className="h-5 w-5" />
                      </span>
                      {s.ready ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          Éditeur dédié
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Studio
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">{s.label}</h3>
                    <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">
                      {s.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {s.ready ? 'Gérer' : 'Ouvrir dans le Studio'}
                      <Icons.ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
