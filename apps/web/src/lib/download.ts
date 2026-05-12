import { spawn } from 'child_process';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { logger } from '@moonlight/shared';

export interface DownloadProgress {
  percent: number;
  speed: string;
  eta: string;
}

export interface DownloadResult {
  success: boolean;
  path?: string;
  title?: string;
  duration?: number;
  error?: string;
}

export function downloadYoutubeVideo(
  url: string,
  outputDir: string,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<DownloadResult> {
  return new Promise((resolve) => {
    const id = randomUUID();
    const outputTemplate = join(outputDir, `${id}_%(title)s.%(ext)s`);

    const args = [
      url,
      '-o', outputTemplate,
      '--format', 'best[height<=1080]',
      '--no-playlist',
      '--print', 'filename',
      '--print', 'title',
      '--print', 'duration',
      '--no-warnings',
      '--no-cache-dir',
    ];

    logger.info('Starting YouTube download', { url });

    const proc = spawn('yt-dlp', args, { shell: true });
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: Buffer) => {
      const line = data.toString();
      stderr += line;

      const percentMatch = line.match(/(\d+\.?\d*)%/);
      const speedMatch = line.match(/at\s+([\d.]+[KM]?i?B\/s)/);
      const etaMatch = line.match(/ETA\s+(\d+:\d+)/);

      if (percentMatch && onProgress) {
        onProgress({
          percent: parseFloat(percentMatch[1]),
          speed: speedMatch?.[1] || '',
          eta: etaMatch?.[1] || '',
        });
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        const lines = stdout.trim().split('\n');
        const filePath = lines[0]?.trim();
        const title = lines[1]?.trim();
        const duration = parseFloat(lines[2]?.trim() || '0');

        logger.info('YouTube download complete', { title, filePath });
        resolve({
          success: true,
          path: filePath,
          title,
          duration: isNaN(duration) ? undefined : duration,
        });
      } else {
        logger.error('YouTube download failed', { stderr: stderr.slice(-500) });
        resolve({
          success: false,
          error: `Download failed: ${stderr.slice(-200)}`,
        });
      }
    });

    proc.on('error', (err) => {
      logger.error('YouTube download process error', { error: String(err) });
      resolve({ success: false, error: String(err) });
    });
  });
}
