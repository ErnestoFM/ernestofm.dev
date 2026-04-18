import { render, screen } from '@testing-library/react';
import SkillsSection from '@/components/sections/SkillsSection';
import type { Skill } from '@/types';

const mockTranslations = {
  title: 'Skills',
  subtitle: 'Technologies',
  categories: {
    backend: 'Backend',
    frontend: 'Frontend',
    database: 'Database',
    cloud: 'Cloud',
    devops: 'DevOps',
    testing: 'Testing',
  },
};

const mockSkills: Skill[] = [
  { id: '1', name: 'Node.js', category: 'backend', level: 90, iconSlug: 'nodedotjs' },
  { id: '2', name: 'React', category: 'frontend', level: 85, iconSlug: 'react' },
];

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SkillsSection', () => {
  it('renders all skill names', () => {
    render(<SkillsSection skills={mockSkills} t={mockTranslations} />);
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders skill levels', () => {
    render(<SkillsSection skills={mockSkills} t={mockTranslations} />);
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders section title', () => {
    render(<SkillsSection skills={mockSkills} t={mockTranslations} />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    render(<SkillsSection skills={mockSkills} t={mockTranslations} />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });
});
