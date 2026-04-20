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
const mockGetSession = getServerSession as jest.Mock;

const { NextRequest: MockNextRequest } = require('next/server');

describe('GET /api/skills', () => {
  it('returns skills list', async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name).toBe('Node.js');
  });
});

describe('POST /api/skills', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const req = new MockNextRequest('http://localhost:3000/api/skills', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('creates a skill when authenticated', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { email: 'admin@test.com' } });
    const req = new MockNextRequest('http://localhost:3000/api/skills', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Python',
        category: 'backend',
        level: 85,
        iconSlug: 'python',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
