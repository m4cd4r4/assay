import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section with company name', async ({ page }) => {
    await expect(page.locator('nav')).toContainText('Assay');
    await expect(page.locator('h1')).toContainText('finally understood');
  });

  test('displays the powered-by badge', async ({ page }) => {
    await expect(page.getByText('POWERED BY CLAUDE OPUS 4.6')).toBeVisible();
  });

  test('shows all four stats in the stats bar', async ({ page }) => {
    await expect(page.getByText('Token Context', { exact: true })).toBeVisible();
    await expect(page.getByText('Analysis Passes', { exact: true })).toBeVisible();
    await expect(page.getByText('Turnaround', { exact: true })).toBeVisible();
    await expect(page.getByText('Production Risk', { exact: true })).toBeVisible();
  });

  test('has CTA buttons that link to contact section', async ({ page }) => {
    const primaryCta = page.getByRole('link', { name: /Request Free PoC/i }).first();
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toHaveAttribute('href', '#contact');
  });

  test('renders all 5 feature passes', async ({ page }) => {
    await expect(page.getByText('PASS 01')).toBeVisible();
    await expect(page.getByText('PASS 02')).toBeVisible();
    await expect(page.getByText('PASS 03')).toBeVisible();
    await expect(page.getByText('PASS 04')).toBeVisible();
    await expect(page.getByText('PASS 05')).toBeVisible();
  });

  test('renders the COBOL code preview', async ({ page }) => {
    await expect(page.getByText('PAYROLL-CALC.cbl')).toBeVisible();
    await expect(page.getByText('IDENTIFICATION DIVISION.')).toBeVisible();
  });

  test('renders 3 steps in how-it-works', async ({ page }) => {
    await expect(page.getByText('Upload Your Source')).toBeVisible();
    await expect(page.getByText('AI Analysis')).toBeVisible();
    await expect(page.getByText('Download Knowledge Base')).toBeVisible();
  });

  test('renders all 4 pricing tiers', async ({ page }) => {
    await expect(page.getByText('$1,250')).toBeVisible();
    await expect(page.getByText('$2,500')).toBeVisible();
    await expect(page.getByText('$6,000')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Enterprise', exact: true })).toBeVisible();
  });

  test('marks Standard tier as popular', async ({ page }) => {
    await expect(page.getByText('POPULAR')).toBeVisible();
  });

  test('renders trust/security section', async ({ page }) => {
    await expect(page.getByText('Read-Only')).toBeVisible();
    await expect(page.getByText('NDA Protected')).toBeVisible();
    await expect(page.getByText('API-Only Processing')).toBeVisible();
    await expect(page.getByText('Australian Owned')).toBeVisible();
  });

  test('footer shows Solaisoft Pty Ltd', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Solaisoft Pty Ltd');
  });

  test('footer has privacy and terms links', async ({ page }) => {
    const privacyLink = page.locator('footer').getByRole('link', { name: 'Privacy' });
    const termsLink = page.locator('footer').getByRole('link', { name: 'Terms' });
    await expect(privacyLink).toHaveAttribute('href', '/privacy');
    await expect(termsLink).toHaveAttribute('href', '/terms');
  });

  test('navigation links point to correct sections', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features');
    await expect(nav.getByRole('link', { name: 'How It Works' })).toHaveAttribute('href', '#how-it-works');
    await expect(nav.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '#pricing');
    await expect(nav.getByRole('link', { name: 'Trust' })).toHaveAttribute('href', '#trust');
  });
});
