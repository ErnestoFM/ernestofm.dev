'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
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

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">&lt;ErnestoFM /&gt; Admin</h1>
          <p className="text-gray-400 text-sm">Content Management System</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-gray-900 border-r border-gray-800 p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
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
          <h2 className="text-2xl font-bold text-white mb-6 capitalize">{activeTab}</h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <p className="text-gray-400">
              CRUD interface for <strong className="text-white capitalize">{activeTab}</strong> — connect to{' '}
              <code className="text-blue-400 text-sm">/api/{activeTab}</code>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Use the API endpoints directly or extend this panel with full form UI for each entity.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
