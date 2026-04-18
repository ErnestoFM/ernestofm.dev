import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/projects/route';

jest.mock('@/services/cache-service', () => ({
  withCache: jest.fn((_key, fetcher) => fetcher()),
  invalidateCache: jest.fn().mockResolvedValue(undefined),
  CACHE_KEYS: { PROJECTS: 'projects:all' },
}));

jest.mock('@/services/content-service', () => ({
  getProjects: jest.fn().mockResolvedValue([
    { id: '1', name: 'Project A', featured: true },
  ]),
  createProject: jest.fn().mockResolvedValue({ id: 'new-1', name: 'New Project' }),
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from 'next-auth';
const mockGetSession = getServerSession as jest.Mock;

describe('GET /api/projects', () => {
  it('returns projects list', async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name).toBe('Project A');
  });
});

describe('POST /api/projects', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const req = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('creates a project when authenticated', async () => {
    mockGetSession.mockResolvedValueOnce({ user: { email: 'admin@test.com' } });
    const req = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: 'New Project',
        description: 'A new project',
        date: '2024-01-01',
        imageUrl: 'https://example.com/image.jpg',
        skills: ['Node.js'],
        featured: false,
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
