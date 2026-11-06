import { createContext, use, type ReactNode } from 'react';
import { isDemoMode } from './flags';
import * as fixtures from './fixtures';

/**
 * Demo mode — implementation.md §15 Phase 1 task 5.
 * `?demo=1` (and every test) feeds the screens the mockup data. Outside demo mode the
 * context is null and screens show their empty or loading state until Phase 3 wires the
 * real API, so fixture data can never leak into the product.
 */
export type DemoData = typeof fixtures;

const DemoContext = createContext<DemoData | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  return <DemoContext value={isDemoMode() ? fixtures : null}>{children}</DemoContext>;
}

export function useDemo(): DemoData | null {
  return use(DemoContext);
}
