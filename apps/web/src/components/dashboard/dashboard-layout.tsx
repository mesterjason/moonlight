'use client';

import { motion } from 'framer-motion';
import { Sidebar } from './sidebar';
import { useDashboardStore } from '@/stores/dashboard';
import { UploadZone } from './upload-zone';
import { ProcessingQueue } from './processing-queue';
import { ClipGrid } from './clip-grid';

function SettingsPanel() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Account</h3>
        <p className="text-sm text-white/40">Manage your account settings and preferences.</p>
      </div>

      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
        <label className="text-sm text-white/70 block mb-2">Display Name</label>
        <input
          type="text"
          placeholder="Your name"
          className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-moonlight-400/50 focus:outline-none"
        />
      </div>

      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
        <label className="text-sm text-white/70 block mb-2">API Key</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value="ml_sk_xxxxxxxxxxxx"
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-white/40 font-mono focus:outline-none"
          />
          <button className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">
            Copy
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
        <label className="text-sm text-white/70 block mb-2">Notification Preferences</label>
        <div className="space-y-3">
          {['Email notifications', 'Processing complete', 'Weekly digest'].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 text-moonlight-500 focus:ring-moonlight-400" />
              <span className="text-sm text-white/50">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const activeTab = useDashboardStore((s) => s.activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'uploads':
        return (
          <div className="space-y-8">
            <UploadZone />
            <ProcessingQueue />
          </div>
        );
      case 'clips':
        return <ClipGrid />;
      case 'queue':
        return <ProcessingQueue />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-cosmic">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
