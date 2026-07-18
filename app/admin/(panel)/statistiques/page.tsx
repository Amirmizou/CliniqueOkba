'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, RotateCcw, Undo2, Eye, Users, CalendarDays, TrendingUp, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useToast } from '@/components/admin/ui'

interface DayCounts {
  views: number
  visits: number
}

interface Stats {
  totalViews: number
  totalVisits: number
  today: DayCounts
  last7: DayCounts
  last30: DayCounts
  since: string | null
  series: Array<{ day: string; views: number; visits: number }>
  topPaths: Array<{ path: string; views: number }>
  devices?: {
    today: DeviceCounts
    last7: DeviceCounts
    last30: DeviceCounts
    total: DeviceCounts
  }
}

type DeviceCounts = { desktop: DayCounts; mobile: DayCounts; tablet: DayCounts }

const DEVICE_PERIODS = [
  { key: 'today', label: "Aujourd'hui" },
  { key: 'last7', label: '7 jours' },
  { key: 'last30', label: '30 jours' },
  { key: 'total', label: 'Total' },
] as const

type DevicePeriod = (typeof DEVICE_PERIODS)[number]['key']

const DEVICE_LABELS = [
  { key: 'desktop', label: 'Ordinateur', icon: Monitor, color: 'bg-emerald-500' },
  { key: 'mobile', label: 'Téléphone', icon: Smartphone, color: 'bg-sky-500' },
  { key: 'tablet', label: 'Tablette', icon: Tablet, color: 'bg-amber-500' },
] as const

const nf = new Intl.NumberFormat('fr-FR')

function formatDay(day: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }) {
  return new Intl.DateTimeFormat('fr-FR', { ...opts, timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`))
}

function Stat({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Icon className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </CardContent>
    </Card>
  )
}

export default function StatistiquesPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [devicePeriod, setDevicePeriod] = useState<DevicePeriod>('last30')
  const [canUndo, setCanUndo] = useState(false)
  const { toast } = useToast()

  const load = () =>
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((res) => {
        setStats(res.stats ?? null)
        setCanUndo(res.canUndo === true)
      })
      .catch(() => toast({ title: 'Erreur', description: 'Statistiques indisponibles.', variant: 'destructive' }))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
    // Rafraîchissement pendant que la page reste ouverte.
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReset = async () => {
    if (!confirm('Remettre tous les compteurs de visites à zéro ? Une sauvegarde est créée : vous pourrez annuler juste après.')) return
    try {
      const res = await fetch('/api/admin/stats', { method: 'DELETE' })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setStats(json.stats)
      setCanUndo(json.canUndo === true)
      toast({ title: 'Compteurs remis à zéro', description: 'Cliquez sur « Annuler » pour restaurer.' })
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de réinitialiser.', variant: 'destructive' })
    }
  }

  const handleUndo = async () => {
    try {
      const res = await fetch('/api/admin/stats', { method: 'POST' })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setStats(json.stats)
      setCanUndo(json.canUndo === true)
      toast({ title: 'Réinitialisation annulée', description: 'Les compteurs ont été restaurés.' })
    } catch {
      toast({ title: 'Erreur', description: 'Aucune sauvegarde à restaurer.', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!stats) return <p className="p-8 text-center text-slate-500">Statistiques indisponibles.</p>

  const maxViews = Math.max(1, ...stats.series.map((d) => d.views))

  const devices = stats.devices?.[devicePeriod]
  const deviceTotal = DEVICE_LABELS.reduce((sum, d) => sum + (devices?.[d.key]?.visits ?? 0), 0)
  const deviceRows = DEVICE_LABELS.map((d) => {
    const visits = devices?.[d.key]?.visits ?? 0
    const views = devices?.[d.key]?.views ?? 0
    return { ...d, visits, views, pct: deviceTotal ? Math.round((visits / deviceTotal) * 100) : 0 }
  }).sort((a, b) => b.visits - a.visits)

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Visites du site</h1>
          <p className="mt-1 text-sm text-slate-500">
            {stats.since ? `Mesuré depuis le ${formatDay(stats.since, { day: '2-digit', month: 'long', year: 'numeric' })}.` : 'Aucune visite enregistrée pour le moment.'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {canUndo && (
            <Button variant="default" onClick={handleUndo} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Undo2 className="h-4 w-4" />
              Annuler la réinitialisation
            </Button>
          )}
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CalendarDays} label="Aujourd'hui" value={nf.format(stats.today.visits)} hint={`${nf.format(stats.today.views)} pages vues`} />
        <Stat icon={TrendingUp} label="7 derniers jours" value={nf.format(stats.last7.visits)} hint={`${nf.format(stats.last7.views)} pages vues`} />
        <Stat icon={Users} label="30 derniers jours" value={nf.format(stats.last30.visits)} hint={`${nf.format(stats.last30.views)} pages vues`} />
        <Stat icon={Eye} label="Total" value={nf.format(stats.totalVisits)} hint={`${nf.format(stats.totalViews)} pages vues`} />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-2">
            <h2 className="text-lg font-semibold">Appareils utilisés</h2>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
              {DEVICE_PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setDevicePeriod(p.key)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    devicePeriod === p.key
                      ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {deviceTotal === 0 ? (
            <p className="py-8 text-center text-slate-500">Aucune donnée pour cette période.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {deviceRows.map((d) => (
                <div key={d.key} className="flex items-center gap-4">
                  <span className="flex w-32 shrink-0 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <d.icon className="h-4 w-4 shrink-0 text-slate-400" />
                    {d.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="w-36 shrink-0 text-end text-sm tabular-nums text-slate-500">
                    {nf.format(d.visits)} <span className="text-slate-400">({d.pct}%)</span>
                    <span className="ms-1 text-xs text-slate-400">· {nf.format(d.views)} pages</span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs text-slate-400">
            Répartition des visites sur la période choisie. Les iPad récents se déclarant comme des Mac,
            ils sont comptés en «&nbsp;Ordinateur&nbsp;».
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="border-b pb-2 text-lg font-semibold">30 derniers jours</h2>
          <div className="mt-6 flex h-40 items-end gap-1">
            {stats.series.map((d) => (
              <div key={d.day} className="group relative flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-emerald-500/80 transition-colors group-hover:bg-emerald-600"
                  style={{ height: `${Math.max(2, (d.views / maxViews) * 100)}%` }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[11px] text-white group-hover:block">
                  {formatDay(d.day)} · {nf.format(d.visits)} visites · {nf.format(d.views)} pages
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>{formatDay(stats.series[0].day)}</span>
            <span>{formatDay(stats.series[stats.series.length - 1].day)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="border-b pb-2 text-lg font-semibold">Pages les plus consultées</h2>
          {stats.topPaths.length === 0 ? (
            <p className="py-8 text-center text-slate-500">Aucune donnée pour le moment.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {stats.topPaths.map((p) => (
                <div key={p.path} className="flex items-center gap-4">
                  <span className="w-1/2 truncate text-sm font-medium text-slate-700 dark:text-slate-200">{p.path}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${(p.views / stats.topPaths[0].views) * 100}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-end text-sm tabular-nums text-slate-500">{nf.format(p.views)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400">
        «&nbsp;Visites&nbsp;» = sessions de navigation, «&nbsp;pages vues&nbsp;» = pages affichées. Les robots connus
        et les pages d&apos;administration ne sont pas comptés.
      </p>
    </div>
  )
}
