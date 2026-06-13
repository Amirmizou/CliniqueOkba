import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

/**
 * Gestion des médecins (schéma `doctor`).
 *  GET    -> liste
 *  POST   -> crée / met à jour
 *  DELETE -> ?id=<_id>
 */
export const dynamic = 'force-dynamic'

const STR = ['name', 'name_ar', 'specialty', 'specialty_ar', 'title', 'title_ar',
  'subtitle', 'subtitle_ar', 'experience', 'experience_ar',
  'consultationDays', 'consultationDays_ar', 'consultationHours', 'consultationHours_ar',
  'accentColor', 'iconName'] as const

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const doctors = await writeClient.fetch(
    `*[_type == "doctor"] | order(order asc) {
      _id, ${STR.join(', ')}, services, services_ar, order, active,
      "imageUrl": image.asset->url, "imageAssetId": image.asset->_id
    }`,
  )
  return NextResponse.json({ doctors })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const doc: Record<string, any> = {
      _type: 'doctor',
      services: Array.isArray(b.services) ? b.services.filter(Boolean) : [],
      services_ar: Array.isArray(b.services_ar) ? b.services_ar.filter(Boolean) : [],
      order: typeof b.order === 'number' ? b.order : 0,
      active: b.active !== false,
    }
    for (const k of STR) doc[k] = b[k] || ''
    if (b.imageAssetId) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: b.imageAssetId } }
    }

    let result
    if (b._id) {
      const patch: Record<string, any> = { ...doc }
      delete patch._type
      if (!b.imageAssetId) delete patch.image
      result = await writeClient.patch(b._id).set(patch).commit()
    } else {
      result = await writeClient.create(doc as { _type: string; [k: string]: any })
    }
    revalidateSite()
    return NextResponse.json({ ok: true, doctor: result })
  } catch (e) {
    console.error('Erreur sauvegarde médecin:', e)
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
