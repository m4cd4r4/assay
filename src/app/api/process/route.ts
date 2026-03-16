/**
 * POST /api/process
 *
 * Kicks off the 5-pass AI documentation pipeline for a given job.
 * Runs asynchronously — poll /api/status/[jobId] for progress.
 *
 * Request: { jobId: string }
 * Response: { jobId, status: 'processing' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJob, updateJobStatus, addJobOutput } from '@/lib/jobs/store';

// Job ID format: cb-{base36timestamp}-{base36random}
const JOB_ID_REGEX = /^cb-[a-z0-9]+-[a-z0-9]+$/;

// Rate limit: max 3 processing jobs per 6 hours per IP (Anthropic cost protection)
const processAttempts = new Map<string, number[]>();

function isProcessRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 6 * 60 * 60 * 1000;
  const limit = 3;

  const attempts = (processAttempts.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (attempts.length >= limit) {
    processAttempts.set(ip, attempts);
    return true;
  }
  attempts.push(now);
  processAttempts.set(ip, attempts);
  return false;
}
import { callOpus, createCostTracker, trackCall } from '@/lib/ai/client';
import { buildOverviewPrompt, buildBusinessRulePrompt, buildDeadCodePrompt, buildDataFlowPrompt } from '@/lib/ai/prompts';
import { buildDependencyGraph } from '@/lib/cobol/call-chain';
import { isLongContext, estimateGroupTokens } from '@/lib/cobol/grouper';
import { generateProjectOverview, generateProgramDocument, generateIndexDocument } from '@/lib/output/markdown';
import { generateSystemDependencyDiagram } from '@/lib/output/mermaid';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isProcessRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Processing limit reached. Please try again in 6 hours.' },
      { status: 429 },
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

    const job = getJob(jobId);
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

    // Start async processing (don't await — let it run in background)
    processJobAsync(jobId).catch((err) => {
      console.error(`Job ${jobId} failed:`, err);
      updateJobStatus(jobId, 'error', {
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

async function processJobAsync(jobId: string): Promise<void> {
  const job = getJob(jobId);
  if (!job?.project) return;

  const project = job.project;
  const costTracker = createCostTracker();

  // --- Stage 1: Parsing (already done during upload) ---
  updateJobStatus(jobId, 'parsing', {
    progress: 5,
    currentStep: 'Building dependency graph...',
  });

  const graph = buildDependencyGraph(project.programs, project.copybooks);

  // --- Stage 2: Grouping (already done during upload) ---
  updateJobStatus(jobId, 'grouping', {
    progress: 10,
    currentStep: `${project.groups.length} processing groups prepared`,
  });

  // --- Stage 3: AI Processing (5 passes per group) ---
  updateJobStatus(jobId, 'processing', {
    progress: 15,
    currentStep: 'Starting AI analysis...',
  });

  const totalPasses = project.groups.length * 4; // 4 AI passes per group (dependency map uses local generation)
  let completedPasses = 0;

  for (let gi = 0; gi < project.groups.length; gi++) {
    const group = project.groups[gi];
    const programId = group.primaryProgram.programId;
    const groupTokens = estimateGroupTokens(group);
    const longContext = isLongContext(groupTokens);

    updateJobStatus(jobId, 'processing', {
      progress: 15 + Math.round((completedPasses / totalPasses) * 70),
      currentStep: `Analyzing ${programId} (${gi + 1}/${project.groups.length})...`,
      processedPrograms: gi,
    });

    // Pass 1: Program Overview
    const overviewPrompt = buildOverviewPrompt(group);
    const overviewResult = await callOpus(
      overviewPrompt.system,
      overviewPrompt.user,
      { isLongContext: longContext },
    );
    trackCall(costTracker, overviewResult);
    completedPasses++;

    // Pass 2: Business Rules
    updateJobStatus(jobId, 'processing', {
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

    // Pass 3: Dead Code Detection
    updateJobStatus(jobId, 'processing', {
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

    // Pass 4: Data Flow
    updateJobStatus(jobId, 'processing', {
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

    // Assemble program document
    const programDoc = generateProgramDocument(
      group.primaryProgram,
      overviewResult.content,
      rulesResult.content,
      deadCodeResult.content,
      dataFlowResult.content,
    );

    addJobOutput(jobId, `programs/${programId}/overview.md`, programDoc);
  }

  // --- Stage 4: Assembly ---
  updateJobStatus(jobId, 'assembling', {
    progress: 90,
    currentStep: 'Assembling knowledge base...',
    processedPrograms: project.groups.length,
  });

  // Generate project overview with dependency diagram
  const projectOverview = generateProjectOverview(project, graph);
  addJobOutput(jobId, 'overview.md', projectOverview);

  // Generate system dependency diagram standalone
  const systemDiagram = generateSystemDependencyDiagram(graph);
  addJobOutput(jobId, 'diagrams/system-dependencies.mmd', systemDiagram);

  // Generate index
  const index = generateIndexDocument(project);
  addJobOutput(jobId, 'index.md', index);

  // Add cost summary
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
  addJobOutput(jobId, 'cost-summary.md', costSummary);

  // --- Complete ---
  updateJobStatus(jobId, 'complete', {
    progress: 100,
    currentStep: 'Knowledge base ready for download',
    completedAt: new Date().toISOString(),
    processedPrograms: project.totalPrograms,
  });
}
