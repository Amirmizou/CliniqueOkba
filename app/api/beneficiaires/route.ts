import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { RateLimiter } from '@/lib/rate-limit'
import { getSupabaseAdmin, BENEFICIAIRES_BUCKET } from '@/lib/supabase'
import { getInsuranceSection } from '@/sanity/lib/fetch'

export const dynamic = 'force-dynamic'

// Liste des organismes conventionnés (info publique, déjà visible sur la page
// d'inscription). Sert à générer les liens de partage côté admin.
export async function GET() {
  try {
    const insurance = await getInsuranceSection()
    const organismes: string[] = Array.isArray((insurance as any)?.providers)
      ? (insurance as any).providers
          .map((p: { name?: string }) => (p?.name || '').trim())
          .filter((n: string) => n.length > 0)
      : []
    return NextResponse.json({ organismes })
  } catch (e) {
    console.error('Erreur GET organismes bénéficiaires:', e)
    return NextResponse.json({ organismes: [] })
  }
}

// Un bénéficiaire ne devrait pas soumettre en rafale : 3 / minute / IP.
const rateLimiter = new RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
  prefix: 'rl:beneficiaire',
})

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8 Mo
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
// Justificatif de propriété (facture électricité/gaz/eau) : mêmes formats qu'un
// document scanné. Concerne les acquéreurs (Promotion Dembri).
const JUSTIF_TYPES = DOC_TYPES

const isDembri = (o: string) => {
  const s = (o || '').toLowerCase()
  return s.includes('dembri') || s.includes('dambri')
}

const familyMemberSchema = z.object({
  nom: z.string().trim().min(1).max(80),
  prenom: z.string().trim().min(1).max(80),
  date_naissance: z.string().trim().max(20).optional().default(''),
  lien_parente: z.string().trim().max(40).optional().default(''),
})

const beneficiarySchema = z.object({
  organisme: z.string().trim().min(1, 'Organisme requis').max(120),
  nom: z.string().trim().min(1, 'Nom requis').max(80),
  prenom: z.string().trim().min(1, 'Prénom requis').max(80),
  telephone: z.string().trim().min(6, 'Téléphone requis').max(30),
  email: z.string().trim().email().max(120).optional().or(z.literal('')),
  adresse: z.string().trim().max(300).optional().or(z.literal('')),
  num_assure: z.string().trim().max(60).optional().or(z.literal('')),
  family_members: z.array(familyMemberSchema).max(20).default([]),
  projet_dedie: z.string().trim().max(120).optional().or(z.literal('')),
  situation_familiale: z.enum(['celibataire', 'marie']).optional().or(z.literal('')),
})

// Les nom/prénom doivent rester en caractères latins (français) pour l'app
// métier : on retire toute lettre arabe, même si l'API est appelée directement.
const ARABIC_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/g
const stripArabic = (s: string) => s.replace(ARABIC_RE, '').replace(/\s{2,}/g, ' ').trim()

// Normalisations pour l'identification d'un bénéficiaire déjà inscrit.
const normPhone = (s: string) => (s || '').replace(/[^\d+]/g, '')
const normName = (s: string) => stripArabic(s || '').toLowerCase()
const normOrg = (s: string) => (s || '').trim().toLowerCase()

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function slugify(s: string) {
  return (
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 40) || 'organisme'
  )
}

type Supa = NonNullable<ReturnType<typeof getSupabaseAdmin>>

interface Identity {
  telephone: string
  nom: string
  prenom: string
  organisme: string
}

/**
 * Retrouve la fiche d'un bénéficiaire à partir de ses 4 champs d'identité
 * (téléphone + nom + prénom + organisme). Sert de vérification légère : sans
 * connaître ces 4 informations, on ne peut pas accéder à une fiche.
 */
async function findOwnRecord(supabase: Supa, ident: Identity) {
  const telKey = normPhone(ident.telephone)
  if (!telKey) return null
  const { data: rows } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('telephone', telKey)
  const match = (rows || []).find(
    (r: any) =>
      normName(r.nom) === normName(ident.nom) &&
      normName(r.prenom) === normName(ident.prenom) &&
      normOrg(r.organisme) === normOrg(ident.organisme),
  )
  return match || null
}

