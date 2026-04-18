import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSkills, createSkill } from '@/services/content-service';
import { withCache, invalidateCache, CACHE_KEYS } from '@/services/cache-service';
import { z } from 'zod';

const SkillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['backend', 'frontend', 'database', 'cloud', 'devops', 'testing']),
  level: z.number().int().min(1).max(100),
  iconSlug: z.string().min(1),
});

export async function GET() {
  try {
    const data = await withCache(CACHE_KEYS.SKILLS, getSkills);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = SkillSchema.parse(body);
    const skill = await createSkill(validated);
    await invalidateCache(CACHE_KEYS.SKILLS);
    return NextResponse.json(skill, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.flatten().fieldErrors }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
