'use client';

import { useState } from 'react';
import { LogOut, Briefcase, Zap, Award, BookOpen, FileText } from 'lucide-react';

type AdminTab = 'projects' | 'skills' | 'certifications' | 'courses' | 'articles';

const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'projects', label: 'Projects', icon: <Briefcase size={16} /> },
  { id: 'skills', label: 'Skills', icon: <Zap size={16} /> },
  { id: 'certifications', label: 'Certifications', icon: <Award size={16} /> },
  { id: 'courses', label: 'Courses', icon: <BookOpen size={16} /> },
  { id: 'articles', label: 'Articles', icon: <FileText size={16} /> },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[var(--surface-1)] text-[var(--text-1)]">
      {/* Header */}
      <header className="bg-[var(--surface-0)] border-b border-[var(--border-1)] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-1)]">&lt;ErnestoFM /&gt; Admin</h1>
          <p className="text-[var(--text-muted)] text-sm">Content Management System</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-1)] hover:bg-[var(--button-ghost-bg)] rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-[var(--surface-0)] border-r border-[var(--border-1)] p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[var(--button-primary-bg)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-1)] hover:bg-[var(--button-ghost-bg)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-[var(--text-1)] mb-6 capitalize">{activeTab}</h2>
          <div className="bg-[var(--surface-0)] rounded-2xl border border-[var(--border-1)] p-6">
            <p className="text-[var(--text-2)]">
              CRUD interface for <strong className="text-[var(--text-1)] capitalize">{activeTab}</strong> — connect to{' '}
              <code className="text-blue-400 text-sm">/api/{activeTab}</code>
            </p>
            <p className="text-[var(--text-muted)] text-sm mt-2">
              Use the API endpoints directly or extend this panel with full form UI for each entity.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
