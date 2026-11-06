/**
 * Feature flags — implementation.md §13. V1 defaults are all false.
 *
 * Visual tests run with every flag on, because the design pack shows the full product.
 * Production V1 runs with the V2 and unvalidated surfaces off (§17.4).
 */
export type FlagName =
  | 'storeMode'
  | 'familyProfiles'
  | 'tools'
  | 'scanMostAccurate'
  | 'confidencePercent'
  | 'photoRealSnap'
  | 'iosHaptics';

const V1_DEFAULTS: Record<FlagName, boolean> = {
  storeMode: false,
  familyProfiles: false,
  tools: false,
  scanMostAccurate: false,
  confidencePercent: false,
  photoRealSnap: false,
  iosHaptics: false,
};

const ALL_ON: Record<FlagName, boolean> = {
  storeMode: true,
  familyProfiles: true,
  tools: true,
  scanMostAccurate: true,
  confidencePercent: true,
  photoRealSnap: true,
  iosHaptics: true,
};

/**
 * Demo mode and flag overrides are build-time disabled in production.
 *
 * Vite replaces `import.meta.env.VITE_APP_ENV` with a literal, so in a production build
 * this is `false` and every branch behind it — including the whole fixtures module — is
 * dropped by the bundler. Without this, a real user could type `?demo=1` and be shown
 * Aarav's measurements as their own, which AGENTS.md rule 9 forbids.
 */
const OVERRIDES_ALLOWED = import.meta.env.VITE_APP_ENV !== 'production';

function readOverrides(): Partial<Record<FlagName, boolean>> {
  if (!OVERRIDES_ALLOWED) return {};
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);

  // `?flags=all` is how the visual tests capture the designed state (§17.4).
  if (params.get('flags') === 'all') return ALL_ON;

  const overrides: Partial<Record<FlagName, boolean>> = {};
  for (const name of Object.keys(V1_DEFAULTS) as FlagName[]) {
    const value = params.get(name);
    if (value === '1' || value === 'true') overrides[name] = true;
    if (value === '0' || value === 'false') overrides[name] = false;
  }
  return overrides;
}

export const flags: Record<FlagName, boolean> = { ...V1_DEFAULTS, ...readOverrides() };

export function isOn(name: FlagName): boolean {
  return flags[name];
}

/**
 * Demo mode feeds every screen the mockup fixtures (§15 Phase 1 task 5). It is off in
 * production builds no matter what the URL says.
 */
export function isDemoMode(): boolean {
  if (!OVERRIDES_ALLOWED) return false;
  if (typeof window === 'undefined') return false;
  const value = new URLSearchParams(window.location.search).get('demo');
  return value === '1' || value === 'true';
}
