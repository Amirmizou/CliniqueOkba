'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
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
  AlertCircle,
  Pencil,
  Lock,
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

// Logos locaux de secours pour les organismes sans logo dans Sanity
const LOCAL_LOGOS: Record<string, string> = {
  bna: '/images/conventions/bna.png',
  dambri: '/images/conventions/dambri-promo.png',
  dembri: '/images/conventions/dambri-promo.png',
  ensb: '/images/conventions/ensb.png',
  seaco: '/images/conventions/seaco.png',
}

/** Cherche un logo local par correspondance partielle du nom d'organisme */
function findLocalLogo(name: string): string | undefined {
  const n = name.toLowerCase()
  for (const [key, url] of Object.entries(LOCAL_LOGOS)) {
    if (n.includes(key)) return url
  }
  return undefined
}

export default function BeneficiaireForm({ organismes, logos = {} }: { organismes: string[], logos?: Record<string, string> }) {
  const t = useTranslations('beneficiaireForm')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const isRtl = locale === 'ar'

  // Merge logos de Sanity avec fallback local
  const resolvedLogos = useMemo(() => {
    const merged: Record<string, string> = { ...logos }
    for (const name of organismes) {
      if (!merged[name]) {
        const local = findLocalLogo(name)
        if (local) merged[name] = local
      }
    }
    return merged
  }, [logos, organismes])

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
  // Justificatif de propriété (facture élec/gaz/eau) — acquéreurs Dembri.
  const [justificatif, setJustificatif] = useState<File | null>(null)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  // Modification d'une inscription existante (après vérification d'identité).
  const [editMode, setEditMode] = useState(false)
  const [duplicate, setDuplicate] = useState<{ canModify: boolean; message: string } | null>(null)
  const [modifyLoading, setModifyLoading] = useState(false)

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
    setJustificatif(null)
    setConsent(false)
    setSuccess(false)
    setError('')
    setEditMode(false)
    setDuplicate(null)
    setStep(minStep)
  }

  const handleSubmit = async () => {
    setError('')
    // Photo obligatoire à l'inscription. En modification, la photo déjà
    // enregistrée reste valable : on n'exige un fichier que si l'on crée
    // une nouvelle fiche.
    if (!editMode && !photo) return setError(t('errorPhoto'))
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
      if (justificatif && isDembri(form.organisme)) fd.append('justificatif', justificatif)

      const res = await fetch('/api/beneficiaires', { method: editMode ? 'PATCH' : 'POST', body: fd })
      // Déjà inscrit : on ne crée pas de doublon, on propose la modification.
      if (res.status === 409) {
        const j = await res.json().catch(() => ({}))
        setDuplicate({ canModify: !!j.canModify, message: j.error || '' })
        goTop()
        return
      }
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

  // Vérifie l'identité (téléphone + nom + prénom + organisme) et charge SA fiche
  // pour la pré-remplir, puis bascule en mode modification.
  const startModify = async () => {
    setModifyLoading(true)
    setError('')
    try {
      const res = await fetch('/api/beneficiaires', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telephone: form.telephone,
          nom: form.nom,
          prenom: form.prenom,
          organisme: form.organisme,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || t('errorGeneric'))
      }
      const { beneficiaire: b } = await res.json()
      setForm((f) => ({
        ...f,
        email: b.email || '',
        adresse: b.adresse || '',
        num_assure: b.num_assure || '',
        projet_dedie: b.projet_dedie || f.projet_dedie,
        situation_familiale: b.situation_familiale || '',
      }))
      setMembers(
        Array.isArray(b.family_members)
          ? b.family_members.map((m: any) => ({
              nom: m.nom || '',
              prenom: m.prenom || '',
              date_naissance: m.date_naissance || '',
              lien_parente: m.lien_parente || '',
            }))
          : [],
      )
      setShowMore(true)
      setEditMode(true)
      setDuplicate(null)
      // On repart à l'étape « coordonnées » ; l'identité est verrouillée.
      setMinStep(1)
      setStep(1)
      goTop()
    } catch (err: any) {
      setError(err?.message || t('errorGeneric'))
    } finally {
      setModifyLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center shadow-xl shadow-emerald-500/10 dark:border-emerald-900 dark:bg-emerald-950/40"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.1 }}
        >
          <CheckCircle2 className="mx-auto mb-6 h-20 w-20 text-emerald-600 drop-shadow-md" />
        </motion.div>
        <h3 className="mb-3 text-3xl font-extrabold tracking-tight text-emerald-800 dark:text-emerald-300">
          {editMode ? (isRtl ? 'تم تحديث بياناتك' : 'Vos informations ont été mises à jour') : t('successTitle')}
        </h3>
        <p className="mb-8 text-lg font-medium text-emerald-700 dark:text-emerald-400">
          {editMode
            ? isRtl
              ? 'تم حفظ التعديلات بنجاح.'
              : 'Vos modifications ont bien été enregistrées.'
            : t('successMsg')}
        </p>
          {!editMode && (
            <Button onClick={resetForm} size="lg" variant="outline" className="h-12 px-8 text-base font-bold shadow-sm">
              {t('newSubmission')}
            </Button>
          )}
      </motion.div>
    )
  }

  // Écran « déjà inscrit(e) » : bloque le doublon et propose la modification.
  if (duplicate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center shadow-xl shadow-amber-500/10 dark:border-amber-900 dark:bg-amber-950/40"
      >
        <AlertCircle className="mx-auto mb-6 h-20 w-20 text-amber-600 drop-shadow-md" />
        <h3 className="mb-3 text-3xl font-extrabold tracking-tight text-amber-800 dark:text-amber-300">
          {isRtl ? 'أنت مسجّل بالفعل' : 'Vous êtes déjà inscrit(e)'}
        </h3>
        <p className="mb-8 text-lg font-medium text-amber-700 dark:text-amber-400">{duplicate.message}</p>
        {duplicate.canModify ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-base text-slate-600 dark:text-slate-300">
              {isRtl ? 'هل تريد تعديل معلوماتك؟' : 'Souhaitez-vous modifier vos informations ?'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={startModify} disabled={modifyLoading} size="lg" className="h-12 bg-emerald-600 px-8 text-base font-bold hover:bg-emerald-700">
                {modifyLoading ? <Loader2 className="me-2 h-5 w-5 animate-spin" /> : <Pencil className="me-2 h-5 w-5" />}
                {isRtl ? 'تعديل معلوماتي' : 'Modifier mes informations'}
              </Button>
              <Button onClick={() => setDuplicate(null)} size="lg" variant="outline" className="h-12 px-8 text-base font-bold">
                {isRtl ? 'رجوع' : 'Retour'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-base text-slate-600 dark:text-slate-300">
              {isRtl ? 'لتعديل هذا الملف، يرجى الاتصال بالعيادة.' : 'Pour modifier ce dossier, veuillez contacter la clinique.'}
            </p>
            <Button onClick={() => setDuplicate(null)} size="lg" variant="outline" className="h-12 px-8 text-base font-bold">
              {isRtl ? 'رجوع' : 'Retour'}
            </Button>
          </div>
        )}
      </motion.div>
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
          <motion.div
            className="h-full rounded-full bg-emerald-600"
            initial={{ width: 0 }}
            animate={{ width: `${((step - minStep + 1) / (TOTAL_STEPS - minStep)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* En-tête d'étape */}
      <div className="mb-8 flex items-start gap-4">
        <motion.div 
          key={step}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-950 dark:text-emerald-400"
        >
          <CurrentIcon className="h-7 w-7" />
        </motion.div>
        <div className="pt-1">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{stepMeta[step].title}</h2>
          <p className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">{stepMeta[step].help}</p>
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="min-h-[220px] relative">
        <AnimatePresence mode="wait">
          {/* Étape 1 : Organisme (gros boutons) */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
            {organismes.length === 0 ? (
              <p className="rounded-xl bg-amber-50 p-4 text-amber-700">{t('noOrganisme')}</p>
            ) : (
              organismes.map((o) => (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  key={o}
                  type="button"
                  onClick={() => selectOrganisme(o)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-start text-lg font-semibold transition shadow-sm ${
                    form.organisme === o
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-emerald-500/10 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:shadow-md'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {resolvedLogos[o] ? (
                      <Image src={resolvedLogos[o]} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg object-contain" />
                    ) : (
                      <Building2 className="h-6 w-6 shrink-0 text-slate-400" />
                    )}
                    <span>{o}</span>
                  </span>
                  {form.organisme === o && <Check className="h-6 w-6 text-emerald-600" />}
                </motion.button>
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
          </motion.div>
        )}

        {/* Étape 2 : Coordonnées */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Mode modification : identité verrouillée (clé de la fiche) */}
            {editMode && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div className="text-sm text-emerald-800 dark:text-emerald-300">
                  <p className="font-semibold">
                    {isRtl ? 'تعديل بياناتك' : 'Modification de vos informations'}
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    {isRtl
                      ? `${form.prenom} ${form.nom} — ${form.organisme}. الاسم والهاتف والهيئة مقفلة؛ عدّل بقية المعلومات ثم احفظ.`
                      : `${form.prenom} ${form.nom} — ${form.organisme}. Le nom, le téléphone et l'organisme sont verrouillés ; modifiez le reste puis enregistrez.`}
                  </p>
                </div>
              </div>
            )}
            <div>
              <label className={labelClass} htmlFor="prenom">
                {t('prenom')} <span className="text-red-500">*</span>
              </label>
              <input id="prenom" dir="ltr" lang="fr" disabled={editMode} className={`${inputClass} ${editMode ? 'cursor-not-allowed opacity-60' : ''}`} value={form.prenom} onChange={(e) => set('prenom', stripArabic(e.target.value))} />
            </div>
            <div>
              <label className={labelClass} htmlFor="nom">
                {t('nom')} <span className="text-red-500">*</span>
              </label>
              <input id="nom" dir="ltr" lang="fr" disabled={editMode} className={`${inputClass} ${editMode ? 'cursor-not-allowed opacity-60' : ''}`} value={form.nom} onChange={(e) => set('nom', stripArabic(e.target.value))} />
              {!editMode && <p className="mt-1.5 text-sm text-amber-600 dark:text-amber-400">{t('nameLatinHint')}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="telephone">
                {t('telephone')} <span className="text-red-500">*</span>
              </label>
              <input id="telephone" type="tel" inputMode="tel" disabled={editMode} className={`${inputClass} ${editMode ? 'cursor-not-allowed opacity-60' : ''}`} value={form.telephone} onChange={(e) => set('telephone', e.target.value)} placeholder="0X XX XX XX XX" />
            </div>

            <AnimatePresence mode="wait">
              {!showMore ? (
                <motion.button 
                  key="btn"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  type="button" 
                  onClick={() => setShowMore(true)} 
                  className="mt-2 text-base font-medium text-emerald-600 hover:underline"
                >
                  + {t('moreInfo')}
                </motion.button>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50"
                >
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
              </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          )}

          {/* Étape 3 : Situation familiale + ayants droit */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
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
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={s.key}
                    type="button"
                    onClick={() => {
                      setError('')
                      set('situation_familiale', s.key)
                    }}
                    className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold transition shadow-sm ${
                      form.situation_familiale === s.key
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-emerald-500/10 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:shadow-md'
                    }`}
                  >
                    {s.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {form.situation_familiale && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                    {form.situation_familiale === 'marie' ? t('ayantsDroitMarie') : t('ayantsDroitCelibataire')}
                  </p>
                  {members.length > 0 && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">{t('nameLatinHint')}</p>
                  )}

                  <AnimatePresence>
                  {members.map((m, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden', marginTop: 0 }}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
                    >
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
                    </motion.div>
                  ))}
                  </AnimatePresence>

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
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Étape 4 : Photos + consentement */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <p className={labelClass}>
                {t('photoLabel')} <span className="text-red-500">*</span>
              </p>
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

            {/* Justificatif de propriété — uniquement pour les acquéreurs (Dembri) */}
            {isDembri(form.organisme) && (
              <div>
                <p className={labelClass}>
                  {isRtl
                    ? 'إثبات الملكية (فاتورة الكهرباء أو الغاز أو الماء)'
                    : 'Justificatif de propriété (facture électricité, gaz ou eau)'}
                </p>
                <MediaPicker
                  file={justificatif}
                  setFile={setJustificatif}
                  capture="environment"
                  accept="image/*,application/pdf"
                  takeLabel={isRtl ? 'تصوير الفاتورة' : 'Scanner la facture'}
                  chooseLabel={t('chooseDoc')}
                  changeLabel={t('change')}
                  addedLabel={t('added')}
                  tip={
                    isRtl
                      ? 'فاتورة حديثة باسم المالك لإثبات ملكية السكن.'
                      : 'Une facture récente au nom du propriétaire pour prouver la propriété du logement.'
                  }
                  isRtl={isRtl}
                />
              </div>
            )}

            <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-base text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-emerald-600" />
              <span>{t('consent')}</span>
            </label>
            </motion.div>
          )}
        </AnimatePresence>
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
                  {editMode ? (isRtl ? 'حفظ التعديلات' : 'Enregistrer les modifications') : t('finish')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {submitting && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md dark:bg-slate-950/90"
          >
            <div className="flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-100 shadow-xl shadow-emerald-500/20 dark:bg-emerald-900/50"
              >
                <Loader2 className="h-12 w-12 animate-spin text-emerald-600 dark:text-emerald-300" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-extrabold tracking-wide text-emerald-800 dark:text-emerald-300"
              >
                {t('submitting')}...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-3 text-base font-semibold text-emerald-600/80 dark:text-emerald-400/80"
              >
                {isRtl ? 'جاري تأمين بياناتك الطبية...' : 'Sécurisation de vos données médicales...'}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
