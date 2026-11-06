/**
 * Shown while the first lazy route chunk loads.
 *
 * Deliberately blank: §12.8.10 says a skeleton appears only after 300 ms, so a flash of
 * loading UI never replaces a screen that is about to render. Phase 1 swaps this for the
 * real Skeleton once the component exists.
 */
export function HydrateFallback() {
  return <div aria-busy="true" aria-live="polite" className="min-h-dvh bg-surface-50" />;
}
