type RateLimitStore = Map<string, { count: number; resetTime: number }>

const store: RateLimitStore = new Map()

interface RateLimitConfig {
  interval: number
  uniqueTokenPerInterval: number
}

export class RateLimiter {
  private interval: number
  private uniqueTokenPerInterval: number

  constructor(config: RateLimitConfig) {
    this.interval = config.interval
    this.uniqueTokenPerInterval = config.uniqueTokenPerInterval
  }

  check(identifier: string, limit: number): { success: boolean; remaining: number; reset: number } {
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

export const emailRateLimiter = new RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})
