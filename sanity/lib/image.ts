import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => {
    return imageBuilder?.image(source).auto('format').fit('max')
}

// Custom loader pour next/image : contourne Vercel Image Optimization (très lent)
// et utilise directement le CDN global et ultra-rapide de Sanity avec redimensionnement à la volée.
export const sanityImageLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
    // Si l'URL n'est pas une image Sanity (ex: image locale), on la retourne telle quelle
    if (!src.includes('cdn.sanity.io')) return src;
    
    // Ajoute les paramètres de largeur et qualité à l'URL existante
    const url = new URL(src)
    url.searchParams.set('w', width.toString())
    url.searchParams.set('q', (quality || 75).toString())
    url.searchParams.set('auto', 'format')
    return url.href
}
