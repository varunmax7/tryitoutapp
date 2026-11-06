import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router';
import type { RouteChrome } from './RootLayout';

/**
 * Every route in implementation.md §12.5 and §12.6. Screens load lazily so the camera,
 * 3D and admin bundles never land in the initial 250 KB budget (§17.6).
 *
 * `handle` tells the shell which chrome the screen wants (§12.8.3): the BottomNav, a plain
 * page, or a full-screen surface that locks the page and owns its own scrolling.
 *
 * Sheet-only screens (N1 consent, N5 brand request, N7 "Did you buy it?", N8 install,
 * N12 settings) open over a screen rather than at a URL; /dev/sheets lists their stubs.
 */
const lazy = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

const route = (
  path: string,
  load: () => Promise<{ default: ComponentType }>,
  handle: RouteChrome = { chrome: 'plain' },
): RouteObject => ({ path, lazy: lazy(load), handle });

export const appRoutes: RouteObject[] = [
  // 1.1's hero is ink, so the status bar and the overscroll above it must be too.
  route('/', () => import('@/features/welcome/WelcomeRoute'), { chrome: 'plain', theme: 'ink' }),

  // F1a — type it
  route('/measure', () => import('@/features/measure/MeasureRoute')),
  route('/measure/numbers', () => import('@/features/measure/YourNumbersRoute')),

  // F1b — scan me. The camera owns the screen and never bounces over the viewfinder.
  route('/scan', () => import('@/features/scan/ScanRoute'), {
    chrome: 'fullscreen',
    theme: 'dark',
  }),
  route('/scan/processing', () => import('@/features/scan/ScanProcessingRoute'), {
    chrome: 'fullscreen',
    theme: 'dark',
  }),
  route('/scan/size-tag', () => import('@/features/scan/SizeTagRoute'), {
    chrome: 'fullscreen',
    theme: 'dark',
  }),

  // F1 — dashboard and brand detail
  route('/sizes', () => import('@/features/sizes/MySizesRoute'), { chrome: 'tabs' }),
  route('/sizes/:brand/:category', () => import('@/features/brand/BrandFitDetailRoute')),

  // F2 — try it on
  route('/try', () => import('@/features/tryon/TryItOnRoute'), { chrome: 'tabs' }),
  route('/try/build/:buildId', () => import('@/features/tryon/BuildingRoute')),
  route('/try/live/:garmentId', () => import('@/features/live/LiveFitCheckRoute'), {
    chrome: 'fullscreen',
    theme: 'dark',
  }),
  route('/try/studio/:garmentId', () => import('@/features/tryon/StudioRoute')),

  // F3 — share to check (also the PWA share target)
  route('/check', () => import('@/features/share/ShareToCheckRoute')),

  // F4 — ask family: the public vote page needs no account
  route('/v/:token', () => import('@/features/vote/VoteRoute')),

  // F6 — did it fit?
  route('/did-it-fit/:purchaseId', () => import('@/features/diditfit/DidItFitRoute')),

  // V2 behind the storeMode flag
  route('/store', () => import('@/features/store/StoreModeRoute'), { chrome: 'tabs' }),

  route('/me', () => import('@/features/me/MeRoute'), { chrome: 'tabs' }),
  route('/admin', () => import('@/features/admin/AdminRoute')),

  // N10 legal
  route('/privacy', () => import('@/features/legal/PrivacyRoute')),
  route('/terms', () => import('@/features/legal/TermsRoute')),
  route('/about', () => import('@/features/legal/AboutRoute')),
];

/**
 * Dev-only surfaces. The `import.meta.env.DEV` guard sits here, not at the call site, so
 * the bundler drops the array and every dynamic import inside it from production builds.
 */
export const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      route('/dev/ui', () => import('@/features/dev/UiGalleryRoute')),
      route('/dev/sheets', () => import('@/features/dev/SheetsGalleryRoute')),
      route('/dev/states', () => import('@/features/dev/StatesRoute')),
      route('/dev/sentry', () => import('@/features/dev/SentryTestRoute')),
    ]
  : [];

export const notFoundRoute: RouteObject = {
  path: '*',
  lazy: lazy(() => import('@/features/legal/NotFoundRoute')),
};
