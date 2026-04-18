'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';
import type { Article } from '@/types';

interface BlogSectionProps {
  articles: Article[];
  t: {
    title: string;
    subtitle: string;
    read_more: string;
    coming_soon: string;
  };
}

export default function BlogSection({ articles, t }: BlogSectionProps) {
  return (
    <section id="blog" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.title}</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">{t.subtitle}</p>
        </motion.div>

        {articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">✍️</div>
            <p className="text-gray-400 text-lg">{t.coming_soon}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg"
              >
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {article.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs rounded-full"
                    >
                      <Tag size={9} />
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  {article.publishedAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  <a
                    href={`/blog/${article.slug}`}
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    {t.read_more}
                    <ArrowRight size={14} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
