'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import { Text, Lines, ImagePicker, Field, useToast, inputCls } from '@/components/admin/ui'
import { Reorder } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { urlFor } from '@/sanity/lib/image'

const PHOTO_CATS = [
  { value: 'imagerie', label: 'Imagerie médicale' },
  { value: 'nucleaire', label: 'Médecine nucléaire' },
  { value: 'bloc', label: 'Bloc opératoire' },
  { value: 'laboratoire', label: 'Laboratoire d\'analyses' },
  { value: 'hospitalisation', label: 'Hospitalisation' },
  { value: 'consultation', label: 'Consultation & exploration' },
  { value: 'accueil', label: 'Espaces d\'accueil' },
]

const EQ_CATS = [
  { value: 'imaging', label: 'Imagerie' },
  { value: 'laboratory', label: 'Laboratoire' },
  { value: 'facility', label: 'Infrastructure' },
  { value: 'surgery', label: 'Chirurgie' },
]

export default function GaleriePage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [equipements, setEquipements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPhoto, setEditingPhoto] = useState<any | null>(null)
  const [editingEq, setEditingEq] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'photos'|'equipments'>('photos')
  const { toast } = useToast()

  const load = () => {
    fetch('/api/admin/galerie')
      .then((r) => r.json())
      .then((res) => {
        setPhotos(res.photos || [])
        setEquipements(res.equipements || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const handleSave = async (doc: any, isPhoto: boolean) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/galerie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Succès', description: 'Enregistré.' })
      if (isPhoto) setEditingPhoto(null)
      else setEditingEq(null)
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet élément ?')) return
    try {
      await fetch(`/api/admin/galerie?id=${id}`, { method: 'DELETE' })
      toast({ title: 'Succès', description: 'Élément supprimé.' })
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression.', variant: 'destructive' })
    }
  }

  const handleReorder = async (newOrder: any[], type: 'photos'|'equipments') => {
    if (type === 'photos') setPhotos(newOrder)
    else setEquipements(newOrder)
    
    newOrder.forEach((it, i) => {
      if (it.order !== i) {
        it.order = i
        fetch('/api/admin/galerie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: it._id, _type: it._type, order: i }),
        })
      }
    })
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" /></div>

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Galerie & Équipements</h1>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'photos' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            onClick={() => setTab('photos')}
          >
            Photos d'installations
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'equipments' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            onClick={() => setTab('equipments')}
          >
            Équipements médicaux
          </button>
        </div>
      </div>

      {tab === 'photos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditingPhoto({ _type: 'facilityPhoto', active: true, category: 'accueil' })} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Ajouter une photo
            </Button>
          </div>
          <Reorder.Group axis="y" values={photos} onReorder={(arr) => handleReorder(arr, 'photos')} className="grid gap-3">
            {photos.map((it) => (
              <Reorder.Item key={it._id} value={it}>
                <Card className="overflow-hidden p-3 flex gap-4 items-center">
                  <GripVertical className="h-5 w-5 text-slate-300 cursor-grab" />
                  <div className="h-16 w-24 shrink-0 rounded bg-slate-100 overflow-hidden">
                    {it.image?._ref ? <img src={urlFor(it.image).width(200).url()} className="h-full w-full object-cover" alt="" /> : <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">Aucune</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{it.title}</p>
                    <p className="text-xs text-slate-500 truncate">{PHOTO_CATS.find(c => c.value === it.category)?.label}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setEditingPhoto(it)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(it._id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {tab === 'equipments' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditingEq({ _type: 'equipment', category: 'facility', features: [], features_ar: [] })} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Ajouter un équipement
            </Button>
          </div>
          <Reorder.Group axis="y" values={equipements} onReorder={(arr) => handleReorder(arr, 'equipments')} className="grid gap-3">
            {equipements.map((it) => (
              <Reorder.Item key={it._id} value={it}>
                <Card className="overflow-hidden p-3 flex gap-4 items-center">
                  <GripVertical className="h-5 w-5 text-slate-300 cursor-grab" />
                  <div className="h-16 w-16 shrink-0 rounded bg-slate-100 overflow-hidden flex items-center justify-center">
                    {it.image?._ref ? <img src={urlFor(it.image).width(150).url()} className="max-h-full object-contain" alt="" /> : <div className="text-xs text-slate-400">Aucune</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{it.name} <span className="text-xs text-slate-400 font-normal">({it.brand})</span></p>
                    <p className="text-xs text-slate-500 truncate">{EQ_CATS.find(c => c.value === it.category)?.label}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setEditingEq(it)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(it._id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Modal Photo */}
      <Dialog.Root open={!!editingPhoto} onOpenChange={(o) => !o && setEditingPhoto(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold mb-6">Photo d'installation</Dialog.Title>
            {editingPhoto && (
              <div className="space-y-4">
                <Field label="Image">
                  <ImagePicker val={editingPhoto.image?._ref} onChange={(ref) => setEditingPhoto({ ...editingPhoto, image: ref ? { _ref: ref } : null })} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Titre (FR)"><Text val={editingPhoto.title} onChange={(v) => setEditingPhoto({ ...editingPhoto, title: v })} /></Field>
                  <Field label="Titre (AR)"><Text val={editingPhoto.title_ar} onChange={(v) => setEditingPhoto({ ...editingPhoto, title_ar: v })} dir="rtl" /></Field>
                  <Field label="Description (FR)"><Lines val={editingPhoto.description} onChange={(v) => setEditingPhoto({ ...editingPhoto, description: v })} rows={2} /></Field>
                  <Field label="Description (AR)"><Lines val={editingPhoto.description_ar} onChange={(v) => setEditingPhoto({ ...editingPhoto, description_ar: v })} rows={2} dir="rtl" /></Field>
                </div>
                <Field label="Catégorie">
                  <select className={inputCls} value={editingPhoto.category} onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}>
                    {PHOTO_CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Field>
                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input type="checkbox" checked={editingPhoto.featured} onChange={(e) => setEditingPhoto({ ...editingPhoto, featured: e.target.checked })} className="rounded border-slate-300 text-emerald-600" />
                  <span>Mise en avant (Grande tuile)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingPhoto.active} onChange={(e) => setEditingPhoto({ ...editingPhoto, active: e.target.checked })} className="rounded border-slate-300 text-emerald-600" />
                  <span>Affiché sur le site</span>
                </label>
                
                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setEditingPhoto(null)}>Annuler</Button>
                  <Button onClick={() => handleSave(editingPhoto, true)} disabled={saving} className="bg-emerald-600">Enregistrer</Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal Equipment */}
      <Dialog.Root open={!!editingEq} onOpenChange={(o) => !o && setEditingEq(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold mb-6">Équipement médical</Dialog.Title>
            {editingEq && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nom (FR)"><Text val={editingEq.name} onChange={(v) => setEditingEq({ ...editingEq, name: v })} /></Field>
                  <Field label="Nom (AR)"><Text val={editingEq.name_ar} onChange={(v) => setEditingEq({ ...editingEq, name_ar: v })} dir="rtl" /></Field>
                  <Field label="Marque"><Text val={editingEq.brand} onChange={(v) => setEditingEq({ ...editingEq, brand: v })} /></Field>
                  <Field label="Modèle"><Text val={editingEq.model} onChange={(v) => setEditingEq({ ...editingEq, model: v })} /></Field>
                  <Field label="Description (FR)"><Lines val={editingEq.description} onChange={(v) => setEditingEq({ ...editingEq, description: v })} rows={2} /></Field>
                  <Field label="Description (AR)"><Lines val={editingEq.description_ar} onChange={(v) => setEditingEq({ ...editingEq, description_ar: v })} rows={2} dir="rtl" /></Field>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Catégorie">
                    <select className={inputCls} value={editingEq.category} onChange={(e) => setEditingEq({ ...editingEq, category: e.target.value })}>
                      {EQ_CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Icône (ex: Scan, Brain, Activity)">
                    <Text val={editingEq.icon} onChange={(v) => setEditingEq({ ...editingEq, icon: v })} />
                  </Field>
                </div>

                <Field label="Photo">
                  <ImagePicker val={editingEq.image?._ref} onChange={(ref) => setEditingEq({ ...editingEq, image: ref ? { _ref: ref } : null })} />
                </Field>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setEditingEq(null)}>Annuler</Button>
                  <Button onClick={() => handleSave(editingEq, false)} disabled={saving} className="bg-emerald-600">Enregistrer</Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}
