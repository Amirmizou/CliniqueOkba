'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/navigation'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Trash2,
  UserPlus,
  CheckCircle2,
  Camera,
  ImageUp,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  User,
  Users,
  Image as ImageIcon,
} from 'lucide-react'

interface FamilyMember {
  nom: string
  prenom: string
  date_naissance: string
  lien_parente: string
}

const emptyMember = (): FamilyMember => ({ nom: '', prenom: '', date_naissance: '', lien_parente: '' })

// Les nom/prénom doivent rester en caractères latins (français) pour l'app
// métier : on retire toute lettre arabe saisie, y compris en formulaire arabe.
const ARABIC_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/g
const stripArabic = (v: string) => v.replace(ARABIC_RE, '')

// La convention « Promotion Dembri » (parfois orthographiée Dambri) regroupe les
// acquéreurs ; la résidence/îlot est une sous-catégorie choisie ensuite.
const isDembri = (o: string) => {
  const s = (o || '').toLowerCase()
  return s.includes('dembri') || s.includes('dambri')
}

// Résidences des acquéreurs de la Promotion Dembri (sous-catégories).
const DEMBRI_RESIDENCES = [
  'RESIDENCE MALIKA GAID 292/1448 ILOT 01',
  'RESIDENCE MALIKA GAID 162/1448 ILOT 02',
  'RESIDENCE MALIKA GAID 357/1448 ILOT 3A',
  'RESIDENCE MALIKA GAID 227/1448 ILOT 3B',
  'RESIDENCE MALIKA GAID 208/1448 ILOT 04',
  'RESIDENCE MALIKA GAID 177/1448 ILOT 05',
  'RESIDENCE MALIKA GAID 246/1448 ILOT 06',
  'RESIDENCE MERIEM 138-UV20',
  'RESIDENCE MERIEM 147-UV20',
  'RESIDENCE MERIEM 269-UV.20',
  'LOGEMENT L.S.P 529/609 UV.18',
]

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
const labelClass = 'mb-1.5 block text-base font-medium text-slate-700 dark:text-slate-200'

const TOTAL_STEPS = 4

/** Sélecteur de média avec appareil photo + galerie et aperçu. */
function MediaPicker({
  file,
  setFile,
  capture,
  accept,
  takeLabel,
  chooseLabel,
  changeLabel,
  addedLabel,
  tip,
  isRtl,
}: {
  file: File | null
  setFile: (f: File | null) => void
  capture: 'user' | 'environment'
  accept: string
  takeLabel: string
  chooseLabel: string
  changeLabel: string
  addedLabel: string
  tip: string
  isRtl: boolean
}) {
  const camRef = useRef<HTMLInputElement>(null)
  const galRef = useRef<HTMLInputElement>(null)
  // Aperçu image : on crée l'URL objet en mémo, et on la révoque au nettoyage.
  const preview = useMemo(
    () => (file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null),
    [file],
  )
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <div>
      {/* Inputs cachés déclenchés par les boutons */}
      <input
        ref={camRef}
        type="file"
        accept={accept}
        capture={capture}
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <input
        ref={galRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      {!file ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => camRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-4 py-6 text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <Camera className="h-8 w-8" />
            <span className="text-center text-base font-semibold">{takeLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => galRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
          >
            <ImageUp className="h-8 w-8" />
            <span className="text-center text-base font-semibold">{chooseLabel}</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/40">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900">
              <FileText className="h-8 w-8 text-emerald-600" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {addedLabel}
            </p>
            <p className="truncate text-sm text-slate-500">{file.name}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
            {changeLabel}
          </Button>
        </div>
      )}
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{tip}</p>
    </div>
  )
}

