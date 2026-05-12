import type { ViralScore, HookResult } from './types';
import type { SubtitleSegment } from '@moonlight/shared';
import { CONSTANTS } from '@moonlight/shared';

function keywordScore(text: string): number {
  const lower = text.toLowerCase();
  const matches = CONSTANTS.VIRAL.HOOK_KEYWORDS.filter((k) => lower.includes(k)).length;
  return matches / CONSTANTS.VIRAL.HOOK_KEYWORDS.length;
}

function sentimentScore(text: string): number {
  const positive = ['love', 'best', 'amazing', 'incredible', 'beautiful', 'perfect', 'great'];
  const negative = ['worst', 'terrible', 'hate', 'awful', 'horrible', 'bad'];
  const words = text.toLowerCase().split(/\s+/);
  const posCount = words.filter((w) => positive.includes(w)).length;
  const negCount = words.filter((w) => negative.includes(w)).length;
  return (posCount - negCount) / Math.max(words.length, 1);
}

function energyScore(segment: SubtitleSegment): number {
  const textLength = segment.text.length;
  const duration = segment.end - segment.start;
  if (duration <= 0) return 0;
  const wpm = (textLength / duration) * 60;
  return Math.min(wpm / 200, 1);
}

export function scoreMoment(
  segment: SubtitleSegment,
  _index: number,
): Omit<ViralScore, 'segmentIndex'> {
  return {
    start: segment.start,
    end: segment.end,
    score: 0,
    keywords: [],
    transcript: segment.text,
    sentimentScore: sentimentScore(segment.text),
    energyScore: energyScore(segment),
    hookScore: keywordScore(segment.text),
  };
}

export function detectHooks(segments: SubtitleSegment[]): HookResult {
  const hooks: string[] = [];
  for (const seg of segments) {
    const kw = keywordScore(seg.text);
    if (kw > 0.05 && seg.text.length < 100) {
      hooks.push(seg.text);
    }
  }
  return {
    hooks: hooks.slice(0, 5),
    suggestions: hooks.length > 0
      ? hooks.map((h) => `"${h}" — great hook potential`)
      : ['Start with a bold statement', 'Ask a question', 'Use a surprising fact'],
  };
}

export function rankSegments(segments: SubtitleSegment[]): ViralScore[] {
  return segments
    .map((seg, i) => {
      const base = scoreMoment(seg, i);
      const totalScore = base.hookScore * 0.5 + base.energyScore * 0.3 + Math.abs(base.sentimentScore) * 0.2;
      return {
        segmentIndex: i,
        ...base,
        score: totalScore,
        keywords: CONSTANTS.VIRAL.HOOK_KEYWORDS.filter((k) =>
          seg.text.toLowerCase().includes(k),
        ),
      };
    })
    .filter((s) => s.score > CONSTANTS.VIRAL.MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, CONSTANTS.VIRAL.TOP_CLIPS);
}
