# ADR-0004: Line height comes from the reference HTML, not from §12.3

- **Status:** accepted
- **Date:** 2026-11-06
- **Phase:** 1 (Design system and app shell)

## Context

The first visual test of 1.1 Welcome missed its PNG by 1.9% — just inside the 2% gate but
drifting further down the screen, which is the signature of accumulating height errors.

Two causes, both line height:

1. **Tailwind's preflight sets `line-height: 1.5` on `html`.** The design pack inherits
   nothing: `design/reference/*.html` sets `body{margin:0}` and no line height at all, so
   every element without an explicit value uses the font's own metrics. Inheriting 1.5
   made each text block taller than designed, and the error compounded down the page.

2. **§12.3's table lists a line height for tokens the reference leaves unset.** For
   example it gives `title-l` as 22/1.2, but the reference HTML's `h2` on 1.1 sets only
   font, size, weight and tracking.

§12.1 settles this: "When a PNG and this section disagree, the reference HTML wins."

## Decision

- `globals.css` sets `line-height: normal` on `body`, overriding preflight.
- The display and title utilities in `typography.css` set `line-height: normal`.
  `type-display-hero` keeps 1.02, which the reference does specify.
- Each usage adds an explicit `leading-[…]` wherever the reference sets one — 1.5 on
  1.1's hero paragraph, 1.35 on the option-card subtitles, 1.45 on body-s, and so on.
- The sizes, weights and tracking in §12.3 are unchanged; only line height moves.

## Consequences

- 1.1 went from 1.90% to 0.188% different, already inside the 1% that §17.4 wants by
  Phase 11, and the three text bands in its option card now land on the design's exact
  pixel rows.
- Any new screen must take its line height from the reference HTML, not from the §12.3
  table. A screen that drifts progressively downward is almost always this.
- §12.3 should be corrected in implementation.md when the plan is next revised; this ADR
  is the record until then.
