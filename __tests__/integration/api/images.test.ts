// Mock next/server first
jest.mock('next/server', () => {
  class MockNextRequest {
    method: string;
    headers: Record<string, string>;
    _body: any;

    constructor(url: string, init?: { method?: string; headers?: Record<string, string>; body?: any }) {
      this.method = init?.method || 'GET';
      this.headers = init?.headers || {};
      this._body = init?.body;
    }

    async formData() {
      // Return empty FormData if not set
      const data = new Map();
      return data;
    }

    async json() {
      return Promise.resolve({});
    }
  }
  return {
    NextRequest: MockNextRequest,
  NextResponse: {
    json: (data: any, options?: { status?: number }) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
    },
  };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/services/image-service', () => ({
  uploadImage: jest.fn(),
}));

import { POST } from '@/app/api/images/route';
import { getServerSession } from 'next-auth';
import { uploadImage } from '@/services/image-service';

const { NextRequest: MockNextRequest } = require('next/server');
const mockGetServerSession = getServerSession as jest.Mock;
const mockUploadImage = uploadImage as jest.Mock;

describe('app/api/images', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/images', () => {
    it('returns 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);
      const req = new MockNextRequest('http://localhost:3000/api/images', { method: 'POST' });
      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it('returns 400 when no file provided', async () => {
      mockGetServerSession.mockResolvedValue({ user: { id: '1', email: 'test@example.com' } });
      const req = new MockNextRequest('http://localhost:3000/api/images', { method: 'POST' });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });
});
