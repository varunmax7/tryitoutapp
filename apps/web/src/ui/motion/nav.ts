import { useNavigate, type To } from 'react-router';

/**
 * Navigation transitions — implementation.md §12.8.5.
 *
 * Every forward navigation goes through `useNav`, which stamps `html[data-nav]` so the CSS
 * in motion.css picks the right view transition, then navigates with React Router's
 * `viewTransition` option. Back, tab switches, covers and reduced motion each get their
 * own treatment, and a system back swipe gets none at all.
 *
 * This module registers its `popstate` listener on import, which must happen before the
 * router is created, so it runs before React Router's own listener. `router.tsx` imports
 * it first for that reason.
 */
export type NavKind = 'push' | 'back' | 'tab' | 'cover' | 'uncover' | 'ua' | 'fade' | 'desk';

const root = document.documentElement;

/** How the screen now on screen was opened. Lives in history state, so it survives back. */
let enteredBy: NavKind = 'push';

const calm = (): boolean =>
  root.hasAttribute('data-lite') ||
  root.dataset.motion === 'reduce' ||
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export function mark(nav: NavKind): void {
  root.dataset.nav =
    nav === 'ua'
      ? 'ua'
      : calm()
        ? 'fade'
        : matchMedia('(min-width: 1024px)').matches
          ? 'desk'
          : nav;
}

// 1. Back and forward.
window.addEventListener('popstate', (event) => {
  const uaAnimated = (event as PopStateEvent & { hasUAVisualTransition?: boolean })
    .hasUAVisualTransition;
  // Safari 18+ and Chrome 118+ set this after an edge-swipe back. Without the check,
  // iPhone users see the page animate twice (§12.8.5).
  mark(uaAnimated ? 'ua' : enteredBy === 'cover' ? 'uncover' : 'back');
});

type RouterLike = {
  subscribe(callback: (state: { location: { state: unknown } }) => void): unknown;
};

// 2. Remember how each screen was opened.
export function trackNav(router: RouterLike): void {
  router.subscribe(({ location }) => {
    enteredBy = (location.state as { nav?: NavKind } | null)?.nav ?? 'push';
  });
}

// 3. Every forward navigation goes through this hook.
export function useNav() {
  const navigate = useNavigate();
  return (to: To, nav: 'push' | 'tab' | 'cover' = 'push') => {
    mark(nav);
    void navigate(to, {
      viewTransition: !root.hasAttribute('data-still'),
      replace: nav === 'tab',
      state: { nav },
    });
  };
}
