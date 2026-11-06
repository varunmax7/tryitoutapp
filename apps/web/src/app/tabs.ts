import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Tab memory — implementation.md §12.8.3 "Position memory".
 *
 * Tapping another tab opens that tab's last screen. Tapping the current tab pops back to
 * its root; tapping it again at the root scrolls to the top. Kept in session storage, so
 * it survives a reload but not a new session.
 */
export const TAB_ROOTS = ['/sizes', '/try', '/store', '/me'] as const;
export type TabRoot = (typeof TAB_ROOTS)[number];

export function tabRootFor(pathname: string): TabRoot | null {
  return TAB_ROOTS.find((root) => pathname === root || pathname.startsWith(`${root}/`)) ?? null;
}

type TabState = {
  /** The last path visited inside each tab. */
  lastPath: Partial<Record<TabRoot, string>>;
  remember: (tab: TabRoot, path: string) => void;
};

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      lastPath: {},
      remember: (tab, path) => set((state) => ({ lastPath: { ...state.lastPath, [tab]: path } })),
    }),
    {
      name: 'tryitout.tabs',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
