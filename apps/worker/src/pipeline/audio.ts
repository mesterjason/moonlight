import { extractAudio } from '@moonlight/video';
import { logger } from '@moonlight/shared';
import { existsSync } from 'fs';
import { join } from 'path';

export async function extractAudioFromVideo(
  videoPath: string,
  outputDir: string,
): Promise<string> {
  const audioPath = join(outputDir, 'audio.wav');

  if (existsSync(audioPath)) {
    logger.info('Audio already extracted', { path: audioPath });
    return audioPath;
  }

  logger.info('Extracting audio from video', { videoPath });
  await extractAudio(videoPath, audioPath);
  return audioPath;
}
