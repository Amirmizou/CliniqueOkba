'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, Save, Trash2, Eye, EyeOff } from 'lucide-react'
import { Text, Lines, inputCls, Field, ImagePicker, useToast } from '@/components/admin/ui'
import { LogoBadgeSpinner } from '@/components/ui/logo-badge'

interface Pole {
  _id?: string
  title?: string
  title_ar?: string
  slug?: string
  description?: string
  description_ar?: string
  intro?: string
  intro_ar?: string
  items?: string[]
  items_ar?: string[]
  iconName?: string
  accentColor?: string
  badge?: string
  badge_ar?: string
  order?: number
  active?: boolean
  urgent?: boolean
  featured?: boolean
  imageAssetId?: string | null
  imageUrl?: string
  _dirty?: boolean
  _saving?: boolean
}

const ICONS = ['ScanLine', 'Radiation', 'Smile', 'Stethoscope', 'Siren', 'FlaskConical', 'Eye', 'Heart', 'Baby', 'ScanEye', 'Activity', 'Pill']

export default function PolesEditor() {
  const [list, setList] = useState<Pole[]>([])
  const [loading, setLoading] = useState(true)
  const { notify, ToastView } = useToast()

  useEffect(() => {
    fetch('/api/admin/poles')
      .then((r) => r.json())
      .then((d) => setList(d.poles || []))
      .catch(() => notify('Erreur de chargement', false))
      .finally(() => setLoading(false))
  }, [])

  const upd = (i: number, p: Partial<Pole>) =>
    setList((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...p, _dirty: true } : d)))

  const add = () =>
    setList((prev) => [...prev, { title: '', iconName: 'Stethoscope', accentColor: '#006633', active: true, order: prev.length, _dirty: true }])

  const save = async (i: number) => {
    setList((prev) => prev.map((d, idx) => (idx === i ? { ...d, _saving: true } : d)))
    try {
      const res = await fetch('/api/admin/poles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list[i]),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setList((prev) =>
        prev.map((d, idx) =>
          idx === i ? { ...d, _id: data.pole?._id || d._id, _dirty: false, _saving: false } : d,
        ),
      )
      notify('Pôle enregistré ✓')
    } catch (e: any) {
      setList((prev) => prev.map((d, idx) => (idx === i ? { ...d, _saving: false } : d)))
      notify(e.message || 'Échec', false)
    }
  }

  const remove = async (i: number) => {
    const d = list[i]
    if (!confirm(`Supprimer ${d.title || 'ce pôle'} ?`)) return
    if (d._id) {
      const res = await fetch(`/api/admin/poles?id=${d._id}`, { method: 'DELETE' })
      if (!res.ok) return notify('Suppression échouée', false)
    }
    setList((prev) => prev.filter((_, idx) => idx !== i))
    notify('Supprimé')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Tableau de bord
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pôles d'excellence</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Départements de la clinique — descriptions et prestations FR/AR. Les vidéos se gèrent dans le Studio.
          </p>
        </div>
        <button onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {loading ? (
        <LogoBadgeSpinner label="Chargement des pôles…" />
      ) : (
        <div className="space-y-5">
          {list.map((d, i) => (
            <div key={d._id || `new-${i}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.accentColor || '#006633' }} />
                  {d.title || 'Nouveau pôle'}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => upd(i, { active: !d.active })} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${d.active !== false ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                    {d.active !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {d.active !== false ? 'Visible' : 'Masqué'}
                  </button>
                  <button onClick={() => remove(i)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Text label="Titre (FR)" value={d.title || ''} onChange={(v) => upd(i, { title: v })} placeholder="Imagerie médicale" />
                  <Text label="العنوان (AR)" rtl value={d.title_ar || ''} onChange={(v) => upd(i, { title_ar: v })} />
                  <Text label="Description (FR)" value={d.description || ''} onChange={(v) => upd(i, { description: v })} />
                  <Text label="الوصف (AR)" rtl value={d.description_ar || ''} onChange={(v) => upd(i, { description_ar: v })} />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Introduction longue (FR)">
                    <textarea rows={3} className={inputCls} value={d.intro || ''} onChange={(e) => upd(i, { intro: e.target.value })} />
                  </Field>
                  <Field label="مقدمة طويلة (AR)">
                    <textarea dir="rtl" rows={3} className={inputCls} value={d.intro_ar || ''} onChange={(e) => upd(i, { intro_ar: e.target.value })} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Lines label="Prestations (FR)" value={d.items || []} onChange={(v) => upd(i, { items: v })} />
                  <Lines label="الخدمات (AR)" rtl value={d.items_ar || []} onChange={(v) => upd(i, { items_ar: v })} />
                </div>
                {/* Photo de couverture */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Photo de couverture de la carte
                  </p>
                  <div className="sm:max-w-[200px]">
                    <ImagePicker
                      ratio="aspect-[4/3]"
                      val={d.imageAssetId ?? undefined}
                      url={!d.imageAssetId && d.imageUrl ? d.imageUrl : undefined}
                      onChange={(assetId) => upd(i, { imageAssetId: assetId })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Text label="Badge (FR)" value={d.badge || ''} onChange={(v) => upd(i, { badge: v })} />
                  <Text label="الشارة (AR)" rtl value={d.badge_ar || ''} onChange={(v) => upd(i, { badge_ar: v })} />
                  <Field label="Icône">
                    <select className={inputCls} value={d.iconName || 'Stethoscope'} onChange={(e) => upd(i, { iconName: e.target.value })}>
                      {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </Field>
                  <Field label="Couleur">
                    <input type="color" className="h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700" value={d.accentColor || '#006633'} onChange={(e) => upd(i, { accentColor: e.target.value })} />
                  </Field>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Text label="Ordre" className="w-24" value={String(d.order ?? 0)} onChange={(v) => upd(i, { order: parseInt(v) || 0 })} />
                  <label className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input type="checkbox" checked={!!d.urgent} onChange={(e) => upd(i, { urgent: e.target.checked })} /> Urgences
                  </label>
                  <label className="mt-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input type="checkbox" checked={!!d.featured} onChange={(e) => upd(i, { featured: e.target.checked })} /> Vedette
                  </label>
                  <button onClick={() => save(i)} disabled={d._saving || !d._dirty} className="ml-auto mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40">
                    {d._saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {d._dirty ? 'Enregistrer' : 'Enregistré'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastView />
    </div>
  )
}
