import { rankSegments, detectHooks } from '@moonlight/ai';
import type { SubtitleSegment } from '@moonlight/shared';
import type { ViralScore } from '@moonlight/ai';
import { logger } from '@moonlight/shared';

export interface ViralAnalysisResult {
  rankedSegments: ViralScore[];
  hooks: string[];
  suggestions: string[];
}

export function analyzeViralMoments(
  segments: SubtitleSegment[],
): ViralAnalysisResult {
  logger.info('Analyzing viral moments', { segments: segments.length });

  const rankedSegments = rankSegments(segments);
  const hooks = detectHooks(segments);

  logger.info('Viral analysis complete', {
    topSegments: rankedSegments.length,
    hooks: hooks.hooks.length,
  });

  return {
    rankedSegments,
    hooks: hooks.hooks,
    suggestions: hooks.suggestions,
  };
}
