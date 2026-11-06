import { test } from '@playwright/test';
import { expectToMatchDesign } from './visual-compare';

/**
 * Visual tests against the design pack — implementation.md §17.4.
 *
 * Every screen is captured in demo mode with all feature flags on, because the designs
 * show the full product, and in still mode so nothing is caught mid-animation (§12.8.9).
 * 1.4 and 1.5 also run with reduced motion, to prove the resting layout does not change.
 */
const QUERY = '?demo=1&flags=all&still=1';

type Screen = {
  id: string;
  path: string;
  project: 'phone' | 'desktop';
  /** 4.2 is 1060 tall where the rest of the desktop pack is 1180 (§17.4). */
  viewport?: { width: number; height: number };
};

const SCREENS: Screen[] = [
  { id: '1.1-welcome', path: '/', project: 'phone' },
  { id: '1.2-type-my-details', path: '/measure', project: 'phone' },
  { id: '1.3-scan-me', path: '/scan', project: 'phone' },
  { id: '1.4-my-sizes', path: '/sizes', project: 'phone' },
  { id: '1.5-brand-fit-detail', path: '/sizes/zara/tshirt', project: 'phone' },
  { id: '2.1-try-it-on', path: '/try', project: 'phone' },
  { id: '2.2-building-3d-try-on', path: '/try/build/demo', project: 'phone' },
  { id: '2.3-live-fit-check', path: '/try/live/demo', project: 'phone' },
  { id: '3.1-share-to-check', path: '/check', project: 'phone' },
  { id: '3.2-did-it-fit', path: '/did-it-fit/demo', project: 'phone' },
  { id: '3.3-store-mode', path: '/store', project: 'phone' },
  { id: '3.4-me-family-tools', path: '/me', project: 'phone' },
  { id: '4.1-web-my-sizes', path: '/sizes', project: 'desktop' },
  {
    id: '4.2-web-try-on-studio',
    path: '/try/studio/demo',
    project: 'desktop',
    viewport: { width: 1440, height: 1060 },
  },
];

for (const screen of SCREENS) {
  test(`${screen.id} matches its design @visual`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== screen.project,
      `${screen.id} is a ${screen.project} screen`,
    );
    if (screen.viewport) await page.setViewportSize(screen.viewport);

    await page.goto(`${screen.path}${QUERY}`);
    // Fonts must be in before the first comparison, or every glyph differs.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector(`[data-screen="${screen.id}"]`);

    await expectToMatchDesign(page, screen.id);
  });
}

// §17.4: 1.4 and 1.5 must look identical with reduced motion on.
for (const screen of SCREENS.filter((s) => s.id.startsWith('1.4') || s.id.startsWith('1.5'))) {
  test(`${screen.id} is unchanged under reduced motion @visual`, async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone', 'phone only');
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      reducedMotion: 'reduce',
      ...(testInfo.project.use.baseURL ? { baseURL: testInfo.project.use.baseURL } : {}),
    });
    const page = await context.newPage();
    await page.goto(`${screen.path}${QUERY}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector(`[data-screen="${screen.id}"]`);
    await expectToMatchDesign(page, screen.id, { outDir: 'test-results/visual-reduced' });
    await context.close();
  });
}
