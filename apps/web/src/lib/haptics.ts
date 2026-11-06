/**
 * Haptics — implementation.md §12.8.4. Three patterns only, and never on scroll.
 *
 * Android uses the Vibration API. Safari has none; the known workaround toggles a hidden
 * native switch, which is a side effect rather than an API, so it ships behind the
 * `iosHaptics` flag (default off). If it ever stops working, nothing breaks.
 */
import { isOn } from '@/app/flags';

const STORAGE_KEY = 'tryitout.haptics';

export type HapticPattern = 'selection' | 'success' | 'warning';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  /** a size, segment, toggle or sheet detent changes */
  selection: 8,
  /** scan captured, build ready, feedback saved */
  success: [12, 40, 18],
  /** scan failed, link not readable */
  warning: [20, 60, 20],
};

export function hapticsEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setHapticsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Setting applies for this session only.
  }
}

let iosSwitch: HTMLInputElement | null = null;

function playIosHaptic(): void {
  if (!isOn('iosHaptics')) return;
  if (!iosSwitch) {
    iosSwitch = document.createElement('input');
    iosSwitch.type = 'checkbox';
    iosSwitch.setAttribute('switch', '');
    iosSwitch.setAttribute('aria-hidden', 'true');
    iosSwitch.tabIndex = -1;
    iosSwitch.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;opacity:0';
    document.body.append(iosSwitch);
  }
  iosSwitch.click();
}

export function haptic(pattern: HapticPattern): void {
  if (!hapticsEnabled()) return;
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(PATTERNS[pattern]);
    return;
  }
  playIosHaptic();
}
