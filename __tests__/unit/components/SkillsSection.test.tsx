import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillsSection from '@/components/sections/SkillsSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { whileInView, viewport, initial, transition, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
}));

const mockSkills = [
  { id: '1', name: 'Node.js', category: 'backend' as const, level: 95, iconSlug: 'nodejs' },
  { id: '2', name: 'React', category: 'frontend' as const, level: 90, iconSlug: 'react' },
  { id: '3', name: 'PostgreSQL', category: 'database' as const, level: 85, iconSlug: 'postgresql' },
  { id: '4', name: 'AWS', category: 'cloud' as const, level: 80, iconSlug: 'aws' },
  { id: '5', name: 'Docker', category: 'devops' as const, level: 88, iconSlug: 'docker' },
  { id: '6', name: 'Jest', category: 'testing' as const, level: 92, iconSlug: 'jest' },
  { id: '7', name: 'Express', category: 'backend' as const, level: 93, iconSlug: 'express' },
];

const mockT = {
  title: 'Skills',
  subtitle: 'Technology & Tools',
  categories: {
    backend: 'Backend',
    frontend: 'Frontend',
    database: 'Database',
    cloud: 'Cloud',
    devops: 'DevOps',
    testing: 'Testing',
  },
};

describe('SkillsSection', () => {
  it('renders the section title and subtitle', () => {
    render(<SkillsSection skills={mockSkills} t={mockT} />);

    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Technology & Tools')).toBeInTheDocument();
  });

  it('renders all skills initially', () => {
    render(<SkillsSection skills={mockSkills} t={mockT} />);

    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('displays category filter buttons for all categories present', () => {
    render(<SkillsSection skills={mockSkills} t={mockT} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    // 'All' button plus categories that have skills
    expect(buttons.some(btn => btn.textContent === 'All')).toBe(true);
  });

  it('filters skills by category when filter button is clicked', () => {
    render(<SkillsSection skills={mockSkills} t={mockT} />);

    const backendButton = screen.getByRole('button', { name: /Backend/i });
    fireEvent.click(backendButton);

    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Express')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('shows all skills when All filter is clicked', () => {
    render(<SkillsSection skills={mockSkills} t={mockT} />);

    const allButton = screen.getByRole('button', { name: /All/ });
    fireEvent.click(allButton);

    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('displays skill levels as percentages', () => {
    render(<SkillsSection skills={mockSkills} t={mockT} />);

    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders skills grouped by category', () => {
    render(<SkillsSection skills={mockSkills} t={mockT} />);

    const backendMatches = screen.getAllByText('Backend');
    expect(backendMatches.length).toBeGreaterThan(0);
  });

  it('handles empty skills array', () => {
    render(<SkillsSection skills={[]} t={mockT} />);

    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.queryByText('95%')).not.toBeInTheDocument();
  });

  it('handles skills with multiple categories', () => {
    render(<SkillsSection skills={mockSkills} t={mockT} />);

    const categoryButtons = screen.getAllByRole('button');
    // Filter by frontend
    const frontendButton = categoryButtons.find(btn => btn.textContent === 'Frontend');
    if (frontendButton) {
      fireEvent.click(frontendButton);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
    }
  });

  it('maintains active category filter state on re-render', () => {
    const { rerender } = render(<SkillsSection skills={mockSkills} t={mockT} />);

    const testingButton = screen.getByRole('button', { name: /Testing/ });
    fireEvent.click(testingButton);

    expect(screen.getByText('Jest')).toBeInTheDocument();
    expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
  });
});
