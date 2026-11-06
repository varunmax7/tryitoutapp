import { useEffect, useRef, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { usePressable } from './motion/usePressable';
import { isOn } from '@/app/flags';
import { IconArrowLeft, IconTape, IconCube, IconStore, IconPerson } from './icons';

/**
 * TopBar — implementation.md §12.4 and §12.8.3.
 * Sticky and transparent at rest, so the resting layout still equals the PNG; the
 * material and hairline fade in only once content scrolls under it.
 */
export function TopBar({
  onBack,
  backTo,
  title,
  action,
  variant = 'title',
}: {
  onBack?: () => void;
  backTo?: string;
  title?: ReactNode;
  action?: ReactNode;
  /** "title" is 17/600 centred; "step" is the 14/600 step counter. */
  variant?: 'title' | 'step';
}) {
  const press = usePressable('scale', {
    className: 'flex size-11 items-center justify-center rounded-12',
  });
  return (
    <div className="sticky top-0 z-20 flex h-[52px] shrink-0 items-center justify-between px-3 pt-2">
      {backTo ? (
        <Link to={backTo} viewTransition aria-label="Back" {...press}>
          <IconArrowLeft size={22} />
        </Link>
      ) : onBack ? (
        <button type="button" aria-label="Back" onClick={onBack} {...press}>
          <IconArrowLeft size={22} />
        </button>
      ) : (
        <span aria-hidden="true" className="size-11" />
      )}
      {variant === 'step' ? (
        <span className="text-[14px] font-semibold text-ink-700">{title}</span>
      ) : (
        <h1 className="m-0 type-body-strong font-sans">{title}</h1>
      )}
      {action ?? <span aria-hidden="true" className="size-11" />}
    </div>
  );
}

/**
 * The compact bar that fades in as a large title scrolls away (§12.8.3).
 * Scroll-driven CSS does the work where it exists; elsewhere an IntersectionObserver on
 * the title sets `data-scrolled`.
 */
function useCompactBar(titleRef: React.RefObject<HTMLElement | null>) {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supportsScrollTimeline =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: scroll()');
    const reduced =
      document.documentElement.dataset.motion === 'reduce' ||
      (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Attach the observer only where the CSS cannot do it.
    if (supportsScrollTimeline && !reduced) return;

    const title = titleRef.current;
    const bar = barRef.current;
    if (!title || !bar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) bar.toggleAttribute('data-scrolled', !entry.isIntersecting);
      },
      { rootMargin: '-52px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(title);
    return () => observer.disconnect();
  }, [titleRef]);

  return barRef;
}

/**
 * LargeTitleHeader — implementation.md §12.4.
 * At rest it is exactly the designed greeting, title and action. The compact bar takes no
 * layout space and ignores taps, so it can never shift the design.
 */
