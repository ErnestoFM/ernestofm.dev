import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.article.deleteMany();
  await prisma.course.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();

  // Projects
  await prisma.project.createMany({
    data: [
      {
        name: 'API Gateway Microservices',
        description:
          'A production-ready API gateway built with Node.js and Express, supporting authentication, rate limiting, and request routing across multiple microservices.',
        date: new Date('2024-01-15'),
        imageUrl: 'https://placehold.co/800x450/1a1a2e/ffffff?text=API+Gateway',
        skills: ['Node.js', 'Express', 'Docker', 'Redis', 'PostgreSQL'],
        repoUrl: 'https://github.com/ErnestoFM/api-gateway',
        liveUrl: null,
        featured: true,
      },
      {
        name: 'Full Stack Task Manager',
        description:
          'A collaborative task management app with real-time updates, built with Next.js, Spring Boot backend, and PostgreSQL. Includes drag-and-drop, priority queues, and team collaboration features.',
        date: new Date('2023-09-20'),
        imageUrl: 'https://placehold.co/800x450/0f3460/ffffff?text=Task+Manager',
        skills: ['Next.js', 'React', 'Spring Boot', 'Java', 'PostgreSQL'],
        repoUrl: 'https://github.com/ErnestoFM/task-manager',
        liveUrl: null,
        featured: true,
      },
      {
        name: 'Cloud Infrastructure Monitor',
        description:
          'An OCI-native monitoring dashboard that tracks resource utilization, cost metrics, and service health across Oracle Cloud Infrastructure environments.',
        date: new Date('2023-05-10'),
        imageUrl: 'https://placehold.co/800x450/16213e/ffffff?text=Cloud+Monitor',
        skills: ['Oracle Cloud', 'Node.js', 'React', 'Kubernetes', 'GraphQL'],
        repoUrl: 'https://github.com/ErnestoFM/cloud-monitor',
        liveUrl: null,
        featured: false,
      },
    ],
  });

  // Skills
  await prisma.skill.createMany({
    data: [
      { name: 'Node.js', category: 'backend', level: 90, iconSlug: 'nodedotjs' },
      { name: 'Java', category: 'backend', level: 85, iconSlug: 'openjdk' },
      { name: 'Spring Boot', category: 'backend', level: 80, iconSlug: 'springboot' },
      { name: 'GraphQL', category: 'backend', level: 75, iconSlug: 'graphql' },
      { name: 'React', category: 'frontend', level: 85, iconSlug: 'react' },
      { name: 'Next.js', category: 'frontend', level: 82, iconSlug: 'nextdotjs' },
      { name: 'PostgreSQL', category: 'database', level: 88, iconSlug: 'postgresql' },
      { name: 'MongoDB', category: 'database', level: 78, iconSlug: 'mongodb' },
      { name: 'Redis', category: 'database', level: 80, iconSlug: 'redis' },
      { name: 'AWS', category: 'cloud', level: 72, iconSlug: 'amazonaws' },
      { name: 'Oracle Cloud (OCI)', category: 'cloud', level: 75, iconSlug: 'oracle' },
      { name: 'Docker', category: 'devops', level: 88, iconSlug: 'docker' },
      { name: 'Kubernetes', category: 'devops', level: 70, iconSlug: 'kubernetes' },
      { name: 'GitHub Actions', category: 'devops', level: 85, iconSlug: 'githubactions' },
      { name: 'Jest', category: 'testing', level: 80, iconSlug: 'jest' },
    ],
  });

  // Certifications
  await prisma.certification.createMany({
    data: [
      {
        name: 'Oracle Cloud Infrastructure Foundations Associate',
        issuer: 'Oracle',
        date: new Date('2023-11-01'),
        badgeUrl: 'https://placehold.co/200x200/C74634/ffffff?text=OCI',
        credlyUrl: 'https://credentials.oracle.com/',
        inProgress: false,
      },
      {
        name: 'AWS Solutions Architect Associate',
        issuer: 'Amazon Web Services',
        date: new Date('2026-12-01'),
        badgeUrl: null,
        credlyUrl: null,
        inProgress: true,
      },
    ],
  });

  // Courses
  await prisma.course.createMany({
    data: [
      {
        name: 'Complete NodeJS Developer',
        platform: 'Zero To Mastery',
        completedAt: new Date('2023-03-01'),
        certificateUrl: null,
      },
      {
        name: 'Spring Boot & Microservices',
        platform: 'Udemy',
        completedAt: new Date('2023-06-15'),
        certificateUrl: null,
      },
    ],
  });

  // Articles
  await prisma.article.createMany({
    data: [
      {
        title: 'Building Scalable Microservices with Node.js',
        slug: 'scalable-microservices-nodejs',
        summary:
          'A deep dive into designing and deploying production-ready microservices using Node.js, Docker, and Redis for caching.',
        content:
          '# Building Scalable Microservices with Node.js\n\nMicroservices architecture has become the standard for building large-scale applications...\n\n## Introduction\n\nIn this article, we explore the patterns and practices that make microservices resilient and scalable.\n\n## Key Concepts\n\n- **Service Discovery**: How services find each other\n- **API Gateway**: Single entry point for all clients\n- **Event-Driven Architecture**: Async communication between services\n\n## Conclusion\n\nBuilding microservices requires careful planning and the right tooling.',
        publishedAt: null,
        draft: true,
        tags: ['Node.js', 'Microservices', 'Docker', 'Backend'],
      },
      {
        title: 'Getting Started with Oracle Cloud Infrastructure',
        slug: 'getting-started-oci',
        summary:
          'A practical guide to deploying your first application on Oracle Cloud Infrastructure, covering compute, networking, and storage.',
        content:
          '# Getting Started with Oracle Cloud Infrastructure\n\nOracle Cloud Infrastructure (OCI) offers a powerful suite of cloud services...\n\n## Prerequisites\n\n- An OCI account (free tier available)\n- Basic understanding of cloud concepts\n\n## Setting Up Your First Instance\n\nStep-by-step guide to launching a compute instance...\n\n## Conclusion\n\nOCI provides enterprise-grade infrastructure at competitive pricing.',
        publishedAt: null,
        draft: true,
        tags: ['OCI', 'Cloud', 'DevOps'],
      },
    ],
  });

  console.log('✅ Seed data created successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
