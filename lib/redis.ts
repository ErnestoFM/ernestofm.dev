import { Redis } from '@upstash/redis';

type RedisLike = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, options?: { ex?: number }): Promise<unknown>;
  del(key: string): Promise<unknown>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
};

function createNoopRedis(): RedisLike {
  return {
    async get<T>() {
      return null as T | null;
    },
    async set() {
      return null;
    },
    async del() {
      return 0;
    },
    async incr() {
      return 1;
    },
    async expire() {
      return 0;
    },
  };
}

function initializeRedis(): RedisLike {
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

    if (redisUrl && redisToken) {
      try {
        return new Redis({
          url: redisUrl,
          token: redisToken,
        });
      } catch (error) {
        console.warn('Failed to initialize Redis:', error);
        return createNoopRedis();
      }
    }

    return createNoopRedis();
  } catch (error) {
    console.warn('Error during Redis initialization:', error);
    return createNoopRedis();
  }
}

export const redis: RedisLike = initializeRedis();

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
