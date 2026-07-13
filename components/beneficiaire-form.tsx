'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Trash2, UserPlus, CheckCircle2, Upload } from 'lucide-react'

interface FamilyMember {
  nom: string
  prenom: string
  date_naissance: string
  lien_parente: string
}

const emptyMember = (): FamilyMember => ({ nom: '', prenom: '', date_naissance: '', lien_parente: '' })

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200'

export default function BeneficiaireForm({ organismes }: { organismes: string[] }) {
  const t = useTranslations('beneficiaireForm')
  const locale = useLocale()
  const isRtl = locale === 'ar'

  const [form, setForm] = useState({
    organisme: '',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    num_assure: '',
  })
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [photo, setPhoto] = useState<File | null>(null)
  const [document, setDocument] = useState<File | null>(null)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const updateMember = (i: number, k: keyof FamilyMember, v: string) =>
    setMembers((m) => m.map((mem, idx) => (idx === i ? { ...mem, [k]: v } : mem)))

  const resetForm = () => {
    setForm({ organisme: '', nom: '', prenom: '', telephone: '', email: '', adresse: '', num_assure: '' })
    setMembers([])
    setPhoto(null)
    setDocument(null)
    setConsent(false)
    setSuccess(false)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.organisme) return setError(t('errorOrganisme'))
    if (!form.nom || !form.prenom || !form.telephone) return setError(t('errorRequired'))
    if (!consent) return setError(t('errorConsent'))

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('organisme', form.organisme)
      fd.append('nom', form.nom)
      fd.append('prenom', form.prenom)
      fd.append('telephone', form.telephone)
      fd.append('email', form.email)
      fd.append('adresse', form.adresse)
      fd.append('num_assure', form.num_assure)
      fd.append(
        'family_members',
        JSON.stringify(members.filter((m) => m.nom.trim() && m.prenom.trim())),
      )
      if (photo) fd.append('photo', photo)
      if (document) fd.append('document', document)

      const res = await fetch('/api/beneficiaires', { method: 'POST', body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || t('errorGeneric'))
      }
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err?.message || t('errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-600" />
        <h3 className="mb-2 text-xl font-bold text-emerald-800 dark:text-emerald-300">{t('successTitle')}</h3>
        <p className="mb-6 text-emerald-700 dark:text-emerald-400">{t('successMsg')}</p>
        <Button onClick={resetForm} variant="outline">
          {t('newSubmission')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} dir={isRtl ? 'rtl' : 'ltr'} className="space-y-8">
      {/* Organisme */}
      <div>
        <label className={labelClass} htmlFor="organisme">
          {t('organisme')} <span className="text-red-500">*</span>
        </label>
        <select
          id="organisme"
          value={form.organisme}
          onChange={(e) => set('organisme', e.target.value)}
          className={inputClass}
          required
        >
          <option value="">{organismes.length ? t('organismePlaceholder') : t('noOrganisme')}</option>
          {organismes.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Coordonnées */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">{t('identity')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="prenom">
              {t('prenom')} <span className="text-red-500">*</span>
            </label>
            <input id="prenom" className={inputClass} value={form.prenom} onChange={(e) => set('prenom', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="nom">
              {t('nom')} <span className="text-red-500">*</span>
            </label>
            <input id="nom" className={inputClass} value={form.nom} onChange={(e) => set('nom', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="telephone">
              {t('telephone')} <span className="text-red-500">*</span>
            </label>
            <input id="telephone" type="tel" className={inputClass} value={form.telephone} onChange={(e) => set('telephone', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              {t('email')} <span className="text-slate-400">({t('optional')})</span>
            </label>
            <input id="email" type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="num_assure">
              {t('numAssure')} <span className="text-slate-400">({t('optional')})</span>
            </label>
            <input id="num_assure" className={inputClass} value={form.num_assure} onChange={(e) => set('num_assure', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="adresse">
              {t('adresse')} <span className="text-slate-400">({t('optional')})</span>
            </label>
            <input id="adresse" className={inputClass} value={form.adresse} onChange={(e) => set('adresse', e.target.value)} />
          </div>
        </div>
      </fieldset>

      {/* Membres de la famille */}
      <fieldset className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <legend className="text-lg font-semibold text-slate-800 dark:text-white">{t('familyTitle')}</legend>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('familyHint')}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setMembers((m) => [...m, emptyMember()])}>
            <UserPlus className="me-1.5 h-4 w-4" />
            {t('addMember')}
          </Button>
        </div>

        {members.map((m, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <input placeholder={t('memberPrenom')} className={inputClass} value={m.prenom} onChange={(e) => updateMember(i, 'prenom', e.target.value)} />
              <input placeholder={t('memberNom')} className={inputClass} value={m.nom} onChange={(e) => updateMember(i, 'nom', e.target.value)} />
              <input type="date" aria-label={t('dateNaissance')} className={inputClass} value={m.date_naissance} onChange={(e) => updateMember(i, 'date_naissance', e.target.value)} />
              <select aria-label={t('lienParente')} className={inputClass} value={m.lien_parente} onChange={(e) => updateMember(i, 'lien_parente', e.target.value)}>
                <option value="">{t('lienParente')}</option>
                <option value={t('lienConjoint')}>{t('lienConjoint')}</option>
                <option value={t('lienEnfant')}>{t('lienEnfant')}</option>
                <option value={t('lienParent')}>{t('lienParent')}</option>
                <option value={t('lienAutre')}>{t('lienAutre')}</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => setMembers((arr) => arr.filter((_, idx) => idx !== i))}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              {t('removeMember')}
            </button>
          </div>
        ))}
      </fieldset>

      {/* Fichiers */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">{t('filesTitle')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="photo">
              {t('photoLabel')}
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 p-3 dark:border-slate-700">
              <Upload className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-slate-600 file:me-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-white dark:text-slate-300"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">{t('photoHint')}</p>
          </div>
          <div>
            <label className={labelClass} htmlFor="document">
              {t('documentLabel')}
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 p-3 dark:border-slate-700">
              <Upload className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="document"
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={(e) => setDocument(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-slate-600 file:me-3 file:rounded-md file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-white dark:text-slate-300"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">{t('documentHint')}</p>
          </div>
        </div>
      </fieldset>

      {/* Consentement */}
      <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-600" />
        <span>{t('consent')}</span>
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? (
          <>
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
            {t('submitting')}
          </>
        ) : (
          <>
            <Plus className="me-2 h-4 w-4" />
            {t('submit')}
          </>
        )}
      </Button>
    </form>
  )
}
