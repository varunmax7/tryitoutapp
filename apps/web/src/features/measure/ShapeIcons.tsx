import type { SVGProps } from 'react';

/**
 * The four body-shape pictures on 1.2 (§12.5), taken from design/reference.
 * Filled silhouettes on a 40x56 grid: ink-300 when the tile is not chosen, ink-900 when
 * it is, so the chosen shape reads at a glance.
 */
const TORSOS = {
  slim: 'M14 12h12l3 6-1 18 2 18H10l2-18-1-18z',
  athletic: 'M7 12h26l2 6-6 18 2 18H11l2-18-6-18z',
  regular: 'M11 12h18l3 6-2 18 2 18H10l2-18-2-18z',
  broad: 'M9 12h22l3 6 1 18 1 18H6l1-18 1-18z',
} as const;

export type ShapeKey = keyof typeof TORSOS;

export function ShapeIcon({
  shape,
  selected,
  ...rest
}: SVGProps<SVGSVGElement> & { shape: ShapeKey; selected: boolean }) {
  const fill = selected ? 'fill-ink-900' : 'fill-ink-300';
  return (
    <svg width="30" height="42" viewBox="0 0 40 56" aria-hidden="true" {...rest}>
      <circle cx="20" cy="5" r="4.5" className={fill} />
      <path d={TORSOS[shape]} className={fill} />
    </svg>
  );
}
