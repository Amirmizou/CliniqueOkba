import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { isAuthenticated } from '@/lib/admin/api'

/**
 * GET  -> liste des images Sanity déjà uploadées (pour le navigateur de galerie)
 * POST multipart/form-data : { file } -> { assetId, url, kind }
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const images = await writeClient.fetch(
      `*[_type == "sanity.imageAsset"] | order(_createdAt desc) [0...300] {
        _id,
        url,
        originalFilename,
        "width": metadata.dimensions.width,
        "height": metadata.dimensions.height
      }`,
    )
    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ error: 'Erreur de chargement' }, { status: 500 })
  }
}

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

    // Limite : 40 Mo image, 500 Mo vidéo.
    // Sanity conserve le fichier ORIGINAL sans recompression.
    // Pour les vidéos HD > 500 Mo, utiliser le champ "URL externe" dans la fiche.
    const maxSize = isVideo ? 500 * 1024 * 1024 : 40 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (max ${isVideo ? '500 Mo' : '40 Mo'}). Pour les vidéos HD plus lourdes, utilisez le champ "URL externe".` },
        { status: 400 },
      )
    }

    // Passer le File/Blob directement au client Sanity évite de charger
    // l'intégralité du fichier en mémoire (important pour les grandes vidéos).
    const asset = await writeClient.assets.upload(isImage ? 'image' : 'file', file, {
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
