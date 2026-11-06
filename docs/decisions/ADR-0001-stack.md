# ADR-0001: Stack and version pins

- **Status:** accepted
- **Date:** 2026-11-06
- **Phase:** 0 (Foundation)

## Context

implementation.md §1 and §8 lock the stack. This record pins the actual versions installed
at the start of the build and explains the two places where the newest release was not the
right choice.

## Decision

| Layer           | Pinned                                                                               | Note                                                |
| --------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------- |
| Package manager | pnpm 10.34.5 workspaces                                                              | `packageManager` field; CI uses `--frozen-lockfile` |
| Node            | 22 LTS in CI, `engines: >=22` locally                                                | `.nvmrc` holds 22                                   |
| TypeScript      | 6.0.3                                                                                | **not** 7.x: see below                              |
| Build           | Vite 8.3.6, `@vitejs/plugin-react` 6.2.1                                             | Rolldown-based                                      |
| UI              | React 19.3.1, React Router 8.5.1 (data router, lazy routes)                          |                                                     |
| Styling         | Tailwind CSS 4.3.4 via `@tailwindcss/vite`, tokens in `@theme`                       |                                                     |
| PWA             | vite-plugin-pwa 2.0.0 (Workbox 7)                                                    | manifest + app-shell precache                       |
| Validation      | Zod 4.6.7, shared through `@tryitout/shared`                                         |                                                     |
| Monitoring      | `@sentry/react` 11.11.0, `@sentry/deno` 11.11.0, `sentry-sdk` 2.x                    | see ADR-0003                                        |
| Tests           | Vitest 5.1.0, Playwright 1.65.0, pytest 8                                            |                                                     |
| Lint            | ESLint 10 flat config + typescript-eslint 8.72.1, Prettier 3.9.10, ruff, mypy strict |                                                     |
| Worker          | Python 3.11 in the Modal image and in CI                                             |                                                     |

### Why TypeScript 6, not 7

TypeScript 7.0.2 (the native port) is the current `latest`, but typescript-eslint 8.72.1
declares `typescript: >=4.8.4 <6.1.0`. Linting is a hard CI gate (§17.8), so the type
checker follows the linter. Revisit when typescript-eslint supports 7.x.

### Why Python 3.11 for the worker

Modal's image pins `python_version="3.11"` (§19 step 3) and CI matches it, so a test can
never pass on a version the worker does not run. A local `apps/worker/.venv` on a newer
interpreter is fine for the HTTP and auth tests; anything touching the model stack must be
verified on 3.11.

## Consequences

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm e2e` and
  `pnpm licenses:check` all run in CI on every pull request.
- Version bumps for TypeScript and typescript-eslint move together.
- App icons ship as a placeholder SVG AppMark until Phase 1 exports the PNG set from the
  real `AppMark` component (§12.4).
