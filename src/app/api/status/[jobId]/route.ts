/**
 * GET /api/status/[jobId]
 *
 * Returns the current status of a processing job.
 * Requires the session that created the job.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublicJob } from '@/lib/jobs/store';
import { getSessionToken } from '@/lib/auth/session';

const JOB_ID_REGEX = /^cb-[a-f0-9]{32}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  if (!jobId || !JOB_ID_REGEX.test(jobId)) {
    return NextResponse.json({ error: 'Invalid job ID.' }, { status: 400 });
  }

  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return NextResponse.json({ error: 'No session.' }, { status: 401 });
  }

  const job = getPublicJob(jobId, sessionToken);
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json(job);
}
