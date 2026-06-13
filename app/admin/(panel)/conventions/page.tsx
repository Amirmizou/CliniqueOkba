'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Save, Plus, Trash2, Pencil, GripVertical } from 'lucide-react'
import { Text, Lines, ImagePicker, Field, useToast } from '@/components/admin/ui'
import { Reorder } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { urlFor } from '@/sanity/lib/image'

export default function ConventionsPage() {
  const [data, setData] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingProvider, setEditingProvider] = useState<any | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/admin/conventions')
      .then((r) => r.json())
      .then((res) => {
        if (res.conventions) {
          setData(res.conventions)
        } else {
          setData({ _type: 'insuranceSection', providers: [] })
        }
        setLoading(false)
      })
      .catch((e) => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/conventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur')
      const json = await res.json()
      setData(json.conventions)
      toast({ title: 'Succès', description: 'Conventions enregistrées.' })
    } catch (e) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProvider = () => {
    const arr = [...(data.providers || [])]
    if (editingProvider._isNew) {
      delete editingProvider._isNew
      editingProvider._key = crypto.randomUUID()
      arr.push(editingProvider)
    } else {
      const idx = arr.findIndex(p => p._key === editingProvider._key)
      if (idx !== -1) arr[idx] = editingProvider
    }
    setData({ ...data, providers: arr })
    setEditingProvider(null)
  }

  const handleDeleteProvider = (key: string) => {
    if (!confirm('Supprimer cet organisme ?')) return
    setData({ ...data, providers: data.providers.filter((p: any) => p._key !== key) })
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" /></div>

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Conventions & Assurances</h1>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Textes d'introduction</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Badge (FR)"><Text val={data.badge} onChange={(v) => setData({ ...data, badge: v })} /></Field>
              <Field label="Badge (AR)"><Text val={data.badge_ar} onChange={(v) => setData({ ...data, badge_ar: v })} dir="rtl" /></Field>
              
              <Field label="Titre (FR)"><Text val={data.title} onChange={(v) => setData({ ...data, title: v })} /></Field>
              <Field label="Titre (AR)"><Text val={data.title_ar} onChange={(v) => setData({ ...data, title_ar: v })} dir="rtl" /></Field>
              
              <Field label="Sous-titre (FR)"><Lines val={data.subtitle} onChange={(v) => setData({ ...data, subtitle: v })} rows={2} /></Field>
              <Field label="Sous-titre (AR)"><Lines val={data.subtitle_ar} onChange={(v) => setData({ ...data, subtitle_ar: v })} rows={2} dir="rtl" /></Field>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-semibold">Organismes partenaires</h2>
              <Button onClick={() => setEditingProvider({ _isNew: true })} size="sm" className="gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                <Plus className="h-4 w-4" />
                Ajouter un organisme
              </Button>
            </div>

            <Reorder.Group 
              axis="y" 
              values={data.providers || []} 
              onReorder={(arr) => setData({ ...data, providers: arr })} 
              className="space-y-3 mt-4"
            >
              {(data.providers || []).map((p: any) => (
                <Reorder.Item key={p._key} value={p}>
                  <div className="flex items-center p-3 gap-4 border rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                    <GripVertical className="h-5 w-5 text-slate-300 cursor-grab active:cursor-grabbing" />
                    {p.logo?._ref && (
                      <div className="h-10 w-10 shrink-0 rounded border bg-slate-50 flex items-center justify-center p-1">
                        <img src={urlFor(p.logo).width(80).height(80).url()} alt="" className="max-h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 truncate">{p.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => setEditingProvider(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteProvider(p._key)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {(!data.providers || data.providers.length === 0) && (
              <p className="text-center text-slate-500 py-8">Aucun partenaire configuré.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">Note de bas de section</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Note (FR)"><Lines val={data.note} onChange={(v) => setData({ ...data, note: v })} rows={2} /></Field>
              <Field label="Note (AR)"><Lines val={data.note_ar} onChange={(v) => setData({ ...data, note_ar: v })} rows={2} dir="rtl" /></Field>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Organisme */}
      <Dialog.Root open={!!editingProvider} onOpenChange={(o) => !o && setEditingProvider(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl z-50">
            <Dialog.Title className="text-xl font-bold mb-6">
              {editingProvider?._isNew ? 'Nouvel organisme' : 'Modifier l\'organisme'}
            </Dialog.Title>
            
            {editingProvider && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Nom (FR)"><Text val={editingProvider.name} onChange={(v) => setEditingProvider({ ...editingProvider, name: v })} /></Field>
                  <Field label="Nom (AR)"><Text val={editingProvider.name_ar} onChange={(v) => setEditingProvider({ ...editingProvider, name_ar: v })} dir="rtl" /></Field>
                  <Field label="Description (FR)"><Lines val={editingProvider.description} onChange={(v) => setEditingProvider({ ...editingProvider, description: v })} rows={2} /></Field>
                  <Field label="Description (AR)"><Lines val={editingProvider.description_ar} onChange={(v) => setEditingProvider({ ...editingProvider, description_ar: v })} rows={2} dir="rtl" /></Field>
                </div>
                
                <Field label="Logo (Optionnel)">
                  <ImagePicker 
                    val={editingProvider.logo?._ref} 
                    onChange={(ref) => setEditingProvider({ ...editingProvider, logo: ref ? { _ref: ref } : null })} 
                  />
                </Field>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <Button variant="outline" onClick={() => setEditingProvider(null)}>Annuler</Button>
                  <Button onClick={handleSaveProvider} className="bg-emerald-600 hover:bg-emerald-700">
                    Valider
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
