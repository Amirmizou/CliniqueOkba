import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated } from '@/lib/admin/api'

/**
 * Upload d'un média (image ou vidéo) vers les assets Sanity (CDN).
 * Retourne la référence d'asset à stocker dans un document + l'URL d'aperçu.
 *
 * POST  multipart/form-data : { file }
 *  -> { assetId, url, kind }
 */
export const dynamic = 'force-dynamic'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const VIDEO_TYPES = ['video/mp4', 'video/webm']

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const isImage = IMAGE_TYPES.includes(file.type)
    const isVideo = VIDEO_TYPES.includes(file.type)
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Type non supporté (images JPG/PNG/WebP/GIF ou vidéos MP4/WebM).' },
        { status: 400 },
      )
    }

    // Limite : 40 Mo image, 200 Mo vidéo.
    // Sanity conserve TOUJOURS le fichier ORIGINAL en pleine résolution (aucune
    // recompression à l'upload) ; les redimensionnements se font seulement à
    // l'affichage. On garde donc une limite haute pour ne pas forcer le client
    // à compresser ses photos avant l'envoi (= préservation de la qualité source).
    const maxSize = isVideo ? 200 * 1024 * 1024 : 40 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (max ${isVideo ? '200 Mo' : '40 Mo'}).` },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await writeClient.assets.upload(isImage ? 'image' : 'file', buffer, {
      filename: file.name,
      contentType: file.type,
    })

    return NextResponse.json({
      assetId: asset._id,
      url: asset.url,
      kind: isImage ? 'image' : 'file',
    })
  } catch (error) {
    console.error('Erreur upload média:', error)
    return NextResponse.json({ error: "Échec de l'upload" }, { status: 500 })
  }
}
