'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, Save, Trash2, Eye, EyeOff } from 'lucide-react'
import { Text, Lines, ImagePicker, Field, useToast } from '@/components/admin/ui'
import { LogoBadgeSpinner } from '@/components/ui/logo-badge'

interface Doctor {
  _id?: string
  title?: string
  name?: string
  name_ar?: string
  specialty?: string
  specialty_ar?: string
  subtitle?: string
  subtitle_ar?: string
  services?: string[]
  services_ar?: string[]
  videos?: string[]
  accentColor?: string
  consultationDays?: string
  consultationDays_ar?: string
  consultationHours?: string
  consultationHours_ar?: string
  order?: number
  active?: boolean
  imageUrl?: string
  imageAssetId?: string
  _dirty?: boolean
  _saving?: boolean
}

export default function MedecinsEditor() {
  const [list, setList] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const { notify, ToastView } = useToast()

  useEffect(() => {
    fetch('/api/admin/doctors')
      .then((r) => r.json())
      .then((d) => setList(d.doctors || []))
      .catch(() => notify('Erreur de chargement', false))
      .finally(() => setLoading(false))
  }, [])

  const upd = (i: number, p: Partial<Doctor>) =>
    setList((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...p, _dirty: true } : d)))

  const add = () =>
    setList((prev) => [...prev, { name: '', title: 'Dr.', active: true, order: prev.length, _dirty: true }])

  const save = async (i: number) => {
    setList((prev) => prev.map((d, idx) => (idx === i ? { ...d, _saving: true } : d)))
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list[i]),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setList((prev) =>
        prev.map((d, idx) =>
          idx === i ? { ...d, _id: data.doctor?._id || d._id, _dirty: false, _saving: false } : d,
        ),
      )
      notify('Médecin enregistré ✓')
    } catch (e: any) {
      setList((prev) => prev.map((d, idx) => (idx === i ? { ...d, _saving: false } : d)))
      notify(e.message || 'Échec', false)
    }
  }

  const remove = async (i: number) => {
    const d = list[i]
    if (!confirm(`Supprimer ${d.name || 'ce médecin'} ?`)) return
    if (d._id) {
      const res = await fetch(`/api/admin/doctors?id=${d._id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return notify(`Suppression échouée: ${err.details || err.error || ''}`, false)
      }
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Médecins</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Équipe médicale — nom, spécialité, prestations en français et arabe.
          </p>
        </div>
        <button onClick={add} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {loading ? (
        <LogoBadgeSpinner label="Chargement des médecins…" />
      ) : (
        <div className="space-y-5">
          {list.map((d, i) => (
            <div key={d._id || `new-${i}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {d.title} {d.name || 'Nouveau médecin'}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => upd(i, { active: !d.active })} className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${d.active !== false ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                    {d.active !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {d.active !== false ? 'Visible' : 'Masqué'}
                  </button>
                  <button onClick={() => remove(i)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                <ImagePicker url={d.imageUrl} onUploaded={(assetId, url) => upd(i, { imageAssetId: assetId, imageUrl: url })} />

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Text label="Civilité" value={d.title || ''} onChange={(v) => upd(i, { title: v })} placeholder="Dr." />
                    <Text label="Ordre" value={String(d.order ?? 0)} onChange={(v) => upd(i, { order: parseInt(v) || 0 })} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Text label="Nom (FR)" value={d.name || ''} onChange={(v) => upd(i, { name: v })} placeholder="Meskaldji Rima" />
                    <Text label="الاسم (AR)" rtl value={d.name_ar || ''} onChange={(v) => upd(i, { name_ar: v })} placeholder="مسكلجي ريما" />
                    <Text label="Spécialité (FR)" value={d.specialty || ''} onChange={(v) => upd(i, { specialty: v })} />
                    <Text label="التخصص (AR)" rtl value={d.specialty_ar || ''} onChange={(v) => upd(i, { specialty_ar: v })} />
                    <Text label="Sous-titre (FR)" value={d.subtitle || ''} onChange={(v) => upd(i, { subtitle: v })} />
                    <Text label="العنوان الفرعي (AR)" rtl value={d.subtitle_ar || ''} onChange={(v) => upd(i, { subtitle_ar: v })} />
                    <Text label="Jours (FR)" value={d.consultationDays || ''} onChange={(v) => upd(i, { consultationDays: v })} placeholder="Du samedi au jeudi" />
                    <Text label="الأيام (AR)" rtl value={d.consultationDays_ar || ''} onChange={(v) => upd(i, { consultationDays_ar: v })} />
                    <Text label="Horaires (FR)" value={d.consultationHours || ''} onChange={(v) => upd(i, { consultationHours: v })} placeholder="08h00 – 16h00" />
                    <Text label="الساعات (AR)" rtl value={d.consultationHours_ar || ''} onChange={(v) => upd(i, { consultationHours_ar: v })} />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Lines label="Prestations (FR)" value={d.services || []} onChange={(v) => upd(i, { services: v })} />
                    <Lines label="الخدمات (AR)" rtl value={d.services_ar || []} onChange={(v) => upd(i, { services_ar: v })} />
                  </div>

                  {/* Couleur d'accent + vidéos */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Couleur d'accent (carte, badges, boutons)">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={d.accentColor || '#006633'}
                          onChange={(e) => upd(i, { accentColor: e.target.value })}
                          className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-300 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800"
                          aria-label="Sélecteur de couleur"
                        />
                        <Text
                          value={d.accentColor || ''}
                          onChange={(v) => upd(i, { accentColor: v })}
                          placeholder="#006633"
                          className="flex-1"
                        />
                      </div>
                    </Field>
                    <Lines
                      label="Vidéos (un lien par ligne — YouTube, Facebook, MP4)"
                      value={d.videos || []}
                      onChange={(v) => upd(i, { videos: v })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button onClick={() => save(i)} disabled={d._saving || !d._dirty} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40">
                      {d._saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {d._dirty ? 'Enregistrer' : 'Enregistré'}
                    </button>
                  </div>
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
