/**
 * GET /api/status/[jobId]
 *
 * Returns the current status of a processing job.
 * Poll this endpoint to track progress.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublicJob } from '@/lib/jobs/store';

const JOB_ID_REGEX = /^cb-[a-z0-9]+-[a-z0-9]+$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  if (!jobId || !JOB_ID_REGEX.test(jobId)) {
    return NextResponse.json({ error: 'Invalid job ID.' }, { status: 400 });
  }

  const job = getPublicJob(jobId);
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json(job);
}
