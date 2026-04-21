import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import { getSiteUrl } from '@/lib/site-url';

async function fetchData(endpoint: string) {
  const baseUrl = getSiteUrl();
  try {
    const res = await fetch(`${baseUrl}/api/${endpoint}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  await params; // locale consumed by layout

  const [tHero, tAbout, tSkills, tProjects, tCerts, tBlog, tContact] = await Promise.all([
    getTranslations('hero'),
    getTranslations('about'),
    getTranslations('skills'),
    getTranslations('projects'),
    getTranslations('certifications'),
    getTranslations('blog'),
    getTranslations('contact'),
  ]);

  const [skills, projects, certifications, courses, articles] = await Promise.all([
    fetchData('skills'),
    fetchData('projects'),
    fetchData('certifications'),
    fetchData('courses'),
    fetchData('articles'),
  ]);

  return (
    <>
      <HeroSection
        t={{
          greeting: tHero('greeting'),
          name: tHero('name'),
          alias: tHero('alias'),
          roles: tHero.raw('roles') as string[],
          cta_cv: tHero('cta_cv'),
          cta_contact: tHero('cta_contact'),
        }}
      />
      <AboutSection
        t={{
          title: tAbout('title'),
          bio: tAbout('bio'),
          location: tAbout('location'),
          available: tAbout('available'),
        }}
      />
      <SkillsSection
        skills={skills}
        t={{
          title: tSkills('title'),
          subtitle: tSkills('subtitle'),
          categories: tSkills.raw('categories') as Record<string, string>,
        }}
      />
      <ProjectsSection
        projects={projects}
        t={{
          title: tProjects('title'),
          subtitle: tProjects('subtitle'),
          featured: tProjects('featured'),
          view_code: tProjects('view_code'),
          view_demo: tProjects('view_demo'),
          filter_all: tProjects('filter_all'),
        }}
      />
      <CertificationsSection
        certifications={certifications}
        courses={courses}
        t={{
          title: tCerts('title'),
          tab_certs: tCerts('tab_certs'),
          tab_courses: tCerts('tab_courses'),
          in_progress: tCerts('in_progress'),
          verify: tCerts('verify'),
        }}
      />
      <BlogSection
        articles={articles}
        t={{
          title: tBlog('title'),
          subtitle: tBlog('subtitle'),
          read_more: tBlog('read_more'),
          coming_soon: tBlog('coming_soon'),
        }}
      />
      <ContactSection
        t={{
          title: tContact('title'),
          subtitle: tContact('subtitle'),
          name: tContact('name'),
          email: tContact('email'),
          subject: tContact('subject'),
          message: tContact('message'),
          send: tContact('send'),
          whatsapp: tContact('whatsapp'),
          success: tContact('success'),
          error: tContact('error'),
        }}
      />
    </>
  );
}
