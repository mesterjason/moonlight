'use client';

import { useRef, useEffect, useState } from 'react';

interface SubtitleSegment {
  index: number;
  start: number;
  end: number;
  text: string;
}

interface SubtitlePreviewProps {
  segments: SubtitleSegment[];
  currentTime: number;
  style?: 'neon' | 'classic' | 'minimal';
  emoji?: boolean;
}

const styleConfig = {
  neon: { font: 'bold 28px Arial', fill: '#ffffff', stroke: '#6c63ff', shadow: '#ff00ff' },
  classic: { font: '24px Arial', fill: '#ffffff', stroke: '#000000', shadow: '#000000' },
  minimal: { font: '20px Arial', fill: '#ffffff', stroke: '#00000044', shadow: 'transparent' },
};

const EMOJI_MAP: Record<string, string> = {
  love: '❤️', heart: '❤️', fire: '🔥', wow: '😮', crazy: '🤯',
  insane: '🔥', mind: '🧠', best: '🏆', game: '🎮', hack: '💡',
  secret: '🤫', exclusive: '💎', tutorial: '📚', guide: '📖',
  reaction: '😱', review: '⭐', shocking: '⚡', ultimate: '👑',
  wait: '⏸️', omg: '😱', 'complete': '✅', 'step': '📝',
  breaking: '🚨', controversial: '💥', life: '✨', perfect: '💯',
};

function injectEmojis(text: string): string {
  let result = text;
  for (const [word, emoji] of Object.entries(EMOJI_MAP)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, `${emoji} $&`);
  }
  return result;
}

export function SubtitlePreview({ segments, currentTime, style = 'neon', emoji = true }: SubtitlePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeText, setActiveText] = useState('');

  useEffect(() => {
    const active = segments.find((s) => currentTime >= s.start && currentTime < s.end);
    const text = active ? (emoji ? injectEmojis(active.text) : active.text) : '';
    setActiveText(text);
  }, [segments, currentTime, emoji]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeText) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cfg = styleConfig[style];
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const lines = splitText(ctx, activeText, w - 80);
    const lineHeight = style === 'neon' ? 42 : style === 'classic' ? 36 : 30;
    const totalHeight = lines.length * lineHeight;
    const startY = h - 120 - totalHeight;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    for (let i = 0; i < lines.length; i++) {
      const y = startY + i * lineHeight;
      const x = w / 2;

      if (cfg.shadow !== 'transparent') {
        ctx.shadowColor = cfg.shadow;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.font = cfg.font;
      ctx.strokeStyle = cfg.stroke;
      ctx.lineWidth = style === 'minimal' ? 1 : 4;
      ctx.strokeText(lines[i], x, y);

      ctx.fillStyle = cfg.fill;
      ctx.fillText(lines[i], x, y);
    }
  }, [activeText, style]);

  return (
    <canvas
      ref={canvasRef}
      width={1080}
      height={1920}
      className="w-full aspect-[9/16] rounded-xl bg-cosmic"
    />
  );
}

function splitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}
