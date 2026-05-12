import { logger } from '@moonlight/shared';
import { extractAudioFromVideo } from './audio';
import { transcribeAudio } from './transcribe';
import { analyzeViralMoments } from './detect-viral';
import { generateClips } from './clip';
import { renderFinal } from '@moonlight/video';
import { generateASS } from '@moonlight/subtitles';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { SubtitleSegment } from '@moonlight/shared';

export interface PipelineOptions {
  videoPath: string;
  outputDir: string;
  modelSize?: string;
  maxClips?: number;
  subtitleStyle?: string;
}

export interface PipelineResult {
  clips: Array<{
    path: string;
    start: number;
    end: number;
    score: number;
    transcript: string;
  }>;
  transcription: {
    segments: SubtitleSegment[];
    language: string;
  };
  hooks: string[];
  totalDuration: number;
}

export async function runPipeline(options: PipelineOptions): Promise<PipelineResult> {
  const {
    videoPath,
    outputDir,
    modelSize = 'base',
    maxClips = 10,
    subtitleStyle = 'neon',
  } = options;

  logger.info('Pipeline started', { videoPath, outputDir });

  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // Step 1: Extract audio
  logger.info('Step 1/5: Extracting audio');
  const audioPath = await extractAudioFromVideo(videoPath, outputDir);

  // Step 2: Transcribe
  logger.info('Step 2/5: Transcribing audio');
  const transcription = await transcribeAudio(audioPath, { model: modelSize });

  // Step 3: Analyze viral moments
  logger.info('Step 3/5: Analyzing viral moments');
  const viral = analyzeViralMoments(transcription.segments);

  // Step 4: Generate clips
  logger.info('Step 4/5: Generating clips');
  const topSegments = viral.rankedSegments.slice(0, maxClips);
  const clipsDir = join(outputDir, 'clips');
  const clips = await generateClips(videoPath, topSegments, transcription.segments, clipsDir);

  // Step 5: Render final output with subtitles
  logger.info('Step 5/5: Rendering final clips');
  const renderedClips: PipelineResult['clips'] = [];

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const finalPath = join(outputDir, `final_${i + 1}.mp4`);

    const segmentSubtitles: SubtitleSegment[] = transcription.segments.filter(
      (s) => s.start >= clip.score.start && s.end <= clip.score.end,
    );

    const assContent = generateASS(segmentSubtitles, subtitleStyle);
    const assPath = join(clipsDir, `subs_${i + 1}.ass`);
    await writeFile(assPath, assContent);

    await renderFinal(clip.videoPath, finalPath, { subtitlePath: assPath });

    renderedClips.push({
      path: finalPath,
      start: clip.score.start,
      end: clip.score.end,
      score: clip.score.score,
      transcript: clip.transcript,
    });

    logger.info('Rendered final clip', { index: i + 1, path: finalPath });
  }

  logger.info('Pipeline complete', {
    clips: renderedClips.length,
    totalDuration: transcription.duration,
  });

  return {
    clips: renderedClips,
    transcription: {
      segments: transcription.segments,
      language: transcription.language,
    },
    hooks: viral.hooks,
    totalDuration: transcription.duration,
  };
}
