# Feel tests

Specs here run in the Playwright `feel` project (implementation.md §17.9): 390×844 at DSF 2
with real touch, animations **on**, and the CPU throttled 4× through CDP to stand in for a
mid-range Android.

They are written in Phase 1, alongside `docs/feel-review.md`. Each spec collects:

- `long-animation-frame` entries (Chromium only, which is why this project is Chromium-only)
- INP and CLS from `web-vitals` with `reportAllChanges`
- rAF frame gaps
- time from `pointerdown` to `[data-pressed]`
- each view transition's length

Budgets are in §17.6.
