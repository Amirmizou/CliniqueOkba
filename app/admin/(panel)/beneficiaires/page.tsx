'use client'

import { useState, useEffect } from 'react'
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
  ImageIcon,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  CheckCheck,
  RotateCcw,
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
  family_members: Member[]
  status: string
  traite: boolean
  traite_at: string | null
  notes_admin: string | null
  created_at: string
  photoUrl: string | null
  documentUrl: string | null
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
  const { toast, ToastView } = useToast()

  // Chargement (debouncé). Ne dépend que des filtres primitifs : c'est ce qui
  // évite la boucle de rafraîchissement (le `toast` de useToast n'est pas stable
  // entre les rendus, il ne doit donc PAS figurer dans les dépendances).
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const qs = new URLSearchParams()
        if (organisme) qs.set('organisme', organisme)
        if (status) qs.set('status', status)
        if (traiteFilter) qs.set('traite', traiteFilter)
        if (search.trim()) qs.set('search', search.trim())
        const res = await fetch(`/api/admin/beneficiaires?${qs.toString()}`)
        if (!res.ok) throw new Error()
        const json = await res.json()
        if (cancelled) return
        setList(json.beneficiaries || [])
        setByOrganisme(json.byOrganisme || {})
      } catch {
        if (!cancelled)
          toast({ title: 'Erreur', description: 'Impossible de charger les bénéficiaires.', variant: 'destructive' })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisme, status, traiteFilter, search])

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
        <Button onClick={exportCsv} variant="outline">
          <Download className="me-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

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
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
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
                    b.traite
                      ? 'bg-emerald-50/60 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30'
                      : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900'
                  }
                >
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                    <span className="inline-flex items-center gap-2">
                      {b.traite && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                          <CheckCheck className="h-3 w-3" />
                          Traité
                        </span>
                      )}
                      {b.prenom} {b.nom}
                    </span>
                    {b.num_assure && <span className="ms-1 text-xs text-slate-400">#{b.num_assure}</span>}
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
                      <Button variant="ghost" size="icon-sm" onClick={() => setDetail(b)} aria-label="Détails">
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
                  <StatusBadge status={detail.status} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Info label="Téléphone" value={detail.telephone} />
                  <Info label="E-mail" value={detail.email} />
                  <Info label="N° assuré" value={detail.num_assure} />
                  <Info label="Adresse" value={detail.adresse} />
                </div>

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

                {/* Membres */}
                <div className="mt-5">
                  <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Membres de la famille ({detail.family_members?.length || 0})
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

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200">{value || '—'}</p>
    </div>
  )
}
