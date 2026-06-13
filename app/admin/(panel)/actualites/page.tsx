'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, Pencil, Trash2, Calendar } from 'lucide-react'
import { Text, Lines, ImagePicker, Field, useToast, inputCls } from '@/components/admin/ui'
import * as Dialog from '@radix-ui/react-dialog'
import { urlFor } from '@/sanity/lib/image'

const CATEGORIES = [
  { title: 'Nouveau médecin', value: 'nouveau-medecin' },
  { title: 'Nouvel équipement', value: 'nouvel-equipement' },
  { title: 'Nouvelle convention', value: 'convention' },
  { title: "Changement d'horaires", value: 'horaires' },
  { title: 'Ouverture de service', value: 'nouveau-service' },
  { title: 'Certification / Accréditation', value: 'certification' },
  { title: 'Communiqué officiel', value: 'communique' },
]

function blocksToText(blocks: any[]) {
  if (!Array.isArray(blocks)) return ''
  return blocks.map(b => b.children?.map((c: any) => c.text).join('') || '').join('\n')
}

export default function ActualitesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const load = () => {
    fetch('/api/admin/actualites')
      .then((r) => r.json())
      .then((res) => {
        setItems(res.actualites || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const handleEdit = (it: any) => {
    setEditing({
      ...it,
      _rawContent: blocksToText(it.content),
      _rawContent_ar: blocksToText(it.content_ar),
      publishedAt: it.publishedAt ? new Date(it.publishedAt).toISOString().split('T')[0] : ''
    })
  }

  const handleSave = async (doc: any) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/actualites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Succès', description: 'Actualité enregistrée.' })
      setEditing(null)
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette actualité ?')) return
    try {
      await fetch(`/api/admin/actualites?id=${id}`, { method: 'DELETE' })
      toast({ title: 'Succès', description: 'Actualité supprimée.' })
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Échec de la suppression.', variant: 'destructive' })
    }
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" /></div>

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Actualités</h1>
        <Button onClick={() => setEditing({ published: true, category: 'communique', publishedAt: new Date().toISOString().split('T')[0] })} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Ajouter une actualité
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <Card key={it._id} className="overflow-hidden flex flex-col">
            {it.image?._ref && (
              <div className="h-40 w-full bg-slate-100 overflow-hidden relative">
                <img src={urlFor(it.image).width(400).url()} className="w-full h-full object-cover" alt="" />
              </div>
            )}
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-semibold text-lg leading-tight line-clamp-2">{it.title}</h3>
                {!it.published && <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full shrink-0">Brouillon</span>}
              </div>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{it.excerpt}</p>
              
              <div className="mt-auto flex items-center justify-between border-t pt-4">
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {it.publishedAt ? new Date(it.publishedAt).toLocaleDateString('fr-FR') : 'Non daté'}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(it)}>
                    <Pencil className="h-4 w-4 mr-2" /> Éditer
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(it._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 border rounded-lg border-dashed">Aucune actualité trouvée.</div>
        )}
      </div>

      {/* Modal Edition */}
      <Dialog.Root open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold mb-6">
              {editing?._id ? "Modifier l'actualité" : 'Nouvelle actualité'}
            </Dialog.Title>
            
            {editing && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-1 space-y-4">
                    <Field label="Image de couverture">
                      <ImagePicker val={editing.image?._ref} onChange={(ref) => setEditing({ ...editing, image: ref ? { _ref: ref } : null })} ratio="aspect-[4/3]" />
                    </Field>
                    
                    <Field label="Date de publication">
                      <input type="date" className={inputCls} value={editing.publishedAt} onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value })} />
                    </Field>
                    <Field label="Catégorie">
                      <select className={inputCls} value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                        <option value="">Sélectionnez...</option>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.title}</option>)}
                      </select>
                    </Field>
                    <Field label="Auteur (optionnel)"><Text val={editing.author} onChange={(v) => setEditing({ ...editing, author: v })} /></Field>
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded border-slate-300 text-emerald-600" />
                      <span>Publié (visible)</span>
                    </label>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <Field label="Titre (FR)"><Text val={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} /></Field>
                    <Field label="Titre (AR)"><Text val={editing.title_ar} onChange={(v) => setEditing({ ...editing, title_ar: v })} dir="rtl" /></Field>
                    <Field label="Slug (URL)"><Text val={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} placeholder="Laissez vide pour générer depuis le titre" /></Field>
                    
                    <Field label="Extrait (FR)"><Lines val={editing.excerpt} onChange={(v) => setEditing({ ...editing, excerpt: v.join('\n') })} rows={2} /></Field>
                    <Field label="Extrait (AR)"><Lines val={editing.excerpt_ar} onChange={(v) => setEditing({ ...editing, excerpt_ar: v.join('\n') })} rows={2} dir="rtl" /></Field>
                    
                    <Field label="Contenu brut (FR)">
                      <textarea className={inputCls} rows={6} value={editing._rawContent} onChange={(e) => setEditing({ ...editing, _rawContent: e.target.value })} placeholder="Saisissez le contenu du paragraphe..." />
                    </Field>
                    <Field label="Contenu brut (AR)">
                      <textarea className={inputCls} rows={6} dir="rtl" value={editing._rawContent_ar} onChange={(e) => setEditing({ ...editing, _rawContent_ar: e.target.value })} />
                    </Field>
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
