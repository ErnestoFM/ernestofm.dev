'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark';
}

export default function Providers({ children, initialTheme = 'dark' }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme={initialTheme} enableSystem={false}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
