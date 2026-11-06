# ADR-0003: Sentry privacy configuration

- **Status:** accepted
- **Date:** 2026-11-06
- **Phase:** 0 (Foundation)

## Context

implementation.md §15 Phase 0 task 8 asks for Sentry on web, Edge Functions and worker with
`sendDefaultPii: false`, session replay off, query strings and request bodies stripped in
`beforeSend`, and 20% trace sampling.

Sentry's JavaScript SDK 11 replaced the single `sendDefaultPii` switch with a
`dataCollection` object that configures each category separately. The Python SDK still has
`send_default_pii`.

## Decision

Every SDK is configured to the strictest reading of the plan.

**Web (`apps/web/src/lib/sentry.ts`) and Edge Functions (`supabase/functions/_shared/sentry.ts`):**

```
dataCollection: {
  userInfo: false, cookies: false, httpHeaders: false, httpBodies: [],
  urlQueryParams: false, stackFrameVariables: false,
  databaseQueryData: false, queues: false,
}
```

plus `tracesSampleRate: 0.2`, no `replayIntegration`, and a `beforeSend` that deletes the
query string, request body, cookies and headers, reduces `user` to an id, and rewrites
id-shaped URL segments to `:id`.

**Worker (`apps/worker/tryitout_worker/common/sentry.py`):** `send_default_pii=False`,
`max_request_body_size="never"`, `traces_sample_rate=0.2`, and the same scrubbing.

`stackFrameVariables: false` goes beyond the plan on purpose: a local variable in the scan
path could hold image bytes or a measurement, and AGENTS.md rule 2 says body photos never
reach Sentry.

## Consequences

- Breadcrumb and URL redaction is unit-tested on both sides
  (`apps/web/src/lib/sentry.test.ts`, `apps/worker/tests/test_sentry.py`), so a future
  change that leaks a token fails CI.
- Errors arrive without an IP address or user agent. That is the intended trade: a
  slightly thinner report in exchange for a promise we can keep.
- Session replay stays off for the life of the product unless an ADR supersedes this one.
