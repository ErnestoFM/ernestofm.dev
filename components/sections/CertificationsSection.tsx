'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Clock } from 'lucide-react';
import type { Certification, Course } from '@/types';

interface CertificationsSectionProps {
  certifications: Certification[];
  courses: Course[];
  t: {
    title: string;
    tab_certs: string;
    tab_courses: string;
    in_progress: string;
    verify: string;
  };
}

export default function CertificationsSection({ certifications, courses, t }: CertificationsSectionProps) {
  const [activeTab, setActiveTab] = useState<'certs' | 'courses'>('certs');

  return (
    <section id="certifications" className="py-24 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.title}</h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-200 dark:bg-gray-800 rounded-xl p-1">
            {(['certs', 'courses'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab === 'certs' ? t.tab_certs : t.tab_courses}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'certs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border transition-all ${
                  cert.inProgress
                    ? 'border-dashed border-gray-300 dark:border-gray-600 opacity-75'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg'
                }`}
              >
                {cert.inProgress && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full text-xs font-medium">
                    <Clock size={10} />
                    {t.in_progress}
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {cert.badgeUrl && !cert.inProgress ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={cert.badgeUrl}
                        alt={cert.name}
                        width={64}
                        height={64}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🏆</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-xs font-medium mb-2">{cert.issuer}</p>
                    <p className="text-gray-400 text-xs">
                      {cert.inProgress
                        ? 'In progress...'
                        : new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {cert.credlyUrl && !cert.inProgress && (
                  <a
                    href={cert.credlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <ExternalLink size={11} />
                    {t.verify}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📚</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">{course.name}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">{course.platform}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(course.completedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
