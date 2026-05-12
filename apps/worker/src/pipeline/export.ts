import { renderFinal, generateWatermark } from '@moonlight/video';
import { logger } from '@moonlight/shared';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export interface ExportClip {
  videoPath: string;
  subtitlePath?: string;
  start?: number;
  end?: number;
}

export interface ExportOptions {
  clips: ExportClip[];
  outputDir: string;
  resolution?: { width: number; height: number };
  zoom?: boolean;
  zoomIntensity?: number;
  watermark?: boolean;
  captionStyle?: string;
  onClipProgress?: (index: number, percent: number) => void;
}

export interface ExportResult {
  clips: Array<{
    path: string;
    index: number;
  }>;
}

export async function runExport(options: ExportOptions): Promise<ExportResult> {
  const {
    clips,
    outputDir,
    resolution = { width: 1080, height: 1920 },
    zoom = false,
    zoomIntensity = 1.02,
    watermark = false,
    onClipProgress,
  } = options;

  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  let watermarkPath: string | undefined;
  if (watermark) {
    watermarkPath = join(outputDir, 'watermark.png');
    await generateWatermark(watermarkPath);
  }

  const results: ExportResult['clips'] = [];

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const outputPath = join(outputDir, `export_${i + 1}.mp4`);

    logger.info('Rendering export clip', { index: i + 1, total: clips.length });

    await renderFinal(clip.videoPath, outputPath, {
      subtitlePath: clip.subtitlePath,
      zoom,
      zoomIntensity,
      watermark,
      watermarkPath,
      targetWidth: resolution.width,
      targetHeight: resolution.height,
      onProgress: (pct) => {
        if (onClipProgress) onClipProgress(i, pct);
      },
    });

    results.push({ path: outputPath, index: i + 1 });
    logger.info('Export clip complete', { index: i + 1, path: outputPath });
  }

  logger.info('Export complete', { clips: results.length });
  return { clips: results };
}
