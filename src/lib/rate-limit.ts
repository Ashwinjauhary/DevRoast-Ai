type RateLimitInfo = {
    count: number;
    resetAt: number;
};

// Global in-memory store
// Note: In a serverless environment like Vercel, this map resets on cold starts.
// For a production app with multiple instances, use Redis (e.g. upstash/ratelimit).
const ipMap = new Map<string, RateLimitInfo>();

/**
 * A simple in-memory rate limiter.
 * @param ip The IP address or identifier to rate limit.
 * @param limit The maximum number of requests allowed in the window.
 * @param windowMs The time window in milliseconds.
 * @returns { success: boolean, limit: number, remaining: number, reset: number }
 */
export async function rateLimit(
    ip: string,
    limit: number = 10,
    windowMs: number = 60 * 1000
) {
    const now = Date.now();
    const info = ipMap.get(ip);

    // Clean up expired entry
    if (info && now > info.resetAt) {
        ipMap.delete(ip);
    }

    const currentInfo = ipMap.get(ip) || { count: 0, resetAt: now + windowMs };

    if (currentInfo.count >= limit) {
        return {
            success: false,
            limit,
            remaining: 0,
            reset: currentInfo.resetAt,
        };
    }

    currentInfo.count += 1;
    ipMap.set(ip, currentInfo);

    return {
        success: true,
        limit,
        remaining: limit - currentInfo.count,
        reset: currentInfo.resetAt,
    };
}
