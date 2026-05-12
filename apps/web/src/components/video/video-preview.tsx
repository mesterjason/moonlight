'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { SubtitlePreview } from '@/components/effects/subtitle-preview';

interface SubtitleSegment {
  index: number;
  start: number;
  end: number;
  text: string;
}

interface VideoPreviewProps {
  src?: string;
  subtitles?: SubtitleSegment[];
  captionStyle?: string;
  emoji?: boolean;
}

export function VideoPreview({ src, subtitles = [], captionStyle = 'neon', emoji = true }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setCurrentTime(video.currentTime);
    const onMeta = () => setDuration(video.duration);
    const onEnd = () => setPlaying(false);

    video.addEventListener('timeupdate', onTime);
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('ended', onEnd);
    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('ended', onEnd);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-cosmic border border-white/5 group">
      {src ? (
        <>
          <video
            ref={videoRef}
            src={src}
            className="w-full aspect-[9/16] object-cover"
            playsInline
          />

          <div className="absolute inset-0 pointer-events-none">
            <SubtitlePreview
              segments={subtitles}
              currentTime={currentTime}
              style={captionStyle as 'neon' | 'classic' | 'minimal'}
              emoji={emoji}
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-white/80 hover:text-white transition-colors">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>

              <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative group/bar">
                <div
                  className="h-full bg-moonlight-400 rounded-full"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              <span className="text-xs text-white/50 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <button onClick={() => setMuted(!muted)} className="text-white/60 hover:text-white transition-colors">
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="aspect-[9/16] flex items-center justify-center">
          <div className="text-center">
            <Play className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/20 text-sm">No video selected</p>
          </div>
        </div>
      )}
    </div>
  );
}
