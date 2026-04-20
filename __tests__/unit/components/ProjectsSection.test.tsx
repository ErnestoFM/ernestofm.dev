import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectsSection from '@/components/sections/ProjectsSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const {
        whileInView,
        viewport,
        initial,
        transition,
        exit,
        variants,
        animate,
        ...rest
      } = props;
      return <div {...rest}>{children}</div>;
    },
  },
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { alt, fill, priority, placeholder, blurDataURL, ...rest } = props;
    return <img alt={alt} {...rest} />;
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ExternalLink: () => <span>ExternalLink</span>,
  Star: () => <span>Star</span>,
}));

const mockProjects = [
  {
    id: '1',
    name: 'Project Alpha',
    description: 'A modern web application',
    imageUrl: 'http://example.com/project-alpha.jpg',
    date: new Date('2024-01-15'),
    skills: ['Node.js', 'React'],
    featured: true,
    repoUrl: 'http://github.com/user/project-alpha',
    liveUrl: 'http://project-alpha.com',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Project Beta',
    description: 'Backend service',
    imageUrl: 'http://example.com/project-beta.jpg',
    date: new Date('2023-12-01'),
    skills: ['Python', 'PostgreSQL'],
    featured: false,
    repoUrl: 'http://github.com/user/project-beta',
    liveUrl: null,
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '3',
    name: 'Project Gamma',
    description: 'Full-stack app',
    imageUrl: 'http://example.com/project-gamma.jpg',
    date: new Date('2023-11-01'),
    skills: ['Node.js', 'React', 'PostgreSQL'],
    featured: false,
    repoUrl: 'http://github.com/user/project-gamma',
    liveUrl: 'http://project-gamma.com',
    createdAt: new Date('2023-01-01'),
  },
];

const mockT = {
  title: 'Projects',
  subtitle: 'My Recent Work',
  featured: 'Featured',
  view_code: 'View Code',
  view_demo: 'View Demo',
  filter_all: 'All Projects',
};

describe('ProjectsSection', () => {
  it('renders the section title and subtitle', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('My Recent Work')).toBeInTheDocument();
  });

  it('renders all projects initially', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Project Gamma')).toBeInTheDocument();
  });

  it('displays featured badge for featured projects', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    const featuredElements = screen.queryAllByText('Featured');
    expect(featuredElements.length).toBeGreaterThan(0);
  });

  it('renders project descriptions', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    expect(screen.getByText('A modern web application')).toBeInTheDocument();
    expect(screen.getByText('Backend service')).toBeInTheDocument();
    expect(screen.getByText('Full-stack app')).toBeInTheDocument();
  });

  it('filters projects by skill when filter button is clicked', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    const nodeButton = screen.getByRole('button', { name: /Node\.js/ });
    fireEvent.click(nodeButton);

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Gamma')).toBeInTheDocument();
    expect(screen.queryByText('Project Beta')).not.toBeInTheDocument();
  });

  it('shows all projects when All filter is clicked', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    const allButton = screen.getByRole('button', { name: /All/ });
    fireEvent.click(allButton);

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Project Gamma')).toBeInTheDocument();
  });

  it('renders skill filter buttons', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('displays project links (View Code and View Demo)', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    const viewCodeButtons = screen.queryAllByText('View Code');
    expect(viewCodeButtons.length).toBeGreaterThan(0);
  });

  it('handles empty projects array', () => {
    render(<ProjectsSection projects={[]} t={mockT} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.queryByText('Project Alpha')).not.toBeInTheDocument();
  });

  it('generates correct filter options from project skills', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    const buttons = screen.getAllByRole('button');
    const skillNames = buttons.map(btn => btn.textContent);

    expect(skillNames).toContain('Node.js');
    expect(skillNames).toContain('React');
    expect(skillNames).toContain('PostgreSQL');
  });

  it('multiple project selection works correctly', () => {
    render(<ProjectsSection projects={mockProjects} t={mockT} />);

    const postgresButton = screen.getByRole('button', { name: /PostgreSQL/ });
    fireEvent.click(postgresButton);

    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Project Gamma')).toBeInTheDocument();
    expect(screen.queryByText('Project Alpha')).not.toBeInTheDocument();
  });
});
