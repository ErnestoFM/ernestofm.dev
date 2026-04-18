export interface Project {
  id: string;
  name: string;
  description: string;
  date: Date | string;
  imageUrl: string;
  skills: string[];
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  createdAt: Date | string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  iconSlug: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: Date | string;
  badgeUrl?: string | null;
  credlyUrl?: string | null;
  inProgress: boolean;
}

export interface Course {
  id: string;
  name: string;
  platform: string;
  completedAt: Date | string;
  certificateUrl?: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publishedAt?: Date | string | null;
  draft: boolean;
  tags: string[];
}

export type SkillCategory = 'backend' | 'frontend' | 'database' | 'cloud' | 'devops' | 'testing';
