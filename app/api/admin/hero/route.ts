import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated, revalidateSite } from '@/lib/admin/api'

/**
 * Gestion des slides du carousel Hero (schéma `heroSlide`).
 *  GET    -> liste des slides (avec champs FR/AR + image)
 *  POST   -> crée ou met à jour un slide  { _id?, title, title_ar, subtitle, subtitle_ar, imageAssetId?, order, active }
 *  DELETE -> supprime un slide            ?id=<_id>
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const slides = await writeClient.fetch(
    `*[_type == "heroSlide"] | order(order asc) {
      _id, title, title_ar, subtitle, subtitle_ar, order, active,
      "imageUrl": image.asset->url,
      "imageAssetId": image.asset->_id,
      "videoUrl": videoFile.asset->url,
      "videoAssetId": videoFile.asset->_id
    }`,
  )
  return NextResponse.json({ slides })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { _id, title, title_ar, subtitle, subtitle_ar, imageAssetId, videoAssetId, order, active } = body

    const doc: Record<string, any> = {
      _type: 'heroSlide',
      title: title || '',
      title_ar: title_ar || '',
      subtitle: subtitle || '',
      subtitle_ar: subtitle_ar || '',
      order: typeof order === 'number' ? order : 0,
      active: active !== false,
    }
    if (imageAssetId) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } }
    }
    if (videoAssetId) {
      doc.videoFile = { _type: 'file', asset: { _type: 'reference', _ref: videoAssetId } }
    }

    let result
    if (_id) {
      // Mise à jour : on ne touche pas aux médias si aucun nouveau n'est fourni
      const patch: Record<string, any> = { ...doc }
      if (!imageAssetId) delete patch.image
      if (!videoAssetId) delete patch.videoFile
      delete patch._type
      result = await writeClient.patch(_id).set(patch).commit()
    } else {
      result = await writeClient.create(doc as { _type: string; [key: string]: any })
    }

    revalidateSite()
    return NextResponse.json({ ok: true, slide: result })
  } catch (error) {
    console.error('Erreur sauvegarde hero:', error)
    return NextResponse.json({ error: 'Échec de la sauvegarde' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id manquant' }, { status: 400 })
    await writeClient.delete(id)
    revalidateSite()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Erreur suppression hero:', error)
    return NextResponse.json({ error: 'Échec de la suppression' }, { status: 500 })
  }
}
