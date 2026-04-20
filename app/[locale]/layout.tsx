import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const locales = ['en', 'es'];

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();
  const nav = (messages as Record<string, Record<string, string>>).nav ?? {};
  const footer = (messages as Record<string, Record<string, string>>).footer ?? {};

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar
        locale={locale}
        t={{
          about: nav.about ?? 'About',
          skills: nav.skills ?? 'Skills',
          projects: nav.projects ?? 'Projects',
          certifications: nav.certifications ?? 'Certifications',
          blog: nav.blog ?? 'Blog',
          contact: nav.contact ?? 'Contact',
        }}
      />
      <main>{children}</main>
      <Footer
        t={{
          built_by: footer.built_by ?? 'Built by ErnestoFM',
          download_cv: footer.download_cv ?? 'Download CV',
          whatsapp: footer.whatsapp ?? 'WhatsApp',
        }}
      />
    </NextIntlClientProvider>
  );
}
