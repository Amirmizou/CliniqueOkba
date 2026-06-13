import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

export const dynamic = 'force-dynamic'

const STR = [
  'badge', 'badge_ar',
  'title', 'title_ar',
  'subtitle', 'subtitle_ar',
  'note', 'note_ar'
] as const

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const conventions = await writeClient.fetch(`*[_type == "insuranceSection"][0]`)
  return NextResponse.json({ conventions: conventions || {} })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const doc: Record<string, any> = { _type: 'insuranceSection' }
    
    // Champs textes
    for (const k of STR) doc[k] = b[k] || ''
    
    // Fournisseurs (providers)
    if (Array.isArray(b.providers)) {
      doc.providers = b.providers.map((p: any) => {
        const provider: any = {
          _key: p._key || crypto.randomUUID(),
          name: p.name || '',
          name_ar: p.name_ar || '',
          description: p.description || '',
          description_ar: p.description_ar || ''
        }
        if (p.logo?._ref) {
          provider.logo = {
            _type: 'image',
            asset: { _type: 'reference', _ref: p.logo._ref }
          }
        }
        return provider
      })
    } else {
      doc.providers = []
    }

    let result
    if (b._id) {
      result = await writeClient.patch(b._id).set(doc).commit()
    } else {
      result = await writeClient.create(doc as any)
    }
    revalidateSite()
    return NextResponse.json({ ok: true, conventions: result })
  } catch (e) {
    console.error('Erreur sauvegarde conventions:', e)
    return NextResponse.json({ error: 'Échec de la sauvegarde' }, { status: 500 })
  }
}
