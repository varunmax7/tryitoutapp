import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { usePressable } from './motion/usePressable';
import { haptic } from '@/lib/haptics';
import { IconCheck, IconSearch } from './icons';

/**
 * TextField, SearchField, RadioTile and ProgressBar — implementation.md §12.4.
 *
 * Inputs render at 16px on touch screens (§12.8.4): anything smaller makes iOS Safari
 * zoom the page on focus. The visual tests do not emulate touch, so they still compare
 * the designed 15 to 17px. That is the one intended difference from the PNGs.
 */

export function TextField({
  label,
  unit,
  error,
  mono = true,
  className = '',
  ...rest
}: Omit<ComponentPropsWithoutRef<'input'>, 'className'> & {
  label: string;
  unit?: string;
  error?: string;
  mono?: boolean;
  className?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      <label htmlFor={id} className="text-[13px] font-semibold text-ink-700">
        {label}
      </label>
      <div
        className={`flex h-12 items-center gap-1 rounded-12 border-[1.5px] px-[10px] ${
          error ? 'border-danger' : 'border-line-300'
        }`}
      >
        <input
          id={id}
          {...rest}
          {...(error ? { 'aria-invalid': true, 'aria-describedby': errorId } : {})}
          className={`w-full min-w-0 border-0 bg-transparent p-0 text-[17px] font-semibold text-ink-900 outline-none pointer-coarse:text-[16px] ${
            mono ? 'font-mono' : ''
          }`}
        />
        {unit ? <span className="text-[13px] text-ink-500">{unit}</span> : null}
      </div>
      {error ? (
        <span id={errorId} className="text-[13px] text-danger">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/** Height 48, radius 14, 1.5px line-200, search icon 20, visually hidden label. */
export function SearchField({
  label,
  desktop = false,
  className = '',
  ...rest
}: Omit<ComponentPropsWithoutRef<'input'>, 'className'> & {
  label: string;
  desktop?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div
      className={`relative flex h-12 items-center gap-[10px] rounded-14 border-[1.5px] bg-surface-0 px-[14px] ${
        desktop ? 'border-line-300' : 'border-line-200'
      } ${className}`}
    >
      <IconSearch size={20} className="shrink-0 text-ink-500" />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] text-ink-900 outline-none pointer-coarse:text-[16px]"
      />
    </div>
  );
}

/** 80-100 high, radius 14-16; selected gets a 2px ink border and a corner check badge. */
export function RadioTile({
  selected,
  onSelect,
  icon,
  label,
  name,
  height = 92,
}: {
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  label: string;
  name: string;
  height?: number;
}) {
  const press = usePressable('card', {
    className: [
      'relative flex flex-col items-center justify-center gap-[6px] rounded-14 bg-surface-0 p-[6px]',
      selected
        ? 'border-2 border-ink-900 text-ink-900'
        : 'border-[1.5px] border-line-200 text-ink-700',
    ].join(' '),
  });
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      name={name}
      style={{ height: `${height}px` }}
      onClick={() => {
        haptic('selection');
        onSelect();
      }}
      {...press}
    >
      {selected ? (
        <span
          aria-hidden="true"
          className="absolute top-[6px] right-[6px] flex size-[18px] items-center justify-center rounded-pill bg-marigold-500"
        >
          <IconCheck size={11} strokeWidth={3} className="text-ink-900" />
        </span>
      ) : null}
      {icon}
      <span className={`text-[13px] ${selected ? 'font-semibold' : 'font-medium'}`}>{label}</span>
    </button>
  );
}

/** 6px track in line-200, marigold fill, radius 3. The fill springs (§12.8.8). */
export function ProgressBar({
  value,
  label,
  className = '',
}: {
  /** 0 to 1. */
  value: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(label ? { 'aria-label': label } : {})}
      className={`h-[6px] overflow-hidden rounded-3 bg-line-200 ${className}`}
    >
      {/* scaleX, not width: §12.8.1 rule 7 keeps layout off the animation path. */}
      <div
        className="h-[6px] origin-left rounded-3 bg-marigold-500"
        style={{
          width: '100%',
          transform: `scaleX(${pct / 100})`,
          transition: 'transform var(--spring-gentle)',
        }}
      />
    </div>
  );
}
