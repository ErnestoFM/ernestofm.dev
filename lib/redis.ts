import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const CACHE_TTL = 300; // 5 minutes

/**
 * Get or set a cached value
 * @param key Cache key
 * @param fetcher Function to call when cache misses
 * @param ttl Time to live in seconds (default: 300)
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached !== null) return cached;

  const data = await fetcher();
  await redis.set(key, data, { ex: ttl });
  return data;
}
