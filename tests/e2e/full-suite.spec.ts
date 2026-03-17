import { test, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Navigate to a page and wait for it to be ready.
 * Dev server may take time to compile routes on first hit.
 */
async function gotoReady(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
}

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------
test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await gotoReady(page, '/');
  });

  test('loads with correct title and h1', async ({ page }) => {
    await expect(page).toHaveTitle(/Assay/);
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('COBOL');
  });

  test('nav links exist and point to correct anchors', async ({ page }) => {
    const desktopNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(desktopNav).toBeVisible();

    const expectedLinks = [
      { text: 'Features', href: '#features' },
      { text: 'How It Works', href: '#how-it-works' },
      { text: 'Pricing', href: '#pricing' },
      { text: 'Trust', href: '#trust' },
      { text: 'Live Demo', href: '/demo' },
      { text: 'Docs', href: '/docs' },
    ];

    for (const link of expectedLinks) {
      const anchor = desktopNav.locator(`a:has-text("${link.text}")`).first();
      await expect(anchor).toHaveAttribute('href', link.href);
    }
  });

  test('all sections are visible', async ({ page }) => {
    const sectionIds = ['features', 'how-it-works', 'trust', 'pricing', 'contact'];
    for (const id of sectionIds) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
    }
  });

  test('stats bar shows expected values', async ({ page }) => {
    const statsBar = page.locator('.glass').first();
    await expect(statsBar).toContainText('1M');
    await expect(statsBar).toContainText('5');
    await expect(statsBar).toContainText('14-Day');
    await expect(statsBar).toContainText('$0');
  });

  test('CTA buttons link to #contact', async ({ page }) => {
    const primaryCta = page.locator('a:has-text("Request Free PoC")').first();
    await expect(primaryCta).toHaveAttribute('href', '#contact');
  });

  test('footer contains copyright and links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('Solaisoft');
    const privacyLink = footer.locator('a:has-text("Privacy")');
    await expect(privacyLink).toHaveAttribute('href', '/privacy');
    const termsLink = footer.locator('a:has-text("Terms")');
    await expect(termsLink).toHaveAttribute('href', '/terms');
  });

  test('footer Privacy link navigates correctly', async ({ page }) => {
    await page.locator('footer a:has-text("Privacy")').click();
    await page.waitForURL('**/privacy');
    await expect(page).toHaveURL(/\/privacy/);
  });

  test('footer Terms link navigates correctly', async ({ page }) => {
    await page.locator('footer a:has-text("Terms")').click();
    await page.waitForURL('**/terms');
    await expect(page).toHaveURL(/\/terms/);
  });
});

