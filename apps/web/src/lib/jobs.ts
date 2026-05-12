import { randomUUID } from 'crypto';

export type JobStatus = 'queued' | 'downloading' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  type: 'upload' | 'youtube' | 'export';
  status: JobStatus;
  progress: number;
  fileName: string;
  filePath?: string;
  error?: string;
  createdAt: string;
}

const jobs = new Map<string, Job>();

export function createJob(type: Job['type'], fileName: string): Job {
  const job: Job = {
    id: randomUUID(),
    type,
    status: 'queued',
    progress: 0,
    fileName,
    createdAt: new Date().toISOString(),
  };
  jobs.set(job.id, job);
  return job;
}

export function updateJob(id: string, data: Partial<Job>) {
  const job = jobs.get(id);
  if (job) {
    Object.assign(job, data);
  }
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function listJobs(): Job[] {
  return Array.from(jobs.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
