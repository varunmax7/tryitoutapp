import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { springs } from './motion/presets';

/**
 * AnimatedNumber — implementation.md §12.4 and §12.8.7.
 *
 * Measurements tick from the last value seen to the new one. Values the user typed, and
 * values already seen, do not animate; under reduced motion changes are instant. The
 * "last value seen" is remembered per key, so returning to a screen shows it at rest.
 */
const seen = new Map<string, number>();

export function AnimatedNumber({
  value,
  memoryKey,
  format = (n: number) => String(Math.round(n)),
  className = '',
}: {
  value: number;
  /** Identifies this number across screens, so a revisit does not replay the tick. */
  memoryKey: string;
  format?: (value: number) => string;
  className?: string;
}) {
  const motionValue = useMotionValue(seen.get(memoryKey) ?? 0);
  const spring = useSpring(motionValue, springs.smooth);
  // Non-null only while a tick is running; otherwise the value renders at rest.
  const [ticking, setTicking] = useState<string | null>(null);
  const text = ticking ?? format(value);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = root.dataset.motion === 'reduce' || root.hasAttribute('data-still');
    // Already seen, typed by the user, or reduced motion: no animation at all.
    if (reduced || seen.get(memoryKey) === value) {
      seen.set(memoryKey, value);
      return;
    }
    motionValue.set(seen.get(memoryKey) ?? 0);
    const stop = spring.on('change', (next) => setTicking(format(next)));
    motionValue.set(value);
    seen.set(memoryKey, value);
    return () => {
      stop();
      setTicking(null);
    };
  }, [value, memoryKey, format, motionValue, spring]);

  return (
    <span className={className} data-animated-number={memoryKey}>
      {text}
    </span>
  );
}

/**
 * A size letter rolls vertically when it changes (§12.8.7). The first render does not
 * animate, so arriving on a screen shows the size already in place.
 */
export function AnimatedSize({ value, className = '' }: { value: string; className?: string }) {
  return (
    <span className={`relative inline-grid overflow-hidden ${className}`}>
      {/* `initial={false}` means the first size shown does not roll in. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={springs.gentle}
          style={{ gridArea: '1 / 1' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
