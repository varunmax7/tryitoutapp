import { spring } from 'motion';

/**
 * Spring presets — implementation.md §12.8.2.
 *
 * Springs defined the way Apple defines them: how long the motion looks, and how much it
 * bounces. JS animations pass these objects straight through (`transition={springs.smooth}`);
 * CSS gets the same feel through `applyMotionTokens`, so the two never drift apart.
 *
 * A spring's CSS duration is its full settle time: snappy 350ms, smooth 750ms, gentle 950ms.
 * The movement looks finished at its `visualDuration`.
 */
export const springs = {
  /** presses, toggles, chips, selections */
  snappy: { type: 'spring', visualDuration: 0.25, bounce: 0.1 },
  /** sheets, dialogs, anything large */
  smooth: { type: 'spring', visualDuration: 0.4, bounce: 0 },
  /** a result landing: fit marker, new size, success */
  gentle: { type: 'spring', visualDuration: 0.55, bounce: 0.2 },
} as const;

export type SpringName = keyof typeof springs;

/**
 * Replaces the `--spring-*` placeholders in motion.css with exact `linear()` springs.
 *
 * Call once in main.tsx before the first render, and again when the motion setting
 * changes. Browsers without `linear()` easing (iOS before 17.2) fall back to the enter
 * curve at the spring's visual duration.
 */
export function applyMotionTokens(
  reduced: boolean,
  root: HTMLElement = document.documentElement,
): void {
  const hasLinear =
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('transition-timing-function', 'linear(0, 1)');

  for (const [name, s] of Object.entries(springs)) {
    const value = reduced
      ? // No bounce, short.
        '200ms var(--ease-enter)'
      : hasLinear
        ? spring(s.visualDuration, s.bounce).toString()
        : `${Math.round(s.visualDuration * 1000)}ms var(--ease-enter)`;
    root.style.setProperty(`--spring-${name}`, value);
  }
}
