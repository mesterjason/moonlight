import { spawn } from 'child_process';
import { logger } from '@moonlight/shared';
import type { SubtitleSegment } from '@moonlight/shared';

export interface TranscriptionResult {
  language: string;
  duration: number;
  segments: SubtitleSegment[];
}

export function transcribeAudio(
  audioPath: string,
  options: { model?: string; language?: string } = {},
): Promise<TranscriptionResult> {
  return new Promise((resolve, reject) => {
    const model = options.model || 'base';
    const language = options.language || 'en';

    const args = [
      'apps/worker/python/transcribe.py',
      audioPath,
      '--model', model,
      '--language', language,
      '--timing',
    ];

    logger.info('Starting transcription', { audioPath, model, language });

    const proc = spawn('python', args, {
      cwd: process.cwd(),
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        try {
          const result: TranscriptionResult = JSON.parse(stdout);
          logger.info('Transcription complete', {
            segments: result.segments.length,
            duration: result.duration,
            language: result.language,
          });
          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse transcription output: ${err}`));
        }
      } else {
        logger.error('Transcription failed', { stderr: stderr.slice(-500) });
        reject(new Error(`Transcription exited with code ${code}: ${stderr.slice(-200)}`));
      }
    });

    proc.on('error', reject);
  });
}
