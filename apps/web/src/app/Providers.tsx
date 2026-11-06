import { useEffect, type ReactNode } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { I18nextProvider } from 'react-i18next';
import { DemoProvider } from './demo';
import { ToastHost } from '@/ui/Toast';
import { i18n } from '@/i18n';
import { applyMotionPrefs, watchMotionPrefs } from '@/lib/motionPrefs';

/**
 * App-wide providers — implementation.md §12.8.2 and §12.8.9.
 *
 * Motion loads through LazyMotion with `domAnimation`; only 3.2 needs `domMax` for
 * layout animation, and it loads that itself. `reducedMotion="user"` makes every Motion
 * animation follow the OS setting.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyMotionPrefs();
    return watchMotionPrefs();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <DemoProvider>
            <ToastHost>{children}</ToastHost>
          </DemoProvider>
        </MotionConfig>
      </LazyMotion>
    </I18nextProvider>
  );
}
