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
