import { useEffect, useState, type ReactNode } from 'react';

/**
 * Skeleton — implementation.md §12.4 and §12.8.7.
 * Same boxes as the final layout, in surface-100, with a translating shimmer that is off
 * under reduced motion. Shown only after 300ms, then kept at least 400ms, so a fast
 * response never produces a flicker.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`skeleton block rounded-12 ${className}`} />;
}

const APPEAR_AFTER_MS = 300;
const MIN_VISIBLE_MS = 400;

/** Renders `skeleton` while `loading`, following the 300/400ms rule. */
export function Loading({
  loading,
  skeleton,
  children,
}: {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}) {
  const [showing, setShowing] = useState(false);
  const [shownAt, setShownAt] = useState<number | null>(null);

  useEffect(() => {
    if (loading) {
      const timer = window.setTimeout(() => {
        setShowing(true);
        setShownAt(Date.now());
      }, APPEAR_AFTER_MS);
      return () => window.clearTimeout(timer);
    }
    if (!showing) return;
    const elapsed = shownAt === null ? MIN_VISIBLE_MS : Date.now() - shownAt;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const timer = window.setTimeout(() => setShowing(false), remaining);
    return () => window.clearTimeout(timer);
  }, [loading, showing, shownAt]);

  if (loading && !showing) return null;
  return <>{showing ? skeleton : children}</>;
}
