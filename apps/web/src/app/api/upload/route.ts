import { NextRequest, NextResponse } from 'next/server';
import { storeUpload } from '@/lib/storage';
import { validateVideoFile } from '@/lib/validate';
import { createJob, updateJob } from '@/lib/jobs';
import { logger } from '@moonlight/shared';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validation = validateVideoFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const job = createJob('upload', file.name);
    logger.info('Upload started', { jobId: job.id, fileName: file.name, size: file.size });

    const stored = await storeUpload(file);

    updateJob(job.id, {
      status: 'completed',
      progress: 100,
      filePath: stored.path,
    });

    logger.info('Upload completed', { jobId: job.id, fileId: stored.id });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      file: stored,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    logger.error('Upload error', { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
