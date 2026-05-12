import type { SubtitleSegment } from '@moonlight/shared';

export interface TranscriptionResult {
  segments: SubtitleSegment[];
  language: string;
  duration: number;
}

export interface ViralScore {
  segmentIndex: number;
  start: number;
  end: number;
  score: number;
  keywords: string[];
  transcript: string;
  sentimentScore: number;
  energyScore: number;
  hookScore: number;
}

export interface HookResult {
  hooks: string[];
  suggestions: string[];
}
