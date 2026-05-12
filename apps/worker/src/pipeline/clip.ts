import { clipSegment } from '@moonlight/video';
import { logger } from '@moonlight/shared';
import { join } from 'path';
import type { ViralScore } from '@moonlight/ai';
import { generateSRT } from '@moonlight/subtitles';
import type { SubtitleSegment } from '@moonlight/shared';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export interface ClippedSegment {
  score: ViralScore;
  videoPath: string;
  subtitlePath: string;
  transcript: string;
}

export async function generateClips(
  videoPath: string,
  rankedSegments: ViralScore[],
  allSegments: SubtitleSegment[],
  outputDir: string,
): Promise<ClippedSegment[]> {
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  const clips: ClippedSegment[] = [];

  for (let i = 0; i < rankedSegments.length; i++) {
    const score = rankedSegments[i];
    const clipFilename = `clip_${i + 1}_${score.segmentIndex}.mp4`;
    const subFilename = `clip_${i + 1}_${score.segmentIndex}.srt`;
    const clipPath = join(outputDir, clipFilename);
    const subPath = join(outputDir, subFilename);

    logger.info('Generating clip', {
      index: i + 1,
      start: score.start,
      end: score.end,
      score: score.score,
    });

    await clipSegment(videoPath, clipPath, score.start, score.end);

    const segmentSubtitles: SubtitleSegment[] = allSegments.filter(
      (s) => s.start >= score.start && s.end <= score.end,
    );

    const srt = generateSRT(segmentSubtitles);
    await writeFile(subPath, srt);

    clips.push({
      score,
      videoPath: clipPath,
      subtitlePath: subPath,
      transcript: segmentSubtitles.map((s) => s.text).join(' '),
    });

    logger.info('Clip generated', {
      index: i + 1,
      path: clipPath,
      subtitleSegments: segmentSubtitles.length,
    });
  }

  logger.info('All clips generated', { count: clips.length });
  return clips;
}
