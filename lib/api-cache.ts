const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function cachedFetch<T = any>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const cacheKey = `${url}-${JSON.stringify(options)}`
    const cached = cache.get(cacheKey)
    const now = Date.now()

    // Retourner depuis le cache si valide
    if (cached && now - cached.timestamp < CACHE_DURATION) {
        return cached.data
    }

    // Fetch et mise en cache
    const response = await fetch(url, options)

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    cache.set(cacheKey, { data, timestamp: now })
    return data
}

// Fonction pour nettoyer le cache expiré
export function clearExpiredCache() {
    const now = Date.now()
    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp >= CACHE_DURATION) {
            cache.delete(key)
        }
    }
}

// Fonction pour vider tout le cache
export function clearAllCache() {
    cache.clear()
}
