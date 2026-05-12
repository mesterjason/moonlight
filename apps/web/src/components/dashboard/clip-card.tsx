'use client';

import { motion } from 'framer-motion';
import { Play, Download, Sparkles, Clock } from 'lucide-react';
import type { ClipItem } from '@/stores/dashboard';

interface ClipCardProps {
  clip: ClipItem;
}

export function ClipCard({ clip }: ClipCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]"
    >
      <div className="aspect-[9/16] bg-gradient-to-br from-moonlight-900 via-purple-900/30 to-cosmic flex items-center justify-center relative">
        {clip.thumbnail ? (
          <img src={clip.thumbnail} alt={clip.title} className="object-cover w-full h-full" />
        ) : (
          <div className="text-center">
            <Sparkles className="h-6 w-6 text-moonlight-400/50 mx-auto mb-2" />
            <p className="text-xs text-white/20">Generating...</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white text-xs font-medium hover:bg-white/20 transition-colors">
              <Play className="h-3.5 w-3.5" />
              Preview
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white text-xs font-medium hover:bg-white/20 transition-colors">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        {clip.status === 'ready' && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-300 font-medium">Ready</span>
          </div>
        )}

        {clip.status === 'generating' && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-300" />
            <span className="text-[10px] text-amber-300 font-medium">Generating</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-white/80 truncate">{clip.title}</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          <span>{clip.duration}s</span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {Math.round(clip.score * 100)}% viral
          </span>
        </div>
      </div>
    </motion.div>
  );
}
