import { writeFile, mkdir, unlink } from 'fs/promises';
import { createWriteStream, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { pipeline } from 'stream/promises';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const OUTPUT_DIR = join(process.cwd(), 'public', 'outputs');
const DOWNLOAD_DIR = join(process.cwd(), 'downloads');

export interface StoredFile {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export async function ensureDirs() {
  if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });
  if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true });
  if (!existsSync(DOWNLOAD_DIR)) await mkdir(DOWNLOAD_DIR, { recursive: true });
}

export async function storeUpload(
  file: File,
): Promise<StoredFile> {
  await ensureDirs();
  const id = randomUUID();
  const ext = file.name.split('.').pop() || 'mp4';
  const filename = `${id}.${ext}`;
  const path = join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(path, Buffer.from(bytes));

  return {
    id,
    filename,
    originalName: file.name,
    path,
    size: file.size,
    mimeType: file.type,
    createdAt: new Date().toISOString(),
  };
}

export async function storeFromPath(
  sourcePath: string,
  originalName: string,
): Promise<StoredFile> {
  await ensureDirs();
  const id = randomUUID();
  const ext = originalName.split('.').pop() || 'mp4';
  const filename = `${id}.${ext}`;
  const destPath = join(UPLOAD_DIR, filename);

  const { createReadStream } = await import('fs');
  const readStream = createReadStream(sourcePath);
  const writeStream = createWriteStream(destPath);
  await pipeline(readStream, writeStream);

  const { stat } = await import('fs/promises');
  const stats = await stat(destPath);

  return {
    id,
    filename,
    originalName,
    path: destPath,
    size: stats.size,
    mimeType: 'video/mp4',
    createdAt: new Date().toISOString(),
  };
}

export async function removeFile(path: string) {
  try {
    await unlink(path);
  } catch {
    // file may not exist
  }
}

export function getUploadPath(filename: string): string {
  return join(UPLOAD_DIR, filename);
}

export function getOutputPath(filename: string): string {
  return join(OUTPUT_DIR, filename);
}
