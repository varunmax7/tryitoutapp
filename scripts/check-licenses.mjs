/**
 * Licence allowlist — implementation.md §15 Phase 0 task 6 and §17.8.
 *
 * Nothing with a non-commercial licence may ship in Tryitout (AGENTS.md rule 3). This
 * runs on every PR, for JavaScript and, when a Python environment is present, for the
 * worker as well.
 *
 *   node scripts/check-licenses.mjs
 *
 * The plan named `license-checker` for the JS side. `pnpm licenses list` is used instead
 * because it reads pnpm's own lockfile rather than guessing from a symlinked node_modules
 * (docs/decisions/ADR-0002-licence-check.md).
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Permissive licences only. Anything not listed here has to be reviewed by a human. */
const ALLOWED = new Set([
  '0BSD',
  'Apache-2.0',
  'Artistic-2.0',
  'BlueOak-1.0.0',
  'BSD',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC0-1.0',
  'CC-BY-3.0',
  'CC-BY-4.0',
  'ISC',
  'MIT',
  'MIT-0',
  'MPL-2.0',
  'OFL-1.1',
  'Python-2.0',
  'PSF-2.0',
  'Unlicense',
  'WTFPL',
  'Zlib',
]);

/**
 * Exceptions, each with a reason. The SAM License is the only non-standard licence the
 * plan allows, and only for the SAM 3D Body weights (§8), which live in a Modal Volume
 * rather than in a package.
 */
const EXCEPTIONS = new Map([
  ['tryitout', 'the repo itself'],
  ['web', 'workspace package'],
  ['@tryitout/shared', 'workspace package'],
  ['tryitout-worker', 'workspace package'],
  // Public-domain-equivalent declarations that SPDX parsing does not normalise.
  ['jsonify', 'Public Domain'],
]);

/** SPDX expressions resolve if any single licence in them is allowed. */
function isAllowed(expression) {
  if (!expression) return false;
  return expression
    .replace(/[()]/g, ' ')
    .split(/\s+(?:OR|AND)\s+/i)
    .map((part) => part.trim().replace(/\+$/, ''))
    .some((part) => ALLOWED.has(part));
}

function run(command, args, cwd = ROOT) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function checkJs() {
  // Dev tooling is included deliberately: a copyleft build tool in a commercial repo is
  // a decision for a human, not a surprise.
  const raw = run('pnpm', ['licenses', 'list', '--json', '--long', '--recursive']).trim();
  // A check that silently inspects nothing is worse than no check at all.
  if (!raw) throw new Error('pnpm reported no licences. Run `pnpm install` first.');
  const byLicence = JSON.parse(raw);
  const packageCount = Object.values(byLicence).reduce((n, list) => n + list.length, 0);
  if (packageCount === 0) throw new Error('pnpm reported no packages. Run `pnpm install` first.');
  console.log(
    `• javascript: ${packageCount} packages across ${Object.keys(byLicence).length} licences`,
  );
  const offenders = [];

  for (const [licence, packages] of Object.entries(byLicence)) {
    if (isAllowed(licence)) continue;
    for (const pkg of packages) {
      if (EXCEPTIONS.has(pkg.name)) continue;
      offenders.push({ name: pkg.name, versions: (pkg.versions ?? []).join(', '), licence });
    }
  }
  return offenders;
}

function checkPython() {
  const pipLicenses = join(ROOT, 'apps/worker/.venv/bin/pip-licenses');
  if (!existsSync(pipLicenses)) {
    console.log('• python: no apps/worker/.venv found, skipped');
    return [];
  }
  const raw = run(pipLicenses, ['--format=json', '--with-system'], join(ROOT, 'apps/worker'));
  const packages = JSON.parse(raw);
  console.log(`• python: ${packages.length} packages in apps/worker/.venv`);
  return packages
    .filter((pkg) => !isAllowed(normalisePythonLicence(pkg.License)) && !EXCEPTIONS.has(pkg.Name))
    .map((pkg) => ({ name: pkg.Name, versions: pkg.Version, licence: pkg.License }));
}

/** pip metadata uses prose names; map the common ones onto SPDX ids. */
function normalisePythonLicence(licence) {
  if (!licence || licence === 'UNKNOWN') return '';
  const map = [
    [/^MIT\b/i, 'MIT'],
    [/apache.*2/i, 'Apache-2.0'],
    [/\bBSD\b.*3|3-clause/i, 'BSD-3-Clause'],
    [/\bBSD\b.*2|2-clause/i, 'BSD-2-Clause'],
    [/^BSD/i, 'BSD'],
    [/^ISC/i, 'ISC'],
    [/mozilla.*2/i, 'MPL-2.0'],
    [/^Python Software Foundation/i, 'PSF-2.0'],
    [/^(The )?Unlicense/i, 'Unlicense'],
    [/^Public Domain/i, 'CC0-1.0'],
  ];
  for (const [pattern, spdx] of map) {
    if (pattern.test(licence)) return spdx;
  }
  return licence;
}

const offenders = [...checkJs(), ...checkPython()];

if (offenders.length > 0) {
  console.error('\nLicences outside the allowlist:\n');
  for (const { name, versions, licence } of offenders) {
    console.error(`  ${name}@${versions} — ${licence || 'UNKNOWN'}`);
  }
  console.error(
    '\nTryitout ships nothing that forbids commercial use (AGENTS.md rule 3).\n' +
      'Either drop the dependency, or add it to ALLOWED / EXCEPTIONS in this script with\n' +
      'an ADR in docs/decisions explaining why it is safe.\n',
  );
  process.exit(1);
}

console.log('Licence check passed: every dependency allows commercial use.');
