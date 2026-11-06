@AGENTS.md

## Working style for Claude Code
- Start every phase in plan mode: read implementation.md §15 (the phase), restate goal + acceptance criteria,
  list tasks mapped to files, and wait for approval before editing.
- Use the subagents in .claude/agents for focused work; keep the main session for integration and review.
- After each task run the checks for that phase and commit (Conventional Commits).
- If implementation.md doesn't answer a product question, stop and ask. Don't invent behaviour.
- Never print, log or commit secrets. Read env names from .env.example.
- Before touching a screen, open its PNG and reference HTML in design/.