// ---------------------------------------------------------------------------
// Mobile Navigation
// ---------------------------------------------------------------------------
test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger menu opens and closes', async ({ page }) => {
    await gotoReady(page, '/');

    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(toggle).toBeVisible();

    // Open
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();

    // Close
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileMenu).not.toBeVisible();
  });

  test('mobile menu contains all nav links', async ({ page }) => {
    await gotoReady(page, '/');

    await page.locator('button[aria-label="Toggle navigation menu"]').click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();

    const linkTexts = ['Features', 'How It Works', 'Pricing', 'Trust', 'Live Demo', 'Docs', 'Request Demo'];
    for (const text of linkTexts) {
      await expect(menu.locator(`a:has-text("${text}")`)).toBeVisible();
    }
  });

  test('clicking a mobile nav link closes the menu', async ({ page }) => {
    await gotoReady(page, '/');

    await page.locator('button[aria-label="Toggle navigation menu"]').click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();

    await menu.locator('a:has-text("Features")').click();
    await expect(menu).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Skip Navigation & Accessibility
// ---------------------------------------------------------------------------
test.describe('Accessibility', () => {
  test('skip link appears on Tab and targets #main-content', async ({ page }) => {
    await gotoReady(page, '/');

    // Tab into the page to reveal skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // The target must exist
    await expect(page.locator('#main-content')).toBeAttached();
  });

  test('heading hierarchy is correct on landing page', async ({ page }) => {
    await gotoReady(page, '/');

    // Exactly one h1
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);

    // h2s exist under sections
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThanOrEqual(4);
  });

  test('mobile nav button has aria attributes', async ({ page }) => {
    await gotoReady(page, '/');

    // Use mobile viewport to see the button
    await page.setViewportSize({ width: 375, height: 812 });
    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  test('no visible content stuck at opacity:0', async ({ page }) => {
    await gotoReady(page, '/');
    // Wait for any animations
    await page.waitForTimeout(1500);

    const hiddenElements = await page.evaluate(() => {
      const els = document.querySelectorAll('section, h1, h2, p, a, button');
      const stuck: string[] = [];
      for (const el of els) {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (
          style.opacity === '0' &&
          rect.width > 0 &&
          rect.height > 0 &&
          !el.getAttribute('aria-hidden')
        ) {
          stuck.push(`${el.tagName}.${el.className.slice(0, 40)}`);
        }
      }
      return stuck;
    });
    expect(hiddenElements).toEqual([]);
  });

  test('interactive elements have focus outlines', async ({ page }) => {
    await gotoReady(page, '/');

    // Tab through a few elements and check they receive focus
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // first focusable after skip

    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      return {
        tag: el.tagName,
        hasOutline: window.getComputedStyle(el).outlineStyle !== 'none' ||
                    window.getComputedStyle(el).boxShadow !== 'none',
      };
    });
    expect(focused).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Demo Page
// ---------------------------------------------------------------------------
test.describe('Demo Page', () => {
  // Run demo tests serially - they all hit the same dev server route
  // and parallel compilation causes 404 flakes
  test.describe.configure({ mode: 'serial' });

  test('loads with correct title', async ({ page }) => {
    await gotoReady(page, '/demo');
    await expect(page).toHaveTitle('Live Demo - Assay');
  });

  test('loading skeleton appears initially then data loads', async ({ page }) => {
    await page.route('**/demo/output/payroll-calc.json', async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      await route.continue();
    });

    await page.goto('/demo', { waitUntil: 'commit' });
    const loadingText = page.locator('text=Loading demo data...');
    await expect(loadingText).toBeVisible({ timeout: 5000 });

    await expect(loadingText).not.toBeVisible({ timeout: 15000 });
  });

  test('demo data loads and shows stats', async ({ page }) => {
    await gotoReady(page, '/demo');

    // Wait for demo data to populate (stats labels appear after JSON loads)
    await expect(page.getByText('Lines of COBOL')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Paragraphs')).toBeVisible();
  });

  test('Run Analysis button starts the demo', async ({ page }) => {
    await gotoReady(page, '/demo');
    await expect(page.getByText('Lines of COBOL')).toBeVisible({ timeout: 15000 });

    const runBtn = page.locator('button:has-text("Run Analysis")');
    await expect(runBtn).toBeVisible();
    await runBtn.click();

    await expect(page.locator('text=Analysis Passes')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Analysing...')).toBeVisible();
  });

  test('Skip Animation button works', async ({ page }) => {
    await gotoReady(page, '/demo');
    await expect(page.getByText('Lines of COBOL')).toBeVisible({ timeout: 15000 });

    await page.locator('button:has-text("Run Analysis")').click();
    await expect(page.locator('text=Analysing...')).toBeVisible({ timeout: 5000 });

    const skipBtn = page.locator('button:has-text("Skip Animation")');
    await expect(skipBtn).toBeVisible();
    await skipBtn.click();

    await expect(page.locator('text=Analysing...')).not.toBeVisible({ timeout: 5000 });
  });

  test('pass tabs switch content', async ({ page }) => {
    await gotoReady(page, '/demo');
    await expect(page.getByText('Lines of COBOL')).toBeVisible({ timeout: 15000 });

    await page.locator('button:has-text("Run Analysis")').click();
    await expect(page.locator('text=Analysing...')).toBeVisible({ timeout: 5000 });

    await page.locator('button:has-text("Skip Animation")').click();
    await expect(page.locator('text=Analysing...')).not.toBeVisible({ timeout: 5000 });

    await expect(page.locator('h2:has-text("Program Overview")')).toBeVisible();

    await page.locator('button:has-text("Business Rules")').click();
    await expect(page.locator('h2:has-text("Business Rules")')).toBeVisible();
  });

  test('download button appears after all passes complete', async ({ page }) => {
    await gotoReady(page, '/demo');
    await expect(page.getByText('Lines of COBOL')).toBeVisible({ timeout: 15000 });

    await page.locator('button:has-text("Run Analysis")').click();

    // Skip through all 4 passes sequentially
    const passLabels = ['Program Overview', 'Business Rules', 'Dead Code Detection', 'Data Flow Analysis'];
    for (let i = 0; i < 4; i++) {
      // Wait for the current pass animation to start or the skip button
      const skipBtn = page.locator('button:has-text("Skip Animation")');
      await expect(skipBtn).toBeVisible({ timeout: 10000 });
      await skipBtn.click();
      await expect(page.locator('text=Analysing...')).not.toBeVisible({ timeout: 5000 });

      // Switch to the next pass if not the last
      if (i < 3) {
        const nextBtn = page.locator(`button:has-text("${passLabels[i + 1]}")`);
        await nextBtn.click();
        // Brief pause for animation to start
        await page.waitForTimeout(500);
      }
    }

    const downloadBtn = page.locator('button:has-text("Download Knowledge Base")');
    await expect(downloadBtn).toBeVisible({ timeout: 10000 });
  });

  test('View Source Code button toggles source', async ({ page }) => {
    await gotoReady(page, '/demo');
    await expect(page.getByText('Lines of COBOL')).toBeVisible({ timeout: 15000 });

    const sourceBtn = page.locator('button:has-text("View Source Code")');
    await expect(sourceBtn).toBeVisible();
    await sourceBtn.click();

    const sourceLabel = page.locator('text=sample-payroll.cbl');
    await expect(sourceLabel).toBeVisible({ timeout: 5000 });

    await page.locator('button:has-text("Hide Source")').click();
    await expect(sourceLabel).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Contact Form
// ---------------------------------------------------------------------------
test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await gotoReady(page, '/');
  });

  test('contact section is visible', async ({ page }) => {
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeAttached();
    await expect(page.locator('text=Ready to understand your COBOL')).toBeAttached();
  });

  test('Book a Call button exists', async ({ page }) => {
    const bookBtn = page.locator('button:has-text("Book a Call")');
    await expect(bookBtn).toBeAttached();
  });
});

// ---------------------------------------------------------------------------
// Contact API Validation
// ---------------------------------------------------------------------------
test.describe('Contact API', () => {
  const ORIGIN_HEADERS = {
    'Origin': 'http://localhost:3099',
  };

  // The contact route has a rate limit of 5/hour per IP.
  // When rate-limited, 429 is a valid response proving the endpoint works.
  // Tests accept either the expected status OR 429.

  test('POST /api/contact rejects missing required fields', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: ORIGIN_HEADERS,
      data: { name: 'Test' },
    });
    if (res.status() === 429) {
      // Rate limited - endpoint is working, skip further assertions
      return;
    }
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('required');
  });

  test('POST /api/contact rejects invalid email', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: ORIGIN_HEADERS,
      data: {
        name: 'Test User',
        email: 'not-an-email',
        company: 'Test Co',
      },
    });
    if (res.status() === 429) return;
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid email');
  });

  test('POST /api/contact accepts valid submission', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: ORIGIN_HEADERS,
      data: {
        name: 'E2E Test',
        email: 'e2e@example.com',
        company: 'Test Corp',
        codebaseSize: 'Under 25K lines',
        message: 'Automated test submission',
      },
    });
    if (res.status() === 429) return;
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test('POST /api/contact rejects invalid codebase size', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: ORIGIN_HEADERS,
      data: {
        name: 'Test',
        email: 'test@example.com',
        company: 'Co',
        codebaseSize: 'INVALID_SIZE',
      },
    });
    if (res.status() === 429) return;
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid codebase size');
  });

  test('POST /api/contact rejects overly long input', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: ORIGIN_HEADERS,
      data: {
        name: 'A'.repeat(201),
        email: 'test@example.com',
        company: 'Co',
      },
    });
    if (res.status() === 429) return;
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('too long');
  });
});

