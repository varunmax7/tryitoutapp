import type { Page } from '@playwright/test';

/**
 * Instrumentation for the feel tests — implementation.md §17.9.
 *
 * Everything here runs in the page: long animation frames, rAF gaps, the time from
 * pointerdown to the pressed state, and the length of each view transition.
 */
export type FeelMetrics = {
  longFrames: { duration: number; name: string }[];
  frameGaps: number[];
  pressDelays: number[];
  transitions: number[];
  cls: number;
};

declare global {
  interface Window {
    __feel: FeelMetrics;
  }
}

/** Installed before any page script, so nothing is missed during the first paint. */
export async function installFeelProbe(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const feel: FeelMetrics = {
      longFrames: [],
      frameGaps: [],
      pressDelays: [],
      transitions: [],
      cls: 0,
    };
    window.__feel = feel;

    // Long Animation Frames: Chromium only, which is why this project is Chromium only.
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          feel.longFrames.push({ duration: entry.duration, name: entry.name });
        }
      }).observe({ type: 'long-animation-frame', buffered: true });
    } catch {
      // Older Chromium: the rAF gaps below still catch a stall.
    }

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) feel.cls += shift.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {
      // No layout-shift support: CLS stays 0 and the budget is checked elsewhere.
    }

    let last = performance.now();
    const tick = (now: number) => {
      feel.frameGaps.push(now - last);
      last = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Press feedback: pointerdown to the data-pressed attribute landing (§12.8.10).
    let pressedAt = 0;
    document.addEventListener(
      'pointerdown',
      () => {
        pressedAt = performance.now();
      },
      true,
    );
    new MutationObserver((records) => {
      for (const record of records) {
        if (
          record.attributeName === 'data-pressed' &&
          (record.target as Element).hasAttribute('data-pressed') &&
          pressedAt > 0
        ) {
          feel.pressDelays.push(performance.now() - pressedAt);
          pressedAt = 0;
        }
      }
    }).observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-pressed'],
    });

    // Time every view transition from `ready` to `finished` (§17.9).
    const start = document.startViewTransition?.bind(document);
    if (start) {
      document.startViewTransition = ((callback: () => void) => {
        const transition = start(callback);
        const began = performance.now();
        void transition.finished.then(() => feel.transitions.push(performance.now() - began));
        return transition;
      }) as typeof document.startViewTransition;
    }
  });
}

export async function readFeel(page: Page): Promise<FeelMetrics> {
  return page.evaluate(() => window.__feel);
}

/**
 * Clears what was collected during load, so a measurement covers only the gesture that
 * follows it. §17.6's "zero long frames" budget is about the scripted scroll, not about
 * first paint, lazy chunks and the font swap.
 */
export async function resetFeel(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.__feel.longFrames = [];
    window.__feel.frameGaps = [];
    window.__feel.pressDelays = [];
    window.__feel.transitions = [];
    window.__feel.cls = 0;
  });
}

/**
 * Measures pointerdown to `data-pressed` on one element, inside the page, so the number
 * is the app's own latency and not Playwright's polling interval (§12.8.10).
 */
export async function measurePressDelay(page: Page, selector: string): Promise<number> {
  const pending = page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) throw new Error(`no element for ${sel}`);
    return new Promise<number>((resolve, reject) => {
      const started = performance.now();
      const observer = new MutationObserver(() => {
        if (element.hasAttribute('data-pressed')) {
          observer.disconnect();
          resolve(performance.now() - started);
        }
      });
      observer.observe(element, { attributes: true, attributeFilter: ['data-pressed'] });
      setTimeout(() => {
        observer.disconnect();
        reject(new Error('the pressed state never appeared'));
      }, 2000);
    });
  }, selector);

  const box = (await page.locator(selector).boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const delay = await pending;
  await page.mouse.up();
  return delay;
}

/** Stands in for a mid-range Android (§17.9). */
export async function throttleCpu(page: Page, rate = 4): Promise<void> {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate });
}

/** A real touch fling, not a wheel event. */
export async function flingScroll(page: Page, distance: number): Promise<void> {
  const session = await page.context().newCDPSession(page);
  await session.send('Input.synthesizeScrollGesture', {
    x: 195,
    y: 500,
    yDistance: -distance,
    speed: 3000,
    gestureSourceType: 'touch',
    repeatCount: 0,
  });
}