async function uploadFile(
  supabase: Supa,
  file: File,
  prefix: string,
  allowedTypes: string[],
): Promise<{ path?: string; error?: string }> {
  if (!allowedTypes.includes(file.type)) {
    return { error: `Type de fichier non autorisé (${file.type || 'inconnu'}).` }
  }
  if (file.size > MAX_FILE_BYTES) {
    return { error: 'Fichier trop volumineux (max 8 Mo).' }
  }
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5)
  const path = `${prefix}/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await supabase.storage
    .from(BENEFICIAIRES_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false })
  if (error) return { error: error.message }
  return { path }
}

async function checkRateLimit(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  return rateLimiter.check(ip, 3)
}

/** Parse et valide le corps multipart commun à la création et à la modification. */
async function parseForm(form: FormData) {
  let familyMembers: unknown = []
  const rawMembers = form.get('family_members')
  if (typeof rawMembers === 'string' && rawMembers.trim()) {
    try {
      familyMembers = JSON.parse(rawMembers)
    } catch {
      return { error: 'Membres de la famille invalides.' as const }
    }
  }

  const parsed = beneficiarySchema.safeParse({
    organisme: form.get('organisme'),
    nom: form.get('nom'),
    prenom: form.get('prenom'),
    telephone: form.get('telephone'),
    email: form.get('email') ?? '',
    adresse: form.get('adresse') ?? '',
    num_assure: form.get('num_assure') ?? '',
    projet_dedie: form.get('projet_dedie') ?? '',
    situation_familiale: form.get('situation_familiale') ?? '',
    family_members: familyMembers,
  })
  if (!parsed.success) {
    return { error: 'Données invalides.' as const, details: parsed.error.flatten().fieldErrors }
  }

  const data = parsed.data
  // Nom/prénom en caractères latins uniquement (bénéficiaire + ayants droit).
  data.nom = stripArabic(data.nom)
  data.prenom = stripArabic(data.prenom)
  data.family_members = data.family_members.map((m) => ({
    ...m,
    nom: stripArabic(m.nom),
    prenom: stripArabic(m.prenom),
  }))
  if (!data.nom || !data.prenom) {
    return { error: 'Nom et prénom requis en caractères latins.' as const }
  }
  return { data }
}

export async function POST(request: Request) {
  try {
    const rl = await checkRateLimit(request)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer dans une minute.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      console.error('Supabase non configuré (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
      return NextResponse.json({ error: 'Service indisponible pour le moment.' }, { status: 503 })
    }

    const form = await request.formData()
    const parsed = await parseForm(form)
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error, details: parsed.details }, { status: 400 })
    }
    const data = parsed.data
    const telKey = normPhone(data.telephone)
    const orgSlug = slugify(data.organisme)

    // Anti-doublon : un même numéro de téléphone ne peut être inscrit qu'une fois.
    const { data: existing } = await supabase
      .from('beneficiaries')
      .select('id, nom, prenom, organisme')
      .eq('telephone', telKey)
    if (existing && existing.length > 0) {
      const sameIdentity = existing.some(
        (r: any) =>
          normName(r.nom) === normName(data.nom) &&
          normName(r.prenom) === normName(data.prenom) &&
          normOrg(r.organisme) === normOrg(data.organisme),
      )
      return NextResponse.json(
        {
          error: sameIdentity
            ? 'Vous êtes déjà inscrit(e) avec ce numéro de téléphone.'
            : 'Ce numéro de téléphone est déjà utilisé pour une inscription.',
          alreadyRegistered: true,
          canModify: sameIdentity,
        },
        { status: 409 },
      )
    }

    // Uploads (optionnels mais fortement recommandés)
    let photoPath: string | undefined
    let documentPath: string | undefined

    const photo = form.get('photo')
    if (photo instanceof File && photo.size > 0) {
      const res = await uploadFile(supabase, photo, `${orgSlug}/photos`, PHOTO_TYPES)
      if (res.error) return NextResponse.json({ error: `Photo : ${res.error}` }, { status: 400 })
      photoPath = res.path
    }

    const document = form.get('document')
    if (document instanceof File && document.size > 0) {
      const res = await uploadFile(supabase, document, `${orgSlug}/documents`, DOC_TYPES)
      if (res.error) return NextResponse.json({ error: `Document : ${res.error}` }, { status: 400 })
      documentPath = res.path
    }

    // Justificatif de propriété : uniquement pour les acquéreurs (Dembri).
    let justificatifPath: string | undefined
    const justificatif = form.get('justificatif')
    if (isDembri(data.organisme) && justificatif instanceof File && justificatif.size > 0) {
      const res = await uploadFile(supabase, justificatif, `${orgSlug}/justificatifs`, JUSTIF_TYPES)
      if (res.error) return NextResponse.json({ error: `Justificatif : ${res.error}` }, { status: 400 })
      justificatifPath = res.path
    }

    const { data: inserted, error: dbError } = await supabase
      .from('beneficiaries')
      .insert({
        organisme: data.organisme,
        nom: data.nom,
        prenom: data.prenom,
        telephone: telKey,
        email: data.email || null,
        adresse: data.adresse || null,
        num_assure: data.num_assure || null,
        projet_dedie: data.projet_dedie || null,
        situation_familiale: data.situation_familiale || null,
        family_members: data.family_members,
        photo_path: photoPath ?? null,
        document_path: documentPath ?? null,
        justificatif_path: justificatifPath ?? null,
        status: 'en_attente',
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Erreur insertion bénéficiaire:', dbError)
      const toRemove = [photoPath, documentPath, justificatifPath].filter(Boolean) as string[]
      if (toRemove.length) {
        await supabase.storage.from(BENEFICIAIRES_BUCKET).remove(toRemove).catch(() => {})
      }
      return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 })
    }

    // Notification email à la clinique (best-effort, ne bloque pas la réponse)
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const toEmail = process.env.CLINIC_EMAIL || 'contact@cliniqueokba.com'
      const fromEmail = process.env.MAIL_FROM || 'Clinique Okba <onboarding@resend.dev>'
      const resend = new Resend(apiKey)
      resend.emails
        .send({
          from: fromEmail,
          to: [toEmail],
          subject: `Nouvelle inscription bénéficiaire — ${escapeHtml(data.organisme)}`,
          html: `<p>Nouvelle inscription de bénéficiaire en attente de validation.</p>
                 <p><strong>Organisme :</strong> ${escapeHtml(data.organisme)}</p>
                 <p><strong>Nom :</strong> ${escapeHtml(data.prenom)} ${escapeHtml(data.nom)}</p>
                 <p><strong>Téléphone :</strong> ${escapeHtml(data.telephone)}</p>
                 <p><strong>Membres de la famille :</strong> ${data.family_members.length}</p>
                 <p>Consultez l'espace admin → Bénéficiaires pour valider.</p>`,
        })
        .catch((e) => console.error('Email notification bénéficiaire échoué:', e))
    }

    return NextResponse.json({ ok: true, id: inserted.id })
  } catch (e) {
    console.error('Erreur API bénéficiaires:', e)
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 })
  }
}

