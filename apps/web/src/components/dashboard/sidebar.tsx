'use client';

import { motion } from 'framer-motion';
import {
  Upload, Film, Clock, Settings, Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/stores/dashboard';
import { CreditsDisplay } from './credits-display';

const tabs = [
  { id: 'uploads', label: 'Uploads', icon: Upload },
  { id: 'clips', label: 'My Clips', icon: Film },
  { id: 'queue', label: 'Processing', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const activeTab = useDashboardStore((s) => s.activeTab);
  const setActiveTab = useDashboardStore((s) => s.setActiveTab);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-cosmic/50 backdrop-blur-xl z-50 flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/5">
        <Moon className="h-5 w-5 text-moonlight-400" />
        <span className="font-bold text-white">MoonLight</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                isActive
                  ? 'bg-moonlight-500/10 text-moonlight-300 border border-moonlight-500/20'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5',
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-moonlight-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <CreditsDisplay />
      </div>
    </aside>
  );
}
