import { useEffect, useState } from 'react';

/**
 * Desktop breakpoint — implementation.md §12.7: at 1024px and up, /sizes and
 * /try/studio get their own layouts beside the Sidebar.
 */
export function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(
    () => typeof matchMedia === 'function' && matchMedia('(min-width: 1024px)').matches,
  );
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const query = matchMedia('(min-width: 1024px)');
    const onChange = () => setDesktop(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return desktop;
}
