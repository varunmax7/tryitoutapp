# ADR-0005: The visual tests run on macOS

- **Status:** accepted
- **Date:** 2026-11-06
- **Phase:** 1 (Design system and app shell)

## Context

§17.4 makes the PNGs in `design/screens` the visual baselines and sets the gate at
`maxDiffPixelRatio: 0.02`, tightening to 0.01 by Phase 11.

The first CI run of the finished screens failed almost all of them, with a striking
pattern:

| Screen               | macOS | Linux (ubuntu-latest) |
| -------------------- | ----- | --------------------- |
| 1.1 Welcome          | 0.19% | 2.61%                 |
| 1.4 My sizes         | 1.10% | 2.74%                 |
| 1.5 Brand fit detail | 1.24% | 2.45%                 |
| 2.1 Try it on        | 1.24% | 2.75%                 |
| 3.2 Did it fit?      | 0.74% | 2.69%                 |
| 3.3 Store mode       | 0.40% | 2.25%                 |
| 3.4 Me               | 1.61% | 3.05%                 |

The same commit, the same self-hosted WOFF2 files, the same Chromium version: every
screen gains between 1.4 and 2.4 percentage points on Linux. The cause is glyph
rasterisation. macOS and Linux hint and snap stems differently, so text pixels land a
subpixel — sometimes a whole pixel — apart. pixelmatch's `includeAA` already discards
genuinely anti-aliased pixels; what is left is real positional difference in the glyph
stems, which no comparison setting can separate from a real one-pixel layout error.

The design pack was rendered with macOS text rasterisation, which is why the numbers on a
developer's Mac are small and the numbers on a Linux runner are not.

Three options were considered:

1. **Raise the threshold in CI.** Rejected: a gate loose enough to absorb 3% would no
   longer catch the kind of error it exists to catch. 1.1 drifted by 1.9% before ADR-0004
   fixed it, and that was a real, compounding layout bug.
2. **Blur or downsample before comparing.** Workable, but it changes what the gate means,
   and it would have hidden the ADR-0004 bug too.
3. **Compare on the platform the baselines came from.**

## Decision

The visual tests run in their own CI job on `macos-latest`. Everything else — unit,
routes, accessibility, feel, the worker and the Edge Functions — stays on Linux.

- `pnpm e2e:visual` runs the pixel comparison; the Linux job runs `pnpm e2e:functional`,
  which is everything except `@visual`.
- The repository is public, so macOS runner minutes are free. If it is ever made private,
  this decision needs revisiting: either pay for the minutes, or re-render the baselines
  on Linux and keep both sets.
- The threshold stays at 0.02, going to 0.01 in Phase 11, exactly as §17.4 says.

## Consequences

- A developer on macOS sees the same numbers CI does, which is the point.
- A developer on Linux or Windows will see every screen roughly 2 points worse and should
  not chase it; `docs/feel-review.md` and this ADR are where that is written down.
- If the design pack is ever re-exported, note the platform it was rendered on.
