import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router';

/**
 * Every route in implementation.md §12.5 and §12.6. Screens load lazily so the camera,
 * 3D and admin bundles never land in the initial 250 KB budget (§17.6).
 *
 * Sheet-only screens (N1 consent, N5 brand request, N7 "Did you buy it?", N8 install,
 * N12 settings) open over a screen rather than at a URL; /dev/sheets lists their stubs.
 */
const lazy = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const appRoutes: RouteObject[] = [
  { path: '/', lazy: lazy(() => import('@/features/welcome/WelcomeRoute')) },

  // F1a — type it
  { path: '/measure', lazy: lazy(() => import('@/features/measure/MeasureRoute')) },
  { path: '/measure/numbers', lazy: lazy(() => import('@/features/measure/YourNumbersRoute')) },

  // F1b — scan me
  { path: '/scan', lazy: lazy(() => import('@/features/scan/ScanRoute')) },
  { path: '/scan/processing', lazy: lazy(() => import('@/features/scan/ScanProcessingRoute')) },
  { path: '/scan/size-tag', lazy: lazy(() => import('@/features/scan/SizeTagRoute')) },

  // F1 — dashboard and brand detail
  { path: '/sizes', lazy: lazy(() => import('@/features/sizes/MySizesRoute')) },
  {
    path: '/sizes/:brand/:category',
    lazy: lazy(() => import('@/features/brand/BrandFitDetailRoute')),
  },

  // F2 — try it on
  { path: '/try', lazy: lazy(() => import('@/features/tryon/TryItOnRoute')) },
  { path: '/try/build/:buildId', lazy: lazy(() => import('@/features/tryon/BuildingRoute')) },
  { path: '/try/live/:garmentId', lazy: lazy(() => import('@/features/live/LiveFitCheckRoute')) },
  { path: '/try/studio/:garmentId', lazy: lazy(() => import('@/features/tryon/StudioRoute')) },

  // F3 — share to check (also the PWA share target)
  { path: '/check', lazy: lazy(() => import('@/features/share/ShareToCheckRoute')) },

  // F4 — ask family: the public vote page needs no account
  { path: '/v/:token', lazy: lazy(() => import('@/features/vote/VoteRoute')) },

  // F6 — did it fit?
  {
    path: '/did-it-fit/:purchaseId',
    lazy: lazy(() => import('@/features/diditfit/DidItFitRoute')),
  },

  // V2 behind the storeMode flag
  { path: '/store', lazy: lazy(() => import('@/features/store/StoreModeRoute')) },

  { path: '/me', lazy: lazy(() => import('@/features/me/MeRoute')) },
  { path: '/admin', lazy: lazy(() => import('@/features/admin/AdminRoute')) },

  // N10 legal
  { path: '/privacy', lazy: lazy(() => import('@/features/legal/PrivacyRoute')) },
  { path: '/terms', lazy: lazy(() => import('@/features/legal/TermsRoute')) },
  { path: '/about', lazy: lazy(() => import('@/features/legal/AboutRoute')) },
];

/**
 * Dev-only surfaces. The `import.meta.env.DEV` guard sits here, not at the call site, so
 * the bundler drops the array and every dynamic import inside it from production builds.
 */
export const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      { path: '/dev/ui', lazy: lazy(() => import('@/features/dev/UiGalleryRoute')) },
      { path: '/dev/sheets', lazy: lazy(() => import('@/features/dev/SheetsGalleryRoute')) },
      { path: '/dev/states', lazy: lazy(() => import('@/features/dev/StatesRoute')) },
      { path: '/dev/sentry', lazy: lazy(() => import('@/features/dev/SentryTestRoute')) },
    ]
  : [];

export const notFoundRoute: RouteObject = {
  path: '*',
  lazy: lazy(() => import('@/features/legal/NotFoundRoute')),
};
