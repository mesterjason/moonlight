import { NextRequest, NextResponse } from 'next/server';
import { validateYoutubeUrl } from '@/lib/validate';
import { createJob, updateJob } from '@/lib/jobs';
import { downloadYoutubeVideo } from '@/lib/download';
import { storeFromPath, ensureDirs } from '@/lib/storage';
import { join } from 'path';
import { logger } from '@moonlight/shared';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    const validation = validateYoutubeUrl(url);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const job = createJob('youtube', url);
    logger.info('YouTube import started', { jobId: job.id, url });

    updateJob(job.id, { status: 'downloading', progress: 0 });

    const downloadDir = join(process.cwd(), 'downloads');
    await ensureDirs();

    const result = await downloadYoutubeVideo(url, downloadDir, (progress) => {
      updateJob(job.id, { progress: Math.round(progress.percent) });
    });

    if (!result.success || !result.path) {
      updateJob(job.id, { status: 'failed', error: result.error });
      return NextResponse.json({ error: result.error || 'Download failed' }, { status: 500 });
    }

    updateJob(job.id, { status: 'processing', progress: 50 });

    const stored = await storeFromPath(result.path, `${result.title || 'youtube'}.mp4`);

    updateJob(job.id, {
      status: 'completed',
      progress: 100,
      filePath: stored.path,
    });

    logger.info('YouTube import completed', { jobId: job.id, title: result.title });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      file: stored,
      title: result.title,
      duration: result.duration,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'YouTube import failed';
    logger.error('YouTube import error', { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
