import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

export const dynamic = 'force-dynamic'

const STR = ['title', 'title_ar', 'description', 'description_ar', 'category', 'externalUrl'] as const

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const videos = await writeClient.fetch(
    `*[_type == "video"] | order(order asc) {
      _id, title, title_ar, description, description_ar, category, order, active, poster, externalUrl,
      "videoUrl": coalesce(externalUrl, videoFile.asset->url),
      "videoRef": videoFile.asset._ref,
      "fileSize": videoFile.asset->size
    }`,
  )
  return NextResponse.json({ videos })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const b = await request.json()
    const doc: Record<string, any> = {
      _type: 'video',
      order: typeof b.order === 'number' ? b.order : 0,
      active: b.active !== false,
    }
    
    for (const k of STR) doc[k] = b[k] || ''
    if (!doc.category) doc.category = 'general'

    if (b.poster?._ref) {
      doc.poster = { _type: 'image', asset: { _type: 'reference', _ref: b.poster._ref } }
    } else {
      doc.poster = null
    }

    if (b.videoFile?._ref) {
      doc.videoFile = { _type: 'file', asset: { _type: 'reference', _ref: b.videoFile._ref } }
    }
    // externalUrl prioritaire sur le fichier uploadé
    doc.externalUrl = b.externalUrl || null

    let result
    if (b._id) {
      const patch: Record<string, any> = { ...doc }
      delete patch._type
      result = await writeClient.patch(b._id).set(patch).commit()
    } else {
      result = await writeClient.create(doc as any)
    }
    revalidateSite()
    return NextResponse.json({ ok: true, video: result })
  } catch (e) {
    console.error('Erreur sauvegarde video:', e)
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
