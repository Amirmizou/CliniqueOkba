import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

export const dynamic = 'force-dynamic'

const STR = ['title', 'title_ar', 'excerpt', 'excerpt_ar', 'category', 'author', 'publishedAt'] as const

// Helper to convert plain text with line breaks to Portable Text blocks
function textToBlocks(text: string | null | undefined) {
  if (!text || text.trim() === '') return []
  return text.split('\n').map((line, idx) => ({
    _type: 'block',
    _key: crypto.randomUUID(),
    style: 'normal',
    children: [{ _type: 'span', _key: crypto.randomUUID(), text: line, marks: [] }]
  }))
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const actualites = await writeClient.fetch(
    `*[_type == "article"] | order(publishedAt desc) {
      _id, title, title_ar, "slug": slug.current, excerpt, excerpt_ar, category, author, publishedAt, published, image,
      content, content_ar
    }`,
  )
  return NextResponse.json({ actualites })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const doc: Record<string, any> = {
      _type: 'article',
      published: !!b.published,
    }
    
    for (const k of STR) doc[k] = b[k] || ''
    
    if (b.slug) {
      doc.slug = { _type: 'slug', current: b.slug }
    } else if (b.title) {
      doc.slug = { _type: 'slug', current: b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }
    }

    if (b.image?._ref) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: b.image._ref } }
    } else {
      doc.image = null
    }

    // Convert raw text back to Portable Text if string was passed
    if (typeof b._rawContent === 'string') {
      doc.content = textToBlocks(b._rawContent)
    }
    if (typeof b._rawContent_ar === 'string') {
      doc.content_ar = textToBlocks(b._rawContent_ar)
    }

    let result
    if (b._id) {
      const patch: Record<string, any> = { ...doc }
      delete patch._type
      result = await writeClient.patch(b._id).set(patch).commit()
    } else {
      result = await writeClient.create(doc as any)
    }
    revalidateSite()
    return NextResponse.json({ ok: true, article: result })
  } catch (e) {
    console.error('Erreur sauvegarde actualité:', e)
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
