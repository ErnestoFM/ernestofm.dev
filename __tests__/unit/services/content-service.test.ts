import { getProjects, getSkills, getCertifications, getPublishedArticles } from '@/services/content-service';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    skill: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    certification: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    course: {
      findMany: jest.fn(),
    },
    article: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from '@/lib/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('content-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProjects', () => {
    it('returns projects ordered by featured and date', async () => {
      const mockProjects = [
        { id: '1', name: 'Project A', featured: true },
        { id: '2', name: 'Project B', featured: false },
      ];
      (mockPrisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

      const result = await getProjects();

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        orderBy: [{ featured: 'desc' }, { date: 'desc' }],
      });
      expect(result).toEqual(mockProjects);
    });

    it('returns empty array when no projects exist', async () => {
      (mockPrisma.project.findMany as jest.Mock).mockResolvedValue([]);
      const result = await getProjects();
      expect(result).toEqual([]);
    });
  });

  describe('getSkills', () => {
    it('returns skills ordered by category', async () => {
      const mockSkills = [{ id: '1', name: 'Node.js', category: 'backend', level: 90 }];
      (mockPrisma.skill.findMany as jest.Mock).mockResolvedValue(mockSkills);

      const result = await getSkills();

      expect(mockPrisma.skill.findMany).toHaveBeenCalledWith({ orderBy: { category: 'asc' } });
      expect(result).toEqual(mockSkills);
    });
  });

  describe('getCertifications', () => {
    it('returns certifications ordered by date descending', async () => {
      const mockCerts = [{ id: '1', name: 'OCI Foundation', issuer: 'Oracle' }];
      (mockPrisma.certification.findMany as jest.Mock).mockResolvedValue(mockCerts);

      const result = await getCertifications();

      expect(mockPrisma.certification.findMany).toHaveBeenCalledWith({ orderBy: { date: 'desc' } });
      expect(result).toEqual(mockCerts);
    });
  });

  describe('getPublishedArticles', () => {
    it('only returns non-draft articles', async () => {
      const mockArticles = [{ id: '1', title: 'Published Article', draft: false }];
      (mockPrisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);

      const result = await getPublishedArticles();

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith({
        where: { draft: false },
        orderBy: { publishedAt: 'desc' },
      });
      expect(result).toEqual(mockArticles);
    });
  });
});
