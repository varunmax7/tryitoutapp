# AGENTS.md — Tryitout

## Product
Tryitout tells Indian shoppers their real size in every brand and shows the fit on their own body,
using real measurements and physics. V1 = 6 features (implementation.md §2). Brand name: Tryitout.

## Read first
- implementation.md — the plan. Work only on the current phase listed in docs/progress.md.
- design/README.md and design/screens/*.png — the UI source of truth. design/reference/*.html has exact CSS and copy.

## Hard rules
1. Fit comes from centimetres (size engine + cloth simulation). Never use generative image/video models to decide or show fit.
2. Body photos are processed in memory only. Never write them to disk, Storage, R2, logs, Sentry or analytics.
3. Only dependencies and models whose licence allows commercial use. Never SMPL/SMPL-X or research-only checkpoints. Run `pnpm licenses:check` before adding anything.
4. No scraping of shopping sites. The share-check parser reads URLs only; HEAD redirects are allowed for short links. Size charts come from curated CSVs.
5. UI must match design/screens. Use tokens from apps/web/src/styles/tokens.css. No raw hex values in components. No emoji in the UI.
6. Accessibility: 44 px touch targets, labelled controls, WCAG AA contrast, visible focus.
7. Privacy: V1 is 18+ only. Consent before any measurement. "Delete everything" removes all user rows and files.
8. Security: RLS on every table, zod validation on every input; the service-role key and R2 keys never reach the client.
   Every change goes through staging before production.
9. Sample data from the mockups (Aarav, 98 cm, "88% sure") is only for fixtures and tests.
10. Ask the human before: adding a dependency, changing a public API contract, editing CI/deploy config, or changing anything in implementation.md.
11. Feel (implementation.md §12.8): native scrolling only (no scroll-jacking, no smooth-scroll libraries, no touchmove
    preventDefault in scrollers). Animate only transform and opacity. Use styles/motion.css tokens and src/ui/motion/presets.ts
    springs, never inline durations or curves. Every animation has a reduced-motion version. Navigation never waits for the
    network. Screens at rest still match design/screens.

## Stack
pnpm monorepo. apps/web: React 19 + Vite + TypeScript + Tailwind v4 + three.js + MediaPipe Tasks Vision (PWA).
apps/worker: Modal, Python 3.11 (SAM 3D Body/MHR, SAM 2, SigLIP 2, GarmentCode + Warp).
packages: sizing, urlparse, anny-lite, shared. supabase: migrations, functions (Deno), seed.

## Commands
pnpm i | pnpm dev | pnpm test | pnpm e2e | pnpm e2e:visual | pnpm e2e:feel | pnpm lint | pnpm typecheck | pnpm licenses:check
supabase start | supabase db reset | supabase functions serve | supabase test db
cd apps/worker && modal serve tryitout_worker/app.py | pytest

## Definition of done (every task)
- typecheck, lint and unit tests pass; new logic has tests
- changed screens pass their visual test against design/screens
- changed interactions follow §12.8 and pass pnpm e2e:feel; checked once with reduced motion on
- no console errors; axe shows no serious accessibility issues on changed routes
- docs/progress.md updated; an ADR in docs/decisions for any decision that changes the plan

## Conventions
Conventional Commits. Branch per phase: phase/NN-name. Small PRs. Feature flags for unfinished or V2 surfaces.
