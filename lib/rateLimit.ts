interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale rate limit records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * In-memory sliding window rate limiter
 * @param identifier Unique key (e.g., client IP address)
 * @param limit Maximum allowed requests within window
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 min)
 */
export function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 60000,
): { success: boolean; limit: number; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Filter timestamps within the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
    };
  }

  record.timestamps.push(now);
  rateLimitMap.set(identifier, record);

  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
  };
}

/**
 * Extract client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return "anonymous";
}
