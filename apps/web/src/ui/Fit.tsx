import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { FitTag } from '@tryitout/shared';
import { usePressable } from './motion/usePressable';
import { haptic } from '@/lib/haptics';
import { FitChip } from './Chips';
import { IconCheck } from './icons';
import { ProgressBar } from './Fields';

/**
 * FitBar — implementation.md §12.4.
 * Three segments (1fr 1.4fr 1fr), 10px high, with an 18px ink marker. The marker moves
 * by translating a full-width wrapper, never by animating `left` (§12.8.1 rule 7).
 */
export function FitBar({
  value,
  labels,
}: {
  /** 0 to 1 across the whole bar; 0.5 is the middle of the good band. */
  value: number;
  /** 1.5 labels only the first bar in a stack, so the scale is stated once. */
  labels?: [string, string, string] | string[] | undefined;
}) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <>
      <div
        className="relative grid h-[10px] gap-[3px]"
        style={{ gridTemplateColumns: '1fr 1.4fr 1fr' }}
        aria-hidden="true"
      >
        <span className="rounded-l-[5px] bg-bar-tight" />
        <span className="bg-bar-good" />
        <span className="rounded-r-[5px] bg-bar-loose" />
        <span className="pointer-events-none absolute inset-0">
          <span
            className="block"
            style={{
              transform: `translateX(${clamped * 100}%)`,
              transition: 'transform var(--spring-gentle)',
            }}
          >
            <span className="-mt-1 -ml-[9px] block size-[18px] rounded-pill border-[3px] border-surface-0 bg-ink-900 shadow-marker" />
          </span>
        </span>
      </div>
      {labels ? (
        <div className="flex justify-between text-[11px] text-ink-500">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : null}
    </>
  );
}

/**
 * SizePicker — implementation.md §12.4.
 * Six columns, 44px items. Selected is ink; the compare size is marigold-100 with an ink
 * border, so two sizes can be on screen without competing.
 */
export function SizePicker({
  sizes,
  selected,
  compare,
  onSelect,
  label,
  caption,
}: {
  sizes: string[];
  selected: string;
  compare?: string;
  onSelect: (size: string) => void;
  label: string;
  caption?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div role="radiogroup" aria-label={label} className="grid grid-cols-6 gap-[6px]">
        {sizes.map((size) => (
          <SizeButton
            key={size}
            size={size}
            state={size === selected ? 'selected' : size === compare ? 'compare' : 'default'}
            onSelect={() => {
              haptic('selection');
              onSelect(size);
            }}
          />
        ))}
      </div>
      {caption ? (
        <p className="flex items-center gap-[6px] text-[13px] text-ink-500">
          {compare ? (
            <span aria-hidden="true" className="size-2 shrink-0 rounded-pill bg-marigold-500" />
          ) : null}
          {caption}
        </p>
      ) : null}
    </div>
  );
}

function SizeButton({
  size,
  state,
  onSelect,
}: {
  size: string;
  state: 'default' | 'selected' | 'compare';
  onSelect: () => void;
}) {
  const press = usePressable('scale', {
    className: [
      'type-numeral flex h-11 items-center justify-center rounded-12 text-[14px]',
      state === 'selected'
        ? 'bg-ink-900 text-surface-0'
        : state === 'compare'
          ? 'border-[1.5px] border-ink-900 bg-marigold-100 text-ink-900'
          : 'border-[1.5px] border-line-200 bg-surface-0 text-ink-900',
    ].join(' '),
  });
  return (
    <button
      type="button"
      role="radio"
      aria-checked={state === 'selected'}
      onClick={onSelect}
      {...press}
    >
      {size}
    </button>
  );
}

/**
 * BrandRow — implementation.md §12.4.
 * Min height 58, a 40px monogram, and a divider inset to 66px so it starts after it.
 * Pressing highlights rather than scaling, and waits 60ms so scrolling never flashes it.
 */
export function BrandRow({
  to,
  monogram,
  name,
  note,
  size,
  fitTag,
  onPrefetch,
}: {
  to: string;
  monogram: string;
  name: string;
  note: string;
  size: string;
  fitTag: FitTag;
  onPrefetch?: () => void;
}) {
  const press = usePressable('row', {
    inScroller: true,
    className: 'flex min-h-[58px] items-center gap-3 px-[14px] py-[6px] text-ink-900',
  });
  return (
    <Link
      to={to}
      viewTransition
      {...press}
      // Prefetch on intent (§12.8.7), without losing the press feedback's own handler.
      onPointerDown={(event) => {
        press.onPointerDown(event);
        onPrefetch?.();
      }}
      onMouseEnter={onPrefetch}
      className={`${press.className} no-underline`}
    >
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-surface-100 font-display font-bold"
        style={{
          fontSize: monogram.length >= 3 ? '13px' : monogram.length === 2 ? '15px' : '16px',
        }}
      >
        {monogram}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[16px] font-semibold">{name}</span>
        <span className="truncate text-[13px] text-ink-500">{note}</span>
      </span>
      <span className="flex flex-col items-end gap-[3px]">
        <span className="type-numeral text-[19px]">{size}</span>
        <FitChip tag={fitTag} />
      </span>
    </Link>
  );
}

export function BrandRowDivider() {
  return <div aria-hidden="true" className="mr-[14px] ml-[66px] h-px bg-line-100" />;
}

export type Step = {
  label: ReactNode;
  state: 'done' | 'running' | 'pending';
  /** 0 to 1, only for the running step. */
  progress?: number;
};

/** StepList — implementation.md §12.4, bound to the build job's step and progress. */
export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="m-0 flex list-none flex-col p-0">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex flex-col gap-2 py-2 ${index > 0 ? 'border-t border-line-100' : ''}`}
        >
          <div className="flex items-center gap-3">
            <StepMarker step={step} index={index} />
            <span className="flex-1 text-[15px] font-medium">{step.label}</span>
            {step.state === 'running' && step.progress != null ? (
              <span className="type-numeral text-[13px] text-ink-700">
                {Math.round(step.progress * 100)}%
              </span>
            ) : null}
          </div>
          {step.state === 'running' && step.progress != null ? (
            <ProgressBar value={step.progress} label="Build progress" className="ml-[40px]" />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function StepMarker({ step, index }: { step: Step; index: number }) {
  if (step.state === 'done') {
    return (
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-fit-great-bg text-fit-great-fg"
      >
        <IconCheck size={15} strokeWidth={2.4} />
      </span>
    );
  }
  if (step.state === 'running') {
    return (
      <span
        aria-hidden="true"
        className="flex size-7 shrink-0 items-center justify-center rounded-pill border-2 border-marigold-500"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="type-numeral flex size-7 shrink-0 items-center justify-center rounded-pill border-[1.5px] border-line-300 text-[13px] text-ink-500"
    >
      {index + 1}
    </span>
  );
}
