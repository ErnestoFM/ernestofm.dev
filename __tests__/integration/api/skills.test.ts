// Mock next/server first to avoid Request not defined error
jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    public method: string;
    public headers: Map<string, string>;
    private bodyValue: string;

    constructor(url: string, init: { method?: string; headers?: Record<string, string>; body?: string } = {}) {
      this.method = init.method || 'GET';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.bodyValue = init.body || '';
    }

    async json() {
      return JSON.parse(this.bodyValue);
    }
  },
  NextResponse: {
    json: (data: any, options: any = {}) => ({
      status: options.status || 200,
      json: async () => data,
    }),
  },
}));

import { GET, POST } from '@/app/api/skills/route';

jest.mock('@/services/cache-service', () => ({
  withCache: jest.fn((_key, fetcher) => fetcher()),
  invalidateCache: jest.fn().mockResolvedValue(undefined),
  CACHE_KEYS: { SKILLS: 'skills:all' },
}));

jest.mock('@/services/content-service', () => ({
  getSkills: jest.fn().mockResolvedValue([
    { id: '1', name: 'Node.js', category: 'backend', level: 90, iconSlug: 'nodedotjs' },
  ]),
  createSkill: jest.fn().mockResolvedValue({ id: 'new-1', name: 'Python' }),
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from 'next-auth';
import { withCache, invalidateCache, CACHE_KEYS } from '@/services/cache-service';
import { getSkills, createSkill } from '@/services/content-service';

const mockGetSession = getServerSession as jest.Mock;
const mockWithCache = withCache as jest.Mock;
const mockInvalidateCache = invalidateCache as jest.Mock;
const mockGetSkills = getSkills as jest.Mock;
const mockCreateSkill = createSkill as jest.Mock;

const { NextRequest: MockNextRequest } = require('next/server');

function makePostRequest(body: object) {
  return new MockNextRequest('http://localhost:3000/api/skills', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockWithCache.mockImplementation((_key, fetcher) => fetcher());
  mockGetSkills.mockResolvedValue([
    { id: '1', name: 'Node.js', category: 'backend', level: 90, iconSlug: 'nodedotjs' },
  ]);
  mockCreateSkill.mockResolvedValue({ id: 'new-1', name: 'Python' });
  mockInvalidateCache.mockResolvedValue(undefined);
});

describe('GET /api/skills', () => {
  it('returns skills list', async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name).toBe('Node.js');
    expect(mockWithCache).toHaveBeenCalledWith(CACHE_KEYS.SKILLS, expect.any(Function));
    expect(mockGetSkills).toHaveBeenCalledTimes(1);
  });

  it('returns 500 when cache or service fails', async () => {
    mockWithCache.mockRejectedValueOnce(new Error('cache failed'));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to fetch skills' });
  });
});

describe('POST /api/skills', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const req = makePostRequest({ name: 'Test' });

    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(mockCreateSkill).not.toHaveBeenCalled();
    expect(mockInvalidateCache).not.toHaveBeenCalled();
  });

  it('returns 400 when payload is invalid', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { email: 'admin@test.com' } });
    const req = makePostRequest({
      name: '',
      category: 'mobile',
      level: 150,
      iconSlug: '',
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(mockCreateSkill).not.toHaveBeenCalled();
    expect(mockInvalidateCache).not.toHaveBeenCalled();
  });

  it('creates a skill and invalidates cache when authenticated with valid payload', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { email: 'admin@test.com' } });
    const payload = {
      name: 'Python',
      category: 'backend',
      level: 85,
      iconSlug: 'python',
    };
    mockCreateSkill.mockResolvedValueOnce({ id: 'new-1', ...payload });

    const req = makePostRequest(payload);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data).toEqual({ id: 'new-1', ...payload });
    expect(mockCreateSkill).toHaveBeenCalledWith(payload);
    expect(mockInvalidateCache).toHaveBeenCalledWith(CACHE_KEYS.SKILLS);
  });

  it('returns 500 when createSkill fails', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { email: 'admin@test.com' } });
    mockCreateSkill.mockRejectedValueOnce(new Error('db down'));
    const req = makePostRequest({
      name: 'Python',
      category: 'backend',
      level: 85,
      iconSlug: 'python',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to create skill' });
    expect(mockInvalidateCache).not.toHaveBeenCalled();
  });

  it('returns 500 when cache invalidation fails after creating skill', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { email: 'admin@test.com' } });
    mockInvalidateCache.mockRejectedValueOnce(new Error('redis down'));
    const req = makePostRequest({
      name: 'Python',
      category: 'backend',
      level: 85,
      iconSlug: 'python',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to create skill' });
    expect(mockCreateSkill).toHaveBeenCalledTimes(1);
    expect(mockInvalidateCache).toHaveBeenCalledWith(CACHE_KEYS.SKILLS);
  });
});
