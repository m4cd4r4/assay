import { test, expect } from '@playwright/test';

// Session tokens are created via the upload flow (assay_session cookie).
// There is no login page or /api/auth endpoint.

test.describe('Session Security', () => {
  test('API routes reject requests without a valid session', async ({ request }) => {
    const response = await request.get('/api/status/cb-00000000000000000000000000000000');
    expect(response.status()).toBe(401);
  });

  test('upload creates a session cookie', async ({ request }) => {
    const response = await request.post('/api/upload', {
      multipart: {
        projectName: 'Session Test',
        files: {
          name: 'test.cbl',
          mimeType: 'text/plain',
          buffer: Buffer.from(
            '       IDENTIFICATION DIVISION.\n       PROGRAM-ID. TEST.\n       PROCEDURE DIVISION.\n           STOP RUN.\n'
          ),
        },
      },
    });
    expect(response.status()).toBe(200);
    const setCookie = response.headers()['set-cookie'] ?? '';
    expect(setCookie).toContain('assay_session');
  });
});
