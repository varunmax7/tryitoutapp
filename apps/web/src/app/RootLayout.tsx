import { Outlet } from 'react-router';

/**
 * Phase 0 shell. The mobile BottomNav layout and the desktop Sidebar layout arrive in
 * Phase 1 task 2 (§15); until then every route renders on its own.
 */
export function RootLayout() {
  return <Outlet />;
}
