# Tryitout

Your real size in every brand, and a fit check on your own body before you buy.

- **The plan:** [`implementation.md`](implementation.md). Work one phase at a time from §15.
- **The current phase:** [`docs/progress.md`](docs/progress.md).
- **The UI source of truth:** [`design/README.md`](design/README.md) —
  `design/screens/*.png` and `design/reference/*.html`.
- **Rules for every change:** [`AGENTS.md`](AGENTS.md).

## Setup

```bash
pnpm install                     # Node 22 or newer
pnpm fonts:fetch                 # only when the type stack changes; the WOFF2 files are committed
cp .env.example .env.local       # then fill in your own project values
pnpm dev                         # http://localhost:5173
```

The Python worker is separate from the pnpm workspace:

```bash
cd apps/worker
python3 -m venv .venv && ./.venv/bin/pip install -r requirements-dev.txt
./.venv/bin/python -m pytest -q
```

The local Supabase stack needs Docker running:

```bash
pnpm supabase start
pnpm supabase db reset
```

## Checks

| Command               | What it covers                                                                    |
| --------------------- | --------------------------------------------------------------------------------- |
| `pnpm lint`           | ESLint + Prettier, including the no-raw-hex, no-inline-motion and no-emoji guards |
| `pnpm typecheck`      | TypeScript strict across the workspace                                            |
| `pnpm test`           | Vitest unit tests                                                                 |
| `pnpm build`          | Production build of the PWA                                                       |
| `pnpm e2e`            | Playwright flows on the `phone` and `desktop` projects                            |
| `pnpm e2e:visual`     | Routes compared against `design/screens`                                          |
| `pnpm e2e:feel`       | Scrolling, motion and responsiveness (§17.9)                                      |
| `pnpm licenses:check` | Every dependency allows commercial use                                            |

CI runs all of them on every pull request.

## Non-negotiables

Fit comes from centimetres and physics, never from generative images. Body photos are
processed in memory and never stored. Nothing with a non-commercial licence ships. No
scraping of shopping sites. The UI matches the design pack and uses tokens, never raw hex.
