// nav.ts registers its popstate listener on import, which must happen before the router
// is created so it runs before React Router's own listener (§12.8.5).
import { trackNav } from '@/ui/motion/nav';
import { createBrowserRouter } from 'react-router';
import { appRoutes, devRoutes, notFoundRoute } from './routes';
import { RootLayout } from './RootLayout';
import { HydrateFallback } from './HydrateFallback';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    HydrateFallback,
    children: [...appRoutes, ...devRoutes, notFoundRoute],
  },
]);

trackNav(router);
