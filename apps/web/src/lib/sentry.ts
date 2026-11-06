import * as Sentry from '@sentry/react';

/**
 * Error monitoring — implementation.md §15 Phase 0 task 8.
 *
 * Privacy rules that must not be relaxed (§13, AGENTS.md rule 2):
 *   - no default PII: no user info, cookies, headers, bodies or query params
 *   - session replay off, so a body photo can never reach a replay frame
 *   - query strings and request bodies stripped, because share links and pasted product
 *     URLs travel in them
 *   - id-shaped path segments redacted, so vote tokens and purchase ids stay out of events
 *   - 20% trace sampling
 */

const DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.VITE_APP_ENV ?? 'local';

const ID_SEGMENT =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[A-Za-z0-9_-]{16,})$/;

/** Drops the query and fragment and replaces id-shaped path segments with `:id`. */
export function redactUrl(raw: string): string {
  try {
    const url = new URL(raw, 'https://tryitout.local');
    const path = url.pathname
      .split('/')
      .map((segment) => (ID_SEGMENT.test(segment) ? ':id' : segment))
      .join('/');
    return raw.startsWith('http') ? `${url.origin}${path}` : path;
  } catch {
    return '[redacted]';
  }
}

function scrub(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  if (event.request) {
    delete event.request.query_string;
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    if (event.request.url) event.request.url = redactUrl(event.request.url);
  }
  if (event.user) {
    const { id } = event.user;
    event.user = id == null ? {} : { id };
  }
  for (const crumb of event.breadcrumbs ?? []) {
    if (typeof crumb.data?.url === 'string') crumb.data.url = redactUrl(crumb.data.url);
    delete crumb.data?.body;
  }
  return event;
}

export function initSentry(): void {
  // Local dev and tests run without a DSN; Sentry stays a no-op there.
  if (!DSN) return;

  Sentry.init({
    dsn: DSN,
    environment: ENVIRONMENT,
    release: __APP_VERSION__,
    // Sentry 11 replaced `sendDefaultPii: false` with explicit per-category switches.
    // Everything that could carry a measurement, a share link or a body photo is off
    // (docs/decisions/ADR-0003-sentry-data-collection.md).
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
      databaseQueryData: false,
      queues: false,
    },
    tracesSampleRate: 0.2,
    // Deliberately no replayIntegration: see the privacy rules above.
    integrations: [Sentry.browserTracingIntegration()],
    beforeSend: scrub,
  });
}

/** Used once per environment to prove the pipeline works (Phase 0 acceptance). */
export function sendSentryTestError(): void {
  Sentry.captureException(new Error('Tryitout Sentry test error (web)'));
}