export default function BeneficiaireForm({ organismes }: { organismes: string[] }) {
  const t = useTranslations('beneficiaireForm')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const isRtl = locale === 'ar'

  const [step, setStep] = useState(0)
  // Étape minimale accessible : passe à 1 quand l'organisme est pré-rempli via
  // un lien partagé (ex. ?org=SEACO), pour sauter l'étape de choix d'organisme.
  const [minStep, setMinStep] = useState(0)
  const [lockedOrganisme, setLockedOrganisme] = useState('')
  const [form, setForm] = useState({
    organisme: '',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    num_assure: '',
    projet_dedie: '',
    situation_familiale: '',
  })
  const [showMore, setShowMore] = useState(false)
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

  // Pré-remplissage via lien partagé : ?org=SEACO (ou ?org=SEACO&projet=...).
  // On lit window.location pour éviter le besoin d'un Suspense (useSearchParams).
  // Initialisation depuis un système externe (l'URL) au montage uniquement.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const orgParam = (params.get('org') || params.get('organisme') || '').trim()
    if (!orgParam) return
    const norm = (s: string) => s.toLowerCase().trim()
    const match =
      organismes.find((o) => norm(o) === norm(orgParam)) ??
      organismes.find((o) => norm(o).includes(norm(orgParam)))
    if (!match) return
    const projetParam = (params.get('projet') || '').trim()
    setForm((f) => ({ ...f, organisme: match, projet_dedie: projetParam || f.projet_dedie }))
    setLockedOrganisme(match)
    // On ne saute l'étape organisme que si le dossier est complet : DAMBRI
    // exige un projet dédié, donc on ne saute pas si le projet manque.
    const needsProjet = isDembri(match)
    if (!needsProjet || projetParam) {
      setStep(1)
      setMinStep(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const next = () => {
    setError('')
    if (step === 0 && !form.organisme) return setError(t('errorOrganisme'))
    if (step === 0 && isDembri(form.organisme) && !form.projet_dedie) {
      return setError(isRtl ? 'يرجى اختيار الإقامة' : 'Veuillez sélectionner votre résidence')
    }
    if (step === 1 && (!form.prenom || !form.nom || !form.telephone)) return setError(t('errorRequired'))
    if (step === 2 && !form.situation_familiale) return setError(t('errorSituation'))
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
    goTop()
  }
  const back = () => {
    setError('')
    setStep((s) => Math.max(s - 1, minStep))
    goTop()
  }

  // Sélection d'un organisme : on avance automatiquement à l'étape suivante
  // pour éviter de descendre chercher le bouton « Suivant ». DAMBRI a besoin
  // du projet dédié : on attend alors le choix du projet pour avancer.
  const selectOrganisme = (o: string) => {
    setError('')
    set('organisme', o)
    if (!isDembri(o)) {
      setStep(1)
      goTop()
    }
  }
  const selectProjet = (v: string) => {
    set('projet_dedie', v)
    if (v) {
      setError('')
      setStep(1)
      goTop()
    }
  }

  // Ajoute un ayant droit avec un lien de parenté pré-rempli (parent, conjoint…).
  const addMemberWith = (lien: string) =>
    setMembers((m) => [...m, { ...emptyMember(), lien_parente: lien }])

  const resetForm = () => {
    // Sur un lien partagé, on garde l'organisme (et le projet) pré-remplis pour
    // enchaîner les inscriptions sans re-choisir l'organisme à chaque fois.
    setForm((f) => ({
      organisme: lockedOrganisme || '',
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      adresse: '',
      num_assure: '',
      projet_dedie: lockedOrganisme ? f.projet_dedie : '',
      situation_familiale: '',
    }))
    setMembers([])
    setPhoto(null)
    setDocument(null)
    setConsent(false)
    setSuccess(false)
    setError('')
    setStep(minStep)
  }

  const handleSubmit = async () => {
    setError('')
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
      if (form.projet_dedie) fd.append('projet_dedie', form.projet_dedie)
      if (form.situation_familiale) fd.append('situation_familiale', form.situation_familiale)
      fd.append('family_members', JSON.stringify(members.filter((m) => m.nom.trim() && m.prenom.trim())))
      if (photo) fd.append('photo', photo)
      if (document) fd.append('document', document)

      const res = await fetch('/api/beneficiaires', { method: 'POST', body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || t('errorGeneric'))
      }
      setSuccess(true)
      goTop()
    } catch (err: any) {
      setError(err?.message || t('errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/40">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-600" />
        <h3 className="mb-2 text-2xl font-bold text-emerald-800 dark:text-emerald-300">{t('successTitle')}</h3>
        <p className="mb-6 text-lg text-emerald-700 dark:text-emerald-400">{t('successMsg')}</p>
        <Button onClick={resetForm} size="lg" variant="outline">
          {t('newSubmission')}
        </Button>
      </div>
    )
  }

  const stepMeta = [
    { icon: Building2, title: t('step1Title'), help: t('step1Help') },
    { icon: User, title: t('step2Title'), help: t('step2Help') },
    { icon: Users, title: t('step3Title'), help: t('step3Help') },
    { icon: ImageIcon, title: t('step4Title'), help: t('step4Help') },
  ]
  const NextIcon = isRtl ? ArrowLeft : ArrowRight
  const BackIcon = isRtl ? ArrowRight : ArrowLeft
  const CurrentIcon = stepMeta[step].icon

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <style>{`
        @keyframes beneficiaire-nudge { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes beneficiaire-nudge-rtl { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-5px)} }
        .beneficiaire-nudge { animation: beneficiaire-nudge 1.1s ease-in-out infinite; }
        [dir="rtl"] .beneficiaire-nudge { animation-name: beneficiaire-nudge-rtl; }
        @media (prefers-reduced-motion: reduce) { .beneficiaire-nudge { animation: none; } }
      `}</style>
      {/* Bascule de langue */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="text-sm text-slate-400">{t('langChoose')} :</span>
        <div className="inline-flex overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: 'fr' })}
            className={`px-4 py-1.5 text-sm font-semibold transition ${
              locale === 'fr' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Français
          </button>
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: 'ar' })}
            className={`px-4 py-1.5 text-sm font-semibold transition ${
              locale === 'ar' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Organisme pré-sélectionné via un lien partagé */}
      {lockedOrganisme && minStep > 0 && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/40">
          <Building2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {isRtl ? 'الهيئة' : 'Organisme'} : <span className="font-bold">{lockedOrganisme}</span>
            {form.projet_dedie ? ` — ${form.projet_dedie}` : ''}
          </p>
        </div>
      )}

      {/* Progression (recalée quand l'étape organisme est sautée via un lien) */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-500">
          <span>{t('stepOf', { current: step - minStep + 1, total: TOTAL_STEPS - minStep })}</span>
          <span>{Math.round(((step - minStep + 1) / (TOTAL_STEPS - minStep)) * 100)}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${((step - minStep + 1) / (TOTAL_STEPS - minStep)) * 100}%` }}
          />
        </div>
      </div>

      {/* En-tête d'étape */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <CurrentIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{stepMeta[step].title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{stepMeta[step].help}</p>
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="min-h-[220px]">
        {/* Étape 1 : Organisme (gros boutons) */}
        {step === 0 && (
          <div className="space-y-3">
            {organismes.length === 0 ? (
              <p className="rounded-xl bg-amber-50 p-4 text-amber-700">{t('noOrganisme')}</p>
            ) : (
              organismes.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => selectOrganisme(o)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-start text-lg font-semibold transition ${
                    form.organisme === o
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {o}
                  {form.organisme === o && <Check className="h-6 w-6 text-emerald-600" />}
                </button>
              ))
            )}
            
            {isDembri(form.organisme) && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <label className={labelClass} htmlFor="projet_dedie">
                  {isRtl ? 'الإقامة' : 'Votre résidence'} <span className="text-red-500">*</span>
                </label>
                <select
                  id="projet_dedie"
                  className={inputClass}
                  value={form.projet_dedie}
                  onChange={(e) => selectProjet(e.target.value)}
                >
                  <option value="">{isRtl ? 'اختر الإقامة...' : 'Sélectionnez votre résidence...'}</option>
                  {DEMBRI_RESIDENCES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="Autre">{isRtl ? 'أخرى' : 'Autre'}</option>
                </select>
                <p className="mt-2 text-sm text-slate-500">
                  {isRtl
                    ? 'اختر الإقامة التي تنتمي إليها ضمن ترقية دمبري.'
                    : 'Sélectionnez la résidence à laquelle vous appartenez (acquéreurs de la Promotion Dembri).'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Étape 2 : Coordonnées */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="prenom">
                {t('prenom')} <span className="text-red-500">*</span>
              </label>
              <input id="prenom" dir="ltr" lang="fr" className={inputClass} value={form.prenom} onChange={(e) => set('prenom', stripArabic(e.target.value))} />
            </div>
            <div>
              <label className={labelClass} htmlFor="nom">
                {t('nom')} <span className="text-red-500">*</span>
              </label>
              <input id="nom" dir="ltr" lang="fr" className={inputClass} value={form.nom} onChange={(e) => set('nom', stripArabic(e.target.value))} />
              <p className="mt-1.5 text-sm text-amber-600 dark:text-amber-400">{t('nameLatinHint')}</p>
            </div>
            <div>
              <label className={labelClass} htmlFor="telephone">
                {t('telephone')} <span className="text-red-500">*</span>
              </label>
              <input id="telephone" type="tel" inputMode="tel" className={inputClass} value={form.telephone} onChange={(e) => set('telephone', e.target.value)} placeholder="0X XX XX XX XX" />
            </div>

            {!showMore ? (
              <button type="button" onClick={() => setShowMore(true)} className="text-base font-medium text-emerald-600 hover:underline">
                + {t('moreInfo')}
              </button>
            ) : (
              <div className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div>
                  <label className={labelClass} htmlFor="email">
                    {t('email')} <span className="text-slate-400">({t('optional')})</span>
                  </label>
                  <input id="email" type="email" inputMode="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} />
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
            )}
          </div>
        )}

        {/* Étape 3 : Situation familiale + ayants droit */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Situation familiale (oriente les ayants droit à saisir) */}
            <div>
              <p className={labelClass}>
                {t('situationLabel')} <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'celibataire', label: t('situationCelibataire') },
                  { key: 'marie', label: t('situationMarie') },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      setError('')
                      set('situation_familiale', s.key)
                    }}
                    className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold transition ${
                      form.situation_familiale === s.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {form.situation_familiale && (
              <>
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {form.situation_familiale === 'marie' ? t('ayantsDroitMarie') : t('ayantsDroitCelibataire')}
                </p>
                {members.length > 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">{t('nameLatinHint')}</p>
                )}

                {members.map((m, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input placeholder={t('memberPrenom')} dir="ltr" lang="fr" className={inputClass} value={m.prenom} onChange={(e) => updateMember(i, 'prenom', stripArabic(e.target.value))} />
                      <input placeholder={t('memberNom')} dir="ltr" lang="fr" className={inputClass} value={m.nom} onChange={(e) => updateMember(i, 'nom', stripArabic(e.target.value))} />
                      <input type="date" aria-label={t('dateNaissance')} className={inputClass} value={m.date_naissance} onChange={(e) => updateMember(i, 'date_naissance', e.target.value)} />
                      <select aria-label={t('lienParente')} className={inputClass} value={m.lien_parente} onChange={(e) => updateMember(i, 'lien_parente', e.target.value)}>
                        <option value="">{t('lienParente')}</option>
                        {form.situation_familiale === 'marie' && <option value={t('lienConjoint')}>{t('lienConjoint')}</option>}
                        {form.situation_familiale === 'marie' && <option value={t('lienEnfant')}>{t('lienEnfant')}</option>}
                        <option value={t('lienParent')}>{t('lienParent')}</option>
                        <option value={t('lienAutre')}>{t('lienAutre')}</option>
                      </select>
                    </div>
                    <button type="button" onClick={() => setMembers((arr) => arr.filter((_, idx) => idx !== i))} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
                      <Trash2 className="h-4 w-4" />
                      {t('removeMember')}
                    </button>
                  </div>
                ))}

                {/* Boutons d'ajout ciblés selon la situation */}
                <div className="grid gap-2 sm:grid-cols-3">
                  {form.situation_familiale === 'marie' && (
                    <Button type="button" variant="outline" size="lg" onClick={() => addMemberWith(t('lienConjoint'))} className="w-full">
                      <UserPlus className="me-2 h-5 w-5" />
                      {t('addConjoint')}
                    </Button>
                  )}
                  {form.situation_familiale === 'marie' && (
                    <Button type="button" variant="outline" size="lg" onClick={() => addMemberWith(t('lienEnfant'))} className="w-full">
                      <UserPlus className="me-2 h-5 w-5" />
                      {t('addEnfant')}
                    </Button>
                  )}
                  <Button type="button" variant="outline" size="lg" onClick={() => addMemberWith(t('lienParent'))} className="w-full">
                    <UserPlus className="me-2 h-5 w-5" />
                    {t('addParent')}
                  </Button>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">{t('ayantsDroitNote')}</p>
              </>
            )}
          </div>
        )}

        {/* Étape 4 : Photos + consentement */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className={labelClass}>{t('photoLabel')}</p>
              <MediaPicker
                file={photo}
                setFile={setPhoto}
                capture="user"
                accept="image/*"
                takeLabel={t('takePhoto')}
                chooseLabel={t('choosePhoto')}
                changeLabel={t('change')}
                addedLabel={t('added')}
                tip={t('photoTip')}
                isRtl={isRtl}
              />
            </div>
            <div>
              <p className={labelClass}>{t('documentLabel')}</p>
              <MediaPicker
                file={document}
                setFile={setDocument}
                capture="environment"
                accept="image/*,application/pdf"
                takeLabel={t('scanDoc')}
                chooseLabel={t('chooseDoc')}
                changeLabel={t('change')}
                addedLabel={t('added')}
                tip={t('docTip')}
                isRtl={isRtl}
              />
            </div>

            <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-base text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-emerald-600" />
              <span>{t('consent')}</span>
            </label>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Navigation — barre collante en bas pour rester toujours visible */}
      <div className="sticky bottom-0 z-10 mt-8 border-t border-slate-200 bg-white/95 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-stretch gap-3">
          {step > minStep && (
            <Button type="button" variant="outline" size="lg" onClick={back} className="h-14 shrink-0 px-5">
              <BackIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{t('back')}</span>
            </Button>
          )}

          {step < TOTAL_STEPS - 1 ? (
            <Button
              type="button"
              size="lg"
              onClick={next}
              className="h-14 flex-1 text-lg font-bold shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/20"
            >
              {t('next')}
              <NextIcon className="beneficiaire-nudge ms-2 h-6 w-6" />
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
              className="h-14 flex-1 bg-emerald-600 text-lg font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="me-2 h-5 w-5 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                <>
                  <Check className="me-2 h-6 w-6" />
                  {t('finish')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
