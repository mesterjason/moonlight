'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaptionStyle {
  id: string;
  name: string;
  previewLabel: string;
  gradient: string;
  description: string;
}

const styles: CaptionStyle[] = [
  { id: 'neon', name: 'Neon', previewLabel: 'Neon Glow', gradient: 'from-moonlight-400 via-purple-400 to-pink-400', description: 'Bold glow effect' },
  { id: 'classic', name: 'Classic', previewLabel: 'White Stroke', gradient: 'from-white to-white/80', description: 'Clean white text' },
  { id: 'minimal', name: 'Minimal', previewLabel: 'Subtle', gradient: 'from-white/60 to-white/30', description: 'Lightweight style' },
];

interface CaptionStylePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaptionStylePicker({ value, onChange }: CaptionStylePickerProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {styles.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={cn(
            'relative p-4 rounded-xl border text-center transition-all',
            value === s.id
              ? 'border-moonlight-500/30 bg-moonlight-500/10'
              : 'border-white/5 bg-white/[0.02] hover:border-white/10',
          )}
        >
          {value === s.id && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-moonlight-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
          <div className={cn('text-lg font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent', s.gradient)}>
            Aa
          </div>
          <div className="text-sm font-medium text-white/70">{s.name}</div>
          <div className="text-[10px] text-white/30 mt-0.5">{s.description}</div>
        </button>
      ))}
    </div>
  );
}
