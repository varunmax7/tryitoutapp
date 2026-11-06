import { useEffect, useState, type ReactNode } from 'react';
import { Dialog, Drawer } from '@base-ui/react';

/**
 * BottomSheet — implementation.md §12.4 and §12.8.6.
 *
 * Built on Base UI's Drawer (vaul says in its own repo that it is unmaintained, §8).
 * Radius 28 at the top, a 40x4 handle, and the `scrim` backdrop. Detents come from
 * `snapPoints`; drag, flick-to-dismiss and scroll hand-off are Base UI's own behaviour.
 *
 * At 1024px and up the same content opens as a centred dialog instead.
 */
function useIsDesktop(): boolean {
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

export type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Hide the title visually when the sheet draws its own header. */
  hideTitle?: boolean;
  description?: string;
  /** Fractions of the viewport height, or pixels (§12.8.6). */
  snapPoints?: (number | string)[];
  children: ReactNode;
};

export function BottomSheet({
  open,
  onOpenChange,
  title,
  hideTitle = false,
  description,
  snapPoints,
  children,
}: BottomSheetProps) {
  const desktop = useIsDesktop();

  if (desktop) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-scrim" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[min(480px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 rounded-24 bg-surface-0 p-5">
            <Dialog.Title className={hideTitle ? 'sr-only' : 'type-title-l m-0'}>
              {title}
            </Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-1 text-[14px] text-ink-700">
                {description}
              </Dialog.Description>
            ) : null}
            {children}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} {...(snapPoints ? { snapPoints } : {})}>
      <Drawer.Portal>
        {/* The backdrop fades with the drag progress, so the sheet feels attached to it. */}
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-scrim" />
        <Drawer.Popup className="fixed inset-x-0 bottom-0 z-50 flex max-h-[96dvh] flex-col rounded-t-28 bg-surface-0 pb-[env(safe-area-inset-bottom)]">
          {/* The whole popup is draggable in Base UI; the handle is the visual cue. */}
          <div className="flex justify-center pt-[10px] pb-1">
            <span aria-hidden="true" className="h-1 w-10 rounded-pill bg-line-300" />
          </div>
          <Drawer.Title className={hideTitle ? 'sr-only' : 'type-title-l m-0 px-5'}>
            {title}
          </Drawer.Title>
          {description ? (
            <Drawer.Description className="px-5 pt-1 text-[14px] text-ink-700">
              {description}
            </Drawer.Description>
          ) : null}
          {/* Base UI hands scrolling over to the sheet once this viewport is at the top. */}
          <Drawer.Viewport className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </Drawer.Viewport>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/**
 * Wraps the app so a full-height sheet can scale the page behind it, the way iOS card
 * sheets do. Lite mode skips the scale (§12.8.6, §12.8.9).
 */
export function SheetIndent({ children }: { children: ReactNode }) {
  return (
    <Drawer.Indent className="min-h-dvh [html[data-lite]_&]:!scale-100">{children}</Drawer.Indent>
  );
}

export { Drawer as SheetPrimitive };
