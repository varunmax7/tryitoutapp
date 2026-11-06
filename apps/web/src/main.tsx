import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { initSentry } from '@/lib/sentry';
import { applyMotionPrefs } from '@/lib/motionPrefs';
import { Providers } from '@/app/Providers';
import { router } from '@/app/router';
import '@/styles/globals.css';

initSentry();
// Before the first render, so no screen ever paints with the wrong motion settings.
applyMotionPrefs();

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

createRoot(container).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