/**
 * Vérification d'identité + lecture de SA fiche (pour pré-remplir la
 * modification). Corps JSON : { telephone, nom, prenom, organisme }.
 * Renvoie uniquement les champs modifiables du bénéficiaire correspondant.
 */
export async function PUT(request: Request) {
  try {
    const rl = await checkRateLimit(request)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer dans une minute.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }
    const supabase = getSupabaseAdmin()
    if (!supabase) return NextResponse.json({ error: 'Service indisponible pour le moment.' }, { status: 503 })

    const body = await request.json().catch(() => null)
    const ident: Identity = {
      telephone: String(body?.telephone || '').trim(),
      nom: stripArabic(String(body?.nom || '')),
      prenom: stripArabic(String(body?.prenom || '')),
      organisme: String(body?.organisme || '').trim(),
    }
    if (!ident.telephone || !ident.nom || !ident.prenom || !ident.organisme) {
      return NextResponse.json({ error: 'Informations d’identification incomplètes.' }, { status: 400 })
    }

    const rec = await findOwnRecord(supabase, ident)
    if (!rec) {
      return NextResponse.json(
        { error: 'Aucune inscription trouvée avec ces informations.' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      beneficiaire: {
        organisme: rec.organisme,
        nom: rec.nom,
        prenom: rec.prenom,
        telephone: rec.telephone,
        email: rec.email || '',
        adresse: rec.adresse || '',
        num_assure: rec.num_assure || '',
        projet_dedie: rec.projet_dedie || '',
        situation_familiale: rec.situation_familiale || '',
        family_members: Array.isArray(rec.family_members) ? rec.family_members : [],
        hasPhoto: !!rec.photo_path,
        hasDocument: !!rec.document_path,
        hasJustificatif: !!rec.justificatif_path,
        status: rec.status,
      },
    })
  } catch (e) {
    console.error('Erreur PUT bénéficiaire (lookup):', e)
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 })
  }
}

