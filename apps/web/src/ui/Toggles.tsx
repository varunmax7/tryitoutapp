import type { ReactNode } from 'react';
import { usePressable } from './motion/usePressable';
import { haptic } from '@/lib/haptics';
import { IconCheck } from './icons';

/**
 * PillToggle, Segmented and Switch — implementation.md §12.4.
 * Selections slide rather than jump (§12.8.4), and each change fires a `selection` haptic.
 */

export function PillToggle({
  pressed,
  onPress,
  disabled = false,
  multi = false,
  children,
}: {
  pressed: boolean;
  onPress: () => void;
  disabled?: boolean;
  /** Multi-select pills show a marigold check when on. */
  multi?: boolean;
  children: ReactNode;
}) {
  const press = usePressable('scale', {
    className: [
      'inline-flex h-11 items-center gap-[6px] rounded-pill px-[18px] text-[15px]',
      pressed
        ? 'bg-ink-900 font-semibold text-surface-0'
        : 'border-[1.5px] border-line-200 bg-surface-0 font-medium text-ink-700',
      disabled ? 'opacity-40' : '',
    ].join(' '),
  });
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => {
        haptic('selection');
        onPress();
      }}
      {...press}
    >
      {multi && pressed ? <IconCheck size={14} className="text-marigold-500" /> : null}
      {children}
    </button>
  );
}

export type SegmentedItem = { value: string; label: ReactNode; sub?: ReactNode };

/**
 * Track surface-100 (or surface-150), padding 3-4, radius 14-16; items 44-52 high,
 * radius 10-12; the active item is white with shadow-seg and slides into place.
 */
export function Segmented({
  items,
  value,
  onChange,
  label,
  tall = false,
  track = 'surface-100',
  radius = 16,
}: {
  items: SegmentedItem[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  tall?: boolean;
  track?: 'surface-100' | 'surface-150';
  /** The designs use a 12px track with 10px items (1.2) and a 16/12 pair elsewhere. */
  radius?: 12 | 14 | 16;
}) {
  const trackRadius = radius === 12 ? 'rounded-12' : radius === 14 ? 'rounded-14' : 'rounded-16';
  const itemRadius = radius === 12 ? 'rounded-10' : 'rounded-12';
  const index = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={`relative grid p-1 ${trackRadius} ${track === 'surface-150' ? 'bg-surface-150' : 'bg-surface-100'}`}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {/* One sliding thumb, moved with transform so only the compositor works. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1 bottom-1 left-1 bg-surface-0 shadow-seg ${itemRadius}`}
        style={{
          width: `calc((100% - 8px) / ${items.length})`,
          transform: `translateX(${index * 100}%)`,
          transition: 'transform var(--spring-snappy)',
        }}
      />
      {items.map((item) => (
        <SegmentedButton
          key={item.value}
          item={item}
          selected={item.value === value}
          tall={tall}
          itemRadius={itemRadius}
          onSelect={() => {
            haptic('selection');
            onChange(item.value);
          }}
        />
      ))}
    </div>
  );
}

function SegmentedButton({
  item,
  selected,
  tall,
  itemRadius,
  onSelect,
}: {
  item: SegmentedItem;
  selected: boolean;
  tall: boolean;
  itemRadius: string;
  onSelect: () => void;
}) {
  const press = usePressable('scale', {
    className: [
      `relative z-10 flex flex-col items-center justify-center text-[15px] ${itemRadius}`,
      tall ? 'h-[52px]' : 'h-11',
      selected ? 'font-semibold text-ink-900' : 'font-medium text-ink-700',
    ].join(' '),
  });
  return (
    <button type="button" aria-pressed={selected} onClick={onSelect} {...press}>
      <span>{item.label}</span>
      {item.sub ? <span className="text-[11px] font-medium text-ink-500">{item.sub}</span> : null}
    </button>
  );
}

/** 52x32, radius 16, padding 3, knob 26. Light on = ink-900; dark on = on-dark-success. */
export function Switch({
  checked,
  onChange,
  label,
  onDark = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  onDark?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => {
        haptic('selection');
        onChange(!checked);
      }}
      className={[
        'relative h-8 w-[52px] shrink-0 rounded-16 p-[3px]',
        checked
          ? onDark
            ? 'bg-on-dark-success'
            : 'bg-ink-900'
          : onDark
            ? 'bg-dark-650'
            : 'bg-line-200',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={`block size-[26px] rounded-pill ${checked && onDark ? 'bg-dark-900' : 'bg-surface-0'}`}
        style={{
          transform: `translateX(${checked ? 20 : 0}px)`,
          transition: 'transform var(--spring-snappy)',
        }}
      />
    </button>
  );
}
