import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

export const dynamic = 'force-dynamic'

const STR = ['question', 'question_ar', 'answer', 'answer_ar', 'category'] as const

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const faqs = await writeClient.fetch(
    `*[_type == "faq"] | order(order asc) {
      _id, question, question_ar, answer, answer_ar, category, order, active
    }`,
  )
  return NextResponse.json({ faqs })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const doc: Record<string, any> = {
      _type: 'faq',
      order: typeof b.order === 'number' ? b.order : 0,
      active: b.active !== false,
    }
    for (const k of STR) doc[k] = b[k] || ''
    if (!doc.category) doc.category = 'general'

    let result
    if (b._id) {
      const patch: Record<string, any> = { ...doc }
      delete patch._type
      result = await writeClient.patch(b._id).set(patch).commit()
    } else {
      result = await writeClient.create(doc as any)
    }
    revalidateSite()
    return NextResponse.json({ ok: true, faq: result })
  } catch (e) {
    console.error('Erreur sauvegarde faq:', e)
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
