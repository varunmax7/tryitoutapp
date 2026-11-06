/**
 * Phase 0 placeholder. Every route in implementation.md §12.5 and §12.6 resolves to one of
 * these so the shell, the router and the visual-test harness have something to point at.
 * Phase 1 replaces each stub with the real screen built against design/screens.
 */
export type ScreenStubProps = {
  /** Design-pack id, e.g. "1.4-my-sizes", or an N-id from §12.6. */
  id: string;
  title: string;
  /** Which release ships it, so the stub says what it is waiting for. */
  ships: 'V1' | 'V2';
  note?: string;
};

export function ScreenStub({ id, title, ships, note }: ScreenStubProps) {
  return (
    <main
      data-screen-stub={id}
      className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col gap-4 px-6 py-10"
    >
      <p className="font-mono text-[12px] font-semibold tracking-[0.06em] text-ink-500 uppercase">
        {id} · {ships}
      </p>
      <h1 className="font-display text-[28px] leading-[1.15] font-bold tracking-[-0.02em]">
        {title}
      </h1>
      <p className="text-[15px] text-ink-700">
        {note ?? 'Stub. The built screen arrives in Phase 1, matched against the design pack.'}
      </p>
      <div className="mt-2 rounded-18 border border-line-200 bg-surface-0 p-4">
        <p className="text-[13px] text-ink-500">
          Reference: <span className="font-mono">design/screens/{id}.png</span>
        </p>
      </div>
    </main>
  );
}