/**
 * Mise à jour de SA propre fiche. Multipart, avec les 4 champs d'identité
 * (téléphone + nom + prénom + organisme) qui servent de vérification et qui
 * restent la clé (non modifiables). Les autres champs sont mis à jour.
 */
export async function PATCH(request: Request) {
  try {
    const rl = await checkRateLimit(request)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer dans une minute.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }
    const supabase = getSupabaseAdmin()
    if (!supabase) return NextResponse.json({ error: 'Service indisponible pour le moment.' }, { status: 503 })

    const form = await request.formData()
    const parsed = await parseForm(form)
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error, details: parsed.details }, { status: 400 })
    }
    const data = parsed.data

    // Vérification : la fiche doit exister et correspondre aux 4 champs d'identité.
    const rec = await findOwnRecord(supabase, data)
    if (!rec) {
      return NextResponse.json(
        { error: 'Aucune inscription trouvée avec ces informations.', notFound: true },
        { status: 404 },
      )
    }
    const orgSlug = slugify(data.organisme)

    // Nouveaux fichiers (facultatifs) : on remplace ceux existants.
    let photoPath: string | undefined
    let documentPath: string | undefined
    const photo = form.get('photo')
    if (photo instanceof File && photo.size > 0) {
      const res = await uploadFile(supabase, photo, `${orgSlug}/photos`, PHOTO_TYPES)
      if (res.error) return NextResponse.json({ error: `Photo : ${res.error}` }, { status: 400 })
      photoPath = res.path
    }
    const document = form.get('document')
    if (document instanceof File && document.size > 0) {
      const res = await uploadFile(supabase, document, `${orgSlug}/documents`, DOC_TYPES)
      if (res.error) return NextResponse.json({ error: `Document : ${res.error}` }, { status: 400 })
      documentPath = res.path
    }
    let justificatifPath: string | undefined
    const justificatif = form.get('justificatif')
    if (isDembri(data.organisme) && justificatif instanceof File && justificatif.size > 0) {
      const res = await uploadFile(supabase, justificatif, `${orgSlug}/justificatifs`, JUSTIF_TYPES)
      if (res.error) return NextResponse.json({ error: `Justificatif : ${res.error}` }, { status: 400 })
      justificatifPath = res.path
    }

    // On ne touche PAS à la clé d'identité (nom/prénom/téléphone/organisme).
    const patch: Record<string, unknown> = {
      email: data.email || null,
      adresse: data.adresse || null,
      num_assure: data.num_assure || null,
      projet_dedie: data.projet_dedie || null,
      situation_familiale: data.situation_familiale || null,
      family_members: data.family_members,
      // Une modification remet le dossier « à traiter » côté application métier.
      traite: false,
      traite_at: null,
    }
    if (photoPath) patch.photo_path = photoPath
    if (documentPath) patch.document_path = documentPath
    if (justificatifPath) patch.justificatif_path = justificatifPath

    const { error: upErr } = await supabase.from('beneficiaries').update(patch).eq('id', rec.id)
    if (upErr) {
      console.error('Erreur mise à jour bénéficiaire:', upErr)
      const toRemove = [photoPath, documentPath, justificatifPath].filter(Boolean) as string[]
      if (toRemove.length) {
        await supabase.storage.from(BENEFICIAIRES_BUCKET).remove(toRemove).catch(() => {})
      }
      return NextResponse.json({ error: 'Échec de la mise à jour.' }, { status: 500 })
    }

    // Nettoyage best-effort des anciens fichiers remplacés.
    const oldFiles = [
      photoPath ? rec.photo_path : null,
      documentPath ? rec.document_path : null,
      justificatifPath ? rec.justificatif_path : null,
    ].filter(Boolean) as string[]
    if (oldFiles.length) {
      await supabase.storage.from(BENEFICIAIRES_BUCKET).remove(oldFiles).catch(() => {})
    }

    return NextResponse.json({ ok: true, updated: true })
  } catch (e) {
    console.error('Erreur PATCH bénéficiaire (update):', e)
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 })
  }
}
