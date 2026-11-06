import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Card — implementation.md §12.4. White, radius 18-22, padding 14-16. */
export function Card({
  className = '',
  children,
  ...rest
}: ComponentPropsWithoutRef<'div'> & { children?: ReactNode }) {
  return (
    <div {...rest} className={`rounded-18 bg-surface-0 p-[14px] ${className}`}>
      {children}
    </div>
  );
}

export type TapeValue = { label: string; value: ReactNode };

/**
 * TapeCard — implementation.md §12.4. The measuring-tape card: marigold, with a tick
 * ruler along the bottom edge at a 7px pitch, every fifth tick long.
 */
export function TapeCard({
  title,
  values,
  action,
  caption,
  desktop = false,
}: {
  title: string;
  values: TapeValue[];
  action?: ReactNode;
  /** "From a body scan" / "Estimated from your details" (§12.6 N2). */
  caption?: ReactNode;
  desktop?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-marigold-500 ${desktop ? 'rounded-24 p-5 pb-7' : 'rounded-18 px-[14px] pt-3 pb-[22px]'}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">{title}</span>
        {action}
      </div>
      <div
        className="mt-[2px] grid gap-[6px]"
        style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}
      >
        {values.map((item) => (
          <div key={item.label} className="flex flex-col gap-px">
            <span className="text-[12px] text-marigold-ink">{item.label}</span>
            <span className={desktop ? 'type-numeral-l' : 'type-numeral-m'}>{item.value}</span>
          </div>
        ))}
      </div>
      {caption ? <p className="mt-2 text-[12px] text-marigold-ink">{caption}</p> : null}
      <TapeRuler />
    </div>
  );
}

/** Ticks every 7px, every fifth one long. Drawn as one path so it costs one node. */
function TapeRuler({ width = 350 }: { width?: number }) {
  const ticks: string[] = [];
  for (let x = 7, i = 0; x < width; x += 7, i += 1) {
    ticks.push(`M${x} 12v-${(i + 1) % 5 === 0 ? 9 : 5}`);
  }
  return (
    <svg
      width={width + 8}
      height="12"
      viewBox={`0 0 ${width} 12`}
      aria-hidden="true"
      className="absolute bottom-0 left-0"
    >
      <path d={ticks.join('')} className="stroke-ink-900" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

/** ReviewCard — marigold-100 with a marigold-200 border and a 32px marigold icon circle. */
export function ReviewCard({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-18 border border-marigold-200 bg-marigold-100 p-[14px]">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-marigold-500 text-ink-900"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[14px] font-semibold">{title}</span>
        {body ? <span className="text-[13px] text-ink-700">{body}</span> : null}
      </div>
      {action}
    </div>
  );
}

/** ToolTile — height 96, radius 18, 1px line-200, icon 28, title 15/600, sub 12. */
export function ToolTile({ icon, title, sub }: { icon: ReactNode; title: string; sub: string }) {
  return (
    <div className="flex h-24 flex-col justify-between rounded-18 border border-line-200 bg-surface-0 p-3">
      <span aria-hidden="true" className="text-ink-900">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-[15px] font-semibold">{title}</span>
        <span className="text-[12px] text-ink-500">{sub}</span>
      </span>
    </div>
  );
}
