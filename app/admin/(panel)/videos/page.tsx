'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Film,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Link2,
  Upload,
} from 'lucide-react'
import { Text, Lines, ImagePicker, FilePicker, Field, useToast, inputCls } from '@/components/admin/ui'
import { Reorder } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { urlFor } from '@/sanity/lib/image'

const VIDEO_CATS = [
  { title: 'Général', value: 'general' },
  { title: 'Podcast / Interview', value: 'podcast' },
  { title: 'Imagerie Médicale', value: 'imagerie' },
  { title: 'Médecine Nucléaire', value: 'nucleaire' },
  { title: 'Pôle Dentaire', value: 'dentaire' },
  { title: 'Maternité & Pédiatrie', value: 'maternite' },
  { title: 'Urgences & Réanimation', value: 'urgences' },
  { title: 'Chirurgie', value: 'chirurgie' },
  { title: 'Laboratoire', value: 'laboratoire' },
  { title: 'Autre', value: 'autre' },
]

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function formatSize(bytes?: number) {
  if (!bytes) return null
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} Go`
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} Mo`
  return `${Math.round(bytes / 1024)} Ko`
}

export default function VideosPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [sharing, setSharing] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const load = () => {
    fetch('/api/admin/videos')
      .then((r) => r.json())
      .then((res) => {
        setItems(res.videos || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async (doc: any) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Succès', description: 'Vidéo enregistrée.' })
      setEditing(null)
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette vidéo ?')) return
    try {
      await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' })
      toast({ title: 'Succès', description: 'Vidéo supprimée.' })
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression.', variant: 'destructive' })
    }
  }

  const handleReorder = async (newOrder: any[]) => {
    setItems(newOrder)
    newOrder.forEach((it, i) => {
      if (it.order !== i) {
        it.order = i
        fetch('/api/admin/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: it._id, order: i }),
        })
      }
    })
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback pour les anciens navigateurs
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
      </div>
    )

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vidéothèque
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {items.length} vidéo{items.length !== 1 ? 's' : ''} · Glissez pour réorganiser
          </p>
        </div>
        <Button
          onClick={() => setEditing({ active: true, category: 'general' })}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter une vidéo
        </Button>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="grid gap-3">
        {items.map((it) => (
          <Reorder.Item key={it._id} value={it}>
            <Card className="cursor-default overflow-hidden transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4 p-3">
                <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-slate-300 active:cursor-grabbing" />

                {/* Miniature */}
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-slate-100">
                  {it.poster?._ref ? (
                    <img
                      src={urlFor(it.poster).width(200).url()}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Film className="h-6 w-6 text-slate-300" />
                    </div>
                  )}
                  {/* Badge source */}
                  {it.externalUrl && (
                    <span className="absolute bottom-1 right-1 rounded bg-blue-600 px-1 py-0.5 text-[9px] font-bold uppercase text-white">
                      URL
                    </span>
                  )}
                </div>

                {/* Infos */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {it.title}
                    </h3>
                    {!it.active && (
                      <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                        Inactif
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="font-medium">
                      {VIDEO_CATS.find((c) => c.value === it.category)?.title || it.category}
                    </span>
                    {it.fileSize && (
                      <span className="text-slate-400">{formatSize(it.fileSize)}</span>
                    )}
                    {it.externalUrl && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <Link2 className="h-3 w-3" />
                        URL externe
                      </span>
                    )}
                    {it.description && (
                      <span className="truncate text-slate-400">{it.description}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  {it.videoUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => { setSharing(it); setCopied(false) }}
                      title="Partager"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={() => setEditing(it)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(it._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {items.length === 0 && (
        <div className="py-12 text-center text-slate-500">Aucune vidéo configurée.</div>
      )}

      {/* ─── Dialog : Partage ─────────────────────────────────────────────── */}
      <Dialog.Root
        open={!!sharing}
        onOpenChange={(o) => {
          if (!o) setSharing(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <Dialog.Title className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
              Partager la vidéo
            </Dialog.Title>
            {sharing && (
              <>
                <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                  {sharing.title}
                  {sharing.fileSize && (
                    <span className="ml-2 text-xs text-slate-400">
                      · {formatSize(sharing.fileSize)}
                    </span>
                  )}
                </p>

                {/* URL + copier */}
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400">
                    {sharing.videoUrl}
                  </span>
                  <button
                    onClick={() => copyUrl(sharing.videoUrl)}
                    className="flex shrink-0 items-center gap-1.5 rounded-md bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? 'Copié !' : 'Copier'}
                  </button>
                </div>

                {/* Boutons de partage */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${sharing.title}\n${sharing.videoUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 rounded-xl bg-[#25D366] px-3 py-3.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <WhatsAppIcon className="h-6 w-6" />
                    WhatsApp
                  </a>
                  <a
                    href={sharing.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 rounded-xl bg-slate-100 px-3 py-3.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <ExternalLink className="h-6 w-6" />
                    Ouvrir
                  </a>
                  <a
                    href={sharing.videoUrl}
                    download={`${sharing.title || 'video'}.mp4`}
                    className="flex flex-col items-center gap-2 rounded-xl bg-slate-100 px-3 py-3.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Download className="h-6 w-6" />
                    Télécharger
                  </a>
                </div>

                {/* Info taille */}
                {sharing.fileSize && sharing.fileSize > 100 * 1024 * 1024 && (
                  <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                    Vidéo haute résolution ({formatSize(sharing.fileSize)}) — utilisez le lien direct plutôt que le téléchargement en cas de partage mobile.
                  </p>
                )}

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setSharing(null)}>
                    Fermer
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ─── Dialog : Édition ─────────────────────────────────────────────── */}
      <Dialog.Root open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <Dialog.Title className="mb-6 text-xl font-bold">
              {editing?._id ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
            </Dialog.Title>

            {editing && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Colonne gauche : média */}
                  <div className="space-y-4">
                    <Field label="Affiche (image de couverture)">
                      <ImagePicker
                        val={editing.poster?._ref}
                        onChange={(ref) =>
                          setEditing({ ...editing, poster: ref ? { _ref: ref } : null })
                        }
                        ratio="aspect-video"
                      />
                    </Field>

                    {/* Séparateur "upload OU URL" */}
                    <div className="space-y-3">
                      <Field label="Option 1 — Upload fichier (max 500 Mo)">
                        <FilePicker
                          val={editing.videoFile?._ref || editing.videoRef}
                          onChange={(ref) =>
                            setEditing({ ...editing, videoFile: ref ? { _ref: ref } : null })
                          }
                          accept="video/mp4,video/webm"
                          label="Sélectionner une vidéo MP4 / WebM"
                        />
                      </Field>

                      <div className="relative flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          ou
                        </span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                      </div>

                      <div>
                        <div className="mb-1 flex items-center gap-1.5">
                          <Link2 className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Option 2 — URL externe directe
                          </span>
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Recommandé HD
                          </span>
                        </div>
                        <div>
                        <input
                          type="url"
                          placeholder="https://... (MP4 ou WebM direct)"
                          value={editing.externalUrl || ''}
                          onChange={(e) =>
                            setEditing({ ...editing, externalUrl: e.target.value || null })
                          }
                          className={inputCls}
                        />
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                          Copiez le lien direct de la vidéo hébergée sur votre CDN, Google Drive, Dropbox, etc. Prioritaire sur le fichier uploadé. Idéal pour les vidéos haute résolution sans limite de taille.
                        </p>
                        </div>
                      </div>

                      {editing.videoUrl && (
                        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800/30 dark:bg-emerald-900/10">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                              Vidéo active
                            </p>
                            <p className="mt-0.5 truncate text-xs text-emerald-600 dark:text-emerald-500/70">
                              {editing.videoUrl}
                            </p>
                          </div>
                          <a
                            href={editing.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                          >
                            <ExternalLink className="h-4 w-4 text-emerald-600" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Colonne droite : métadonnées */}
                  <div className="space-y-4">
                    <Field label="Catégorie">
                      <select
                        className={inputCls}
                        value={editing.category || 'general'}
                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      >
                        {VIDEO_CATS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Titre (FR)">
                      <Text
                        val={editing.title}
                        onChange={(v) => setEditing({ ...editing, title: v })}
                      />
                    </Field>
                    <Field label="Titre (AR)">
                      <Text
                        val={editing.title_ar}
                        onChange={(v) => setEditing({ ...editing, title_ar: v })}
                        dir="rtl"
                      />
                    </Field>
                    <Field label="Description (FR)">
                      <Lines
                        val={editing.description}
                        onChange={(v) => setEditing({ ...editing, description: v })}
                        rows={3}
                      />
                    </Field>
                    <Field label="Description (AR)">
                      <Lines
                        val={editing.description_ar}
                        onChange={(v) => setEditing({ ...editing, description_ar: v })}
                        rows={3}
                        dir="rtl"
                      />
                    </Field>
                    <label className="flex cursor-pointer items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        checked={editing.active}
                        onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                      />
                      <span className="text-sm">Actif (visible sur le site)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-4">
                  <Button variant="outline" onClick={() => setEditing(null)}>
                    Annuler
                  </Button>
                  <Button
                    onClick={() => handleSave(editing)}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
