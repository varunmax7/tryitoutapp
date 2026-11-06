import type { ConfidenceLevel } from './enums';

/**
 * Confidence banding — implementation.md §11.3 step 8.
 * High ≥ 0.8, Medium 0.6–0.8, Low < 0.6.
 */
export function confidenceLevel(p: number): ConfidenceLevel {
  if (!Number.isFinite(p) || p < 0 || p > 1) {
    throw new RangeError(`confidence p must be between 0 and 1, received ${p}`);
  }
  if (p >= 0.8) return 'high';
  if (p >= 0.6) return 'medium';
  return 'low';
}

/**
 * Whether a percentage may appear on screen instead of a level.
 * Only once the brand × category has ≥ 200 "Did it fit?" outcomes AND the model has been
 * calibrated — the mockups' "88% sure" is a fixture, never a default (§11.3, §0).
 */
export const CALIBRATION_MIN_OUTCOMES = 200;

export function mayShowPercentage(opts: {
  outcomes: number;
  calibrated: boolean;
  flagConfidencePercent: boolean;
}): boolean {
  return opts.flagConfidencePercent && opts.calibrated && opts.outcomes >= CALIBRATION_MIN_OUTCOMES;
}
