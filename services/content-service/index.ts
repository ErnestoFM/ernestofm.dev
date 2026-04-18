import prisma from '@/lib/prisma';
import type { Project, Skill, Certification, Course, Article } from '@/types';

/**
 * Fetch all projects, featured first
 */
export async function getProjects(): Promise<Project[]> {
  return prisma.project.findMany({
    orderBy: [{ featured: 'desc' }, { date: 'desc' }],
  });
}

/**
 * Fetch a single project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({ where: { id } });
}

/**
 * Create a new project
 */
export async function createProject(data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  return prisma.project.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
  });
}

/**
 * Update a project by ID
 */
export async function updateProject(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
  return prisma.project.update({
    where: { id },
    data: {
      ...data,
      ...(data.date ? { date: new Date(data.date) } : {}),
    },
  });
}

/**
 * Delete a project by ID
 */
export async function deleteProject(id: string): Promise<void> {
  await prisma.project.delete({ where: { id } });
}

/**
 * Fetch all skills grouped by category
 */
export async function getSkills(): Promise<Skill[]> {
  return prisma.skill.findMany({ orderBy: { category: 'asc' } });
}

/**
 * Create a new skill
 */
export async function createSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
  return prisma.skill.create({ data });
}

/**
 * Update a skill by ID
 */
export async function updateSkill(id: string, data: Partial<Omit<Skill, 'id'>>): Promise<Skill> {
  return prisma.skill.update({ where: { id }, data });
}

/**
 * Delete a skill by ID
 */
export async function deleteSkill(id: string): Promise<void> {
  await prisma.skill.delete({ where: { id } });
}

/**
 * Fetch all certifications
 */
export async function getCertifications(): Promise<Certification[]> {
  return prisma.certification.findMany({ orderBy: { date: 'desc' } });
}

/**
 * Create a certification
 */
export async function createCertification(data: Omit<Certification, 'id'>): Promise<Certification> {
  return prisma.certification.create({
    data: { ...data, date: new Date(data.date) },
  });
}

/**
 * Fetch all courses
 */
export async function getCourses(): Promise<Course[]> {
  return prisma.course.findMany({ orderBy: { completedAt: 'desc' } });
}

/**
 * Fetch all published articles (non-draft)
 */
export async function getPublishedArticles(): Promise<Article[]> {
  return prisma.article.findMany({
    where: { draft: false },
    orderBy: { publishedAt: 'desc' },
  });
}

/**
 * Fetch all articles (admin use)
 */
export async function getAllArticles(): Promise<Article[]> {
  return prisma.article.findMany({ orderBy: { publishedAt: 'desc' } });
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return prisma.article.findUnique({ where: { slug } });
}

/**
 * Create a new article
 */
export async function createArticle(data: Omit<Article, 'id'>): Promise<Article> {
  return prisma.article.create({
    data: {
      ...data,
      ...(data.publishedAt ? { publishedAt: new Date(data.publishedAt) } : {}),
    },
  });
}

/**
 * Update an article by ID
 */
export async function updateArticle(id: string, data: Partial<Omit<Article, 'id'>>): Promise<Article> {
  return prisma.article.update({
    where: { id },
    data: {
      ...data,
      ...(data.publishedAt ? { publishedAt: new Date(data.publishedAt) } : {}),
    },
  });
}

/**
 * Delete an article by ID
 */
export async function deleteArticle(id: string): Promise<void> {
  await prisma.article.delete({ where: { id } });
}
