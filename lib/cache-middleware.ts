import { type NextRequest, NextResponse } from "next/server"
import redis from "./redis"

type CacheOptions = {
  ttl: number // Time to live in seconds
}

const defaultOptions: CacheOptions = {
  ttl: 3600, // 1 hour default cache
}

/**
 * Middleware to cache API responses in Redis
 */
export async function withCache(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  options: Partial<CacheOptions> = {},
) {
  // Skip cache for non-GET requests
  if (req.method !== "GET") {
    return handler()
  }

  const opts = { ...defaultOptions, ...options }
  const cacheKey = `cache:${req.url}`

  // Try to get from cache first
  if (redis) {
    try {
      const cachedResponse = await redis.get(cacheKey)
      if (cachedResponse) {
        console.log(`Cache hit for ${cacheKey}`)
        // Return cached response
        return NextResponse.json(cachedResponse, {
          headers: {
            "X-Cache": "HIT",
          },
        })
      }
    } catch (error) {
      console.error("Redis cache error:", error)
      // Continue without cache
    }
  }

  // Cache miss, execute handler
  const response = await handler()

  // Cache the response
  if (redis && response.ok) {
    try {
      const responseData = await response.clone().json()
      await redis.set(cacheKey, responseData, { ex: opts.ttl })
      console.log(`Cached response for ${cacheKey} with TTL ${opts.ttl}s`)
    } catch (error) {
      console.error("Failed to cache response:", error)
    }
  }

  // Add cache miss header
  const headers = new Headers(response.headers)
  headers.set("X-Cache", "MISS")

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
