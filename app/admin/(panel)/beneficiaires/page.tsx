'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/admin/ui'
import {
  Loader2,
  Search,
  Download,
  Trash2,
  Eye,
  FileText,
  Receipt,
  ImageIcon,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  CheckCheck,
  RotateCcw,
  UserRound,
  Link2,
  Copy,
  Check,
  ChevronDown,
  Radio,
  RefreshCw,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

interface Member {
  nom?: string
  prenom?: string
  date_naissance?: string
  lien_parente?: string
}
interface Beneficiary {
  id: string
  organisme: string
  nom: string
  prenom: string
  telephone: string
  email: string | null
  adresse: string | null
  num_assure: string | null
  projet_dedie: string | null
  situation_familiale: string | null
  family_members: Member[]
  status: string
  traite: boolean
  traite_at: string | null
  notes_admin: string | null
  created_at: string
  photoUrl: string | null
  documentUrl: string | null
  justificatifUrl: string | null
}

const STATUS: Record<string, { label: string; cls: string; icon: any }> = {
  en_attente: { label: 'En attente', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400', icon: Clock },
  valide: { label: 'Validé', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400', icon: CheckCircle2 },
  rejete: { label: 'Rejeté', cls: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400', icon: XCircle },
}

const inputCls =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white'

const TRAITE_TABS: { key: string; label: string }[] = [
  { key: '', label: 'Tous' },
  { key: 'false', label: 'À traiter' },
  { key: 'true', label: 'Traités' },
]

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] || STATUS.en_attente
  const Icon = s.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  )
}

export default function BeneficiairesPage() {
  const [list, setList] = useState<Beneficiary[]>([])
  const [byOrganisme, setByOrganisme] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [organisme, setOrganisme] = useState('')
  const [status, setStatus] = useState('')
  const [traiteFilter, setTraiteFilter] = useState('')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<Beneficiary | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Beneficiary>>({})
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  // Temps réel
  const [liveSync, setLiveSync] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [newIds, setNewIds] = useState<string[]>([])
  const knownIdsRef = useRef<Set<string>>(new Set())
  const fingerprintRef = useRef<string | null>(null)
  const { toast, ToastView } = useToast()

  const handleEditChange = (field: keyof Beneficiary, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const saveEdit = async () => {
    if (!detail) return
    try {
      const res = await fetch('/api/admin/beneficiaires', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: detail.id,
          nom: editForm.nom,
          prenom: editForm.prenom,
          telephone: editForm.telephone,
          email: editForm.email,
          num_assure: editForm.num_assure,
          adresse: editForm.adresse,
          situation_familiale: editForm.situation_familiale,
        }),
      })
      if (!res.ok) throw new Error()
      
      // Update local state
      const updated = { ...detail, ...editForm } as Beneficiary
      setDetail(updated)
      setList((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
      setIsEditing(false)
      toast({ title: 'Succès', description: 'Les informations ont été modifiées.', variant: 'default' })
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    }
  }

  // Les filtres sont lus via une ref par le poller, pour ne pas le recréer à
  // chaque frappe dans la recherche.
  const filtersRef = useRef({ organisme, status, traiteFilter, search })
  const toastRef = useRef(toast)

  useEffect(() => {
    filtersRef.current = { organisme, status, traiteFilter, search }
    toastRef.current = toast
  })

  /** Charge la liste. `silent` = rafraîchissement temps réel (pas de spinner,
   *  pas de perte de la sélection en cours). */
  const load = useCallback(async (silent = false) => {
    const f = filtersRef.current
    if (!silent) setLoading(true)
    else setSyncing(true)
    try {
      const qs = new URLSearchParams()
      if (f.organisme) qs.set('organisme', f.organisme)
      if (f.status) qs.set('status', f.status)
      if (f.traiteFilter) qs.set('traite', f.traiteFilter)
      if (f.search.trim()) qs.set('search', f.search.trim())
      const res = await fetch(`/api/admin/beneficiaires?${qs.toString()}`)
      if (!res.ok) throw new Error()
      const json = await res.json()
      const next: Beneficiary[] = json.beneficiaries || []

      if (silent) {
        // Signale visuellement les inscriptions apparues depuis le dernier rendu.
        const known = knownIdsRef.current
        const fresh = next.filter((b) => !known.has(b.id)).map((b) => b.id)
        if (known.size > 0 && fresh.length > 0) {
          setNewIds((prev) => [...new Set([...prev, ...fresh])])
          toastRef.current({
            title: fresh.length > 1 ? `${fresh.length} nouvelles inscriptions` : 'Nouvelle inscription',
            description: 'La liste vient d’être mise à jour.',
          })
          // Le surlignage s'efface tout seul au bout de 30 s.
          setTimeout(() => setNewIds((prev) => prev.filter((id) => !fresh.includes(id))), 30_000)
        }
        // La sélection est conservée, mais purgée des lignes disparues.
        setSelectedIds((prev) => prev.filter((id) => next.some((b) => b.id === id)))
      } else {
        setSelectedIds([])
        setNewIds([])
      }

      knownIdsRef.current = new Set(next.map((b) => b.id))
      setList(next)
      setByOrganisme(json.byOrganisme || {})
      setLastSync(new Date())
      return true
    } catch {
      if (!silent)
        toastRef.current({
          title: 'Erreur',
          description: 'Impossible de charger les bénéficiaires.',
          variant: 'destructive',
        })
      return false
    } finally {
      if (!silent) setLoading(false)
      else setSyncing(false)
    }
  }, [])

  // Chargement (debouncé) au changement de filtre.
  useEffect(() => {
    const timer = setTimeout(() => {
      knownIdsRef.current = new Set() // évite de "découvrir" toute la liste filtrée
      load(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [organisme, status, traiteFilter, search, load])

  // Synchronisation temps réel : on interroge une sonde légère (compteur +
  // dernières dates) toutes les 10 s et on ne recharge la liste complète que si
  // l'empreinte a bougé. La sonde est suspendue quand l'onglet est en arrière-plan.
  useEffect(() => {
    if (!liveSync) return
    let stopped = false

    const tick = async () => {
      if (stopped || document.hidden) return
      try {
        const res = await fetch('/api/admin/beneficiaires?probe=1')
        if (!res.ok) return
        const fp = await res.json()
        const key = `${fp.count}|${fp.latest}|${fp.lastTraite}`
        if (fingerprintRef.current !== null && fingerprintRef.current !== key) {
          await load(true)
        }
        fingerprintRef.current = key
      } catch {
        /* réseau indisponible : on réessaiera au prochain tick */
      }
    }

    const interval = setInterval(tick, 10_000)
    // Reprise immédiate quand on revient sur l'onglet.
    const onVisible = () => {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    tick()

    return () => {
      stopped = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [liveSync, load])

  const changeStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/beneficiaires', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setList((l) => l.map((b) => (b.id === id ? { ...b, status: newStatus } : b)))
      setDetail((d) => (d && d.id === id ? { ...d, status: newStatus } : d))
      toast({ title: 'Statut mis à jour' })
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la mise à jour.', variant: 'destructive' })
    }
  }

  const bulkChangeStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/admin/beneficiaires', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setList((l) => l.map((b) => (selectedIds.includes(b.id) ? { ...b, status: newStatus } : b)))
      toast({ title: 'Statut mis à jour pour la sélection' })
      setSelectedIds([])
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la mise à jour groupée.', variant: 'destructive' })
    }
  }

  const toggleTraite = async (id: string, value: boolean) => {
    try {
      const res = await fetch('/api/admin/beneficiaires', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, traite: value }),
      })
      if (!res.ok) throw new Error()
      const now = value ? new Date().toISOString() : null
      // Si un filtre "À traiter"/"Traités" est actif et que la ligne ne
      // correspond plus, on la retire de la vue ; sinon on la met à jour.
      const dropFromView =
        (traiteFilter === 'false' && value === true) || (traiteFilter === 'true' && value === false)
      setList((l) =>
        dropFromView
          ? l.filter((b) => b.id !== id)
          : l.map((b) => (b.id === id ? { ...b, traite: value, traite_at: now } : b)),
      )
      setDetail((d) => (d && d.id === id ? { ...d, traite: value, traite_at: now } : d))
      toast({ title: value ? 'Marqué comme traité' : 'Rétabli — à traiter' })
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la mise à jour.', variant: 'destructive' })
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer définitivement ce bénéficiaire et ses fichiers ?')) return
    try {
      const res = await fetch('/api/admin/beneficiaires', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setList((l) => l.filter((b) => b.id !== id))
      setDetail(null)
      toast({ title: 'Supprimé' })
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression.', variant: 'destructive' })
    }
  }

  const exportCsv = () => {
    const qs = new URLSearchParams({ format: 'csv' })
    if (organisme) qs.set('organisme', organisme)
    if (status) qs.set('status', status)
    if (traiteFilter) qs.set('traite', traiteFilter)
    window.open(`/api/admin/beneficiaires?${qs.toString()}`, '_blank')
  }

  const organismes = Object.keys(byOrganisme).sort()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bénéficiaires</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Inscriptions des organismes conventionnés — {list.length} affiché(s)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Indicateur / interrupteur de synchronisation temps réel */}
          <button
            onClick={() => setLiveSync((v) => !v)}
            title={liveSync ? 'Désactiver la synchronisation temps réel' : 'Activer la synchronisation temps réel'}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              liveSync
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {liveSync ? (
              <span className="relative flex h-2 w-2">
                {!syncing && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
            ) : (
              <Radio className="h-3.5 w-3.5" />
            )}
            {liveSync ? 'Temps réel' : 'Temps réel désactivé'}
            {lastSync && liveSync && (
              <span className="text-emerald-600/70 dark:text-emerald-500/70">
                · {lastSync.toLocaleTimeString('fr-FR')}
              </span>
            )}
          </button>

          <Button
            onClick={() => load(true)}
            variant="outline"
            size="icon-sm"
            disabled={syncing}
            aria-label="Actualiser maintenant"
            title="Actualiser maintenant"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          </Button>

          <Button onClick={exportCsv} variant="outline">
            <Download className="me-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Liens de partage à destination des responsables d'organisme */}
      <ShareLinks toast={toast} />

      {/* Résumé par organisme */}
      {organismes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setOrganisme('')}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              !organisme ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Tous ({Object.values(byOrganisme).reduce((a, b) => a + b, 0)})
          </button>
          {organismes.map((o) => (
            <button
              key={o}
              onClick={() => setOrganisme(o)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                organisme === o ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {o} ({byOrganisme[o]})
            </button>
          ))}
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom, prénom, téléphone)…"
            className={`${inputCls} w-full ps-8`}
          />
        </div>

        {/* Filtre segmenté Traité */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
          {TRAITE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTraiteFilter(tab.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                traiteFilter === tab.key
                  ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-950 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="valide">Validé</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : list.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-slate-500">
            <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            Aucun bénéficiaire pour ces critères.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Actions groupées */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-800/30 dark:bg-emerald-900/20">
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                {selectedIds.length} sélectionné(s)
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => bulkChangeStatus('valide')} className="bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="me-1.5 h-4 w-4" /> Valider la sélection
                </Button>
                <Button size="sm" variant="outline" onClick={() => bulkChangeStatus('rejete')} className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50">
                  <XCircle className="me-1.5 h-4 w-4" /> Rejeter la sélection
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium w-10">
                    <input
                      type="checkbox"
                      checked={list.length > 0 && selectedIds.length === list.length}
                      onChange={(e) => setSelectedIds(e.target.checked ? list.map((b) => b.id) : [])}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">Bénéficiaire</th>
                <th className="px-4 py-3 font-medium">Organisme</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Famille</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {list.map((b) => (
                <tr
                  key={b.id}
                  className={
                    newIds.includes(b.id)
                      ? 'bg-amber-50 ring-1 ring-inset ring-amber-300 hover:bg-amber-100/70 dark:bg-amber-950/30 dark:ring-amber-700/50'
                      : b.traite
                        ? 'bg-emerald-50/60 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30'
                        : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                  }
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(b.id)}
                      onChange={(e) =>
                        setSelectedIds((prev) =>
                          e.target.checked ? [...prev, b.id] : prev.filter((id) => id !== b.id),
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 dark:border-slate-700 dark:bg-slate-800"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                    <div className="flex items-center gap-3">
                      {b.photoUrl ? (
                        <a href={b.photoUrl} target="_blank" rel="noreferrer" title="Voir la photo en grand" className="shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={b.photoUrl}
                            alt={`${b.prenom} ${b.nom}`}
                            className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200 transition hover:ring-2 hover:ring-emerald-500 dark:ring-slate-700"
                          />
                        </a>
                      ) : (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                          <UserRound className="h-5 w-5" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {newIds.includes(b.id) && (
                            <span className="inline-flex items-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                              Nouveau
                            </span>
                          )}
                          {b.traite && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                              <CheckCheck className="h-3 w-3" />
                              Traité
                            </span>
                          )}
                          <span className="truncate">
                            {b.prenom} {b.nom}
                          </span>
                        </div>
                        {b.num_assure && <span className="text-xs text-slate-400">#{b.num_assure}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.organisme}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.telephone}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.family_members?.length || 0}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(b.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant={b.traite ? 'default' : 'ghost'}
                        size="icon-sm"
                        onClick={() => toggleTraite(b.id, !b.traite)}
                        aria-label={b.traite ? 'Rétablir (à traiter)' : 'Marquer comme traité'}
                        title={b.traite ? 'Rétablir (à traiter)' : 'Marquer comme traité'}
                        className={b.traite ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-emerald-600'}
                      >
                        {b.traite ? <RotateCcw className="h-4 w-4" /> : <CheckCheck className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => { setDetail(b); setEditForm(b); setIsEditing(false); }} aria-label="Détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => remove(b.id)} aria-label="Supprimer">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Détail */}
      <Dialog.Root open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            {detail && (
              <>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <Dialog.Title className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                      {detail.prenom} {detail.nom}
                      {detail.traite && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold uppercase text-white">
                          <CheckCheck className="h-3 w-3" />
                          Traité
                        </span>
                      )}
                    </Dialog.Title>
                    <p className="text-sm text-slate-500">{detail.organisme}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={detail.status} />
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} aria-label="Modifier">
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </Button>
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Fermer la boîte de dialogue">
                        <XCircle className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300" />
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>

                {isEditing ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Prénom</label>
                      <input className={inputCls + ' w-full'} value={editForm.prenom ?? ''} onChange={e => handleEditChange('prenom', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Nom</label>
                      <input className={inputCls + ' w-full'} value={editForm.nom ?? ''} onChange={e => handleEditChange('nom', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Téléphone</label>
                      <input className={inputCls + ' w-full'} value={editForm.telephone ?? ''} onChange={e => handleEditChange('telephone', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">E-mail</label>
                      <input type="email" className={inputCls + ' w-full'} value={editForm.email ?? ''} onChange={e => handleEditChange('email', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">N° assuré</label>
                      <input className={inputCls + ' w-full'} value={editForm.num_assure ?? ''} onChange={e => handleEditChange('num_assure', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Adresse</label>
                      <input className={inputCls + ' w-full'} value={editForm.adresse ?? ''} onChange={e => handleEditChange('adresse', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Situation familiale</label>
                      <select className={inputCls + ' w-full'} value={editForm.situation_familiale ?? ''} onChange={e => handleEditChange('situation_familiale', e.target.value)}>
                        <option value="">(Non spécifié)</option>
                        <option value="celibataire">Célibataire</option>
                        <option value="marie">Marié(e)</option>
                      </select>
                    </div>
                    <div className="col-span-full mt-2 flex justify-end">
                      <Button onClick={saveEdit} className="bg-emerald-600 hover:bg-emerald-700">Enregistrer</Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Info label="Téléphone" value={detail.telephone} />
                    <Info label="E-mail" value={detail.email} />
                    <Info label="N° assuré" value={detail.num_assure} />
                    <Info label="Adresse" value={detail.adresse} />
                    <Info
                      label="Situation familiale"
                      value={
                        detail.situation_familiale === 'marie'
                          ? 'Marié(e)'
                          : detail.situation_familiale === 'celibataire'
                            ? 'Célibataire'
                            : null
                      }
                    />
                    {detail.projet_dedie && <Info label="Projet dédié" value={detail.projet_dedie} />}
                  </div>
                )}

                {/* Traitement */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Traitement du dossier</p>
                    <p className="text-xs text-slate-500">
                      {detail.traite
                        ? `Traité le ${detail.traite_at ? new Date(detail.traite_at).toLocaleString('fr-FR') : ''}`
                        : "Données pas encore reportées dans l'application métier."}
                    </p>
                  </div>
                  {detail.traite ? (
                    <Button size="sm" variant="outline" onClick={() => toggleTraite(detail.id, false)}>
                      <RotateCcw className="me-1.5 h-4 w-4" />
                      Rétablir (à traiter)
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => toggleTraite(detail.id, true)} className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCheck className="me-1.5 h-4 w-4" />
                      Marquer comme traité
                    </Button>
                  )}
                </div>

                {/* Membres (ayants droit) — à comparer avec la fiche familiale */}
                <div className="mt-5">
                  <h3 className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Ayants droit déclarés ({detail.family_members?.length || 0})
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                      À vérifier avec la fiche familiale
                    </span>
                  </h3>
                  {detail.family_members?.length ? (
                    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                      {detail.family_members.map((m, i) => (
                        <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="text-slate-700 dark:text-slate-200">
                            {m.prenom} {m.nom}
                          </span>
                          <span className="text-slate-400">
                            {[m.lien_parente, m.date_naissance].filter(Boolean).join(' · ')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400">Aucun membre renseigné.</p>
                  )}
                </div>

                {/* Fichiers */}
                <div className="mt-5 flex flex-wrap gap-3">
                  {detail.photoUrl && (
                    <a
                      href={detail.photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Voir la photo
                    </a>
                  )}
                  {detail.documentUrl && (
                    <a
                      href={detail.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <FileText className="h-4 w-4" />
                      Voir la fiche familiale
                    </a>
                  )}
                  {detail.justificatifUrl && (
                    <a
                      href={detail.justificatifUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Receipt className="h-4 w-4" />
                      Voir le justificatif de propriété
                    </a>
                  )}
                </div>

                {/* Actions statut */}
                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <Button
                    size="sm"
                    onClick={() => changeStatus(detail.id, 'valide')}
                    disabled={detail.status === 'valide'}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="me-1.5 h-4 w-4" />
                    Valider
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => changeStatus(detail.id, 'en_attente')}
                    disabled={detail.status === 'en_attente'}
                  >
                    <Clock className="me-1.5 h-4 w-4" />
                    En attente
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => changeStatus(detail.id, 'rejete')}
                    disabled={detail.status === 'rejete'}
                    className="text-red-600"
                  >
                    <XCircle className="me-1.5 h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(detail.id)} className="ms-auto text-red-500">
                    <Trash2 className="me-1.5 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ToastView />
    </div>
  )
}

/** Génère et copie des liens d'inscription pré-remplis par organisme, à partager
 *  avec les responsables (ex. lien SEACO qui saute l'étape de choix d'organisme). */
function ShareLinks({ toast }: { toast: (o: any) => void }) {
  const [organismes, setOrganismes] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)
  const [selected, setSelected] = useState<string>('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (loaded) return
    fetch('/api/beneficiaires')
      .then((r) => r.json())
      .then((j) => {
        const orgs = j.organismes || []
        setOrganismes(orgs)
        if (orgs.length > 0) setSelected(orgs[0])
      })
      .catch(() => setOrganismes([]))
      .finally(() => setLoaded(true))
  }, [loaded])

  const buildLink = (o: string) =>
    `${window.location.origin}/inscription-beneficiaire?org=${encodeURIComponent(o)}`

  const copy = async () => {
    if (!selected) return
    const link = buildLink(selected)
    try {
      await navigator.clipboard.writeText(link)
      setCopied(selected)
      toast({ title: 'Lien copié', description: `Lien pour ${selected} copié avec succès.` })
      setTimeout(() => setCopied((c) => (c === selected ? null : c)), 2500)
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de copier le lien.', variant: 'destructive' })
    }
  }

  return (
    <Card className="border-emerald-100/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 shadow-sm dark:border-emerald-900/30 dark:from-emerald-950/20 dark:to-teal-950/20 overflow-hidden relative">
      {/* Lueur décorative */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-200/20 to-transparent pointer-events-none dark:from-emerald-800/10" />
      
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 relative z-10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-900/40 dark:ring-emerald-800/50">
            <Link2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Liens de partage dédiés</h3>
            <p className="truncate text-xs text-emerald-700/80 dark:text-emerald-400/70">
              Générez un lien d'inscription pré-rempli pour un organisme spécifique.
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
            {!loaded ? (
              <div className="flex h-9 items-center justify-center px-4">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              </div>
            ) : organismes.length === 0 ? (
              <span className="text-xs text-slate-400">Aucun organisme configuré.</span>
            ) : (
              <>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    className="h-9 w-full sm:w-[220px] appearance-none rounded-lg border border-emerald-200 bg-white/90 pl-3 pr-8 text-sm font-medium text-emerald-950 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-800/60 dark:bg-slate-900/80 dark:text-emerald-100"
                    value={selected}
                    onChange={(e) => {
                      setSelected(e.target.value)
                      setCopied(null)
                    }}
                  >
                    {organismes.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600/60" />
                </div>
                
                <Button
                  size="sm"
                  onClick={copy}
                  disabled={!selected}
                  className={`h-9 shrink-0 shadow-sm transition-all ${
                    copied === selected
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700'
                  }`}
                >
                  {copied === selected ? (
                    <Check className="h-4 w-4 sm:mr-1.5" />
                  ) : (
                    <Copy className="h-4 w-4 sm:mr-1.5" />
                  )}
                  <span className="hidden sm:inline-block">
                    {copied === selected ? 'Copié !' : 'Copier'}
                  </span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200">{value || '—'}</p>
    </div>
  )
}
