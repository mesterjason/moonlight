const ALLOWED_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/x-matroska',
];

const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];

const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateVideoFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: `File exceeds 500MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)` };
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Unsupported format: ${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` };
  }

  if (!ALLOWED_TYPES.includes(file.type) && file.type !== '') {
    return { valid: false, error: `Unsupported MIME type: ${file.type}` };
  }

  return { valid: true };
}

export function validateYoutubeUrl(url: string): ValidationResult {
  if (!url || !url.trim()) {
    return { valid: false, error: 'No URL provided' };
  }

  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=.+/,
    /^https?:\/\/youtu\.be\/.+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/.+/,
    /^https?:\/\/(www\.)?youtube\.com\/live\/.+/,
    /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=.+/,
  ];

  const isValid = patterns.some((p) => p.test(url.trim()));
  if (!isValid) {
    return { valid: false, error: 'Invalid YouTube URL format' };
  }

  return { valid: true };
}
