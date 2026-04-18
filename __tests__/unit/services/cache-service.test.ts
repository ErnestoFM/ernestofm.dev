import { withCache, invalidateCache, invalidateAll, CACHE_KEYS } from '@/services/cache-service';

jest.mock('@/lib/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
  getCached: jest.fn(),
  CACHE_TTL: 300,
}));

import { getCached, redis } from '@/lib/redis';
const mockGetCached = getCached as jest.Mock;
const mockRedis = redis as jest.Mocked<typeof redis>;

describe('cache-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('withCache', () => {
    it('calls getCached with the correct key and fetcher', async () => {
      const fetcher = jest.fn().mockResolvedValue([{ id: '1' }]);
      mockGetCached.mockImplementation((_key, fn) => fn());

      await withCache(CACHE_KEYS.PROJECTS, fetcher);

      expect(mockGetCached).toHaveBeenCalledWith(CACHE_KEYS.PROJECTS, fetcher, 300);
    });

    it('returns cached data when available', async () => {
      const cachedData = [{ id: 'cached' }];
      mockGetCached.mockResolvedValue(cachedData);

      const result = await withCache(CACHE_KEYS.SKILLS, jest.fn());

      expect(result).toEqual(cachedData);
    });
  });

  describe('invalidateCache', () => {
    it('deletes the specified cache key', async () => {
      (mockRedis.del as jest.Mock).mockResolvedValue(1);

      await invalidateCache(CACHE_KEYS.PROJECTS);

      expect(mockRedis.del).toHaveBeenCalledWith(CACHE_KEYS.PROJECTS);
    });
  });

  describe('invalidateAll', () => {
    it('deletes all cache keys', async () => {
      (mockRedis.del as jest.Mock).mockResolvedValue(1);

      await invalidateAll();

      expect(mockRedis.del).toHaveBeenCalledTimes(Object.keys(CACHE_KEYS).length);
    });
  });
});
