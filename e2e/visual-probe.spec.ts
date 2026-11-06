import { test } from '@playwright/test';
import { expectToMatchDesign } from './visual-compare';

/**
 * A single-screen probe for the /ui-match loop. Skipped unless PROBE_ID is set:
 *
 *   PROBE_ID=1.4-my-sizes PROBE_PATH=/sizes pnpm e2e --project=phone --grep probe
 *
 * It never fails on the ratio; it prints it and writes the diff to
 * test-results/probe/<id>-diff.png so the difference can be looked at.
 */
const ID = process.env.PROBE_ID;
const PATH = process.env.PROBE_PATH ?? '/';

test('visual probe', async ({ page }, testInfo) => {
  test.skip(!ID, 'set PROBE_ID to run the probe');
  if (process.env.PROBE_VIEWPORT) {
    const [width, height] = process.env.PROBE_VIEWPORT.split('x').map(Number);
    if (width && height) await page.setViewportSize({ width, height });
  }
  await page.goto(`${PATH}?demo=1&flags=all&still=1`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector(`[data-screen="${ID}"]`);
  const result = await expectToMatchDesign(page, ID!, {
    outDir: 'test-results/probe',
    maxDiffPixelRatio: 1,
    alwaysWrite: true,
  });
  testInfo.annotations.push({ type: 'diff', description: `${(result.ratio * 100).toFixed(3)}%` });
  console.log(`DIFF ${ID}: ${(result.ratio * 100).toFixed(3)}%  (${result.diffPixels} px)`);
});
