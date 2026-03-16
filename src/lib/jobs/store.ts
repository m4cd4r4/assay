/**
 * In-memory job store for V1 (no database).
 *
 * Jobs persist for the lifetime of the server process.
 * This is fine for single-user processing — upgrade to
 * a database when multi-tenant support is needed.
 */

import type { ProcessingJob, JobStatus, CostEstimate } from '@/types/job';
import type { CobolProject } from '@/types/cobol';

interface StoredJob extends ProcessingJob {
  project: CobolProject | null;
  outputMarkdown: Map<string, string>;
  knowledgeBaseZip: Buffer | null;
}

const jobs = new Map<string, StoredJob>();

export function createJob(
  projectName: string,
  costEstimate: CostEstimate,
): StoredJob {
  const id = generateJobId();
  const job: StoredJob = {
    id,
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
  };

  jobs.set(id, job);
  return job;
}

export function getJob(id: string): StoredJob | undefined {
  return jobs.get(id);
}

export function updateJobStatus(
  id: string,
  status: JobStatus,
  updates: Partial<Pick<StoredJob, 'progress' | 'currentStep' | 'processedPrograms' | 'error' | 'completedAt'>>,
): void {
  const job = jobs.get(id);
  if (!job) return;

  job.status = status;
  if (updates.progress !== undefined) job.progress = updates.progress;
  if (updates.currentStep !== undefined) job.currentStep = updates.currentStep;
  if (updates.processedPrograms !== undefined) job.processedPrograms = updates.processedPrograms;
  if (updates.error !== undefined) job.error = updates.error;
  if (updates.completedAt !== undefined) job.completedAt = updates.completedAt;
}

export function setJobProject(id: string, project: CobolProject): void {
  const job = jobs.get(id);
  if (job) job.project = project;
}

export function addJobOutput(id: string, filename: string, content: string): void {
  const job = jobs.get(id);
  if (job) job.outputMarkdown.set(filename, content);
}

export function setJobKnowledgeBase(id: string, zip: Buffer): void {
  const job = jobs.get(id);
  if (job) job.knowledgeBaseZip = zip;
}

export function getPublicJob(id: string): ProcessingJob | null {
  const job = jobs.get(id);
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
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `cb-${timestamp}-${random}`;
}
