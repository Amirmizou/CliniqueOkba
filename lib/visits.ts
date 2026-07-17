import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Compteur de visites maison, sans service externe.
 *
 * Les compteurs vivent en mémoire et sont écrits sur disque de façon différée
 * (fichier JSON unique, écriture atomique via un fichier temporaire + rename).
 * Le dossier est configurable par VISITS_DATA_DIR pour les hébergements où le
 * répertoire de l'application est en lecture seule.
 */

const DATA_DIR = process.env.VISITS_DATA_DIR || path.join(process.cwd(), '.data')
const FILE = path.join(DATA_DIR, 'visits.json')

/** Nombre de jours d'historique conservés. */
const RETENTION_DAYS = 400
/** Nombre max de chemins distincts suivis (garde-fou mémoire). */
const MAX_PATHS = 500
/** Délai d'écriture différée après une modification. */
const FLUSH_DELAY_MS = 5_000

export interface DayCounts {
  views: number
  visits: number
}

export interface VisitStore {
  version: 1
  totalViews: number
  totalVisits: number
  firstDay: string | null
  days: Record<string, DayCounts>
  paths: Record<string, number>
}

function emptyStore(): VisitStore {
  return { version: 1, totalViews: 0, totalVisits: 0, firstDay: null, days: {}, paths: {} }
}

let store: VisitStore | null = null
let loading: Promise<VisitStore> | null = null
let flushTimer: NodeJS.Timeout | null = null
let dirty = false

/** Date du jour (YYYY-MM-DD) dans le fuseau de la clinique. */
export function today(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Algiers',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/** Décale une clé de jour de `offset` jours (offset négatif = passé). */
export function shiftDay(day: string, offset: number): string {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

async function load(): Promise<VisitStore> {
  if (store) return store
  if (loading) return loading

  loading = (async () => {
    try {
      const raw = await fs.readFile(FILE, 'utf8')
      const parsed = JSON.parse(raw) as VisitStore
      store = { ...emptyStore(), ...parsed }
    } catch {
      // Fichier absent ou illisible : on repart d'un compteur vide.
      store = emptyStore()
    }
    loading = null
    return store
  })()

  return loading
}

async function flush(): Promise<void> {
  if (!store || !dirty) return
  const snapshot = JSON.stringify(store)
  dirty = false
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const tmp = `${FILE}.${process.pid}.tmp`
    await fs.writeFile(tmp, snapshot, 'utf8')
    await fs.rename(tmp, FILE)
  } catch (e) {
    dirty = true // on réessaiera à la prochaine écriture
    console.error('[visits] écriture impossible:', e)
  }
}

function scheduleFlush() {
  dirty = true
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    void flush()
  }, FLUSH_DELAY_MS)
  flushTimer.unref?.()
}

/** Supprime les jours hors fenêtre de rétention. */
function prune(s: VisitStore) {
  const limit = shiftDay(today(), -RETENTION_DAYS)
  for (const day of Object.keys(s.days)) {
    if (day < limit) delete s.days[day]
  }
}

/** Enregistre une page vue. `newVisit` = première page de la session. */
export async function recordView(rawPath: string, newVisit: boolean): Promise<void> {
  const s = await load()
  const day = today()

  const d = (s.days[day] ??= { views: 0, visits: 0 })
  d.views += 1
  s.totalViews += 1
  if (newVisit) {
    d.visits += 1
    s.totalVisits += 1
  }
  s.firstDay ??= day

  const key = normalizePath(rawPath)
  if (s.paths[key] !== undefined || Object.keys(s.paths).length < MAX_PATHS) {
    s.paths[key] = (s.paths[key] || 0) + 1
  }

  prune(s)
  scheduleFlush()
}

/** Normalise un chemin : sans query, sans slash final, tronqué. */
export function normalizePath(input: string): string {
  let p = (input || '/').split('?')[0].split('#')[0]
  if (!p.startsWith('/')) p = `/${p}`
  if (p.length > 1) p = p.replace(/\/+$/, '') || '/'
  return p.slice(0, 120)
}

export interface VisitsSummary {
  totalViews: number
  totalVisits: number
  today: DayCounts
  last7: DayCounts
  last30: DayCounts
  since: string | null
  /** 30 derniers jours, du plus ancien au plus récent. */
  series: Array<{ day: string; views: number; visits: number }>
  topPaths: Array<{ path: string; views: number }>
}

function sumRange(s: VisitStore, from: string, to: string): DayCounts {
  let views = 0
  let visits = 0
  for (const [day, c] of Object.entries(s.days)) {
    if (day >= from && day <= to) {
      views += c.views
      visits += c.visits
    }
  }
  return { views, visits }
}

export async function getSummary(): Promise<VisitsSummary> {
  const s = await load()
  const day = today()

  const series: VisitsSummary['series'] = []
  for (let i = 29; i >= 0; i--) {
    const d = shiftDay(day, -i)
    const c = s.days[d] || { views: 0, visits: 0 }
    series.push({ day: d, views: c.views, visits: c.visits })
  }

  const topPaths = Object.entries(s.paths)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  return {
    totalViews: s.totalViews,
    totalVisits: s.totalVisits,
    today: s.days[day] || { views: 0, visits: 0 },
    last7: sumRange(s, shiftDay(day, -6), day),
    last30: sumRange(s, shiftDay(day, -29), day),
    since: s.firstDay,
    series,
    topPaths,
  }
}

/** Remet tous les compteurs à zéro. */
export async function resetVisits(): Promise<void> {
  store = emptyStore()
  scheduleFlush()
  await flush()
}
