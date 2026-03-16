import { test, expect } from '@playwright/test';

test.describe('Privacy Policy Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy');
  });

  test('renders privacy policy heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('shows Solaisoft Pty Ltd attribution', async ({ page }) => {
    await expect(page.getByText('Solaisoft Pty Ltd').first()).toBeVisible();
  });

  test('shows draft notice banner', async ({ page }) => {
    await expect(page.getByText('pending formal legal review')).toBeVisible();
  });

  test('contains key privacy sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '1. Who We Are' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '2. Data We Collect' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '3. How We Process Source Code' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '4. Who Has Access' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '6. Data Retention' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '7. Your Rights' })).toBeVisible();
  });

  test('mentions Anthropic API processing', async ({ page }) => {
    await expect(page.getByText('not used for model training').first()).toBeVisible();
  });

  test('mentions 30-day deletion commitment', async ({ page }) => {
    await expect(page.getByText('All source copies are deleted').first()).toBeVisible();
  });

  test('has back link to home', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /Back to Assay/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });
});

test.describe('Terms of Service Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/terms');
  });

  test('renders terms heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
  });

  test('shows draft notice banner', async ({ page }) => {
    await expect(page.getByText('pending formal legal review')).toBeVisible();
  });

  test('contains key terms sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '1. Service Description' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '3. Payment Terms' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '4. Intellectual Property' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '5. Confidentiality' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '7. Limitation of Liability' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '10. Governing Law' })).toBeVisible();
  });

  test('states read-only service', async ({ page }) => {
    await expect(page.getByText('read-only').first()).toBeVisible();
  });

  test('specifies Western Australia jurisdiction', async ({ page }) => {
    await expect(page.getByText('Western Australia').first()).toBeVisible();
  });

  test('mentions payment terms', async ({ page }) => {
    await expect(page.getByText('50% of the engagement fee due').first()).toBeVisible();
  });

  test('has back link to home', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /Back to Assay/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });
});

test.describe('Cross-page Navigation', () => {
  test('can navigate from landing to privacy and back', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByRole('link', { name: 'Privacy' }).click();
    await expect(page).toHaveURL('/privacy');
    await page.getByRole('link', { name: /Back to Assay/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('can navigate from landing to terms and back', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').getByRole('link', { name: 'Terms' }).click();
    await expect(page).toHaveURL('/terms');
    await page.getByRole('link', { name: /Back to Assay/i }).click();
    await expect(page).toHaveURL('/');
  });
});
