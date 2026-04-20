import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Providers from '@/components/layout/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ErnestoFM — Software Engineer',
    template: '%s | ErnestoFM',
  },
  description:
    'Ernesto Fierro — Software Engineer specialized in backend development with full stack experience. Node.js, Java, Spring Boot, React, Next.js, PostgreSQL, Docker, Kubernetes.',
  keywords: ['Software Engineer', 'Backend Developer', 'Full Stack', 'Node.js', 'Java', 'Spring Boot'],
  authors: [{ name: 'Ernesto Fierro', url: 'https://ernestofm.dev' }],
  creator: 'Ernesto Fierro',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ernestofm.dev',
    title: 'ErnestoFM — Software Engineer',
    description: 'Portfolio of Ernesto Fierro, Software Engineer specialized in backend development.',
    siteName: 'ErnestoFM',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ErnestoFM — Software Engineer',
    description: 'Portfolio of Ernesto Fierro, Software Engineer specialized in backend development.',
    creator: '@ErnestoFM',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  const initialTheme = cookieTheme === 'light' || cookieTheme === 'dark' ? cookieTheme : 'dark';

  return (
    <html lang="en" className={initialTheme === 'dark' ? 'dark' : undefined} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers initialTheme={initialTheme}>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