export function LargeTitleHeader({
  greeting,
  title,
  action,
}: {
  greeting?: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const barRef = useCompactBar(titleRef);

  return (
    <>
      <div ref={barRef} className="compact-bar">
        <div className="compact-bar__title flex h-[52px] items-center justify-center">
          <span className="type-body-strong">{title}</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col gap-[2px]">
          {greeting ? <span className="text-[14px] text-ink-500">{greeting}</span> : null}
          <h1 ref={titleRef} className="m-0 type-display-m">
            {title}
          </h1>
        </div>
        {action}
      </div>
    </>
  );
}

type TabKey = 'sizes' | 'try' | 'store' | 'me';

const TABS: { key: TabKey; to: string; label: string; Icon: typeof IconTape }[] = [
  { key: 'sizes', to: '/sizes', label: 'Sizes', Icon: IconTape },
  { key: 'try', to: '/try', label: 'Try on', Icon: IconCube },
  { key: 'store', to: '/store', label: 'Store', Icon: IconStore },
  { key: 'me', to: '/me', label: 'Me', Icon: IconPerson },
];

/**
 * BottomNav — implementation.md §12.4. Height 74, fixed, with the safe area below it.
 * It stays put while content moves (§12.8.5), hence its own view-transition name.
 */
export function BottomNav({ onTabPress }: { onTabPress?: (tab: TabKey, active: boolean) => void }) {
  // The Store tab is V2; in V1 the grid is still four columns wide by design.
  const tabs = TABS.filter((tab) => tab.key !== 'store' || isOn('storeMode'));
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 grid h-[74px] border-t border-line-200 bg-surface-0 px-2 pt-[6px] pb-[10px]"
      style={{
        gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
        height: 'calc(74px + env(safe-area-inset-bottom))',
        viewTransitionName: 'tabbar',
      }}
    >
      {tabs.map(({ key, to, label, Icon }) => (
        <NavLink
          key={key}
          to={to}
          viewTransition
          replace
          className="flex flex-col items-center justify-center gap-[3px] text-[12px] no-underline"
          onClick={(event) => {
            const active = event.currentTarget.getAttribute('aria-current') === 'page';
            onTabPress?.(key, active);
          }}
        >
          {({ isActive }) => (
            <>
              <Icon size={24} className={isActive ? 'text-ink-900' : 'text-ink-500'} />
              <span
                className={isActive ? 'font-semibold text-ink-900' : 'font-medium text-ink-500'}
              >
                {label}
              </span>
              <span
                aria-hidden="true"
                className={`h-[3px] w-[18px] rounded-[2px] ${isActive ? 'bg-marigold-500' : ''}`}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export type SidebarItem = { to: string; label: string; icon: ReactNode; count?: number };

/** Sidebar (desktop) — width 240, ink-900, active item dark-700 with a marigold bar. */
export function Sidebar({ items, footer }: { items: SidebarItem[]; footer?: ReactNode }) {
  return (
    <aside
      data-on-dark
      className="flex w-60 shrink-0 flex-col justify-between bg-ink-900 px-4 py-6 text-on-dark-300"
      style={{ viewTransitionName: 'sidebar' }}
    >
      <div className="flex flex-col gap-6">
        <div className="px-2">
          <span className="type-title-l text-surface-0">Tryitout</span>
        </div>
        <nav aria-label="Sections" className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              viewTransition
              className="relative flex h-11 items-center gap-3 rounded-12 px-3 text-[15px] no-underline"
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-2 bottom-2 left-0 w-[3px] rounded-[2px] bg-marigold-500"
                    />
                  ) : null}
                  <span className={isActive ? 'text-marigold-500' : 'text-on-dark-500'}>
                    {item.icon}
                  </span>
                  <span className={isActive ? 'font-semibold text-surface-0' : 'text-on-dark-300'}>
                    {item.label}
                  </span>
                  {item.count != null ? (
                    <span className="type-numeral ml-auto rounded-pill bg-marigold-500 px-2 text-[12px] text-ink-900">
                      {item.count}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      {footer}
    </aside>
  );
}

/** Avatar — 58px, selected gets a 3px marigold ring; the initial uses a fit-chip palette. */
export function Avatar({
  initial,
  selected = false,
  tone = 'great',
  label,
}: {
  initial: string;
  selected?: boolean;
  tone?: 'great' | 'good' | 'loose' | 'tight';
  label: string;
}) {
  const tones = {
    great: 'bg-fit-great-bg text-fit-great-fg',
    good: 'bg-fit-good-bg text-fit-good-fg',
    loose: 'bg-fit-loose-bg text-fit-loose-fg',
    tight: 'bg-fit-tight-bg text-fit-tight-fg',
  } as const;
  return (
    <span
      aria-label={label}
      role="img"
      className={`flex size-[58px] items-center justify-center rounded-pill font-display text-[20px] font-bold ${tones[tone]} ${
        selected ? 'ring-[3px] ring-marigold-500' : ''
      }`}
    >
      {initial}
    </span>
  );
}
