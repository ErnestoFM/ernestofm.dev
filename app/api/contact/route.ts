import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactEmail } from '@/services/mail-service';
import { sanitizeString, sanitizeEmail } from '@/lib/sanitize';
import { redis } from '@/lib/redis';

const RATE_LIMIT_TTL = 3600; // 1 hour
const RATE_LIMIT_MAX = 5;

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  honeypot: z.string().max(0).optional(), // must be empty
});

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const rateLimitKey = `rate_limit:contact:${ip}`;

  const count = await redis.incr(rateLimitKey);
  if (count === 1) {
    await redis.expire(rateLimitKey, RATE_LIMIT_TTL);
  }
  if (count > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ success: true }); // silent success for bots
    }

    const validated = ContactSchema.parse(body);
    const cleanEmail = sanitizeEmail(validated.email);
    if (!cleanEmail) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await sendContactEmail({
      name: sanitizeString(validated.name),
      email: cleanEmail,
      subject: sanitizeString(validated.subject),
      message: sanitizeString(validated.message),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.flatten().fieldErrors }, { status: 400 });
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
