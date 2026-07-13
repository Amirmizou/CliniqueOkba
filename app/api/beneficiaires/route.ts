import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { RateLimiter } from '@/lib/rate-limit'
import { getSupabaseAdmin, BENEFICIAIRES_BUCKET } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Un bénéficiaire ne devrait pas soumettre en rafale : 3 / minute / IP.
const rateLimiter = new RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
  prefix: 'rl:beneficiaire',
})

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8 Mo
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

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
})

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

async function uploadFile(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
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

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const rl = await rateLimiter.check(ip, 3)
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

    // family_members arrive en JSON stringifié depuis le formulaire
    let familyMembers: unknown = []
    const rawMembers = form.get('family_members')
    if (typeof rawMembers === 'string' && rawMembers.trim()) {
      try {
        familyMembers = JSON.parse(rawMembers)
      } catch {
        return NextResponse.json({ error: 'Membres de la famille invalides.' }, { status: 400 })
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
      family_members: familyMembers,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides.', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }
    const data = parsed.data
    const orgSlug = slugify(data.organisme)

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

    const { data: inserted, error: dbError } = await supabase
      .from('beneficiaries')
      .insert({
        organisme: data.organisme,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        email: data.email || null,
        adresse: data.adresse || null,
        num_assure: data.num_assure || null,
        family_members: data.family_members,
        photo_path: photoPath ?? null,
        document_path: documentPath ?? null,
        status: 'en_attente',
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Erreur insertion bénéficiaire:', dbError)
      // Nettoyage best-effort des fichiers déjà uploadés
      const toRemove = [photoPath, documentPath].filter(Boolean) as string[]
      if (toRemove.length) {
        await supabase.storage.from(BENEFICIAIRES_BUCKET).remove(toRemove).catch(() => {})
      }
      return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 })
    }

    // Notification email à la clinique (best-effort, ne bloque pas la réponse)
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const toEmail = process.env.CLINIC_EMAIL || 'contact@cliniqueokba.com'
      const resend = new Resend(apiKey)
      resend.emails
        .send({
          from: 'Clinique Okba <onboarding@resend.dev>',
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
