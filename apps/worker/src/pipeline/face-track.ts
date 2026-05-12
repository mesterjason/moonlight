import { spawn } from 'child_process';
import { logger } from '@moonlight/shared';

export interface FaceDetection {
  frame: number;
  time: number;
  face: {
    x: number;
    y: number;
    width: number;
    height: number;
    center_x: number;
    center_y: number;
  };
  confidence: number;
}

export interface FaceTrackResult {
  video_width: number;
  video_height: number;
  fps: number;
  total_frames: number;
  faces: FaceDetection[];
}

export function detectFaces(
  videoPath: string,
  sampleRate: number = 1.0,
): Promise<FaceTrackResult> {
  return new Promise((resolve, reject) => {
    const args = [
      'apps/worker/python/face_track.py',
      videoPath,
      '--sample-rate', String(sampleRate),
    ];

    logger.info('Starting face detection', { videoPath, sampleRate });

    const proc = spawn('python', args, { cwd: process.cwd() });
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
          const result: FaceTrackResult = JSON.parse(stdout);
          logger.info('Face detection complete', {
            faces: result.faces.length,
            videoSize: `${result.video_width}x${result.video_height}`,
          });
          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse face tracking output: ${err}`));
        }
      } else {
        logger.error('Face detection failed', { stderr: stderr.slice(-500) });
        reject(new Error(`Face tracking exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

export function getCropRegion(
  face: FaceDetection,
  videoWidth: number,
  videoHeight: number,
  targetAspect: number = 9 / 16,
): { x: number; y: number; w: number; h: number } {
  const targetW = videoHeight * targetAspect;
  const targetH = videoHeight;

  let cropX = face.face.center_x - targetW / 2;
  let cropY = face.face.center_y - targetH / 2;

  cropX = Math.max(0, Math.min(cropX, videoWidth - targetW));
  cropY = Math.max(0, Math.min(cropY, videoHeight - targetH));

  return {
    x: Math.round(cropX),
    y: Math.round(cropY),
    w: Math.round(Math.min(targetW, videoWidth - cropX)),
    h: Math.round(Math.min(targetH, videoHeight - cropY)),
  };
}
