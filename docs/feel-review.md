# Feel review

The script from implementation.md §12.8.11, plus the results of each run.

Run it at the end of Phase 1, at every phase that adds a screen, and in Phase 11 on every
phone in §17.7. Attach screen recordings to the PR.

The automated half (`pnpm e2e:feel`) runs on every PR and is described in §17.9. It
measures a **production build** under a 4× CPU throttle: dev-mode React and unbundled
modules would make the frame numbers meaningless.

## The script

1. Cold start to 1.1: no white flash, and no text shift when fonts load.
2. Fling 1.4 up and down, and bounce at both ends: smooth; the header collapses and comes
   back; the bounce shows the right colours.
3. Start a scroll on a BrandRow: no highlight flash, nothing opens.
4. Tap a BrandRow: highlight, then a push with the monogram morph. TopBar back pops. On
   iPhone Safari, an edge swipe back animates once, not twice.
5. Scroll a tab, switch away, switch back: same position. Tap the active tab: scroll to
   top. On a pushed screen: pop to root.
6. Open 3.1: it springs to its height. Drag it to full. Release a slow drag: it returns.
   Flick it: it closes. Scroll inside, then drag at the top: the sheet moves.
7. Type in 1.2 with the keyboard up: the focused field is always visible, and Next moves
   on. Go back and return: values are kept.
8. Scan: chips tick, the shutter arms, the countdown runs, and the capture gives feedback.
9. Build: steps progress without visible stalls, and the pattern draws in.
10. Live fit: toggling the fit map and compare causes no visible frame drop.
11. Reduced motion on: every flow still works, with fades only.
12. Airplane mode: the shell opens, last results show, the offline banner appears, and
    actions queue.

## Review 1 — Phase 1, 6 November 2026

**Automated (`pnpm e2e:feel`, Chromium, production build, 4× CPU throttle): 6/6 pass.**

| Check                                      | Budget (§17.6)                 | Result                |
| ------------------------------------------ | ------------------------------ | --------------------- |
| Long animation frames during the 1.4 fling | 0 over 50 ms                   | 0                     |
| Cumulative layout shift on 1.4             | ≤ 0.05                         | 0                     |
| BrandRow press feedback                    | ≤ 100 ms (+60 ms scroll guard) | within budget         |
| View transition length, 1.4 → 1.5 → back   | ≤ 450 ms                       | within budget         |
| Tab switch keeps the scroll position       | exact                          | restored within 40 px |
| Layout shift while typing in 1.2           | ≤ 0.05                         | 0                     |
| Long frames toggling the fit map on 2.3    | none over 100 ms               | 0                     |
| Reduced motion: 1.4 → 1.5 → back           | works, fades only              | pass                  |

**On devices: not run.** This needs the reference iPhone and the mid-range Android from
§17.7, which the build environment does not have. Items 1, 3, 4 (edge swipe), 6, 7, 8, 9,
11 and 12 are device-dependent and remain unverified. Record the devices used here when
the review is run, and attach the recordings to the PR.

Items 8, 9 and 12 cover screens whose behaviour arrives in Phases 4, 5 and 11; at Phase 1
those screens render from fixtures only.
