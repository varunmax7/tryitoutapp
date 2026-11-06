import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { usePressable, type PressVariant } from './usePressable';

type PressableOwnProps = {
  press?: PressVariant;
  /** Rows and cards inside a scroller wait 60ms before showing the press (§12.8.4). */
  inScroller?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * Wraps a tappable element with the press feedback from §12.8.4.
 * For elements this does not cover (a router `Link`, a Base UI part), use `usePressable`
 * and spread its props instead.
 */
export function Pressable<T extends ElementType = 'button'>({
  as,
  press = 'scale',
  inScroller = false,
  className,
  children,
  ...rest
}: PressableOwnProps & { as?: T } & Omit<
    ComponentPropsWithoutRef<T>,
    keyof PressableOwnProps | 'as'
  >) {
  const Component = (as ?? 'button') as ElementType;
  const handlers = usePressable(press, { inScroller, ...(className ? { className } : {}) });
  return (
    <Component {...rest} {...handlers}>
      {children}
    </Component>
  );
}
