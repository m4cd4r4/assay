/**
 * Processing job types for tracking documentation generation progress.
 */

export type JobStatus =
  | 'uploading'
  | 'parsing'
  | 'grouping'
  | 'processing'
  | 'assembling'
  | 'complete'
  | 'error';

export interface ProcessingJob {
  id: string;
  projectName: string;
  status: JobStatus;
  progress: number; // 0-100
  currentStep: string;
  totalPrograms: number;
  processedPrograms: number;
  totalCopybooks: number;
  estimatedCost: number;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lineCount: number;
}

export interface CostEstimate {
  totalLines: number;
  totalPrograms: number;
  totalCopybooks: number;
  estimatedTokens: number;
  estimatedApiCost: number;
  pricingTier: 'S' | 'M' | 'L' | 'XL';
  tierPrice: number;
}
