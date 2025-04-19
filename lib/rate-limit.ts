import { type NextRequest, NextResponse } from "next/server"
import redis from "./redis"

type RateLimitOptions = {
  limit: number // Maximum number of requests
  window: number // Time window in seconds
  identifier?: string // Custom identifier (defaults to IP)
}

const defaultOptions: RateLimitOptions = {
  limit: 100, // 100 requests
  window: 60 * 15, // per 15 minutes
}

/**
 * Rate limiting middleware for API routes
 */
export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  options: Partial<RateLimitOptions> = {},
) {
  if (!redis) {
    // If Redis is not available, skip rate limiting
    return handler()
  }

  const opts = { ...defaultOptions, ...options }

  // Get identifier (IP address or custom)
  const identifier = opts.identifier || req.ip || "unknown"
  const key = `rate_limit:${identifier}`

  try {
    // Increment the counter
    const current = await redis.incr(key)

    // Set expiry on first request
    if (current === 1) {
      await redis.expire(key, opts.window)
    }

    // Get TTL
    const ttl = await redis.ttl(key)

    // Set rate limit headers
    const headers = {
      "X-RateLimit-Limit": opts.limit.toString(),
      "X-RateLimit-Remaining": Math.max(0, opts.limit - current).toString(),
      "X-RateLimit-Reset": (Math.floor(Date.now() / 1000) + ttl).toString(),
    }

    // If over limit, return 429 Too Many Requests
    if (current > opts.limit) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter: ttl },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": ttl.toString(),
          },
        },
      )
    }

    // Execute handler
    const response = await handler()

    // Add rate limit headers to response
    const responseHeaders = new Headers(response.headers)
    Object.entries(headers).forEach(([key, value]) => {
      responseHeaders.set(key, value)
    })

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Rate limit error:", error)
    // Continue without rate limiting
    return handler()
  }
}
