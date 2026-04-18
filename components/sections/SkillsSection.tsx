'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Skill, SkillCategory } from '@/types';

interface SkillsSectionProps {
  skills: Skill[];
  t: {
    title: string;
    subtitle: string;
    categories: Record<string, string>;
  };
}

const categoryOrder: SkillCategory[] = ['backend', 'frontend', 'database', 'cloud', 'devops', 'testing'];

export default function SkillsSection({ skills, t }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...categoryOrder.filter(c => skills.some(s => s.category === c))];
  const filtered = activeCategory === 'all' ? skills : skills.filter(s => s.category === activeCategory);

  const grouped = categoryOrder.reduce<Record<string, Skill[]>>((acc, cat) => {
    const cat_skills = filtered.filter(s => s.category === cat);
    if (cat_skills.length) acc[cat] = cat_skills;
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 bg-gray-50 dark:bg-gray-950">
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

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat === 'all' ? 'All' : (t.categories[cat] ?? cat)}
            </button>
          ))}
        </div>

        {/* Skills by category */}
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
                {t.categories[category] ?? category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catSkills.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{skill.name}</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
