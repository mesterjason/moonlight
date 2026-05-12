import { spawn, execSync } from 'child_process';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { logger } from '@moonlight/shared';
import type { FfmpegProgress } from './types';

function parseFfmpegProgress(data: string): FfmpegProgress | null {
  const match = data.match(/time=(\d+:\d+:\d+\.\d+).*fps=(\s*\d+).*speed=(\s*[\d.]+x)/);
  if (!match) return null;
  return {
    percent: 0,
    fps: parseInt(match[2]),
    speed: match[3].trim(),
    time: match[1],
  };
}

function timeToSeconds(t: string): number {
  const [h, m, s] = t.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

export function extractAudio(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', inputPath,
      '-vn',
      '-acodec', 'pcm_s16le',
      '-ar', '16000',
      '-ac', '1',
      '-y',
      outputPath,
    ];

    logger.info('Extracting audio', { input: inputPath, output: outputPath });
    const proc = spawn('ffmpeg', args);

    proc.stderr.on('data', (data: Buffer) => {
      const line = data.toString();
      const progress = parseFfmpegProgress(line);
      if (progress) {
        logger.info('Audio extraction progress', progress as unknown as Record<string, unknown>);
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        logger.info('Audio extraction complete', { output: outputPath });
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

export function clipSegment(
  inputPath: string,
  outputPath: string,
  start: number,
  end: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const duration = end - start;
    const args = [
      '-ss', start.toString(),
      '-i', inputPath,
      '-t', duration.toString(),
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-c:a', 'aac',
      '-y',
      outputPath,
    ];

    logger.info('Clipping segment', { input: inputPath, start, end, output: outputPath });
    const proc = spawn('ffmpeg', args);

    proc.stderr.on('data', (data: Buffer) => {
      const line = data.toString();
      const progress = parseFfmpegProgress(line);
      if (progress) logger.info('Clip progress', progress as unknown as Record<string, unknown>);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        logger.info('Clip complete', { output: outputPath });
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

export interface RenderOptions {
  crop?: { x: number; y: number; w: number; h: number };
  zoom?: boolean;
  zoomIntensity?: number;
  subtitlePath?: string;
  watermark?: boolean;
  watermarkPath?: string;
  targetWidth?: number;
  targetHeight?: number;
  onProgress?: (percent: number) => void;
}

export function renderFinal(
  inputPath: string,
  outputPath: string,
  options: RenderOptions = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const filterParts: string[] = [];
    const inputFiles = [inputPath];

    if (options.crop) {
      const { x, y, w, h } = options.crop;
      filterParts.push(`crop=${w}:${h}:${x}:${y}`);
    }

    if (options.zoom) {
      const z = options.zoomIntensity || 1.02;
      filterParts.push(`zoompan=z='min(zoom+0.0005,${z})':d=30:s=${options.targetWidth || 1080}x${options.targetHeight || 1920}:fps=30`);
    }

    if (options.subtitlePath) {
      const escaped = options.subtitlePath.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "'\\''");
      filterParts.push(`subtitles='${escaped}'`);
    }

    if (options.watermark) {
      const wmPath = options.watermarkPath || join(__dirname, '..', 'assets', 'watermark.png');
      inputFiles.push(wmPath);
      filterParts.push(`overlay=W-w-20:H-h-20:format=auto`);
    }

    const scaleFilter = `scale=${options.targetWidth || 1080}:${options.targetHeight || 1920}:force_original_aspect_ratio=decrease,pad=${options.targetWidth || 1080}:${options.targetHeight || 1920}:(ow-iw)/2:(oh-ih)/2`;
    filterParts.push(scaleFilter);

    const vf = filterParts.join(',');

    const args = [
      ...inputFiles.flatMap((f, i) => i === 0 ? ['-i', f] : ['-i', f]),
      ...(vf ? ['-vf', vf] : []),
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-r', '30',
      '-y',
      outputPath,
    ];

    logger.info('Rendering final output', { input: inputPath, output: outputPath, filters: filterParts.length });
    const proc = spawn('ffmpeg', args);
    let duration = 0;

    proc.stderr.on('data', (data: Buffer) => {
      const line = data.toString();
      const progress = parseFfmpegProgress(line);

      const durMatch = line.match(/Duration: (\d+:\d+:\d+\.\d+)/);
      if (durMatch) {
        duration = timeToSeconds(durMatch[1]);
      }

      if (progress && duration > 0 && options.onProgress) {
        const current = timeToSeconds(progress.time);
        const pct = Math.min(100, Math.round((current / duration) * 100));
        options.onProgress(pct);
      }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        logger.info('Render complete', { output: outputPath });
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

export async function generateWatermark(
  _outputPath: string,
  text: string = 'MoonLight',
): Promise<string> {
  const dir = join(process.cwd(), 'assets');
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  const wmPath = join(dir, 'watermark.png');

  const fontPath = 'C\\:/Windows/Fonts/arial.ttf';

  const args = [
    '-f', 'lavfi',
    '-i', 'color=c=black:s=200x60:r=1:d=1',
    '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=20:x=10:y=10:alpha=0.5:fontfile=${fontPath}`,
    '-frames:v', '1',
    '-update', '1',
    '-y',
    wmPath,
  ];

  execSync(`ffmpeg ${args.join(' ')}`, { stdio: 'ignore' });
  logger.info('Watermark generated', { path: wmPath });
  return wmPath;
}
