import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const [about, homeCare, contents, testimonials] = await Promise.all([
    writeClient.fetch(`*[_type == "aboutSection"][0]`),
    writeClient.fetch(`*[_type == "homeCare"][0]`),
    writeClient.fetch(`*[_type == "sectionContent"]`),
    writeClient.fetch(`*[_type == "testimonial"] | order(order asc)`)
  ])
  return NextResponse.json({ about, homeCare, contents, testimonials })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const docType = b._type
    
    if (!docType) return NextResponse.json({ error: 'Type invalide' }, { status: 400 })

    const doc: Record<string, any> = { _type: docType }
    
    // Remplissage générique pour tout type
    for (const [k, v] of Object.entries(b)) {
      if (k !== '_id' && k !== '_type' && k !== '_createdAt' && k !== '_updatedAt' && k !== '_rev') {
        doc[k] = v
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
    console.error('Erreur sauvegarde section:', e)
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
