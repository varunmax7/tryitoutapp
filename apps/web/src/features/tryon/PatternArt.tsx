/**
 * The flat sewing pattern on 2.2. In the app this is drawn from the real pattern panels
 * the worker returns (§12.5); until Phase 5 it is the designed placeholder.
 */
export function PatternArt() {
  return (
    <svg
      width="326"
      height="156"
      viewBox="0 0 326 156"
      role="img"
      aria-label="Flat sewing pattern of the tee: front, back, two sleeves and a neck rib, with chest 58 cm flat and length 74 cm marked"
    >
      <defs>
        <pattern id="b3d-grid" width="13" height="13" patternUnits="userSpaceOnUse">
          <path d="M13 0H0V13" fill="none" className="stroke-dark-grid" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="326" height="156" rx="10" fill="url(#b3d-grid)" />
      <g
        className="fill-marigold-500/12 stroke-marigold-500"
        strokeWidth="1.6"
        strokeLinejoin="round"
      >
        <path d="M44 16Q64 34 84 16L104 21C98 31 98 44 104 53V116H24V53C30 44 30 31 24 21Z" />
        <path d="M134 16Q154 22 174 16L194 21C188 31 188 44 194 53V116H114V53C120 44 120 31 114 21Z" />
        <path d="M206 40C226 20 240 16 261 16S296 20 316 40L310 58H212Z" />
        <path d="M206 98C226 78 240 74 261 74S296 78 316 98L310 116H212Z" />
        <rect x="206" y="127" width="110" height="8" rx="2" />
      </g>
      <g
        fill="none"
        className="stroke-marigold-500"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      >
        <path d="M64 44V92M60.5 47.5L64 44l3.5 3.5M60.5 88.5L64 92l3.5-3.5" />
        <path d="M154 44V92M150.5 47.5L154 44l3.5 3.5M150.5 88.5L154 92l3.5-3.5" />
        <path d="M261 24V44M258 27L261 24l3 3M258 41L261 44l3-3" />
        <path d="M261 82V102M258 85L261 82l3 3M258 99L261 102l3-3" />
      </g>
      <g
        fontSize="9"
        fontWeight="600"
        letterSpacing="1"
        textAnchor="middle"
        className="fill-marigold-500 font-mono"
      >
        <text x="64" y="108">
          FRONT
        </text>
        <text x="154" y="108">
          BACK
        </text>
        <text x="261" y="54">
          SLEEVE
        </text>
        <text x="261" y="112">
          SLEEVE
        </text>
        <text x="261" y="149">
          NECK RIB
        </text>
      </g>
      <g className="stroke-on-dark-300" strokeWidth="1" fill="none">
        <path d="M12 16V116M8 16H16M8 116H16" />
        <path d="M24 130H104M24 126V134M104 126V134" />
      </g>
      <rect x="3" y="59" width="18" height="14" className="fill-ink-900" />
      <rect x="53" y="123" width="22" height="14" className="fill-ink-900" />
      <g fontSize="10" fontWeight="600" textAnchor="middle" className="fill-on-dark-100 font-mono">
        <text x="12" y="70">
          74
        </text>
        <text x="64" y="134">
          58
        </text>
      </g>
      <text x="154" y="134" fontSize="10" textAnchor="middle" className="fill-on-dark-500">
        all in cm
      </text>
    </svg>
  );
}
