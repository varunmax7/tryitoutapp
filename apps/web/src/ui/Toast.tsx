import { Toast as BaseToast } from '@base-ui/react';
import type { ReactNode } from 'react';

/**
 * Toast — implementation.md §12.4 and §12.8.6.
 * ink-900, white 14/600, radius 14, sitting above the BottomNav. Slides up, swipe to
 * dismiss, four seconds, with an optional Undo — "Undo, not confirm" (§12.8.7).
 */
export const toastManager = BaseToast.createToastManager();

const TOAST_MS = 4000;

export function showToast(message: string, action?: { label: string; onClick: () => void }) {
  toastManager.add({
    title: message,
    timeout: TOAST_MS,
    ...(action ? { actionProps: { children: action.label, onClick: action.onClick } } : {}),
  });
}

export function ToastHost({ children }: { children: ReactNode }) {
  return (
    <BaseToast.Provider toastManager={toastManager}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          className="fixed inset-x-4 z-40 flex flex-col gap-2"
          style={{ bottom: 'calc(86px + env(safe-area-inset-bottom))' }}
        >
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return (
    <>
      {toasts.map((toast) => (
        <BaseToast.Root
          key={toast.id}
          toast={toast}
          className="flex items-center gap-3 rounded-14 bg-ink-900 px-4 py-3 text-[14px] font-semibold text-surface-0"
        >
          <BaseToast.Title className="min-w-0 flex-1" />
          <BaseToast.Action className="shrink-0 text-marigold-500 underline underline-offset-[3px]" />
          <BaseToast.Close aria-label="Dismiss" className="sr-only" />
        </BaseToast.Root>
      ))}
    </>
  );
}
