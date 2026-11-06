#!/usr/bin/env bash
# Measure one screen against its design PNG and write a diff image.
#   scripts/probe.sh 1.4-my-sizes /sizes [phone|desktop] [WIDTHxHEIGHT]
set -euo pipefail
PROBE_ID="$1" PROBE_PATH="$2" PROBE_VIEWPORT="${4:-}" \
  pnpm exec playwright test --project="${3:-phone}" --grep "visual probe" --reporter=list 2>&1 \
  | grep -E "DIFF|pixels differ|Error" || true
