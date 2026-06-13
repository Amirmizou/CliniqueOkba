import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const [photos, equipements] = await Promise.all([
    writeClient.fetch(`*[_type == "facilityPhoto"] | order(order asc)`),
    writeClient.fetch(`*[_type == "equipment"] | order(order asc)`)
  ])
  return NextResponse.json({ photos, equipements })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const docType = b._type
    
    if (docType !== 'facilityPhoto' && docType !== 'equipment') {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 })
    }

    const doc: Record<string, any> = { _type: docType }
    
    if (docType === 'facilityPhoto') {
      doc.title = b.title || ''
      doc.title_ar = b.title_ar || ''
      doc.description = b.description || ''
      doc.description_ar = b.description_ar || ''
      doc.category = b.category || 'accueil'
      doc.featured = !!b.featured
      doc.active = b.active !== false
      doc.order = typeof b.order === 'number' ? b.order : 0
      
      if (b.image?._ref) {
        doc.image = { _type: 'image', asset: { _type: 'reference', _ref: b.image._ref } }
      }
    } else if (docType === 'equipment') {
      doc.name = b.name || ''
      doc.name_ar = b.name_ar || ''
      doc.brand = b.brand || ''
      doc.model = b.model || ''
      doc.category = b.category || 'facility'
      doc.description = b.description || ''
      doc.description_ar = b.description_ar || ''
      doc.icon = b.icon || 'Activity'
      doc.features = Array.isArray(b.features) ? b.features : []
      doc.features_ar = Array.isArray(b.features_ar) ? b.features_ar : []
      doc.order = typeof b.order === 'number' ? b.order : 0
      
      if (b.image?._ref) {
        doc.image = { _type: 'image', asset: { _type: 'reference', _ref: b.image._ref } }
      }
    }

    let result
    if (b._id) {
      result = await writeClient.patch(b._id).set(doc).commit()
    } else {
      result = await writeClient.create(doc as any)
    }
    revalidateSite()
    return NextResponse.json({ ok: true, item: result })
  } catch (e) {
    console.error('Erreur sauvegarde galerie:', e)
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
