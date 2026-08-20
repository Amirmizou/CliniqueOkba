import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../env'

/**
 * Qualité de compression par défaut des images Sanity.
 * En AVIF/WebP, 82 est visuellement indiscernable de 100 sur des photos
 * médicales, pour environ 2,5x moins de poids transféré.
 */
export const IMAGE_QUALITY = 82

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => {
    return imageBuilder?.image(source).auto('format').fit('max').quality(IMAGE_QUALITY)
}

/**
 * Version HAUTE RÉSOLUTION d'une URL d'image Sanity pour les vues plein écran
 * (lightbox/zoom) : retire la hauteur imposée (préserve le ratio d'origine),
 * élargit jusqu'à `maxWidth` et force la qualité 100. Les URLs non-Sanity
 * (fichiers locaux déjà en pleine résolution) sont renvoyées telles quelles.
 */
export function hiResImage(src: string, maxWidth = 2600): string {
    if (!src || !src.includes('cdn.sanity.io')) return src
    try {
        const u = new URL(src)
        u.searchParams.set('w', String(maxWidth))
        u.searchParams.delete('h')
        u.searchParams.delete('rect')
        u.searchParams.set('fit', 'max')
        u.searchParams.set('q', '100')
        u.searchParams.set('auto', 'format')
        return u.href
    } catch {
        return src
    }
}

// Custom loader pour next/image : contourne Vercel Image Optimization (très lent)
// et utilise directement le CDN global et ultra-rapide de Sanity avec redimensionnement à la volée.
export const sanityImageLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
    // Si l'URL n'est pas une image Sanity (ex: image locale), on la retourne telle quelle
    if (!src.includes('cdn.sanity.io')) return src;
    
    // Ajoute les paramètres de largeur et qualité à l'URL existante
    const url = new URL(src)
    url.searchParams.set('w', width.toString())
    // Next.js envoie 75 par defaut ; on remonte a IMAGE_QUALITY, et on respecte
    // une valeur explicite plus haute (lightbox, planches d'imagerie).
    const finalQuality = quality && quality > IMAGE_QUALITY ? quality : IMAGE_QUALITY
    url.searchParams.set('q', finalQuality.toString())
    url.searchParams.set('auto', 'format')
    return url.href
}
