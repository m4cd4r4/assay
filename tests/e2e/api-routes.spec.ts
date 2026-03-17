import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SAMPLE_DIR = path.resolve('public/demo');

test.describe('API: Upload Route', () => {
  test('POST /api/upload with sample COBOL file returns job and cost estimate', async ({ request }) => {
    const payroll = fs.readFileSync(path.join(SAMPLE_DIR, 'sample-payroll.cbl'));

    const response = await request.post('/api/upload', {
      multipart: {
        projectName: 'E2E Test Project',
        files: {
          name: 'sample-payroll.cbl',
          mimeType: 'text/plain',
          buffer: payroll,
        },
      },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.jobId).toBeTruthy();
    expect(body.costEstimate).toBeTruthy();
    expect(body.costEstimate.totalPrograms).toBe(1);
    expect(body.files).toHaveLength(1);
    expect(body.summary.totalLines).toBeGreaterThan(0);

    // Verify session cookie is set
    const setCookie = response.headers()['set-cookie'] ?? '';
    expect(setCookie).toContain('assay_session');
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
  test('GET /api/status with invalid-format id returns 400', async ({ request }) => {
    const response = await request.get('/api/status/nonexistent');
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid job ID');
  });

  test('GET /api/status with valid-format but unknown id returns 401 (no session)', async ({ request }) => {
    const response = await request.get('/api/status/cb-00000000000000000000000000000000');
    expect(response.status()).toBe(401);
  });
});

test.describe('API: Download Route', () => {
  test('GET /api/download with invalid-format id returns 400', async ({ request }) => {
    const response = await request.get('/api/download/nonexistent');
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid job ID');
  });

  test('GET /api/download with valid-format but unknown id returns 401 (no session)', async ({ request }) => {
    const response = await request.get('/api/download/cb-00000000000000000000000000000000');
    expect(response.status()).toBe(401);
  });
});

test.describe('API: Process Route', () => {
  test('POST /api/process without jobId returns 400', async ({ request }) => {
    const response = await request.post('/api/process', {
      data: {},
    });
    expect(response.status()).toBe(400);
  });

  test('POST /api/process with invalid jobId returns 400', async ({ request }) => {
    const response = await request.post('/api/process', {
      data: { jobId: 'nonexistent' },
    });
    expect(response.status()).toBe(400);
  });
});
