import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getProjects, createProject } from '@/services/content-service';
import { withCache, invalidateCache, CACHE_KEYS } from '@/services/cache-service';
import { z } from 'zod';

const ProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  date: z.string(),
  imageUrl: z.string().url(),
  skills: z.array(z.string()),
  repoUrl: z.string().url().optional().nullable(),
  liveUrl: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
});

export async function GET() {
  try {
    const data = await withCache(CACHE_KEYS.PROJECTS, getProjects);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = ProjectSchema.parse(body);
    const project = await createProject(validated);
    await invalidateCache(CACHE_KEYS.PROJECTS);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ error: err.flatten().fieldErrors }, { status: 400 });
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
