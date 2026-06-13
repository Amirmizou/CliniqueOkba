'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Save, Plus, Trash2, Pencil, GripVertical } from 'lucide-react'
import { Text, Lines, ImagePicker, Field, useToast, inputCls } from '@/components/admin/ui'
import { Reorder } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { urlFor } from '@/sanity/lib/image'

export default function SectionsPage() {
  const [data, setData] = useState<any>({ about: null, homeCare: null, contents: [], testimonials: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'about'|'homeCare'|'testimonials'|'contents'>('about')
  const { toast } = useToast()

  const [editingContent, setEditingContent] = useState<any | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null)

  const load = () => {
    fetch('/api/admin/sections')
      .then((r) => r.json())
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const handleSaveDoc = async (doc: any, customSuccessMsg = 'Enregistré.') => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Succès', description: customSuccessMsg })
      setEditingContent(null)
      setEditingTestimonial(null)
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ?')) return
    try {
      await fetch(`/api/admin/sections?id=${id}`, { method: 'DELETE' })
      toast({ title: 'Succès', description: 'Élément supprimé.' })
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression.', variant: 'destructive' })
    }
  }

  const handleReorderTestimonials = async (newOrder: any[]) => {
    setData({ ...data, testimonials: newOrder })
    newOrder.forEach((it, i) => {
      if (it.order !== i) {
        it.order = i
        fetch('/api/admin/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: it._id, _type: it._type, order: i }),
        })
      }
    })
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" /></div>

  const about = data.about || { _type: 'aboutSection' }
  const homeCare = data.homeCare || { _type: 'homeCare' }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sections d'accueil</h1>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'about' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`} onClick={() => setTab('about')}>À Propos</button>
          <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'homeCare' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`} onClick={() => setTab('homeCare')}>Soins à domicile</button>
          <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'testimonials' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`} onClick={() => setTab('testimonials')}>Témoignages</button>
          <button className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'contents' ? 'bg-white dark:bg-slate-900 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`} onClick={() => setTab('contents')}>Titres des sections</button>
        </div>
      </div>

      {tab === 'about' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Titre (FR)"><Text val={about.title} onChange={(v) => setData({ ...data, about: { ...about, title: v } })} /></Field>
              <Field label="Titre (AR)"><Text val={about.title_ar} onChange={(v) => setData({ ...data, about: { ...about, title_ar: v } })} dir="rtl" /></Field>
              <Field label="Sous-titre (FR)"><Text val={about.subtitle} onChange={(v) => setData({ ...data, about: { ...about, subtitle: v } })} /></Field>
              <Field label="Sous-titre (AR)"><Text val={about.subtitle_ar} onChange={(v) => setData({ ...data, about: { ...about, subtitle_ar: v } })} dir="rtl" /></Field>
              <Field label="Description (FR)"><Lines val={about.description} onChange={(v) => setData({ ...data, about: { ...about, description: v.join('\n') } })} rows={4} /></Field>
              <Field label="Description (AR)"><Lines val={about.description_ar} onChange={(v) => setData({ ...data, about: { ...about, description_ar: v.join('\n') } })} rows={4} dir="rtl" /></Field>
              <Field label="Mission (FR)"><Lines val={about.mission} onChange={(v) => setData({ ...data, about: { ...about, mission: v.join('\n') } })} rows={3} /></Field>
              <Field label="Mission (AR)"><Lines val={about.mission_ar} onChange={(v) => setData({ ...data, about: { ...about, mission_ar: v.join('\n') } })} rows={3} dir="rtl" /></Field>
              <div className="col-span-2">
                <Field label="Image Principale">
                  <ImagePicker val={about.image?._ref} onChange={(ref) => setData({ ...data, about: { ...about, image: ref ? { _ref: ref } : null } })} ratio="aspect-[4/3]" />
                </Field>
              </div>

              {/* STATS FR */}
              <div className="col-span-2 border-t pt-6 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Statistiques (FR)</h3>
                  <Button variant="outline" size="sm" onClick={() => setData({...data, about: {...about, stats: [...(about.stats || []), { _key: Date.now().toString(), value: '', label: '', icon: '' }]}})}><Plus className="h-4 w-4 mr-2"/> Ajouter une Stat</Button>
                </div>
                <div className="space-y-4">
                  {(about.stats || []).map((stat: any, i: number) => (
                    <div key={stat._key || i} className="flex gap-4 items-end bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <div className="flex-1"><Field label="Valeur (ex: 24/7)"><Text val={stat.value} onChange={(v) => { const n = [...about.stats]; n[i].value = v; setData({...data, about: {...about, stats: n}}) }} /></Field></div>
                      <div className="flex-1"><Field label="Texte"><Text val={stat.label} onChange={(v) => { const n = [...about.stats]; n[i].label = v; setData({...data, about: {...about, stats: n}}) }} /></Field></div>
                      <div className="flex-1"><Field label="Icône (Lucide)"><Text val={stat.icon} onChange={(v) => { const n = [...about.stats]; n[i].icon = v; setData({...data, about: {...about, stats: n}}) }} /></Field></div>
                      <Button variant="destructive" size="icon" onClick={() => { const n = [...about.stats]; n.splice(i, 1); setData({...data, about: {...about, stats: n}}) }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* STATS AR */}
              <div className="col-span-2 border-t pt-6 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Statistiques (AR)</h3>
                  <Button variant="outline" size="sm" onClick={() => setData({...data, about: {...about, stats_ar: [...(about.stats_ar || []), { _key: Date.now().toString(), value: '', label: '', icon: '' }]}})}><Plus className="h-4 w-4 mr-2"/> Ajouter une Stat</Button>
                </div>
                <div className="space-y-4">
                  {(about.stats_ar || []).map((stat: any, i: number) => (
                    <div key={stat._key || i} className="flex gap-4 items-end bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <div className="flex-1"><Field label="Valeur (ex: 24/7)"><Text val={stat.value} onChange={(v) => { const n = [...about.stats_ar]; n[i].value = v; setData({...data, about: {...about, stats_ar: n}}) }} dir="rtl" /></Field></div>
                      <div className="flex-1"><Field label="Texte"><Text val={stat.label} onChange={(v) => { const n = [...about.stats_ar]; n[i].label = v; setData({...data, about: {...about, stats_ar: n}}) }} dir="rtl" /></Field></div>
                      <div className="flex-1"><Field label="Icône (Lucide)"><Text val={stat.icon} onChange={(v) => { const n = [...about.stats_ar]; n[i].icon = v; setData({...data, about: {...about, stats_ar: n}}) }} /></Field></div>
                      <Button variant="destructive" size="icon" onClick={() => { const n = [...about.stats_ar]; n.splice(i, 1); setData({...data, about: {...about, stats_ar: n}}) }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => handleSaveDoc(about, 'Section À propos enregistrée.')} disabled={saving} className="bg-emerald-600">
                <Save className="h-4 w-4 mr-2" /> Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'homeCare' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Badge (FR)"><Text val={homeCare.badge} onChange={(v) => setData({ ...data, homeCare: { ...homeCare, badge: v } })} /></Field>
              <Field label="Badge (AR)"><Text val={homeCare.badge_ar} onChange={(v) => setData({ ...data, homeCare: { ...homeCare, badge_ar: v } })} dir="rtl" /></Field>
              <Field label="Titre (FR)"><Text val={homeCare.title} onChange={(v) => setData({ ...data, homeCare: { ...homeCare, title: v } })} /></Field>
              <Field label="Titre (AR)"><Text val={homeCare.title_ar} onChange={(v) => setData({ ...data, homeCare: { ...homeCare, title_ar: v } })} dir="rtl" /></Field>
              <Field label="Description (FR)"><Lines val={homeCare.description} onChange={(v) => setData({ ...data, homeCare: { ...homeCare, description: v.join('\n') } })} rows={3} /></Field>
              <Field label="Description (AR)"><Lines val={homeCare.description_ar} onChange={(v) => setData({ ...data, homeCare: { ...homeCare, description_ar: v.join('\n') } })} rows={3} dir="rtl" /></Field>
              <div className="col-span-2">
                <Field label="Image illustrative">
                  <ImagePicker val={homeCare.image?._ref} onChange={(ref) => setData({ ...data, homeCare: { ...homeCare, image: ref ? { _ref: ref } : null } })} ratio="aspect-video" />
                </Field>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => handleSaveDoc(homeCare, 'Section Soins à domicile enregistrée.')} disabled={saving} className="bg-emerald-600">
                <Save className="h-4 w-4 mr-2" /> Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditingTestimonial({ _type: 'testimonial', active: true })} className="bg-emerald-600">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un témoignage
            </Button>
          </div>
          <Reorder.Group axis="y" values={data.testimonials} onReorder={handleReorderTestimonials} className="grid gap-3">
            {data.testimonials.map((it: any) => (
              <Reorder.Item key={it._id} value={it}>
                <Card className="cursor-default flex items-center p-3 gap-4">
                  <GripVertical className="h-5 w-5 text-slate-300 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{it.author}</p>
                    <p className="text-sm text-slate-500 truncate">{it.text}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setEditingTestimonial(it)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(it._id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {tab === 'contents' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEditingContent({ _type: 'sectionContent' })} className="bg-emerald-600">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un titre de section
            </Button>
          </div>
          <div className="grid gap-3">
            {data.contents.map((it: any) => (
              <Card key={it._id} className="flex items-center p-3 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{it.title} <span className="text-xs text-emerald-600 bg-emerald-50 px-2 rounded-full font-normal">{it.sectionId}</span></p>
                  <p className="text-sm text-slate-500 truncate">{it.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEditingContent(it)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(it._id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal Témoignage */}
      <Dialog.Root open={!!editingTestimonial} onOpenChange={(o) => !o && setEditingTestimonial(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold mb-6">Témoignage</Dialog.Title>
            {editingTestimonial && (
              <div className="space-y-4">
                <Field label="Auteur (Nom du patient)"><Text val={editingTestimonial.author} onChange={(v) => setEditingTestimonial({ ...editingTestimonial, author: v })} /></Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Témoignage (FR)"><Lines val={editingTestimonial.text} onChange={(v) => setEditingTestimonial({ ...editingTestimonial, text: v.join('\n') })} rows={4} /></Field>
                  <Field label="Témoignage (AR)"><Lines val={editingTestimonial.text_ar} onChange={(v) => setEditingTestimonial({ ...editingTestimonial, text_ar: v.join('\n') })} rows={4} dir="rtl" /></Field>
                </div>
                <Field label="Service concerné (ex: Maternité)"><Text val={editingTestimonial.service} onChange={(v) => setEditingTestimonial({ ...editingTestimonial, service: v })} /></Field>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input type="checkbox" checked={editingTestimonial.active} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, active: e.target.checked })} className="rounded text-emerald-600" />
                  <span>Actif</span>
                </label>
                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setEditingTestimonial(null)}>Annuler</Button>
                  <Button onClick={() => handleSaveDoc(editingTestimonial)} disabled={saving} className="bg-emerald-600">Enregistrer</Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal Section Content */}
      <Dialog.Root open={!!editingContent} onOpenChange={(o) => !o && setEditingContent(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold mb-6">Contenu de Section</Dialog.Title>
            {editingContent && (
              <div className="space-y-4">
                <Field label="ID de la section (ex: hero, about, services, faq)">
                  <Text val={editingContent.sectionId} onChange={(v) => setEditingContent({ ...editingContent, sectionId: v })} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Badge (FR)"><Text val={editingContent.badge} onChange={(v) => setEditingContent({ ...editingContent, badge: v })} /></Field>
                  <Field label="Badge (AR)"><Text val={editingContent.badge_ar} onChange={(v) => setEditingContent({ ...editingContent, badge_ar: v })} dir="rtl" /></Field>
                  <Field label="Titre (FR)"><Text val={editingContent.title} onChange={(v) => setEditingContent({ ...editingContent, title: v })} /></Field>
                  <Field label="Titre (AR)"><Text val={editingContent.title_ar} onChange={(v) => setEditingContent({ ...editingContent, title_ar: v })} dir="rtl" /></Field>
                  <Field label="Sous-titre (FR)"><Lines val={editingContent.subtitle} onChange={(v) => setEditingContent({ ...editingContent, subtitle: v.join('\n') })} rows={2} /></Field>
                  <Field label="Sous-titre (AR)"><Lines val={editingContent.subtitle_ar} onChange={(v) => setEditingContent({ ...editingContent, subtitle_ar: v.join('\n') })} rows={2} dir="rtl" /></Field>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setEditingContent(null)}>Annuler</Button>
                  <Button onClick={() => handleSaveDoc(editingContent)} disabled={saving} className="bg-emerald-600">Enregistrer</Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}
