---
description: Plan and execute one phase of implementation.md
argument-hint: <phase number, e.g. 3>
---
Read implementation.md §15 Phase $ARGUMENTS and docs/progress.md.
1. Restate the goal and the acceptance criteria.
2. Propose an ordered task list mapped to files and subagents. Wait for my OK.
3. Execute task by task with tests. Commit after each task.
4. Run: pnpm typecheck && pnpm lint && pnpm test && pnpm e2e (plus pnpm e2e:visual and pnpm e2e:feel for UI work).
   Check the implementation.md §12.8.8 interactions for this phase's screens.
5. Run the qa-reviewer subagent. Fix what it finds.
6. Update docs/progress.md and write a PR description: what shipped, how it was tested, open issues.
