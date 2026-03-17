/**
 * POST /api/process
 *
 * Kicks off the 5-pass AI documentation pipeline for a given job.
 * Runs asynchronously - poll /api/status/[jobId] for progress.
 *
 * Request: { jobId: string }
 * Response: { jobId, status: 'processing' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJobIfOwned, updateJobStatus, addJobOutput } from '@/lib/jobs/store';
import { getSessionToken } from '@/lib/auth/session';
import { createRateLimiter, isRateLimited, getClientIp } from '@/lib/rate-limit';
import { callOpus, createCostTracker, trackCall } from '@/lib/ai/client';
import { buildOverviewPrompt, buildBusinessRulePrompt, buildDeadCodePrompt, buildDataFlowPrompt } from '@/lib/ai/prompts';
import { buildDependencyGraph } from '@/lib/cobol/call-chain';
import { isLongContext, estimateGroupTokens } from '@/lib/cobol/grouper';
import { generateProjectOverview, generateProgramDocument, generateIndexDocument } from '@/lib/output/markdown';
import { generateSystemDependencyDiagram } from '@/lib/output/mermaid';

const JOB_ID_REGEX = /^cb-[a-f0-9]{32}$/;
const processLimiter = createRateLimiter(3, 6 * 60 * 60 * 1000);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (await isRateLimited(processLimiter, ip)) {
    return NextResponse.json(
      { error: 'Processing limit reached. Please try again in 6 hours.' },
      { status: 429 },
    );
  }

  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return NextResponse.json(
      { error: 'No session. Upload files first.' },
      { status: 401 },
    );
  }

  try {
    let body: { jobId?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { jobId } = body;

    if (!jobId || !JOB_ID_REGEX.test(jobId)) {
      return NextResponse.json(
        { error: 'jobId is required.' },
        { status: 400 },
      );
    }

    const job = getJobIfOwned(jobId, sessionToken);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found.' },
        { status: 404 },
      );
    }

    if (!job.project) {
      return NextResponse.json(
        { error: 'Job has no uploaded project. Upload files first.' },
        { status: 400 },
      );
    }

    if (job.status === 'processing') {
      return NextResponse.json(
        { error: 'Job is already processing.' },
        { status: 409 },
      );
    }

    if (job.status === 'complete') {
      return NextResponse.json(
        { error: 'Job is already complete. Use /api/download to get results.' },
        { status: 409 },
      );
    }

    // Mark as processing synchronously to prevent double-submission (TOCTOU fix)
    updateJobStatus(jobId, sessionToken, 'processing', {
      progress: 0,
      currentStep: 'Queued for processing...',
    });

    // Start async processing (don't await - let it run in background)
    processJobAsync(jobId, sessionToken).catch((err) => {
      console.error(`Job ${jobId} failed:`, err);
      updateJobStatus(jobId, sessionToken, 'error', {
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    });

    return NextResponse.json({
      jobId,
      status: 'processing',
      message: 'Processing started. Poll /api/status/' + jobId + ' for progress.',
    });
  } catch (error) {
    console.error('Process error:', error);
    return NextResponse.json(
      { error: 'Failed to start processing.' },
      { status: 500 },
    );
  }
}

async function processJobAsync(jobId: string, sessionToken: string): Promise<void> {
  const job = getJobIfOwned(jobId, sessionToken);
  if (!job?.project) return;

  const project = job.project;
  const costTracker = createCostTracker();

  updateJobStatus(jobId, sessionToken, 'parsing', {
    progress: 5,
    currentStep: 'Building dependency graph...',
  });

  const graph = buildDependencyGraph(project.programs, project.copybooks);

  updateJobStatus(jobId, sessionToken, 'grouping', {
    progress: 10,
    currentStep: `${project.groups.length} processing groups prepared`,
  });

  updateJobStatus(jobId, sessionToken, 'processing', {
    progress: 15,
    currentStep: 'Starting AI analysis...',
  });

  const totalPasses = project.groups.length * 4;
  let completedPasses = 0;

  for (let gi = 0; gi < project.groups.length; gi++) {
    const group = project.groups[gi];
    const programId = group.primaryProgram.programId;
    const groupTokens = estimateGroupTokens(group);
    const longContext = isLongContext(groupTokens);

    updateJobStatus(jobId, sessionToken, 'processing', {
      progress: 15 + Math.round((completedPasses / totalPasses) * 70),
      currentStep: `Analyzing ${programId} (${gi + 1}/${project.groups.length})...`,
      processedPrograms: gi,
    });

    const overviewPrompt = buildOverviewPrompt(group);
    const overviewResult = await callOpus(
      overviewPrompt.system,
      overviewPrompt.user,
      { isLongContext: longContext },
    );
    trackCall(costTracker, overviewResult);
    completedPasses++;

    updateJobStatus(jobId, sessionToken, 'processing', {
      progress: 15 + Math.round((completedPasses / totalPasses) * 70),
      currentStep: `Extracting business rules from ${programId}...`,
    });
    const rulesPrompt = buildBusinessRulePrompt(group);
    const rulesResult = await callOpus(
      rulesPrompt.system,
      rulesPrompt.user,
      { isLongContext: longContext },
    );
    trackCall(costTracker, rulesResult);
    completedPasses++;

    updateJobStatus(jobId, sessionToken, 'processing', {
      progress: 15 + Math.round((completedPasses / totalPasses) * 70),
      currentStep: `Detecting dead code in ${programId}...`,
    });
    const deadCodePrompt = buildDeadCodePrompt(group);
    const deadCodeResult = await callOpus(
      deadCodePrompt.system,
      deadCodePrompt.user,
      { isLongContext: longContext },
    );
    trackCall(costTracker, deadCodeResult);
    completedPasses++;

    updateJobStatus(jobId, sessionToken, 'processing', {
      progress: 15 + Math.round((completedPasses / totalPasses) * 70),
      currentStep: `Tracing data flow in ${programId}...`,
    });
    const dataFlowPrompt = buildDataFlowPrompt(group);
    const dataFlowResult = await callOpus(
      dataFlowPrompt.system,
      dataFlowPrompt.user,
      { isLongContext: longContext },
    );
    trackCall(costTracker, dataFlowResult);
    completedPasses++;

    const programDoc = generateProgramDocument(
      group.primaryProgram,
      overviewResult.content,
      rulesResult.content,
      deadCodeResult.content,
      dataFlowResult.content,
    );

    addJobOutput(jobId, sessionToken, `programs/${programId}/overview.md`, programDoc);
  }

  updateJobStatus(jobId, sessionToken, 'assembling', {
    progress: 90,
    currentStep: 'Assembling knowledge base...',
    processedPrograms: project.groups.length,
  });

  const projectOverview = generateProjectOverview(project, graph);
  addJobOutput(jobId, sessionToken, 'overview.md', projectOverview);

  const systemDiagram = generateSystemDependencyDiagram(graph);
  addJobOutput(jobId, sessionToken, 'diagrams/system-dependencies.mmd', systemDiagram);

  const index = generateIndexDocument(project);
  addJobOutput(jobId, sessionToken, 'index.md', index);

  const costSummary = `# Processing Cost Summary

| Metric | Value |
|--------|-------|
| API Calls | ${costTracker.callCount} |
| Input Tokens | ${costTracker.totalInputTokens.toLocaleString()} |
| Output Tokens | ${costTracker.totalOutputTokens.toLocaleString()} |
| Total Cost (USD) | $${costTracker.totalCost.toFixed(2)} |
| Programs Processed | ${project.totalPrograms} |
| Copybooks Included | ${project.totalCopybooks} |
`;
  addJobOutput(jobId, sessionToken, 'cost-summary.md', costSummary);

  updateJobStatus(jobId, sessionToken, 'complete', {
    progress: 100,
    currentStep: 'Knowledge base ready for download',
    completedAt: new Date().toISOString(),
    processedPrograms: project.totalPrograms,
  });
}
