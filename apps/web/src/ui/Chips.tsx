import type { ReactNode } from 'react';
import type { FitTag } from '@tryitout/shared';

/**
 * FitChip and ConfidenceChip — implementation.md §12.4.
 * The fit palettes are tokens, so a tag can never be drawn in an off-palette colour.
 */
const FIT_STYLES: Record<FitTag, { bg: string; fg: string; label: string }> = {
  great: { bg: 'bg-fit-great-bg', fg: 'text-fit-great-fg', label: 'Great fit' },
  good: { bg: 'bg-fit-good-bg', fg: 'text-fit-good-fg', label: 'Good fit' },
  slightly_loose: { bg: 'bg-fit-loose-bg', fg: 'text-fit-loose-fg', label: 'Slightly loose' },
  slightly_tight: { bg: 'bg-fit-tight-bg', fg: 'text-fit-tight-fg', label: 'Slightly tight' },
  not_recommended: { bg: 'bg-fit-tight-bg', fg: 'text-fit-tight-fg', label: 'Not your size' },
};

export function FitChip({
  tag,
  children,
  size = 11,
  className = '',
}: {
  tag: FitTag;
  children?: ReactNode;
  /** 11 to 13 px across the designs. */
  size?: 11 | 12 | 13;
  className?: string;
}) {
  const style = FIT_STYLES[tag];
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2 py-[2px] font-semibold ${style.bg} ${style.fg} ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {children ?? style.label}
    </span>
  );
}

/**
 * Shows the confidence level as words. A percentage appears only once the brand x
 * category is calibrated, which `mayShowPercentage` in @tryitout/shared decides (§11.3).
 */
export function ConfidenceChip({ label, className = '' }: { label: string; className?: string }) {
  return (
    <span
      className={`type-numeral inline-flex items-center rounded-pill bg-line-100 px-2 py-[2px] text-[12px] text-ink-700 ${className}`}
    >
      {label}
    </span>
  );
}
