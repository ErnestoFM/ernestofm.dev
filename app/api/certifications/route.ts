import { NextResponse } from 'next/server';
import { getCertifications } from '@/services/content-service';
import { withCache, CACHE_KEYS } from '@/services/cache-service';

export async function GET() {
  try {
    const data = await withCache(CACHE_KEYS.CERTIFICATIONS, getCertifications);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}
