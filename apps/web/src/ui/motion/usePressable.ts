import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';

/**
 * Press feedback — implementation.md §12.8.4.
 *
 * Buttons, chips and icon buttons scale; cards and tiles scale less; list rows take a
 * surface-100 highlight instead. The pressed state is a `data-pressed` attribute written
 * through a ref, never React state, so no touch causes a re-render.
 *
 * Inside a scroller the state waits 60ms, so scrolling never flashes rows, and it cancels
 * on `pointercancel` or after 10px of movement.
 */
export type PressVariant = 'scale' | 'card' | 'row';

const SCROLL_GUARD_MS = 60;
const MOVE_CANCEL_PX = 10;

export type PressableHandlers = {
  className: string;
  'data-press': PressVariant;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onKeyUp: () => void;
  onBlur: () => void;
  ref: (node: HTMLElement | null) => void;
};

export function usePressable(
  press: PressVariant = 'scale',
  options: { inScroller?: boolean; className?: string } = {},
): PressableHandlers {
  const node = useRef<HTMLElement | null>(null);
  const timer = useRef<number | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const set = () => node.current?.setAttribute('data-pressed', '');
  const clear = () => {
    clearTimer();
    origin.current = null;
    node.current?.removeAttribute('data-pressed');
  };

  // A component unmounting mid-press must not leave a timer behind.
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  return {
    className: ['pressable', options.className].filter(Boolean).join(' '),
    'data-press': press,
    ref: (next) => {
      node.current = next;
    },
    onPointerDown: (event) => {
      origin.current = { x: event.clientX, y: event.clientY };
      if (options.inScroller) {
        clearTimer();
        timer.current = window.setTimeout(set, SCROLL_GUARD_MS);
      } else {
        set();
      }
    },
    onPointerMove: (event) => {
      const start = origin.current;
      if (!start) return;
      const moved =
        Math.abs(event.clientX - start.x) > MOVE_CANCEL_PX ||
        Math.abs(event.clientY - start.y) > MOVE_CANCEL_PX;
      if (moved) clear();
    },
    onPointerUp: clear,
    onPointerCancel: clear,
    onPointerLeave: clear,
    // Enter and Space show the same pressed state (§12.8.4).
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') set();
    },
    onKeyUp: clear,
    onBlur: clear,
  };
}
