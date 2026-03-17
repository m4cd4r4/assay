import { describe, it, expect } from 'vitest';
import {
  createJob,
  getJobIfOwned,
  updateJobStatus,
  getPublicJob,
  addJobOutput,
  setJobKnowledgeBase,
} from '@/lib/jobs/store';

const MOCK_SESSION = 'a'.repeat(64);
const WRONG_SESSION = 'b'.repeat(64);

const MOCK_COST = {
  totalPrograms: 5,
  totalCopybooks: 2,
  estimatedApiCost: 1.50,
  totalLines: 1000,
  tier: 'S' as const,
};

describe('job store', () => {
  describe('createJob', () => {
    it('creates a job with a cb- prefixed ID', () => {
      const job = createJob('TEST-PROJECT', MOCK_COST, MOCK_SESSION);
      expect(job.id).toMatch(/^cb-[0-9a-f]{32}$/);
    });

    it('sets initial status to uploading', () => {
      const job = createJob('TEST-PROJECT', MOCK_COST, MOCK_SESSION);
      expect(job.status).toBe('uploading');
    });

    it('stores project name', () => {
      const job = createJob('MY-APP', MOCK_COST, MOCK_SESSION);
      expect(job.projectName).toBe('MY-APP');
    });

    it('stores cost estimate fields', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      expect(job.totalPrograms).toBe(5);
      expect(job.totalCopybooks).toBe(2);
      expect(job.estimatedCost).toBe(1.50);
    });
  });

  describe('getJobIfOwned', () => {
    it('returns the job for the correct session token', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      const found = getJobIfOwned(job.id, MOCK_SESSION);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(job.id);
    });

    it('returns null for wrong session token', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      expect(getJobIfOwned(job.id, WRONG_SESSION)).toBeNull();
    });

    it('returns null for non-existent job ID', () => {
      expect(getJobIfOwned('cb-0000000000000000000000000000dead', MOCK_SESSION)).toBeNull();
    });
  });

  describe('updateJobStatus', () => {
    it('updates status and progress', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      updateJobStatus(job.id, MOCK_SESSION, 'processing', { progress: 50, currentStep: 'Pass 3' });

      const updated = getJobIfOwned(job.id, MOCK_SESSION);
      expect(updated?.status).toBe('processing');
      expect(updated?.progress).toBe(50);
      expect(updated?.currentStep).toBe('Pass 3');
    });

    it('does nothing with wrong session token', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      updateJobStatus(job.id, WRONG_SESSION, 'completed', { progress: 100 });

      const original = getJobIfOwned(job.id, MOCK_SESSION);
      expect(original?.status).toBe('uploading');
      expect(original?.progress).toBe(0);
    });
  });

  describe('getPublicJob', () => {
    it('returns a sanitized job without internal fields', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      const publicJob = getPublicJob(job.id, MOCK_SESSION);

      expect(publicJob).not.toBeNull();
      expect(publicJob?.id).toBe(job.id);
      expect(publicJob?.projectName).toBe('TEST');
      // Should NOT have internal fields
      expect(publicJob).not.toHaveProperty('sessionToken');
      expect(publicJob).not.toHaveProperty('project');
      expect(publicJob).not.toHaveProperty('outputMarkdown');
      expect(publicJob).not.toHaveProperty('knowledgeBaseZip');
    });

    it('returns null for wrong session', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      expect(getPublicJob(job.id, WRONG_SESSION)).toBeNull();
    });
  });

  describe('addJobOutput', () => {
    it('stores markdown output by filename', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      addJobOutput(job.id, MOCK_SESSION, 'overview.md', '# Overview');

      const found = getJobIfOwned(job.id, MOCK_SESSION);
      expect(found?.outputMarkdown.get('overview.md')).toBe('# Overview');
    });

    it('does nothing with wrong session', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      addJobOutput(job.id, WRONG_SESSION, 'overview.md', '# Hack');

      const found = getJobIfOwned(job.id, MOCK_SESSION);
      expect(found?.outputMarkdown.size).toBe(0);
    });
  });

  describe('setJobKnowledgeBase', () => {
    it('stores a zip buffer', () => {
      const job = createJob('TEST', MOCK_COST, MOCK_SESSION);
      const zip = Buffer.from('fake-zip-content');
      setJobKnowledgeBase(job.id, MOCK_SESSION, zip);

      const found = getJobIfOwned(job.id, MOCK_SESSION);
      expect(found?.knowledgeBaseZip).toEqual(zip);
    });
  });
});
