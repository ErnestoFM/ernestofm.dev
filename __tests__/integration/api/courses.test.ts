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

import { GET } from '@/app/api/courses/route';

jest.mock('@/services/cache-service', () => ({
  withCache: jest.fn((_key, fetcher) => fetcher()),
  CACHE_KEYS: { COURSES: 'courses:all' },
}));

jest.mock('@/services/content-service', () => ({
  getCourses: jest.fn().mockResolvedValue([
    { id: '1', name: 'React Course', platform: 'Udemy', status: 'completed' },
  ]),
}));

describe('GET /api/courses', () => {
  it('returns courses list', async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name).toBe('React Course');
  });
});
