import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin/api'
import { getSupabaseAdmin, BENEFICIAIRES_BUCKET } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const SIGNED_URL_TTL = 60 * 60 // 1h

interface BeneficiaryRow {
  id: string
  organisme: string
  nom: string
  prenom: string
  telephone: string
  email: string | null
  adresse: string | null
  num_assure: string | null
  family_members: Array<{ nom?: string; prenom?: string; date_naissance?: string; lien_parente?: string }>
  photo_path: string | null
  document_path: string | null
  status: string
  notes_admin: string | null
  created_at: string
}

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v)
  return `"${s.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 })

  const url = new URL(request.url)
  const organisme = url.searchParams.get('organisme') || ''
  const status = url.searchParams.get('status') || ''
  // Nettoyage : on retire les caractères qui ont un sens dans la syntaxe
  // PostgREST .or() (virgules, parenthèses, %, *) pour éviter de casser le filtre.
  const search = (url.searchParams.get('search') || '').replace(/[,()%*]/g, ' ').trim()
  const format = url.searchParams.get('format') || ''

  let query = supabase.from('beneficiaries').select('*').order('created_at', { ascending: false })
  if (organisme) query = query.eq('organisme', organisme)
  if (status) query = query.eq('status', status)
  if (search) query = query.or(`nom.ilike.%${search}%,prenom.ilike.%${search}%,telephone.ilike.%${search}%`)

  const { data, error } = await query
  if (error) {
    console.error('Erreur lecture bénéficiaires:', error)
    return NextResponse.json({ error: 'Échec de la lecture' }, { status: 500 })
  }
  const rows = (data || []) as BeneficiaryRow[]

  // Export CSV (une ligne par bénéficiaire)
  if (format === 'csv') {
    const header = [
      'Organisme',
      'Nom',
      'Prénom',
      'Téléphone',
      'Email',
      'Adresse',
      'N° assuré',
      'Statut',
      'Membres famille',
      'Date inscription',
    ]
    const lines = rows.map((r) =>
      [
        r.organisme,
        r.nom,
        r.prenom,
        r.telephone,
        r.email,
        r.adresse,
        r.num_assure,
        r.status,
        (r.family_members || [])
          .map((m) => `${m.prenom || ''} ${m.nom || ''} (${m.lien_parente || '—'})`.trim())
          .join(' ; '),
        new Date(r.created_at).toLocaleString('fr-FR'),
      ]
        .map(csvCell)
        .join(','),
    )
    const csv = '﻿' + [header.map(csvCell).join(','), ...lines].join('\r\n')
    const fname = `beneficiaires${organisme ? '-' + organisme.replace(/[^a-zA-Z0-9]+/g, '-') : ''}.csv`
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fname}"`,
      },
    })
  }

  // Générer les URLs signées pour photo + document
  const beneficiaries = await Promise.all(
    rows.map(async (r) => {
      let photoUrl: string | null = null
      let documentUrl: string | null = null
      if (r.photo_path) {
        const { data: s } = await supabase.storage
          .from(BENEFICIAIRES_BUCKET)
          .createSignedUrl(r.photo_path, SIGNED_URL_TTL)
        photoUrl = s?.signedUrl ?? null
      }
      if (r.document_path) {
        const { data: s } = await supabase.storage
          .from(BENEFICIAIRES_BUCKET)
          .createSignedUrl(r.document_path, SIGNED_URL_TTL)
        documentUrl = s?.signedUrl ?? null
      }
      return { ...r, photoUrl, documentUrl }
    }),
  )

  // Comptage par organisme (pour les filtres + résumé)
  const byOrganisme: Record<string, number> = {}
  for (const r of rows) byOrganisme[r.organisme] = (byOrganisme[r.organisme] || 0) + 1

  return NextResponse.json({ beneficiaries, byOrganisme, total: rows.length })
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 })

  try {
    const { id, status, notes_admin } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

    const patch: Record<string, unknown> = {}
    if (status && ['en_attente', 'valide', 'rejete'].includes(status)) patch.status = status
    if (typeof notes_admin === 'string') patch.notes_admin = notes_admin
    if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'Rien à modifier' }, { status: 400 })

    const { error } = await supabase.from('beneficiaries').update(patch).eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Erreur mise à jour bénéficiaire:', e)
    return NextResponse.json({ error: 'Échec de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 503 })

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

    // Récupérer les chemins de fichiers pour les supprimer du stockage
    const { data: row } = await supabase
      .from('beneficiaries')
      .select('photo_path, document_path')
      .eq('id', id)
      .single()

    const toRemove = [row?.photo_path, row?.document_path].filter(Boolean) as string[]
    if (toRemove.length) {
      await supabase.storage.from(BENEFICIAIRES_BUCKET).remove(toRemove).catch(() => {})
    }

    const { error } = await supabase.from('beneficiaries').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Erreur suppression bénéficiaire:', e)
    return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 })
  }
}
