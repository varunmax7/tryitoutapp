import type { SVGProps } from 'react';

/**
 * AppMark and Wordmark — implementation.md §12.4.
 * The tape mark: a 28x14 marigold bar with five ticks. On dark surfaces the ticks stay
 * ink, because they read against the marigold, not against the background.
 */
export function AppMark({ size = 30, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" {...rest}>
      <rect x="1" y="8" width="28" height="14" rx="3.5" className="fill-marigold-500" />
      <path
        d="M7 8v5M11 8v3M15 8v6M19 8v3M23 8v5"
        className="stroke-ink-900"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex items-center gap-[10px]">
      <AppMark />
      <span className={`type-title-l ${onDark ? 'text-surface-0' : 'text-ink-900'}`}>Tryitout</span>
    </div>
  );
}
