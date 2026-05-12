'use client';

import { useDashboardStore } from '@/stores/dashboard';
import { ClipCard } from './clip-card';
import { Film } from 'lucide-react';

export function ClipGrid() {
  const clips = useDashboardStore((s) => s.clips);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Generated Clips</h3>
        <span className="text-xs text-white/40">{clips.length} clips</span>
      </div>

      {clips.length === 0 ? (
        <div className="text-center py-12 text-white/20 text-sm">
          <Film className="h-8 w-8 mx-auto mb-3 opacity-50" />
          No clips yet. Upload a video to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      )}
    </div>
  );
}
