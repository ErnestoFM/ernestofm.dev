import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';

const mockPush = jest.fn();
const mockSetTheme = jest.fn();

let currentTheme = 'dark';

jest.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: currentTheme,
    setTheme: mockSetTheme,
  }),
}));

const t = {
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  blog: 'Blog',
  contact: 'Contact',
};

describe('Navbar theme toggle', () => {
  beforeEach(() => {
    currentTheme = 'dark';
    mockSetTheme.mockReset();
    mockPush.mockReset();
    document.cookie = 'theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    localStorage.clear();
  });

  it('renders the theme toggle button after mount', async () => {
    render(<Navbar locale="en" t={t} />);

    await waitFor(() => {
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });
  });

  it('toggles from dark to light', async () => {
    currentTheme = 'dark';
    render(<Navbar locale="en" t={t} />);

    const button = await screen.findByTestId('theme-toggle');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('toggles from light to dark', async () => {
    currentTheme = 'light';
    render(<Navbar locale="en" t={t} />);

    const button = await screen.findByTestId('theme-toggle');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('persists theme in localStorage and cookie on toggle', async () => {
    currentTheme = 'dark';
    render(<Navbar locale="en" t={t} />);

    const button = await screen.findByTestId('theme-toggle');
    fireEvent.click(button);

    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.cookie).toContain('theme=light');
  });
});
