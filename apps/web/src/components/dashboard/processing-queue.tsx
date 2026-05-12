'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboard';

const stageIcons: Record<string, React.ReactNode> = {
  'Uploading...': <Loader2 className="h-3.5 w-3.5 text-moonlight-400 animate-spin" />,
  'Queued': <Clock className="h-3.5 w-3.5 text-amber-400" />,
  'Downloading...': <Loader2 className="h-3.5 w-3.5 text-moonlight-400 animate-spin" />,
  'Transcribing': <Loader2 className="h-3.5 w-3.5 text-purple-400 animate-spin" />,
  'Analyzing': <Loader2 className="h-3.5 w-3.5 text-moonlight-400 animate-spin" />,
  'Clipping': <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin" />,
  'Rendering': <Loader2 className="h-3.5 w-3.5 text-orange-400 animate-spin" />,
  'Complete': <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
  'Failed': <XCircle className="h-3.5 w-3.5 text-red-400" />,
};

export function ProcessingQueue() {
  const queue = useDashboardStore((s) => s.queue);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Processing Queue</h3>
        <span className="text-xs text-white/40">{queue.length} items</span>
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-12 text-white/20 text-sm">
          <Clock className="h-8 w-8 mx-auto mb-3 opacity-50" />
          No items in queue
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {queue.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02]"
              >
                <div className="shrink-0">
                  {stageIcons[item.stage] || <Clock className="h-3.5 w-3.5 text-white/30" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate">{item.name}</p>
                  <p className="text-xs text-white/30">{item.stage}</p>
                </div>
                <div className="w-20">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-moonlight-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <span className="text-xs text-white/30 w-8 text-right">{Math.round(item.progress)}%</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
