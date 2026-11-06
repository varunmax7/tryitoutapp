// Pinned: Edge Functions resolve npm specifiers at deploy time, so the version is
// fixed here rather than in a lockfile.
import * as Sentry from 'npm:@sentry/deno@11.10.0';

/**
 * Error monitoring for Edge Functions — implementation.md §15 Phase 0 task 8.
 * Same privacy rules as the web client: no PII, no bodies, no query strings, 20% traces.
 */
const ID_SEGMENT =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[A-Za-z0-9_-]{16,})$/;

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

let started = false;

export function initSentry(): void {
  if (started) return;
  const dsn = Deno.env.get('SENTRY_DSN');
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: Deno.env.get('APP_ENV') ?? 'local',
    tracesSampleRate: 0.2,
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
    beforeSend(event) {
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
      return event;
    },
  });
  started = true;
}

export { Sentry };
