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

import { POST } from '@/app/api/contact/route';

jest.mock('@/lib/redis', () => ({
  redis: {
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  },
  getCached: jest.fn(),
  CACHE_TTL: 300,
}));

jest.mock('@/services/mail-service', () => ({
  sendContactEmail: jest.fn().mockResolvedValue(undefined),
}));

import { sendContactEmail } from '@/services/mail-service';
const mockSendEmail = sendContactEmail as jest.Mock;

// Use the mocked NextRequest
const { NextRequest: MockNextRequest } = require('next/server');

function makeRequest(body: object) {
  return new MockNextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends email with valid data', async () => {
    const req = makeRequest({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message with enough characters.',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  it('returns 400 for invalid email', async () => {
    const req = makeRequest({
      name: 'John',
      email: 'not-an-email',
      subject: 'Test',
      message: 'Test message that is long enough.',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('silently ignores honeypot submissions', async () => {
    const req = makeRequest({
      name: 'Bot',
      email: 'bot@spam.com',
      subject: 'Spam',
      message: 'Buy cheap...',
      honeypot: 'filled-by-bot',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 for message that is too short', async () => {
    const req = makeRequest({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Short',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
