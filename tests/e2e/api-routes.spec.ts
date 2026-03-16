import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SAMPLE_DIR = path.resolve('public/demo');
const BASE_URL = 'http://localhost:3099';

test.describe('API: Upload Route', () => {
  test('POST /api/upload with sample COBOL files returns job and cost estimate', async () => {
    const formData = new FormData();
    formData.append('projectName', 'E2E Test Project');

    const payroll = fs.readFileSync(path.join(SAMPLE_DIR, 'sample-payroll.cbl'));
    const constants = fs.readFileSync(path.join(SAMPLE_DIR, 'sample-copybooks', 'PAYROLL-CONSTANTS.cpy'));
    const taxTables = fs.readFileSync(path.join(SAMPLE_DIR, 'sample-copybooks', 'TAX-TABLES.cpy'));

    formData.append('files', new Blob([payroll]), 'sample-payroll.cbl');
    formData.append('files', new Blob([constants]), 'PAYROLL-CONSTANTS.cpy');
    formData.append('files', new Blob([taxTables]), 'TAX-TABLES.cpy');

    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: { Cookie: 'cb-auth=authenticated' },
    });
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.jobId).toBeTruthy();
    expect(body.costEstimate).toBeTruthy();
    expect(body.costEstimate.totalPrograms).toBe(1);
    expect(body.costEstimate.totalCopybooks).toBe(2);
    expect(body.costEstimate.pricingTier).toBe('S');
    expect(body.files).toHaveLength(3);
    expect(body.summary.totalLines).toBeGreaterThan(0);
  });

  test('POST /api/upload rejects unsupported file types', async ({ request }) => {
    const response = await request.post('/api/upload', {
      multipart: {
        files: {
          name: 'malicious.exe',
          mimeType: 'application/octet-stream',
          buffer: Buffer.from('hello'),
        },
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Unsupported file type');
  });
});

test.describe('API: Status Route', () => {
  test('GET /api/status/nonexistent returns 404', async ({ request }) => {
    const response = await request.get('/api/status/nonexistent');
    expect(response.status()).toBe(404);
  });

  test('GET /api/status with unknown id returns JSON error', async ({ request }) => {
    const response = await request.get('/api/status/unknown-job-id');
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });
});

test.describe('API: Download Route', () => {
  test('GET /api/download/nonexistent returns 404', async ({ request }) => {
    const response = await request.get('/api/download/nonexistent');
    expect(response.status()).toBe(404);
  });

  test('GET /api/download with unknown id returns JSON error', async ({ request }) => {
    const response = await request.get('/api/download/unknown-job-id');
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });
});

test.describe('API: Process Route', () => {
  test('POST /api/process without jobId returns 400', async ({ request }) => {
    const response = await request.post('/api/process', {
      data: {},
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/process with invalid jobId returns 404', async ({ request }) => {
    const response = await request.post('/api/process', {
      data: { jobId: 'nonexistent' },
    });
    expect(response.status()).toBe(404);
  });
});
