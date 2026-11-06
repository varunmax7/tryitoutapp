---
description: Check scrolling, motion and responsiveness against implementation.md §12.8
argument-hint: <screen id or route, optional>
---
Run pnpm e2e:feel and pnpm e2e:visual. For $ARGUMENTS (or every route changed on this branch), walk the §12.8 rules and
the feel script in docs/feel-review.md: native scroll, transitions, sheets, press states, reduced motion, fallbacks.
List each failure with file:line, fix it with the motion-polish subagent, and finish with an INP / long-frames / CLS table (before and after).
