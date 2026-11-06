import { useState } from 'react';
import { sendSentryTestError } from '@/lib/sentry';

/**
 * Dev-only. Proves the Sentry pipeline for the web app, which is a Phase 0 acceptance
 * criterion: the event must arrive with no personal data attached.
 */
export default function SentryTestRoute() {
  const [sent, setSent] = useState(false);

  return (
    <main
      data-screen-stub="dev-sentry"
      className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col gap-4 px-6 py-10"
    >
      <h1 className="font-display text-[28px] leading-[1.15] font-bold tracking-[-0.02em]">
        Sentry check
      </h1>
      <p className="text-[15px] text-ink-700">
        Sends one captured error with the scrubbing in lib/sentry.ts applied. Needs VITE_SENTRY_DSN
        to be set.
      </p>
      <button
        type="button"
        className="h-[54px] rounded-16 bg-ink-900 px-6 text-[17px] font-semibold text-surface-0"
        onClick={() => {
          sendSentryTestError();
          setSent(true);
        }}
      >
        Send a test error
      </button>
      {sent ? (
        <p className="text-[14px] text-ink-700">Sent. Check the Sentry web project.</p>
      ) : null}
    </main>
  );
}
