import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

export const dynamic = 'force-dynamic'

const STR = [
  'description', 'description_ar',
  'copyright', 'copyright_ar',
  'newsletterTitle', 'newsletterTitle_ar',
  'newsletterDescription', 'newsletterDescription_ar'
] as const

const ARRAYS = [
  'quickLinks', 'quickLinks_ar',
  'servicesLinks', 'servicesLinks_ar',
  'legalLinks', 'legalLinks_ar'
] as const

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const footer = await writeClient.fetch(`*[_type == "footerContent"][0]`)
  return NextResponse.json({ footer: footer || {} })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const doc: Record<string, any> = { _type: 'footerContent' }
    
    // Champs textes
    for (const k of STR) doc[k] = b[k] || ''
    
    // Tableaux de liens
    for (const k of ARRAYS) {
      if (Array.isArray(b[k])) {
        doc[k] = b[k].map((link: any) => ({
          label: link.label || '',
          href: link.href || ''
        }))
      } else {
        doc[k] = []
      }
    }

    // Booléens
    doc.showNewsletter = !!b.showNewsletter

    let result
    if (b._id) {
      result = await writeClient.patch(b._id).set(doc).commit()
    } else {
      result = await writeClient.create(doc as any)
    }
    revalidateSite()
    return NextResponse.json({ ok: true, footer: result })
  } catch (e) {
    console.error('Erreur sauvegarde footerContent:', e)
    return NextResponse.json({ error: 'Échec de la sauvegarde' }, { status: 500 })
  }
}
