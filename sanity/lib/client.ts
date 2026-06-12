import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

const isDev = process.env.NODE_ENV === 'development'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    // CDN activé en production pour des lectures ultra-rapides (~50ms vs ~2s)
    // En dev, on garde l'API directe pour voir les changements immédiatement
    useCdn: !isDev,
})

// Client with write access (for admin operations, if needed)
export const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})
