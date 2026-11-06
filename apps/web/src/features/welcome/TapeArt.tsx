/**
 * The marigold tape in 1.1's hero. It drifts at about 0.6x scroll speed where
 * scroll-driven animations exist, and sits still everywhere else (§12.8.3).
 */
const LABELS = [60, 70, 80, 90, 100, 110, 120];

export function TapeArt() {
  const ticks: string[] = [];
  for (let x = 12; x < 480; x += 12) {
    ticks.push(`M${x} 0v${x % 60 === 0 ? 20 : 10}`);
  }
  return (
    <svg
      width="500"
      height="60"
      viewBox="0 0 480 58"
      aria-hidden="true"
      className="tape-drift absolute bottom-[58px] -left-[46px] -rotate-7"
    >
      <rect x="0" y="0" width="480" height="58" className="fill-marigold-500" />
      <path d={ticks.join('')} className="stroke-ink-900" strokeWidth="1.5" fill="none" />
      {LABELS.map((label, index) => (
        <text
          key={label}
          x={(index + 1) * 60}
          y="40"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          className="fill-ink-900 font-mono"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}
