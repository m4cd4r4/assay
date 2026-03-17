/**
 * In-memory job store for V1 (no database).
 *
 * Jobs persist for the lifetime of the server process with a 1-hour TTL.
 * Max 100 concurrent jobs to prevent memory exhaustion.
 * All exported functions require a session token for access control.
 */

import { randomBytes, timingSafeEqual } from 'crypto';
import type { ProcessingJob, JobStatus, CostEstimate } from '@/types/job';
import type { CobolProject } from '@/types/cobol';

const JOB_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_JOBS = 100;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface StoredJob extends ProcessingJob {
  sessionToken: string;
  project: CobolProject | null;
  outputMarkdown: Map<string, string>;
  knowledgeBaseZip: Buffer | null;
  createdAt: number;
}

const jobs = new Map<string, StoredJob>();

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanupRunning() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(cleanupExpiredJobs, CLEANUP_INTERVAL_MS);
  if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }
}

function cleanupExpiredJobs() {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (now - job.createdAt > JOB_TTL_MS) {
      jobs.delete(id);
    }
  }
  if (jobs.size === 0 && cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
}

function evictOldestIfNeeded() {
  if (jobs.size < MAX_JOBS) return;
  let oldestId: string | null = null;
  let oldestTime = Infinity;
  for (const [id, job] of jobs) {
    if (job.status === 'processing') continue;
    if (job.createdAt < oldestTime) {
      oldestTime = job.createdAt;
      oldestId = id;
    }
  }
  if (oldestId) jobs.delete(oldestId);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function verifyOwnership(id: string, sessionToken: string): StoredJob | null {
  const job = jobs.get(id);
  if (!job || !constantTimeEqual(job.sessionToken, sessionToken)) return null;
  return job;
}

export function createJob(
  projectName: string,
  costEstimate: CostEstimate,
  sessionToken: string,
): StoredJob {
  ensureCleanupRunning();
  evictOldestIfNeeded();

  const id = generateJobId();
  const job: StoredJob = {
    id,
    sessionToken,
    projectName,
    status: 'uploading',
    progress: 0,
    currentStep: 'Files uploaded, ready for processing',
    totalPrograms: costEstimate.totalPrograms,
    processedPrograms: 0,
    totalCopybooks: costEstimate.totalCopybooks,
    estimatedCost: costEstimate.estimatedApiCost,
    startedAt: new Date().toISOString(),
    completedAt: null,
    error: null,
    project: null,
    outputMarkdown: new Map(),
    knowledgeBaseZip: null,
    createdAt: Date.now(),
  };

  jobs.set(id, job);
  return job;
}

export function getJobIfOwned(id: string, sessionToken: string): StoredJob | null {
  return verifyOwnership(id, sessionToken);
}

export function updateJobStatus(
  id: string,
  sessionToken: string,
  status: JobStatus,
  updates: Partial<Pick<StoredJob, 'progress' | 'currentStep' | 'processedPrograms' | 'error' | 'completedAt'>>,
): void {
  const job = verifyOwnership(id, sessionToken);
  if (!job) return;

  job.status = status;
  if (updates.progress !== undefined) job.progress = updates.progress;
  if (updates.currentStep !== undefined) job.currentStep = updates.currentStep;
  if (updates.processedPrograms !== undefined) job.processedPrograms = updates.processedPrograms;
  if (updates.error !== undefined) job.error = updates.error;
  if (updates.completedAt !== undefined) job.completedAt = updates.completedAt;
}

export function setJobProject(id: string, sessionToken: string, project: CobolProject): void {
  const job = verifyOwnership(id, sessionToken);
  if (job) job.project = project;
}

export function addJobOutput(id: string, sessionToken: string, filename: string, content: string): void {
  const job = verifyOwnership(id, sessionToken);
  if (job) job.outputMarkdown.set(filename, content);
}

export function setJobKnowledgeBase(id: string, sessionToken: string, zip: Buffer): void {
  const job = verifyOwnership(id, sessionToken);
  if (job) job.knowledgeBaseZip = zip;
}

export function getPublicJob(id: string, sessionToken: string): ProcessingJob | null {
  const job = verifyOwnership(id, sessionToken);
  if (!job) return null;

  return {
    id: job.id,
    projectName: job.projectName,
    status: job.status,
    progress: job.progress,
    currentStep: job.currentStep,
    totalPrograms: job.totalPrograms,
    processedPrograms: job.processedPrograms,
    totalCopybooks: job.totalCopybooks,
    estimatedCost: job.estimatedCost,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    error: job.error,
  };
}

function generateJobId(): string {
  return `cb-${randomBytes(16).toString('hex')}`;
}
