'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Settings2, Video, Subtitles, ZoomIn, Monitor, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/stores/dashboard';

const resolutions = [
  { label: '1080x1920', value: '1080x1920', desc: 'Full HD Vertical' },
  { label: '720x1280', value: '720x1280', desc: 'HD Vertical' },
];

const captionStyles = [
  { label: 'Neon', value: 'neon', color: 'from-moonlight-400 to-purple-400' },
  { label: 'Classic', value: 'classic', color: 'from-white to-white/60' },
  { label: 'Minimal', value: 'minimal', color: 'from-white/40 to-white/20' },
];

const zoomLevels = [
  { label: 'Off', value: 'off' },
  { label: 'Subtle', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'Dynamic', value: 'high' },
];

export function ExportControls() {
  const [resolution, setResolution] = useState('1080x1920');
  const [captionStyle, setCaptionStyle] = useState('neon');
  const [zoom, setZoom] = useState('medium');
  const isPremium = useDashboardStore((s) => s.isPremium);
  const setWatermarkState = useDashboardStore((s) => s.setWatermark);
  const [watermark, setWatermark] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<string[]>([]);
  const updateClip = useDashboardStore((s) => s.updateClip);
  const clips = useDashboardStore((s) => s.clips);

  async function handleExport() {
    setExporting(true);
    setExportDone(false);

    const readyClips = clips.filter((c) => c.status === 'ready');
    if (readyClips.length === 0) {
      setExporting(false);
      return;
    }

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clips: readyClips.map((c) => ({
            videoPath: c.id,
            subtitlePath: undefined,
          })),
          resolution: resolution === '1080x1920' ? { width: 1080, height: 1920 } : { width: 720, height: 1280 },
          zoom: zoom !== 'off',
          zoomIntensity: zoom === 'high' ? 1.05 : zoom === 'medium' ? 1.02 : 1.01,
          watermark,
          captionStyle,
        }),
      });

      if (!res.ok) throw new Error('Export failed');

      const data = await res.json();
      setDownloadUrls(data.downloadUrls || []);

      for (const clip of readyClips) {
        updateClip(clip.id, { status: 'exported' });
      }

      setExportDone(true);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="h-5 w-5 text-moonlight-400" />
        <h3 className="text-lg font-semibold text-white">Export Settings</h3>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="h-4 w-4 text-white/40" />
          <span className="text-sm text-white/60">Resolution</span>
        </div>
        <div className="flex gap-2">
          {resolutions.map((r) => (
            <button
              key={r.value}
              onClick={() => setResolution(r.value)}
              className={cn(
                'flex-1 p-3 rounded-xl border text-left transition-all',
                resolution === r.value
                  ? 'border-moonlight-500/30 bg-moonlight-500/10'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10',
              )}
            >
              <div className="text-sm font-medium text-white">{r.label}</div>
              <div className="text-xs text-white/30">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Subtitles className="h-4 w-4 text-white/40" />
          <span className="text-sm text-white/60">Caption Style</span>
        </div>
        <div className="flex gap-2">
          {captionStyles.map((s) => (
            <button
              key={s.value}
              onClick={() => setCaptionStyle(s.value)}
              className={cn(
                'flex-1 p-3 rounded-xl border text-center transition-all',
                captionStyle === s.value
                  ? 'border-moonlight-500/30 bg-moonlight-500/10'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10',
              )}
            >
              <div className={cn('text-sm font-medium mb-1 bg-gradient-to-r bg-clip-text text-transparent', s.color)}>
                {s.label}
              </div>
              <div className="text-xs text-white/30">Style</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <ZoomIn className="h-4 w-4 text-white/40" />
          <span className="text-sm text-white/60">Zoom Intensity</span>
        </div>
        <div className="flex gap-2">
          {zoomLevels.map((z) => (
            <button
              key={z.value}
              onClick={() => setZoom(z.value)}
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

      <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Video className="h-4 w-4 text-white/40" />
          <div>
            <span className="text-sm text-white/70">Watermark</span>
            <p className="text-xs text-white/30">
              {isPremium ? 'Toggle watermark on/off' : 'Free plan includes branding'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (!isPremium) return;
            const newVal = !watermark;
            setWatermark(newVal);
            setWatermarkState(newVal);
          }}
          className={cn(
            'relative w-10 h-6 rounded-full transition-colors',
            watermark ? 'bg-moonlight-500' : 'bg-white/10',
            !isPremium && 'opacity-50 cursor-not-allowed',
          )}
        >
          <motion.div
            animate={{ x: watermark ? 18 : 2 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white"
          />
        </button>
      </div>

      {!isPremium && (
        <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <p className="text-xs text-amber-400/80">
            Free plan exports include MoonLight watermark. Upgrade to Pro to remove it.
          </p>
        </div>
      )}

      {exportDone && downloadUrls.length > 0 ? (
        <div className="space-y-2">
          {downloadUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              download
              className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-emerald-300 hover:bg-emerald-500/10 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Download Clip {i + 1}</span>
            </a>
          ))}
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => setExportDone(false)}
          >
            Export Again
          </Button>
        </div>
      ) : (
        <Button
          variant="glow"
          className="w-full"
          onClick={handleExport}
          loading={exporting}
          disabled={exporting}
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Rendering...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Clips ({clips.filter((c) => c.status === 'ready').length})
            </>
          )}
        </Button>
      )}
    </div>
  );
}
