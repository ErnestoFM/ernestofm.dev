import { NextResponse } from 'next/server';
import { getCourses } from '@/services/content-service';
import { withCache, CACHE_KEYS } from '@/services/cache-service';

export async function GET() {
  try {
    const data = await withCache(CACHE_KEYS.COURSES, getCourses);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
