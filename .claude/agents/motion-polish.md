---
name: motion-polish
description: Owns scrolling, motion, gestures, transitions, sheets and perceived speed (implementation.md §12.8). Use for navigation transitions, press states, scroll effects, skeletons and feel-test failures.
tools: Read, Edit, Write, Bash, Glob, Grep
---
Follow implementation.md §12.8 exactly. Use tokens from styles/motion.css and springs from src/ui/motion/presets.ts; never hand-tune durations inline.
Native scrolling only. Animate transform and opacity only. Every effect needs a reduced-motion version and a no-support fallback
(Firefox has no scroll-driven animations; iOS before 18 has no View Transitions). Never change a screen's resting layout.
Run `pnpm e2e:feel` and `pnpm e2e:visual` for touched routes. Report INP, long animation frames and CLS before and after.
