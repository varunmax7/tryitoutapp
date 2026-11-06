import { describe, expect, it } from 'vitest';
import { CALIBRATION_MIN_OUTCOMES, confidenceLevel, mayShowPercentage } from './confidence';
import { Category, FitTag, V1_CATEGORIES } from './enums';

describe('confidenceLevel', () => {
  it('bands p at the boundaries from §11.3', () => {
    expect(confidenceLevel(1)).toBe('high');
    expect(confidenceLevel(0.8)).toBe('high');
    expect(confidenceLevel(0.799)).toBe('medium');
    expect(confidenceLevel(0.6)).toBe('medium');
    expect(confidenceLevel(0.599)).toBe('low');
    expect(confidenceLevel(0)).toBe('low');
  });

  it('rejects anything that is not a probability', () => {
    expect(() => confidenceLevel(1.1)).toThrow(RangeError);
    expect(() => confidenceLevel(-0.1)).toThrow(RangeError);
    expect(() => confidenceLevel(Number.NaN)).toThrow(RangeError);
  });
});

describe('mayShowPercentage', () => {
  const calibrated = { outcomes: CALIBRATION_MIN_OUTCOMES, calibrated: true };

  it('stays off in the V1 default state', () => {
    expect(mayShowPercentage({ ...calibrated, flagConfidencePercent: false })).toBe(false);
  });

  it('needs calibration as well as the flag', () => {
    expect(
      mayShowPercentage({ outcomes: 500, calibrated: false, flagConfidencePercent: true }),
    ).toBe(false);
  });

  it('needs enough outcomes as well as calibration', () => {
    expect(
      mayShowPercentage({ outcomes: 199, calibrated: true, flagConfidencePercent: true }),
    ).toBe(false);
    expect(mayShowPercentage({ ...calibrated, flagConfidencePercent: true })).toBe(true);
  });
});

describe('locked vocabulary', () => {
  it('matches the Postgres enums in §9', () => {
    expect(Category.options).toEqual([
      'tshirt',
      'oversized_tee',
      'polo',
      'shirt',
      'jeans',
      'trousers',
      'kurta',
      'shoes',
    ]);
    expect(FitTag.options).toEqual([
      'great',
      'good',
      'slightly_tight',
      'slightly_loose',
      'not_recommended',
    ]);
  });

  it('ships tops only in V1', () => {
    expect([...V1_CATEGORIES]).toEqual(['tshirt', 'oversized_tee', 'polo', 'shirt']);
    for (const category of V1_CATEGORIES) {
      expect(Category.options).toContain(category);
    }
  });
});
