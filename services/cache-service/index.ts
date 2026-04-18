import { redis, getCached, CACHE_TTL } from '@/lib/redis';

export const CACHE_KEYS = {
  PROJECTS: 'projects:all',
  SKILLS: 'skills:all',
  CERTIFICATIONS: 'certifications:all',
  COURSES: 'courses:all',
  ARTICLES: 'articles:published',
} as const;

/**
 * Invalidate a specific cache key
 * @param key The cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
  await redis.del(key);
}

/**
 * Invalidate all portfolio cache keys
 */
export async function invalidateAll(): Promise<void> {
  await Promise.all(Object.values(CACHE_KEYS).map(k => redis.del(k)));
}

/**
 * Wrap a data fetcher with Redis caching
 * @param key Cache key
 * @param fetcher Async function returning data
 * @param ttl Time to live in seconds
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  return getCached(key, fetcher, ttl);
}

export { CACHE_TTL };
