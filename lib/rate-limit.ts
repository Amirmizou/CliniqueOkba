type RateLimitStore = Map<string, { count: number; resetTime: number }>

const store: RateLimitStore = new Map()

interface RateLimitConfig {
  interval: number
  uniqueTokenPerInterval: number
  /** Optional prefix to namespace keys in the shared (Redis) store. */
  prefix?: string
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
}

/**
 * Rate limiter with a distributed backend (Upstash Redis via REST) when
 * `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are configured, and a
 * per-instance in-memory fallback otherwise.
 *
 * On serverless platforms (Vercel), each cold start / concurrent instance has
 * its own memory, so the in-memory store alone cannot enforce a global limit.
 * The Redis backend gives an atomic, shared fixed-window counter. If a Redis
 * request fails for any reason, we fall back to the in-memory store so the
 * endpoint stays available (fail-open on the limiter, not the request).
 */
export class RateLimiter {
  private interval: number
  private uniqueTokenPerInterval: number
  private prefix: string

  constructor(config: RateLimitConfig) {
    this.interval = config.interval
    this.uniqueTokenPerInterval = config.uniqueTokenPerInterval
    this.prefix = config.prefix ?? 'rl'
  }

  async check(identifier: string, limit: number): Promise<RateLimitResult> {
    const redis = getRedisConfig()
    if (redis) {
      try {
        return await this.checkRedis(redis, identifier, limit)
      } catch (error) {
        // Fall back to in-memory rather than failing the request.
        console.error('[rate-limit] Redis backend unavailable, using in-memory fallback:', error)
      }
    }
    return this.checkMemory(identifier, limit)
  }

  private async checkRedis(
    redis: { url: string; token: string },
    identifier: string,
    limit: number
  ): Promise<RateLimitResult> {
    const key = `${this.prefix}:${identifier}`
    // Atomic fixed window: INCR the counter, set the expiry only when the key is
    // new (PEXPIRE ... NX), then read the remaining TTL for the reset timestamp.
    const res = await fetch(`${redis.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redis.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['PEXPIRE', key, this.interval, 'NX'],
        ['PTTL', key],
      ]),
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`Upstash responded ${res.status}`)
    }

    const results = (await res.json()) as Array<{ result?: number; error?: string }>
    const count = Number(results?.[0]?.result ?? 0)
    let pttl = Number(results?.[2]?.result ?? this.interval)
    if (!Number.isFinite(pttl) || pttl < 0) {
      // -1 (no expiry) / -2 (missing) — treat as a fresh full window.
      pttl = this.interval
    }
    const reset = Date.now() + pttl

    if (count > limit) {
      return { success: false, remaining: 0, reset }
    }
    return { success: true, remaining: Math.max(0, limit - count), reset }
  }

  private checkMemory(rawIdentifier: string, limit: number): RateLimitResult {
    // Le préfixe DOIT faire partie de la clé mémoire : sans lui, tous les
    // limiteurs (contact, login, bénéficiaires…) partageaient le même compteur
    // pour une IP donnée. Envoyer un message de contact consommait alors le
    // quota d'inscription, et un endpoint permissif « rechargeait » celui d'un
    // endpoint strict.
    const identifier = `${this.prefix}:${rawIdentifier}`
    const now = Date.now()
    const tokenData = store.get(identifier)

    if (!tokenData || now > tokenData.resetTime) {
      const resetTime = now + this.interval
      store.set(identifier, { count: 1, resetTime })

      this.cleanup()

      return {
        success: true,
        remaining: limit - 1,
        reset: resetTime,
      }
    }

    if (tokenData.count >= limit) {
      return {
        success: false,
        remaining: 0,
        reset: tokenData.resetTime,
      }
    }

    tokenData.count += 1
    store.set(identifier, tokenData)

    return {
      success: true,
      remaining: limit - tokenData.count,
      reset: tokenData.resetTime,
    }
  }

  private cleanup() {
    if (store.size > this.uniqueTokenPerInterval) {
      const now = Date.now()
      for (const [key, value] of store.entries()) {
        if (now > value.resetTime) {
          store.delete(key)
        }
      }
    }
  }
}

function getRedisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url: url.replace(/\/$/, ''), token }
}

export const emailRateLimiter = new RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
  prefix: 'rl:email',
})

/** Plafond journalier du formulaire de contact, par IP (anti-spam soutenu). */
export const emailDailyLimiter = new RateLimiter({
  interval: 24 * 60 * 60 * 1000,
  uniqueTokenPerInterval: 5_000,
  prefix: 'rl:email:day',
})

/**
 * Tentatives de connexion admin. L'authentification est par mot de passe SEUL
 * (pas d'identifiant) : sans limite, un robot peut essayer des milliers de mots
 * de passe. Fenêtre longue et volontairement stricte.
 */
export const loginRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 5_000,
  prefix: 'rl:login',
})

/**
 * Garde-fou global : quel que soit le nombre d'IP utilisées (botnet, proxys
 * tournants), le nombre total d'échecs de connexion reste plafonné.
 */
export const loginGlobalLimiter = new RateLimiter({
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 10,
  prefix: 'rl:login:global',
})

/** Compteur de visites : évite le gonflage artificiel des statistiques. */
export const trackRateLimiter = new RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 20_000,
  prefix: 'rl:track',
})

/**
 * Recherche de fiche bénéficiaire (téléphone + nom + prénom + organisme).
 * Endpoint énumérable : il renvoie des données personnelles. On limite très
 * strictement les tentatives INFRUCTUEUSES.
 */
export const lookupRateLimiter = new RateLimiter({
  interval: 10 * 60 * 1000,
  uniqueTokenPerInterval: 5_000,
  prefix: 'rl:lookup',
})

/** Webhook de revalidation : empêche le brute-force du secret et le cache-busting. */
export const revalidateRateLimiter = new RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 1_000,
  prefix: 'rl:revalidate',
})
