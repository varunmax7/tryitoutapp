import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

/**
 * Pixel comparison against the design pack — implementation.md §17.4.
 *
 * The baselines are the PNGs in design/screens, so the comparison is done here rather
 * than through Playwright's own snapshots: nothing in this repo can write into
 * design/screens, which is the point of "never run --update-snapshots" (§17.4).
 */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Tightened to 0.01 by Phase 11 (§17.4). */
export const MAX_DIFF_PIXEL_RATIO = 0.02;

export type CompareResult = {
  diffPixels: number;
  totalPixels: number;
  ratio: number;
};

export async function expectToMatchDesign(
  page: Page,
  screenId: string,
  options: { outDir: string; maxDiffPixelRatio?: number; alwaysWrite?: boolean } = {
    outDir: 'test-results/visual',
  },
): Promise<CompareResult> {
  const baselinePath = join(ROOT, 'design/screens', `${screenId}.png`);
  const baseline = PNG.sync.read(readFileSync(baselinePath));

  const actualBuffer = await page.screenshot({ animations: 'disabled', scale: 'device' });
  const actual = PNG.sync.read(actualBuffer);

  const sizeMatches = actual.width === baseline.width && actual.height === baseline.height;
  const outDir = join(ROOT, options.outDir);
  mkdirSync(outDir, { recursive: true });

  if (!sizeMatches) {
    writeFileSync(join(outDir, `${screenId}-actual.png`), actualBuffer);
    expect(
      `${actual.width}x${actual.height}`,
      `${screenId}: the rendered size must equal the design PNG`,
    ).toBe(`${baseline.width}x${baseline.height}`);
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const diffPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: 0.12, includeAA: false },
  );
  const totalPixels = baseline.width * baseline.height;
  const ratio = diffPixels / totalPixels;
  const limit = options.maxDiffPixelRatio ?? MAX_DIFF_PIXEL_RATIO;

  if (ratio > limit || options.alwaysWrite) {
    writeFileSync(join(outDir, `${screenId}-actual.png`), actualBuffer);
    writeFileSync(join(outDir, `${screenId}-diff.png`), PNG.sync.write(diff));
  }

  expect(
    ratio,
    `${screenId}: ${diffPixels} of ${totalPixels} pixels differ (${(ratio * 100).toFixed(2)}%). ` +
      `Diff written to ${options.outDir}/${screenId}-diff.png`,
  ).toBeLessThanOrEqual(limit);

  return { diffPixels, totalPixels, ratio };
}
