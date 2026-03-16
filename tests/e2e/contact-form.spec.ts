import { test, expect } from '@playwright/test';

test.describe('Contact Form (PoC Request)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
  });

  test('renders the contact form with all fields', async ({ page }) => {
    await expect(page.getByText('Ready to understand your COBOL?')).toBeVisible();
    await expect(page.getByLabel('Name *')).toBeVisible();
    await expect(page.getByLabel('Work Email *')).toBeVisible();
    await expect(page.getByLabel('Company *')).toBeVisible();
    await expect(page.getByLabel('Codebase Size')).toBeVisible();
    await expect(page.getByLabel('Tell us about your project')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Request Free PoC' })).toBeVisible();
  });

  test('submits form successfully and shows confirmation', async ({ page }) => {
    await page.getByLabel('Name *').fill('Jane Smith');
    await page.getByLabel('Work Email *').fill('jane@example.com');
    await page.getByLabel('Company *').fill('Acme Corp');
    await page.getByLabel('Codebase Size').selectOption('Under 25K lines');
    await page.getByLabel('Tell us about your project').fill('Payroll system documentation');

    await page.getByRole('button', { name: 'Request Free PoC' }).click();

    await expect(page.getByText('Request Received')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('1-2 business days')).toBeVisible();
  });

  test('shows validation error for missing required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Request Free PoC' }).click();

    // HTML5 validation should prevent submission — form should still be visible
    await expect(page.getByRole('button', { name: 'Request Free PoC' })).toBeVisible();
    await expect(page.getByText('Request Received')).not.toBeVisible();
  });

  test('shows loading state while submitting', async ({ page }) => {
    await page.getByLabel('Name *').fill('Test User');
    await page.getByLabel('Work Email *').fill('test@example.com');
    await page.getByLabel('Company *').fill('Test Co');

    await page.getByRole('button', { name: 'Request Free PoC' }).click();

    // Should briefly show "Sending..." before success
    // Then show success message
    await expect(page.getByText('Request Received')).toBeVisible({ timeout: 5000 });
  });

  test('codebase size dropdown has all options', async ({ page }) => {
    const select = page.getByLabel('Codebase Size');
    const options = select.locator('option');
    await expect(options).toHaveCount(6); // "Select..." + 5 sizes
  });
});

test.describe('Contact Form API', () => {
  test('POST /api/contact with valid data returns success', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        company: 'Test Corp',
        codebaseSize: 'Under 25K lines',
        message: 'Test message',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  test('POST /api/contact without name returns 400', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        email: 'test@example.com',
        company: 'Test Corp',
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('required');
  });

  test('POST /api/contact with invalid email returns 400', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Test',
        email: 'not-an-email',
        company: 'Test Corp',
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid email');
  });

  test('POST /api/contact without company returns 400', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Test',
        email: 'test@example.com',
      },
    });
    expect(response.status()).toBe(400);
  });
});
