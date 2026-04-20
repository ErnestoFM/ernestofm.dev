import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getCertifications,
  createCertification,
  getCourses,
  getPublishedArticles,
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '@/services/content-service';

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

  describe('getProjectById', () => {
    it('returns a project by ID', async () => {
      const mockProject = { id: '1', name: 'Project A' };
      (mockPrisma.project.findUnique as jest.Mock).mockResolvedValue(mockProject);

      const result = await getProjectById('1');

      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockProject);
    });

    it('returns null if project not found', async () => {
      (mockPrisma.project.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await getProjectById('invalid');
      expect(result).toBeNull();
    });
  });

  describe('createProject', () => {
    it('creates a new project with date conversion', async () => {
      const projectData = {
        name: 'New Project',
        description: 'Test',
        date: '2024-01-01',
        imageUrl: 'http://example.com/img.jpg',
        skills: ['Node.js'],
        repoUrl: 'http://github.com',
        liveUrl: null,
        featured: false,
      };
      const mockCreated = { id: 'new-1', ...projectData };
      (mockPrisma.project.create as jest.Mock).mockResolvedValue(mockCreated);

      const result = await createProject(projectData);

      expect(mockPrisma.project.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreated);
    });
  });

  describe('updateProject', () => {
    it('updates an existing project', async () => {
      const updateData = { name: 'Updated Name' };
      const mockUpdated = { id: '1', name: 'Updated Name' };
      (mockPrisma.project.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await updateProject('1', updateData);

      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteProject', () => {
    it('deletes a project', async () => {
      (mockPrisma.project.delete as jest.Mock).mockResolvedValue({});
      await deleteProject('1');
      expect(mockPrisma.project.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('createSkill', () => {
    it('creates a new skill', async () => {
      const skillData = { name: 'Python', category: 'backend', level: 80, iconSlug: 'python' };
      const mockCreated = { id: 'skill-1', ...skillData };
      (mockPrisma.skill.create as jest.Mock).mockResolvedValue(mockCreated);

      const result = await createSkill(skillData);

      expect(mockPrisma.skill.create).toHaveBeenCalledWith({ data: skillData });
      expect(result).toEqual(mockCreated);
    });
  });

  describe('updateSkill', () => {
    it('updates an existing skill', async () => {
      const updateData = { level: 95 };
      const mockUpdated = { id: '1', level: 95 };
      (mockPrisma.skill.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await updateSkill('1', updateData);

      expect(mockPrisma.skill.update).toHaveBeenCalledWith({ where: { id: '1' }, data: updateData });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteSkill', () => {
    it('deletes a skill', async () => {
      (mockPrisma.skill.delete as jest.Mock).mockResolvedValue({});
      await deleteSkill('1');
      expect(mockPrisma.skill.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('createCertification', () => {
    it('creates a new certification with date conversion', async () => {
      const certData = { name: 'AWS', issuer: 'Amazon', date: '2024-01-15', url: 'http://verify.com' };
      const mockCreated = { id: 'cert-1', ...certData };
      (mockPrisma.certification.create as jest.Mock).mockResolvedValue(mockCreated);

      const result = await createCertification(certData);

      expect(mockPrisma.certification.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreated);
    });
  });

  describe('getCourses', () => {
    it('returns courses ordered by completedAt descending', async () => {
      const mockCourses = [{ id: '1', name: 'React Basics', platform: 'Udemy' }];
      (mockPrisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

      const result = await getCourses();

      expect(mockPrisma.course.findMany).toHaveBeenCalledWith({ orderBy: { completedAt: 'desc' } });
      expect(result).toEqual(mockCourses);
    });
  });

  describe('getAllArticles', () => {
    it('returns all articles including drafts', async () => {
      const mockArticles = [
        { id: '1', title: 'Published', draft: false },
        { id: '2', title: 'Draft', draft: true },
      ];
      (mockPrisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);

      const result = await getAllArticles();

      expect(mockPrisma.article.findMany).toHaveBeenCalledWith({ orderBy: { publishedAt: 'desc' } });
      expect(result).toEqual(mockArticles);
    });
  });

  describe('getArticleBySlug', () => {
    it('returns an article by slug', async () => {
      const mockArticle = { id: '1', title: 'Article', slug: 'article-slug' };
      (mockPrisma.article.findUnique as jest.Mock).mockResolvedValue(mockArticle);

      const result = await getArticleBySlug('article-slug');

      expect(mockPrisma.article.findUnique).toHaveBeenCalledWith({ where: { slug: 'article-slug' } });
      expect(result).toEqual(mockArticle);
    });

    it('returns null if article not found', async () => {
      (mockPrisma.article.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await getArticleBySlug('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('createArticle', () => {
    it('creates a new article with date conversion', async () => {
      const articleData = {
        title: 'New Article',
        slug: 'new-article',
        content: 'Content',
        draft: false,
        publishedAt: '2024-01-15',
      };
      const mockCreated = { id: 'art-1', ...articleData };
      (mockPrisma.article.create as jest.Mock).mockResolvedValue(mockCreated);

      const result = await createArticle(articleData);

      expect(mockPrisma.article.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreated);
    });
  });

  describe('updateArticle', () => {
    it('updates an existing article', async () => {
      const updateData = { title: 'Updated Title' };
      const mockUpdated = { id: '1', title: 'Updated Title' };
      (mockPrisma.article.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await updateArticle('1', updateData);

      expect(mockPrisma.article.update).toHaveBeenCalled();
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteArticle', () => {
    it('deletes an article', async () => {
      (mockPrisma.article.delete as jest.Mock).mockResolvedValue({});
      await deleteArticle('1');
      expect(mockPrisma.article.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
