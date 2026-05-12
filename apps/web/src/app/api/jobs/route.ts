import { NextRequest, NextResponse } from 'next/server';
import { getJob, listJobs } from '@/lib/jobs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const job = getJob(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json(job);
  }

  const jobs = listJobs();
  return NextResponse.json(jobs);
}
