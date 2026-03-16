import { test, expect } from '@playwright/test';

// These tests run WITHOUT auth (no storageState) to test the login gate itself
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Auth Gate', () => {
  test('unauthenticated users are redirected to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Admin access required')).toBeVisible();
  });

  test('login page shows Assay branding', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Assay' })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('wrong password shows error', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="password"]').fill('wrong');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid password')).toBeVisible();
  });

  test('correct password redirects to landing page', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type="password"]').fill('01assay!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/', { timeout: 5000 });
    await expect(page.locator('nav')).toContainText('Assay');
  });

  test('API routes return 401 without auth', async ({ request }) => {
    const response = await request.get('/api/status/test');
    expect(response.status()).toBe(401);
  });
});
