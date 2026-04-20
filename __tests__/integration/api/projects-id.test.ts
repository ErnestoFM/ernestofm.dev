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

import { GET, PUT, DELETE } from '@/app/api/projects/[id]/route';

jest.mock('@/services/cache-service', () => ({
  invalidateCache: jest.fn().mockResolvedValue(undefined),
  CACHE_KEYS: { PROJECTS: 'projects:all' },
}));

jest.mock('@/services/content-service', () => ({
  getProjectById: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Project 1',
  }),
  updateProject: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Updated Project',
  }),
  deleteProject: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from 'next-auth';
const mockGetSession = getServerSession as jest.Mock;

const { NextRequest: MockNextRequest } = require('next/server');

describe('GET /api/projects/[id]', () => {
  it('returns project by id', async () => {
    const res = await GET(undefined as any, { params: Promise.resolve({ id: '1' }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.name).toBe('Project 1');
  });

  it('returns 404 when project not found', async () => {
    const { getProjectById } = require('@/services/content-service');
    getProjectById.mockResolvedValueOnce(null);

    const res = await GET(undefined as any, { params: Promise.resolve({ id: 'invalid' }) });
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/projects/[id]', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const req = new MockNextRequest('http://localhost:3000/api/projects/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(401);
  });

  it('updates a project when authenticated', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { email: 'admin@test.com' } });
    const req = new MockNextRequest('http://localhost:3000/api/projects/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Project' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(200);
  });
});

describe('DELETE /api/projects/[id]', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const res = await DELETE(undefined as any, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(401);
  });

  it('deletes a project when authenticated', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { email: 'admin@test.com' } });
    const res = await DELETE(undefined as any, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(200);
  });
});
