import { expect, test } from '@playwright/test';

/**
 * Every screen in implementation.md §12.5 and §12.6 resolves at its route without a
 * console error. Screens built in Phase 1 carry `data-screen`; the ones still waiting
 * for their phase carry `data-screen-stub`, and either satisfies this test.
 */
type Route = {
  path: string;
  screen: string;
  /** /sizes swaps to its desktop layout at 1024px and up (§12.7). */
  desktopScreen?: string;
};

const SCREENS: Route[] = [
  { path: '/', screen: '1.1-welcome' },
  { path: '/measure', screen: '1.2-type-my-details' },
  { path: '/measure/numbers', screen: 'N2-your-numbers' },
  { path: '/scan', screen: '1.3-scan-me' },
  { path: '/scan/processing', screen: 'N3-scan-processing' },
  { path: '/scan/size-tag', screen: 'N4-size-tag-scan' },
  { path: '/sizes', screen: '1.4-my-sizes', desktopScreen: '4.1-web-my-sizes' },
  { path: '/sizes/zara/tshirt', screen: '1.5-brand-fit-detail' },
  { path: '/try', screen: '2.1-try-it-on' },
  { path: '/try/build/build_1', screen: '2.2-building-3d-try-on' },
  { path: '/try/live/garment_1', screen: '2.3-live-fit-check' },
  { path: '/try/studio/garment_1', screen: '4.2-web-try-on-studio' },
  { path: '/check', screen: '3.1-share-to-check' },
  { path: '/v/token_1', screen: 'N6-ask-family-vote' },
  { path: '/did-it-fit/purchase_1', screen: '3.2-did-it-fit' },
  { path: '/store', screen: '3.3-store-mode' },
  { path: '/me', screen: '3.4-me-family-tools' },
  { path: '/admin', screen: 'N11-admin' },
  { path: '/privacy', screen: 'N10-privacy' },
  { path: '/terms', screen: 'N10-terms' },
  { path: '/about', screen: 'N10-about' },
];

const DEV_SCREENS: Route[] = [
  { path: '/dev/ui', screen: 'dev-ui' },
  { path: '/dev/sheets', screen: 'dev-sheets' },
  { path: '/dev/states', screen: 'N9-system-states' },
  { path: '/dev/sentry', screen: 'dev-sentry' },
];

for (const { path, screen, desktopScreen } of [...SCREENS, ...DEV_SCREENS]) {
  test(`serves ${screen} at ${path}`, async ({ page }, testInfo) => {
    const expected = testInfo.project.name === 'desktop' && desktopScreen ? desktopScreen : screen;
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    const response = await page.goto(path);
    expect(response?.status(), `${path} should resolve`).toBe(200);
    await expect(
      page.locator(`[data-screen="${expected}"], [data-screen-stub="${expected}"]`),
    ).toBeVisible();
    expect(errors, `${path} logged console errors`).toEqual([]);
  });
}

test('an unknown path renders the not-found screen', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.locator('[data-screen-stub="not-found"]')).toBeVisible();
});

test('the sheet-only screens from §12.6 each have a stub', async ({ page }) => {
  await page.goto('/dev/sheets');
  for (const id of ['N1', 'N5', 'N7', 'N8', 'N12']) {
    await expect(page.locator(`[data-sheet-stub="${id}"]`)).toBeVisible();
  }
});
