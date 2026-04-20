import { Mail, Download, MessageCircle } from 'lucide-react';
import { GITHUB_PROFILE_URL, LINKEDIN_PROFILE_URL } from '@/lib/social-links';

const WHATSAPP_URL =
  'https://wa.me/526863873651?text=Hola%20Ernesto%2C%20vi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20contactarte.';

// SVG Components for GitHub and LinkedIn
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3.405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

interface FooterProps {
  t: {
    built_by: string;
    download_cv: string;
    whatsapp: string;
  };
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-[var(--surface-1)] border-t border-[var(--border-1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-[var(--text-1)]">&lt;ErnestoFM /&gt;</p>
            <p className="text-[var(--text-muted)] mt-1">Ernesto Fierro · Software Engineer</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-1)] transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href={LINKEDIN_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-1)] transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href="mailto:hello@ernestofm.dev"
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-1)] transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
              aria-label={t.whatsapp}
            >
              <MessageCircle size={20} />
            </a>
            <a
              href="/cv/ernesto-fierro-cv.pdf"
              download
              className="flex items-center gap-2 px-4 py-2 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover)] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download size={16} />
              {t.download_cv}
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border-1)] text-center">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} {t.built_by} · Tonalá, Jalisco, México
          </p>
        </div>
      </div>
    </footer>
  );
}
