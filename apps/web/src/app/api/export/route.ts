import { NextRequest, NextResponse } from 'next/server';
import { renderFinal, generateWatermark } from '@moonlight/video';
import { createJob, updateJob } from '@/lib/jobs';
import { logger } from '@moonlight/shared';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

interface ExportClipInput {
  videoPath: string;
  subtitlePath?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clips, resolution, zoom, zoomIntensity, watermark } = body as {
      clips: ExportClipInput[];
      resolution?: { width: number; height: number };
      zoom?: boolean;
      zoomIntensity?: number;
      watermark?: boolean;
      captionStyle?: string;
    };

    if (!clips || !Array.isArray(clips) || clips.length === 0) {
      return NextResponse.json({ error: 'No clips provided' }, { status: 400 });
    }

    const job = createJob('export', `${clips.length} clips`);
    logger.info('Export started', { jobId: job.id, clipCount: clips.length });
    updateJob(job.id, { status: 'processing', progress: 0 });

    const outputDir = join(process.cwd(), 'public', 'exports', job.id);
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    let watermarkPath: string | undefined;
    if (watermark) {
      watermarkPath = join(outputDir, 'watermark.png');
      await generateWatermark(watermarkPath);
    }

    const results: Array<{ path: string; index: number }> = [];

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const clipInputPath = clip.videoPath;
      const outputPath = join(outputDir, `export_${i + 1}.mp4`);

      logger.info('Rendering export clip', { index: i + 1, total: clips.length });

      await renderFinal(clipInputPath, outputPath, {
        subtitlePath: clip.subtitlePath,
        zoom: zoom !== undefined ? zoom : true,
        zoomIntensity: zoomIntensity || 1.02,
        watermark,
        watermarkPath,
        targetWidth: resolution?.width || 1080,
        targetHeight: resolution?.height || 1920,
        onProgress: (pct) => {
          const total = clips.length;
          const overall = Math.round(((i * 100 + pct) / (total * 100)) * 100);
          updateJob(job.id, { progress: overall });
        },
      });

      results.push({ path: outputPath, index: i + 1 });
      logger.info('Export clip complete', { index: i + 1 });
    }

    updateJob(job.id, { status: 'completed', progress: 100 });

    const downloadUrls = results.map(
      (r) => `/api/download?path=${encodeURIComponent(r.path)}&name=clip_${r.index}`,
    );

    logger.info('Export completed', { jobId: job.id });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      clips: results,
      downloadUrls,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Export failed';
    logger.error('Export error', { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
