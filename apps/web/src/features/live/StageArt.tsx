import { illustration } from '@/ui/illustration';

/**
 * Placeholder for the live camera feed and the three.js garment on 2.3 (§12.1).
 * The fit-map colours over the torso ARE product (map-snug / map-right / map-roomy);
 * the person and the room are placeholder art.
 */
export function StageArt() {
  return (
    <svg
      width="390"
      height="844"
      viewBox="0 0 390 844"
      role="img"
      aria-label="Live camera view of you wearing the Snitch tee in size L with a fit map: shoulders and chest just right, biceps snug, waist roomy"
      className="absolute top-0 left-0"
    >
      <defs>
        <clipPath id="lf-torso">
          <path d="M180 184Q195 198 210 184L266 202L258 262L260 366Q195 372 130 366L132 262L124 202Z" />
        </clipPath>
      </defs>
      <rect width="390" height="520" className="fill-room-wall" />
      <rect y="520" width="390" height="324" className="fill-room-floor" />
      <path d="M0 520H390" className="stroke-room-line" strokeWidth="2" />
      <g transform="translate(195 586) scale(0.86) translate(-195 -586)">
        <ellipse cx="195" cy="588" rx="86" ry="9" fill={illustration.figureShadow} opacity="0.35" />
        <path d="M102 279L92 344L88 404L104 406L112 346L127 286Z" fill={illustration.figureSkin} />
        <path
          d="M288 279L298 344L302 404L286 406L278 346L263 286Z"
          fill={illustration.figureSkin}
        />
        <ellipse cx="96" cy="418" rx="9" ry="13" fill={illustration.figureSkin} />
        <ellipse cx="294" cy="418" rx="9" ry="13" fill={illustration.figureSkin} />
        <path
          d="M140 356H250L246 566H206L197 432H193L184 566H144Z"
          fill={illustration.figureJeans}
        />
        <path d="M195 360V430" stroke={illustration.figureJeansSeam} strokeWidth="2" />
        <path d="M142 566H186L189 580Q164 587 136 582Z" fill={illustration.figureShoes} />
        <path d="M204 566H248L254 582Q226 587 201 580Z" fill={illustration.figureShoes} />
        <rect x="184" y="160" width="22" height="36" fill={illustration.figureNeck} />
        <ellipse cx="195" cy="136" rx="27" ry="33" fill={illustration.figureSkin} />
        <path
          d="M168 134Q165 100 195 98Q225 100 222 134Q215 114 195 113Q175 114 168 134Z"
          fill={illustration.figureHair}
        />
        <path
          d="M180 184Q195 198 210 184L266 202L258 262L260 366Q195 372 130 366L132 262L124 202Z"
          fill={illustration.oliveTee}
        />
        <path d="M124 202L98 276L130 286L132 262Z" fill={illustration.oliveTee} />
        <path d="M266 202L292 276L260 286L258 262Z" fill={illustration.oliveTee} />
        {/* Fit map: these three colours are tokens, because they carry meaning. */}
        <g opacity="0.9">
          <g clipPath="url(#lf-torso)">
            <rect x="110" y="170" width="170" height="210" className="fill-map-right" />
            <path d="M110 312Q195 296 280 312V380H110Z" className="fill-map-roomy" />
            <path
              d="M110 312Q195 296 280 312"
              fill="none"
              stroke={illustration.fitSeam}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          </g>
          <path d="M124 202L98 276L130 286L132 262Z" className="fill-map-snug" />
          <path d="M266 202L292 276L260 286L258 262Z" className="fill-map-snug" />
        </g>
        <g fill="none" className="stroke-dark-900" strokeLinecap="round" opacity="0.3">
          <path d="M180 184Q195 198 210 184" strokeWidth="3" />
          <path d="M124 202L132 262M266 202L258 262" strokeWidth="1.5" />
          <path
            d="M158 236q6 22 2 46M232 238q-6 22-2 44M176 330q3 16 0 34M214 330q-3 16 0 34"
            strokeWidth="1.5"
          />
        </g>
      </g>
      {/* Leader lines from each callout to its region. */}
      <g fill="none" stroke={illustration.fitSeam} strokeWidth="1.25" opacity="0.85">
        <path d="M252 224L223 285" />
        <path d="M104 303H131" />
        <path d="M262 462L227 371" />
      </g>
      <g className="stroke-dark-900" strokeWidth="2">
        <circle cx="223" cy="285" r="5" className="fill-map-right" />
        <circle cx="131" cy="302" r="5" className="fill-map-snug" />
        <circle cx="227" cy="371" r="5" className="fill-map-roomy" />
      </g>
    </svg>
  );
}
