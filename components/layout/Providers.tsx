'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark';
}

export default function Providers({ children, initialTheme = 'dark' }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={initialTheme} enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
