'use client';

import { motion } from 'framer-motion';
import { MapPin, CheckCircle, Mail } from 'lucide-react';
import Image from 'next/image';

// SVG Components for GitHub and LinkedIn
const GithubIcon = ({ size = 16 }: { size?: number }) => (
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

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
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

interface AboutSectionProps {
  t: {
    title: string;
    bio: string;
    location: string;
    available: string;
  };
}

export default function AboutSection({ t }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
        >
          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 rounded-2xl overflow-hidden ring-4 ring-blue-500/30 shadow-2xl">
                <Image
                  src="/images/yo_foto.png"
                  alt="Ernesto Fierro"
                  width={288}
                  height={288}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                Software Engineer
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {t.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-sm">{t.location}</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">{t.available}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ErnestoFM"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <GithubIcon size={16} />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/ernestofm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors text-sm font-medium"
              >
                <LinkedinIcon size={16} />
                LinkedIn
              </a>
              <a
                href="mailto:hello@ernestofm.dev"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <Mail size={16} />
                Email
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
