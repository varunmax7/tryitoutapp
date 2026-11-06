# ADR-0002: Licence allowlist uses `pnpm licenses`, not `license-checker`

- **Status:** accepted
- **Date:** 2026-11-06
- **Phase:** 0 (Foundation)

## Context

implementation.md §15 Phase 0 task 6 asks for a licence gate in CI, naming
`license-checker` for JavaScript and `pip-licenses` for Python, with an allowlist of MIT,
Apache-2.0, BSD, ISC, OFL plus the SAM License for that one model.

`license-checker` walks `node_modules` and infers the dependency tree from directory
nesting. pnpm installs a symlinked store, so that walk is unreliable in this repo: it can
miss packages and report versions that are not the installed ones. A licence gate that
quietly inspects the wrong set is worse than no gate.

## Decision

`scripts/check-licenses.mjs` reads `pnpm licenses list --json --long --recursive`, which
comes from pnpm's own lockfile, and `pip-licenses` for `apps/worker/.venv` when it exists.
The script fails when it finds no packages at all, so a broken check cannot report success.

- Allowlist: 0BSD, Apache-2.0, Artistic-2.0, BlueOak-1.0.0, BSD(-2/-3-Clause), CC0-1.0,
  CC-BY-3.0/4.0, ISC, MIT, MIT-0, MPL-2.0, OFL-1.1, PSF-2.0, Python-2.0, Unlicense, WTFPL,
  Zlib. SPDX expressions pass when any one term is allowed.
- Dev dependencies are checked too, not only production ones: a copyleft build tool in a
  commercial repo should be a human decision, not a surprise.
- The SAM License applies to the SAM 3D Body **weights**, which live in a Modal Volume
  rather than a package (§8). It gets an ADR of its own in Phase 4, together with the
  pass-through terms shown on the legal page.

## Consequences

- `pnpm licenses:check` is the single command, run locally and in CI.
- Adding a dependency with an unlisted licence fails CI until someone adds it to `ALLOWED`
  or `EXCEPTIONS` with a reason, which keeps AGENTS.md rule 3 enforceable rather than
  aspirational.
