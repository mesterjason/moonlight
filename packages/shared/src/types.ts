export type VideoStatus =
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'transcribing'
  | 'analyzing'
  | 'clipping'
  | 'rendering'
  | 'completed'
  | 'failed';

export interface VideoInput {
  id: string;
  filename: string;
  originalPath: string;
  duration: number;
  status: VideoStatus;
  createdAt: string;
}

export interface ClipSegment {
  start: number;
  end: number;
  score: number;
  keywords: string[];
  transcript: string;
}

export interface SubtitleSegment {
  index: number;
  start: number;
  end: number;
  text: string;
  confidence: number;
}

export interface ExportConfig {
  resolution: '1080x1920';
  fps: 30;
  subtitleStyle: 'neon' | 'classic' | 'minimal';
  includeWatermark: boolean;
  zoomIntensity: 'low' | 'medium' | 'high';
  includeFaceTrack: boolean;
}

export interface ProcessingJob {
  id: string;
  videoId: string;
  segments: ClipSegment[];
  config: ExportConfig;
  status: VideoStatus;
  progress: number;
  createdAt: string;
}
