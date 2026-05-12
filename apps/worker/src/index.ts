import { logger } from '@moonlight/shared';

async function main() {
  logger.info('MoonLight Worker starting...');

  const videoPath = process.argv[2];
  const outputDir = process.argv[3] || './output';

  if (videoPath) {
    logger.info('Pipeline mode detected', { videoPath, outputDir });

    const { runPipeline } = await import('./pipeline');
    const result = await runPipeline({
      videoPath,
      outputDir,
      modelSize: 'base',
      maxClips: 10,
      subtitleStyle: 'neon',
    });

    logger.info('Pipeline completed successfully', {
      clipsGenerated: result.clips.length,
      hooksFound: result.hooks.length,
    });

    process.exit(0);
  }

  logger.info('Worker listening for jobs (polling mode)...');

  setInterval(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/jobs');
      const jobs = await res.json();
      const pending = jobs.filter((j: { status: string }) => j.status === 'queued');

      for (const job of pending) {
        logger.info('Processing job', { jobId: job.id });
        // TODO: process job from queue
      }
    } catch (err) {
      logger.warn('Job poll failed', { error: String(err) });
    }
  }, 5000);

  process.on('SIGTERM', () => {
    logger.info('Worker shutting down');
    process.exit(0);
  });
}

main().catch((err) => {
  logger.error('Worker failed', { error: String(err) });
  process.exit(1);
});
