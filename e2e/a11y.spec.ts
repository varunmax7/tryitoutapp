import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Accessibility — implementation.md §12.7 and the Phase 1 acceptance criteria:
 * axe shows no serious issues on any screen.
 *
 * Touch-target size and contrast are checked here too, because §12.7 sets both as hard
 * rules (44px, WCAG AA).
 */
const SCREENS: { id: string; path: string; project: 'phone' | 'desktop' }[] = [
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
  { id: '4.2-web-try-on-studio', path: '/try/studio/demo', project: 'desktop' },
];

for (const screen of SCREENS) {
  test(`${screen.id} has no serious accessibility issues`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== screen.project, `${screen.id} is ${screen.project}`);

    await page.goto(`${screen.path}?demo=1&flags=all&still=1`);
    await page.waitForSelector(`[data-screen="${screen.id}"]`);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const serious = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(
      serious.map((v) => `${v.id}: ${v.nodes.length} node(s) — ${v.help}`),
      `${screen.id} axe violations`,
    ).toEqual([]);
  });
}

test('every control meets the 44px touch target', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'phone only');
  await page.goto('/sizes?demo=1&flags=all&still=1');
  await page.waitForSelector('[data-screen="1.4-my-sizes"]');

  const small = await page.evaluate(() => {
    const out: string[] = [];
    const MIN = 44;
    for (const el of document.querySelectorAll('button, a[href], [role="switch"]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.height >= MIN - 0.5) continue;

      // Smaller painted box: the hit area may still reach 44px through `.tap-expand`.
      // Probe it rather than trust the class, by asking what is actually at that point.
      const cx = r.left + r.width / 2;
      const top = document.elementFromPoint(cx, r.top + r.height / 2 - (MIN / 2 - 2));
      const bottom = document.elementFromPoint(cx, r.top + r.height / 2 + (MIN / 2 - 2));
      const hits = (node: Element | null) => node === el || (node != null && el.contains(node));
      if (hits(top) && hits(bottom)) continue;

      out.push(
        `${el.tagName.toLowerCase()} "${el.textContent?.trim().slice(0, 24)}" h=${r.height.toFixed(1)}`,
      );
    }
    return out;
  });
  expect(small, 'controls under the 44px touch target').toEqual([]);
});
