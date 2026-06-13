'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, Pencil, Trash2, GripVertical, Film } from 'lucide-react'
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
  { title: 'Autre', value: 'autre' }
]

export default function VideosPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
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

  useEffect(() => { load() }, [])

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

  if (loading) return <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" /></div>

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Vidéothèque</h1>
        <Button onClick={() => setEditing({ active: true, category: 'general' })} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Ajouter une vidéo
        </Button>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="grid gap-3">
        {items.map((it) => (
          <Reorder.Item key={it._id} value={it}>
            <Card className="cursor-default overflow-hidden">
              <div className="flex items-center p-3 gap-4">
                <GripVertical className="h-5 w-5 text-slate-300 cursor-grab active:cursor-grabbing" />
                <div className="h-16 w-24 shrink-0 rounded bg-slate-100 overflow-hidden relative group">
                  {it.poster?._ref ? (
                    <img src={urlFor(it.poster).width(200).url()} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-slate-400"><Film className="h-6 w-6 opacity-50" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{it.title}</h3>
                    {!it.active && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Inactif</span>}
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-slate-500">
                    <span className="font-medium">{VIDEO_CATS.find(c => c.value === it.category)?.title || it.category}</span>
                    <span className="truncate">{it.description}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEditing(it)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(it._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {items.length === 0 && (
        <div className="text-center py-12 text-slate-500">Aucune vidéo configurée.</div>
      )}

      {/* Modal Edition */}
      <Dialog.Root open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold mb-6">
              {editing?._id ? 'Modifier la vidéo' : 'Ajouter une vidéo'}
            </Dialog.Title>
            
            {editing && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Field label="Affiche de la vidéo (Image de couverture)">
                      <ImagePicker val={editing.poster?._ref} onChange={(ref) => setEditing({ ...editing, poster: ref ? { _ref: ref } : null })} ratio="aspect-video" />
                    </Field>
                    <Field label="Fichier Vidéo (MP4 / WebM)">
                      <FilePicker val={editing.videoFile?._ref || editing.videoRef} onChange={(ref) => setEditing({ ...editing, videoFile: ref ? { _ref: ref } : null })} accept="video/mp4,video/webm" label="Sélectionner une vidéo" />
                    </Field>
                    {editing.videoUrl && (
                      <div className="p-3 bg-slate-50 rounded text-xs text-slate-500 break-all">
                        <strong>URL actuelle:</strong> {editing.videoUrl}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Field label="Catégorie">
                      <select 
                        className={inputCls} 
                        value={editing.category || 'general'} 
                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      >
                        {VIDEO_CATS.map(c => <option key={c.value} value={c.value}>{c.title}</option>)}
                      </select>
                    </Field>
                    <Field label="Titre (FR)"><Text val={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} /></Field>
                    <Field label="Titre (AR)"><Text val={editing.title_ar} onChange={(v) => setEditing({ ...editing, title_ar: v })} dir="rtl" /></Field>
                    
                    <Field label="Description (FR)"><Lines val={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} rows={3} /></Field>
                    <Field label="Description (AR)"><Lines val={editing.description_ar} onChange={(v) => setEditing({ ...editing, description_ar: v })} rows={3} dir="rtl" /></Field>
                    
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                      <span>Actif (visible sur le site)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
                  <Button onClick={() => handleSave(editing)} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
