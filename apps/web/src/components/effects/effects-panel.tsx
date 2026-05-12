'use client';

import { useState } from 'react';
import { Wand2, Captions, ScanFace, ZoomIn, Scale } from 'lucide-react';
import { CaptionStylePicker } from './caption-style-picker';
import { cn } from '@/lib/utils';

interface EffectsPanelProps {
  onStyleChange: (style: string) => void;
  onZoomChange: (level: string) => void;
  onFaceTrackChange: (enabled: boolean) => void;
  onReframeChange: (enabled: boolean) => void;
  onEmojiChange: (enabled: boolean) => void;
}

const zoomLevels = [
  { value: 'off', label: 'Off' },
  { value: 'low', label: 'Subtle' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'Dynamic' },
];

export function EffectsPanel({
  onStyleChange,
  onZoomChange,
  onFaceTrackChange,
  onReframeChange,
  onEmojiChange,
}: EffectsPanelProps) {
  const [captionStyle, setCaptionStyle] = useState('neon');
  const [zoom, setZoom] = useState('medium');
  const [faceTrack, setFaceTrack] = useState(true);
  const [reframe, setReframe] = useState(true);
  const [emoji, setEmoji] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Wand2 className="h-5 w-5 text-moonlight-400" />
        <h3 className="text-lg font-semibold text-white">Effects</h3>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Captions className="h-4 w-4 text-white/40" />
          <span className="text-sm text-white/60">Caption Style</span>
        </div>
        <CaptionStylePicker
          value={captionStyle}
          onChange={(v) => { setCaptionStyle(v); onStyleChange(v); }}
        />
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">😊</span>
          <div>
            <span className="text-sm text-white/70">Emoji Captions</span>
            <p className="text-xs text-white/30">Auto-add emojis to keywords</p>
          </div>
        </div>
        <button
          onClick={() => { setEmoji(!emoji); onEmojiChange(!emoji); }}
          className={cn(
            'relative w-10 h-6 rounded-full transition-colors',
            emoji ? 'bg-moonlight-500' : 'bg-white/10',
          )}
        >
          <div
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
              emoji ? 'translate-x-[18px]' : 'translate-x-[2px]',
            )}
          />
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <ZoomIn className="h-4 w-4 text-white/40" />
          <span className="text-sm text-white/60">Dynamic Zoom</span>
        </div>
        <div className="flex gap-2">
          {zoomLevels.map((z) => (
            <button
              key={z.value}
              onClick={() => { setZoom(z.value); onZoomChange(z.value); }}
              className={cn(
                'flex-1 py-2 rounded-xl border text-sm transition-all',
                zoom === z.value
                  ? 'border-moonlight-500/30 bg-moonlight-500/10 text-white'
                  : 'border-white/5 bg-white/[0.02] text-white/40 hover:text-white/60',
              )}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <ScanFace className="h-4 w-4 text-white/40" />
          <div>
            <span className="text-sm text-white/70">Face Tracking</span>
            <p className="text-xs text-white/30">Smart crop to speaker</p>
          </div>
        </div>
        <button
          onClick={() => { setFaceTrack(!faceTrack); onFaceTrackChange(!faceTrack); }}
          className={cn(
            'relative w-10 h-6 rounded-full transition-colors',
            faceTrack ? 'bg-moonlight-500' : 'bg-white/10',
          )}
        >
          <div
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
              faceTrack ? 'translate-x-[18px]' : 'translate-x-[2px]',
            )}
          />
        </button>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Scale className="h-4 w-4 text-white/40" />
          <div>
            <span className="text-sm text-white/70">9:16 Reframe</span>
            <p className="text-xs text-white/30">Auto-crop to vertical</p>
          </div>
        </div>
        <button
          onClick={() => { setReframe(!reframe); onReframeChange(!reframe); }}
          className={cn(
            'relative w-10 h-6 rounded-full transition-colors',
            reframe ? 'bg-moonlight-500' : 'bg-white/10',
          )}
        >
          <div
            className={cn(
              'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
              reframe ? 'translate-x-[18px]' : 'translate-x-[2px]',
            )}
          />
        </button>
      </div>
    </div>
  );
}
