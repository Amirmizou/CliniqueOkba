'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, Pencil, Trash2, GripVertical, CheckCircle2, XCircle } from 'lucide-react'
import { Text, Lines, Field, useToast, inputCls } from '@/components/admin/ui'
import { Reorder } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'

const CATEGORIES = [
  { value: 'appointment', label: 'Rendez-vous' },
  { value: 'exams', label: 'Examens' },
  { value: 'payment', label: 'Paiement' },
  { value: 'emergency', label: 'Urgences' },
  { value: 'general', label: 'Général' },
]

export default function FAQPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const load = () => {
    fetch('/api/admin/faq')
      .then((r) => r.json())
      .then((res) => {
        setItems(res.faqs || [])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  const handleSave = async (doc: any) => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Succès', description: 'FAQ enregistrée.' })
      setEditing(null)
      load()
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette question ?')) return
    try {
      await fetch(`/api/admin/faq?id=${id}`, { method: 'DELETE' })
      toast({ title: 'Succès', description: 'Question supprimée.' })
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
        fetch('/api/admin/faq', {
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Foire aux questions (FAQ)</h1>
        <Button onClick={() => setEditing({ active: true, category: 'general' })} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Nouvelle question
        </Button>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
        {items.map((it) => (
          <Reorder.Item key={it._id} value={it}>
            <Card className="cursor-default overflow-hidden">
              <div className="flex items-center p-4 gap-4">
                <GripVertical className="h-5 w-5 text-slate-300 cursor-grab active:cursor-grabbing" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{it.question}</h3>
                    {!it.active && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Inactif</span>}
                  </div>
                  <div className="flex gap-4 mt-1 text-sm text-slate-500">
                    <span>Catégorie: {CATEGORIES.find(c => c.value === it.category)?.label || it.category}</span>
                    <span className="truncate">{it.answer?.substring(0, 50)}...</span>
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
        <div className="text-center py-12 text-slate-500">Aucune question configurée.</div>
      )}

      {/* Modal Edition */}
      <Dialog.Root open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold mb-6">
              {editing?._id ? 'Modifier la question' : 'Nouvelle question'}
            </Dialog.Title>
            
            {editing && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="font-medium">Statut de la question</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                    <span>Actif (visible sur le site)</span>
                  </label>
                </div>

                <Field label="Catégorie">
                  <select 
                    className={inputCls} 
                    value={editing.category || 'general'} 
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Question (FR)"><Text val={editing.question} onChange={(v) => setEditing({ ...editing, question: v })} /></Field>
                  <Field label="Question (AR)"><Text val={editing.question_ar} onChange={(v) => setEditing({ ...editing, question_ar: v })} dir="rtl" /></Field>
                  
                  <Field label="Réponse (FR)"><Lines val={editing.answer} onChange={(v) => setEditing({ ...editing, answer: v })} rows={4} /></Field>
                  <Field label="Réponse (AR)"><Lines val={editing.answer_ar} onChange={(v) => setEditing({ ...editing, answer_ar: v })} rows={4} dir="rtl" /></Field>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
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
