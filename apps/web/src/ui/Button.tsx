import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { usePressable } from './motion/usePressable';

/**
 * Buttons — implementation.md §12.4.
 *   Primary   height 54, radius 16, ink-900, white 17/600, icon 20, gap 10
 *   Secondary height 48, radius 14, 1.5px line-300, white, 15-16/600
 *   Danger    height 44, radius 12, 1.5px danger-line, danger text
 */
type Variant = 'primary' | 'secondary' | 'danger';

const VARIANTS: Record<Variant, string> = {
  primary:
    'h-[54px] rounded-16 bg-ink-900 text-surface-0 type-body-strong gap-[10px] px-5 ' +
    'disabled:opacity-40 disabled:pointer-events-none',
  secondary:
    'h-12 rounded-14 border-[1.5px] border-line-300 bg-surface-0 text-ink-900 ' +
    'text-[15px] font-semibold gap-2 px-4',
  danger:
    'h-11 rounded-12 border-[1.5px] border-danger-line bg-surface-0 text-danger ' +
    'text-[15px] font-semibold gap-2 px-4',
};

type ButtonOwnProps = {
  variant?: Variant;
  /** Shows a busy state and blocks input without changing the button's size. */
  loading?: boolean;
  className?: string;
  children?: ReactNode;
};

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  loading = false,
  className = '',
  children,
  ...rest
}: ButtonOwnProps & { as?: T } & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps | 'as'>) {
  const Component = (as ?? 'button') as ElementType;
  const press = usePressable('scale', {
    className: `flex w-full items-center justify-center ${VARIANTS[variant]} ${className}`,
  });
  return (
    <Component
      {...(Component === 'button' ? { type: 'button' } : {})}
      {...rest}
      {...press}
      {...(loading ? { 'aria-busy': true, disabled: true } : {})}
    >
      {children}
    </Component>
  );
}

/** 44x44 circle. Light: white with a line-200 border. Dark: overlay-72 with dark-line. */
export function IconButton({
  onDark = false,
  className = '',
  children,
  ...rest
}: ComponentPropsWithoutRef<'button'> & { onDark?: boolean }) {
  const press = usePressable('scale', {
    className: [
      'flex size-11 items-center justify-center rounded-pill border-[1.5px]',
      onDark
        ? 'border-dark-line bg-overlay-72 text-on-dark-100'
        : 'border-line-200 bg-surface-0 text-ink-900',
      className,
    ].join(' '),
  });
  return (
    <button type="button" {...rest} {...press}>
      {children}
    </button>
  );
}

/** 14-16/600 with a 3px underline offset and a 44px minimum height. */
export function TextLink<T extends ElementType = 'a'>({
  as,
  className = '',
  children,
  ...rest
}: { as?: T; className?: string; children?: ReactNode } & Omit<
  ComponentPropsWithoutRef<T>,
  'as' | 'className' | 'children'
>) {
  const Component = (as ?? 'a') as ElementType;
  return (
    <Component
      {...rest}
      className={`inline-flex min-h-11 items-center text-[15px] font-semibold underline underline-offset-[3px] ${className}`}
    >
      {children}
    </Component>
  );
}
