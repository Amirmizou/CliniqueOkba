import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

export const dynamic = 'force-dynamic'

const STR = [
  'clinicName', 'clinicName_ar',
  'description', 'description_ar',
  'phone', 'whatsappNumber',
  'appointmentMessage', 'appointmentMessage_ar',
  'email',
  'address', 'address_ar'
] as const

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const settings = await writeClient.fetch(`*[_type == "siteSettings"][0]`)
  return NextResponse.json({ settings: settings || {} })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const doc: Record<string, any> = { _type: 'siteSettings' }
    
    // Champs textes
    for (const k of STR) doc[k] = b[k] || ''
    
    // Objet coordinates
    if (b.coordinates) {
      doc.coordinates = {
        lat: Number(b.coordinates.lat) || 0,
        lng: Number(b.coordinates.lng) || 0
      }
    }

    // Objets hours et hours_ar
    if (b.hours) doc.hours = b.hours
    if (b.hours_ar) doc.hours_ar = b.hours_ar

    // Objet socialLinks
    if (b.socialLinks) doc.socialLinks = b.socialLinks

    // Référence logo
    if (b.logo?._ref) {
      doc.logo = {
        _type: 'image',
        asset: { _type: 'reference', _ref: b.logo._ref }
      }
    } else {
      doc.logo = null
    }

    let result
    if (b._id) {
      result = await writeClient.patch(b._id).set(doc).commit()
    } else {
      result = await writeClient.create(doc as any)
    }
    revalidateSite()
    return NextResponse.json({ ok: true, settings: result })
  } catch (e) {
    console.error('Erreur sauvegarde siteSettings:', e)
    return NextResponse.json({ error: 'Échec de la sauvegarde' }, { status: 500 })
  }
}
