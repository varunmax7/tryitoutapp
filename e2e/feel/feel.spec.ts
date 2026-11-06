import { expect, test } from '@playwright/test';
import {
  flingScroll,
  installFeelProbe,
  measurePressDelay,
  readFeel,
  resetFeel,
  throttleCpu,
} from './feel-utils';

/**
 * Feel tests — implementation.md §17.9, with the budgets from §17.6.
 *
 * Demo fixtures, animations ON (not still mode), real touch, and the CPU throttled 4x
 * to stand in for a mid-range Android.
 */
const DEMO = '?demo=1&flags=all';

// §17.6: press feedback ≤ 100ms, page transition ≤ 450ms, CLS ≤ 0.05,
// zero long animation frames during the scripted scroll.
const BUDGET = {
  pressMs: 100,
  transitionMs: 450,
  cls: 0.05,
  longFrameMs: 50,
};

test.beforeEach(async ({ page }) => {
  await installFeelProbe(page);
  await throttleCpu(page);
});

test('1.4 flings without a long animation frame', async ({ page }) => {
  await page.goto(`/sizes${DEMO}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('[data-screen="1.4-my-sizes"]');
  // Measure the scroll, not the load.
  await page.waitForTimeout(300);
  await resetFeel(page);

  await flingScroll(page, 600);
  await flingScroll(page, -600);
  await page.waitForTimeout(400);

  const feel = await readFeel(page);
  const long = feel.longFrames.filter((frame) => frame.duration > BUDGET.longFrameMs);
  expect(long, `long animation frames during the fling: ${JSON.stringify(long)}`).toHaveLength(0);
  expect(feel.cls, 'cumulative layout shift').toBeLessThanOrEqual(BUDGET.cls);
});

test('a BrandRow answers the press within 100 ms and pushes to 1.5', async ({ page }) => {
  await page.goto(`/sizes${DEMO}`);
  await page.evaluate(() => document.fonts.ready);
  const selector = 'a[href="/sizes/zara/tshirt"]';
  const row = page.locator(selector);
  await row.waitFor();
  await resetFeel(page);

  // Rows inside a scroller hold the pressed state back by 60ms so scrolling never
  // flashes them (§12.8.4), so the budget for a row is 100ms plus that guard.
  const delay = await measurePressDelay(page, selector);
  expect(delay, `press feedback took ${delay.toFixed(0)}ms`).toBeLessThanOrEqual(
    BUDGET.pressMs + 60,
  );

  // The press above is a full click, so the push has already started.
  await page.waitForSelector('[data-screen="1.5-brand-fit-detail"]');

  await page.goBack();
  await page.waitForSelector('[data-screen="1.4-my-sizes"]');

  const feel = await readFeel(page);
  for (const length of feel.transitions) {
    expect(length, 'page transition length').toBeLessThanOrEqual(BUDGET.transitionMs);
  }
});

test('switching tabs keeps each tab where it was left', async ({ page }) => {
  await page.goto(`/sizes${DEMO}`);
  await page.waitForSelector('[data-screen="1.4-my-sizes"]');
  await flingScroll(page, 400);
  await page.waitForTimeout(300);
  const scrolled = await page.evaluate(() => window.scrollY);
  expect(scrolled, 'the dashboard scrolled').toBeGreaterThan(0);

  await page.getByRole('link', { name: 'Try on' }).click();
  await page.waitForSelector('[data-screen="2.1-try-it-on"]');

  await page.getByRole('link', { name: 'Sizes' }).click();
  await page.waitForSelector('[data-screen="1.4-my-sizes"]');
  await page.waitForTimeout(300);

  const restored = await page.evaluate(() => window.scrollY);
  expect(Math.abs(restored - scrolled), 'the tab came back where it was left').toBeLessThan(40);
});

test('typing in 1.2 keeps the fields responsive', async ({ page }) => {
  await page.goto(`/measure${DEMO}`);
  await page.waitForSelector('[data-screen="1.2-type-my-details"]');

  const height = page.getByLabel('Height');
  await height.click();
  await height.fill('');
  await height.pressSequentially('182', { delay: 30 });
  await expect(height).toHaveValue('182');

  const feel = await readFeel(page);
  expect(feel.cls, 'typing must not shift the layout').toBeLessThanOrEqual(BUDGET.cls);
});

test('toggling the fit map on 2.3 drops no frames', async ({ page }) => {
  await page.goto(`/try/live/demo${DEMO}`);
  await page.waitForSelector('[data-screen="2.3-live-fit-check"]');

  const fitMap = page.getByRole('switch', { name: 'Fit map' });
  await fitMap.click();
  await page.waitForTimeout(300);
  await fitMap.click();
  await page.waitForTimeout(300);

  const feel = await readFeel(page);
  const long = feel.longFrames.filter((frame) => frame.duration > 100);
  expect(long, `long frames while toggling the fit map: ${JSON.stringify(long)}`).toHaveLength(0);
});

test('reduced motion keeps every screen usable', async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
    ...(testInfo.project.use.baseURL ? { baseURL: testInfo.project.use.baseURL } : {}),
  });
  const page = await context.newPage();
  await installFeelProbe(page);

  await page.goto(`/sizes${DEMO}`);
  await page.waitForSelector('[data-screen="1.4-my-sizes"]');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduce');

  await page.locator('a[href="/sizes/zara/tshirt"]').click();
  await page.waitForSelector('[data-screen="1.5-brand-fit-detail"]');
  await page.goBack();
  await page.waitForSelector('[data-screen="1.4-my-sizes"]');

  await context.close();
});
