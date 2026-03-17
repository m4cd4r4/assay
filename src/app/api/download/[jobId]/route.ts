/**
 * GET /api/download/[jobId]
 *
 * Downloads the generated knowledge base as a JSON bundle.
 * Requires the session that created the job.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJobIfOwned } from '@/lib/jobs/store';
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

  const job = getJobIfOwned(jobId, sessionToken);
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found.' },
      { status: 404 },
    );
  }

  if (job.status !== 'complete') {
    return NextResponse.json(
      { error: `Job is not complete. Current status: ${job.status}` },
      { status: 400 },
    );
  }

  // Convert Map to plain object for JSON serialization
  const files: Record<string, string> = {};
  for (const [path, content] of job.outputMarkdown) {
    files[path] = content;
  }

  const bundle = {
    projectName: job.projectName,
    generatedAt: job.completedAt,
    jobId: job.id,
    fileCount: Object.keys(files).length,
    files,
  };

  return new NextResponse(JSON.stringify(bundle, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${job.projectName.replace(/[^a-zA-Z0-9-_]/g, '_')}-knowledge-base.json"`,
    },
  });
}
