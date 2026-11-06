import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatches, useNavigate } from 'react-router';
import { BottomNav } from '@/ui/Nav';
import { SheetIndent } from '@/ui/BottomSheet';
import { tabRootFor, useTabStore } from './tabs';
import { useIsDesktop } from './useIsDesktop';

/**
 * App shell — implementation.md §12.8.3.
 *
 * The document scrolls, not an inner div, which is what keeps Safari's toolbar collapse,
 * tap-the-status-bar-to-top, find in page and the browser's fastest scroll path. The bars
 * are sticky or fixed on top of it.
 */
export type RouteChrome = {
  /** `tabs` shows the BottomNav; `fullscreen` locks the page for the camera and 3D. */
  chrome?: 'tabs' | 'plain' | 'fullscreen';
  /** Colour of the top edge, used for `theme-color` and the overscroll colour. */
  theme?: 'light' | 'dark' | 'ink';
};

// The only place these values may be written outside tokens.css: the theme-color meta
// tag takes a literal, and 1.1's hero, the camera and the app background differ (§12.8.3).
const THEME_COLOR = {
  light: 'var(--color-surface-50)',
  dark: 'var(--color-dark-900)',
  ink: 'var(--color-ink-900)',
} as const;

function useRouteChrome(): Required<RouteChrome> {
  const matches = useMatches();
  const handle = [...matches]
    .reverse()
    .map((match) => match.handle as RouteChrome | undefined)
    .find((value) => value?.chrome != null || value?.theme != null);
  return { chrome: handle?.chrome ?? 'plain', theme: handle?.theme ?? 'light' };
}

export function RootLayout() {
  const { chrome, theme } = useRouteChrome();
  // At 1024px and up the Sidebar replaces the BottomNav (§12.7).
  const desktop = useIsDesktop();
  const tabs = chrome === 'tabs' && !desktop;
  const location = useLocation();
  const navigate = useNavigate();
  const remember = useTabStore((state) => state.remember);

  // The bounce must never show the wrong colour, and the installed app's status bar
  // follows the top edge of the screen (§12.8.3).
  useEffect(() => {
    const root = document.documentElement;
    root.style.background = THEME_COLOR[theme];
    // theme-color needs a literal colour, so read the resolved token back out.
    const resolved = getComputedStyle(root).backgroundColor;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved);
  }, [theme]);

  // A full-screen surface scrolls on its own, with no bounce over the viewfinder.
  useEffect(() => {
    const full = chrome === 'fullscreen';
    document.documentElement.toggleAttribute('data-fullscreen', full);
    document.body.style.overflow = full ? 'hidden' : '';
    document.body.style.overscrollBehavior = full ? 'none' : '';
    return () => {
      document.documentElement.removeAttribute('data-fullscreen');
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [chrome]);

  // Remember where each tab was left, so switching back returns to the same screen.
  useEffect(() => {
    const tab = tabRootFor(location.pathname);
    if (tab) remember(tab, location.pathname + location.search);
  }, [location.pathname, location.search, remember]);

  const onTabPress = (tab: string, active: boolean) => {
    if (!active) {
      // Opening another tab resumes where that tab was left (§12.8.3).
      const { lastPath } = useTabStore.getState();
      const remembered = lastPath[tab as keyof typeof lastPath];
      if (remembered && remembered !== location.pathname)
        void navigate(remembered, { replace: true });
      return;
    }
    // The iOS convention: tapping the active tab pops to its root, then scrolls to top.
    if (location.pathname !== tab) {
      void navigate(tab, { replace: true });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SheetIndent>
      <ScrollRestoration
        getKey={(loc) =>
          // Tab roots restore by path; everything else per history entry (§12.8.3).
          tabRootFor(loc.pathname) ? loc.pathname : loc.key
        }
      />
      <div
        data-chrome={chrome}
        {...(theme === 'light' ? {} : { 'data-on-dark': '' })}
        className={
          chrome === 'fullscreen' ? 'h-dvh overflow-hidden bg-dark-900' : 'min-h-dvh bg-surface-50'
        }
        style={
          chrome === 'tabs'
            ? { paddingBottom: 'calc(74px + env(safe-area-inset-bottom))' }
            : undefined
        }
      >
        <Outlet />
      </div>
      {tabs ? <BottomNav onTabPress={onTabPress} /> : null}
    </SheetIndent>
  );
}
