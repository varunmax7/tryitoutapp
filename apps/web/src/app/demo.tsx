import { createContext, use, type ReactNode } from 'react';
import { isDemoMode } from './flags';
import * as fixtures from './fixtures';

/** Build-time constant, so the fixtures module is dropped from production builds. */
const DEMO_BUILD = import.meta.env.VITE_APP_ENV !== 'production';

/**
 * Demo mode — implementation.md §15 Phase 1 task 5.
 * `?demo=1` (and every test) feeds the screens the mockup data. Outside demo mode the
 * context is null and screens show their empty or loading state until Phase 3 wires the
 * real API.
 *
 * In a production build (`VITE_APP_ENV=production`) the whole module is compiled out:
 * `?demo=1` does nothing and the fixtures are not in the bundle at all. AGENTS.md rule 9
 * says Aarav, 98 cm and "88% sure" are fixtures, never something a real user is shown.
 */
export type DemoData = typeof fixtures;

const DemoContext = createContext<DemoData | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  return <DemoContext value={DEMO_BUILD && isDemoMode() ? fixtures : null}>{children}</DemoContext>;
}

export function useDemo(): DemoData | null {
  return use(DemoContext);
}
