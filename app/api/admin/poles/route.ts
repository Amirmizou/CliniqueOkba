import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

/**
 * Gestion des pôles (schéma `pole`).
 *  GET / POST / DELETE(?id=)
 */
export const dynamic = 'force-dynamic'

const STR = ['title', 'title_ar', 'description', 'description_ar', 'intro', 'intro_ar',
  'iconName', 'accentColor', 'badge', 'badge_ar'] as const

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'pole'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const poles = await writeClient.fetch(
    `*[_type == "pole"] | order(order asc) {
      _id, ${STR.join(', ')}, "slug": slug.current, items, items_ar,
      order, active, urgent, featured
    }`,
  )
  return NextResponse.json({ poles })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const doc: Record<string, any> = {
      _type: 'pole',
      items: Array.isArray(b.items) ? b.items.filter(Boolean) : [],
      items_ar: Array.isArray(b.items_ar) ? b.items_ar.filter(Boolean) : [],
      order: typeof b.order === 'number' ? b.order : 0,
      active: b.active !== false,
      urgent: !!b.urgent,
      featured: !!b.featured,
    }
    for (const k of STR) doc[k] = b[k] || ''
    if (!doc.iconName) doc.iconName = 'Stethoscope'
    if (!doc.accentColor) doc.accentColor = '#006633'

    let result
    if (b._id) {
      const patch: Record<string, any> = { ...doc }
      delete patch._type
      result = await writeClient.patch(b._id).set(patch).commit()
    } else {
      // Slug obligatoire : fourni ou dérivé du titre
      const current = (b.slug && String(b.slug).trim()) || slugify(b.title || '')
      doc.slug = { _type: 'slug', current }
      result = await writeClient.create(doc as { _type: string; [k: string]: any })
    }
    revalidateSite()
    return NextResponse.json({ ok: true, pole: result })
  } catch (e) {
    console.error('Erreur sauvegarde pôle:', e)
    return NextResponse.json({ error: 'Échec de la sauvegarde' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id manquant' }, { status: 400 })
    await writeClient.delete(id)
    revalidateSite()
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 })
  }
}
