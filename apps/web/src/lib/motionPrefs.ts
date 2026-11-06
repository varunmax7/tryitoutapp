import { MotionGlobalConfig } from 'motion';
import { applyMotionTokens } from '@/ui/motion/presets';

/**
 * Reduced motion, lite mode and still mode — implementation.md §12.8.9.
 *
 * Three independent switches, all expressed as attributes on <html> so CSS can react
 * without React re-rendering:
 *   data-motion="reduce"  the OS setting, or N12's "Reduce motion: Always"
 *   data-lite             low-end device: no backdrop blur, no sheet scale, no parallax
 *   data-still            visual tests: nothing moves at all
 */

const STORAGE_KEY = 'tryitout.motion';

export type ReduceMotionSetting = 'system' | 'always';

export function readReduceMotionSetting(): ReduceMotionSetting {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'always' ? 'always' : 'system';
  } catch {
    // Private windows and blocked site data: fall back to the OS setting.
    return 'system';
  }
}

export function writeReduceMotionSetting(setting: ReduceMotionSetting): void {
  try {
    localStorage.setItem(STORAGE_KEY, setting);
  } catch {
    // Nothing to do: the setting applies for this session only.
  }
  applyMotionPrefs();
}

export function prefersReducedMotion(): boolean {
  if (readReduceMotionSetting() === 'always') return true;
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Low-end Android, where blur and parallax cost more than they give (§12.8.9). */
export function isLiteDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return true;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return true;
  return false;
}

/** Visual tests run with `?still=1`, which freezes every animation (§12.8.9). */
export function isStillMode(): boolean {
  if (typeof window === 'undefined') return false;
  const value = new URLSearchParams(window.location.search).get('still');
  return value === '1' || value === 'true';
}

/**
 * Applies all three switches. Called once before the first render and again whenever the
 * setting or the OS preference changes.
 */
export function applyMotionPrefs(root: HTMLElement = document.documentElement): void {
  const reduced = prefersReducedMotion();
  const still = isStillMode();

  root.toggleAttribute('data-still', still);
  if (reduced) root.dataset.motion = 'reduce';
  else delete root.dataset.motion;
  root.toggleAttribute('data-lite', isLiteDevice());

  // The global switch, not only <MotionConfig skipAnimations>, because useAnimate
  // ignores the prop (§12.8.9).
  MotionGlobalConfig.skipAnimations = still;

  applyMotionTokens(reduced || still, root);
}

/** Keeps the attributes in step with the OS setting for the life of the page. */
export function watchMotionPrefs(): () => void {
  if (typeof matchMedia !== 'function') return () => {};
  const query = matchMedia('(prefers-reduced-motion: reduce)');
  const onChange = () => applyMotionPrefs();
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