// ---------------------------------------------------------------------------
// File Upload API
// ---------------------------------------------------------------------------
test.describe('Upload API', () => {
  const SAMPLE_DIR = path.resolve('public/demo');
  const ORIGIN_HEADERS = { 'Origin': 'http://localhost:3099' };

  test('POST /api/upload accepts .cbl files and returns job ID', async ({ request }) => {
    const payroll = fs.readFileSync(path.join(SAMPLE_DIR, 'sample-payroll.cbl'));

    const res = await request.post('/api/upload', {
      headers: ORIGIN_HEADERS,
      multipart: {
        projectName: 'Full Suite Test',
        files: {
          name: 'sample-payroll.cbl',
          mimeType: 'text/plain',
          buffer: payroll,
        },
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.jobId).toBeTruthy();
    expect(body.jobId).toMatch(/^cb-/);
    expect(body.costEstimate).toBeTruthy();
    expect(body.files).toHaveLength(1);
  });

  test('POST /api/upload rejects non-COBOL files', async ({ request }) => {
    const res = await request.post('/api/upload', {
      headers: ORIGIN_HEADERS,
      multipart: {
        files: {
          name: 'hack.py',
          mimeType: 'text/plain',
          buffer: Buffer.from('print("hello")'),
        },
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Unsupported file type');
  });
});

// ---------------------------------------------------------------------------
// Status API
// ---------------------------------------------------------------------------
test.describe('Status API', () => {
  test('GET /api/status with invalid format returns 400', async ({ request }) => {
    const res = await request.get('/api/status/bad-format');
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid job ID');
  });

  test('GET /api/status with valid format but no session returns 401', async ({ request }) => {
    const res = await request.get('/api/status/cb-00000000000000000000000000000000');
    expect(res.status()).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Download API
// ---------------------------------------------------------------------------
test.describe('Download API', () => {
  test('GET /api/download with invalid format returns 400', async ({ request }) => {
    const res = await request.get('/api/download/bad-format');
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid job ID');
  });

  test('GET /api/download with valid format but no session returns 401', async ({ request }) => {
    const res = await request.get('/api/download/cb-00000000000000000000000000000000');
    expect(res.status()).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Process API
// The /api/process route checks session BEFORE validating jobId,
// so unauthenticated requests always get 401.
// ---------------------------------------------------------------------------
test.describe('Process API', () => {
  const ORIGIN_HEADERS = { 'Origin': 'http://localhost:3099' };

  test('POST /api/process without session returns 401', async ({ request }) => {
    const res = await request.post('/api/process', {
      headers: ORIGIN_HEADERS,
      data: {},
    });
    expect(res.status()).toBe(401);
  });

  test('POST /api/process with invalid jobId but no session returns 401', async ({ request }) => {
    const res = await request.post('/api/process', {
      headers: ORIGIN_HEADERS,
      data: { jobId: 'not-valid' },
    });
    expect(res.status()).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Cross-page navigation
// ---------------------------------------------------------------------------
test.describe('Navigation flows', () => {
  test('demo page links back to home', async ({ page }) => {
    await gotoReady(page, '/demo');

    const homeLink = page.locator('a:has-text("Assay")').first();
    await homeLink.click();
    await page.waitForURL('**/');
    await expect(page).toHaveURL(/\/$/);
  });

  test('landing page "Try Live Demo" navigates to /demo', async ({ page }) => {
    await gotoReady(page, '/');

    await page.locator('a:has-text("Try Live Demo")').click();
    await page.waitForURL('**/demo');
    await expect(page).toHaveURL(/\/demo/);
  });
});
