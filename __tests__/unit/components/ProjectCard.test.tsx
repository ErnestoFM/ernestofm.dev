import { render, screen } from '@testing-library/react';
import ProjectsSection from '@/components/sections/ProjectsSection';
import type { Project } from '@/types';

const mockTranslations = {
  title: 'Projects',
  subtitle: 'Things I built',
  featured: 'Featured',
  view_code: 'View Code',
  view_demo: 'Live Demo',
  filter_all: 'All',
};

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Test Project',
    description: 'A test project description',
    date: '2024-01-01',
    imageUrl: 'https://placehold.co/800x450',
    skills: ['Node.js', 'React'],
    repoUrl: 'https://github.com/test',
    liveUrl: null,
    featured: true,
    createdAt: '2024-01-01',
  },
];

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <article {...props}>{children}</article>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProjectsSection', () => {
  it('renders project name', () => {
    render(<ProjectsSection projects={mockProjects} t={mockTranslations} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders project description', () => {
    render(<ProjectsSection projects={mockProjects} t={mockTranslations} />);
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('renders skill tags', () => {
    render(<ProjectsSection projects={mockProjects} t={mockTranslations} />);
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders repo link when repoUrl provided', () => {
    render(<ProjectsSection projects={mockProjects} t={mockTranslations} />);
    expect(screen.getByText('View Code')).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(<ProjectsSection projects={mockProjects} t={mockTranslations} />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<ProjectsSection projects={mockProjects} t={mockTranslations} />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });
});
