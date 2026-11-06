import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyMotionTokens, springs } from './presets';

const motionCss = readFileSync(join(import.meta.dirname, '../../styles/motion.css'), 'utf8');

describe('motion tokens', () => {
  // §12.8.2: "A unit test checks that every --spring-* in motion.css has a preset."
  it('every --spring-* declared in motion.css has a preset', () => {
    const declared = [...motionCss.matchAll(/--spring-([a-z]+):/g)].map((m) => m[1]);
    expect(declared.length).toBeGreaterThan(0);
    for (const name of declared) {
      expect(Object.keys(springs)).toContain(name);
    }
  });

  it('every preset is declared in motion.css', () => {
    for (const name of Object.keys(springs)) {
      expect(motionCss).toContain(`--spring-${name}:`);
    }
  });

  it('writes a spring for each preset', () => {
    const root = document.createElement('html');
    applyMotionTokens(false, root);
    for (const name of Object.keys(springs)) {
      expect(root.style.getPropertyValue(`--spring-${name}`)).not.toBe('');
    }
  });

  it('drops the bounce and shortens under reduced motion', () => {
    const root = document.createElement('html');
    applyMotionTokens(true, root);
    for (const name of Object.keys(springs)) {
      expect(root.style.getPropertyValue(`--spring-${name}`)).toBe('200ms var(--ease-enter)');
    }
  });
});

describe('motion.css', () => {
  it('keeps the page transition inside the 450ms budget (§17.6)', () => {
    const page = /--dur-page:\s*(\d+)ms/.exec(motionCss);
    expect(page).not.toBeNull();
    expect(Number(page?.[1])).toBeLessThanOrEqual(450);
  });

  it('animates only transform and opacity on page transitions (§12.8.1 rule 7)', () => {
    // The view-transition keyframes may touch transform and opacity, nothing else.
    const keyframes = [...motionCss.matchAll(/@keyframes vt-[a-z-]+\s*\{([^@]*?)\n\}/g)];
    expect(keyframes.length).toBeGreaterThan(0);
    for (const [, body] of keyframes) {
      const properties = [...(body ?? '').matchAll(/^\s{4}([a-z-]+):/gm)].map((m) => m[1]);
      for (const property of properties) {
        expect(['transform', 'opacity', 'translate']).toContain(property);
      }
    }
  });
});
