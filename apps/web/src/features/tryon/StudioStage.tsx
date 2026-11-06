import { illustration } from '@/ui/illustration';

/**
 * Placeholder for 4.2's 3D stage: two figures wearing the same tee in M and L, so the
 * difference is visible side by side. The three.js render replaces the figures; the
 * fit-map colours over each torso are product tokens and stay (§12.1, §12.5).
 */
export function StudioStage() {
  return (
    <svg
      width="100%"
      height="470"
      viewBox="0 0 756 470"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="3D view of you in the Snitch tee. Size M on the left is snug on the chest and tight on the biceps. Size L on the right is just right on the chest, snug on the biceps and roomy at the waist."
      className="block"
    >
      <defs>
        <g id="wt-body">
          <ellipse
            cx="195"
            cy="588"
            rx="86"
            ry="9"
            fill={illustration.figureShadow}
            opacity="0.35"
          />
          <path
            d="M102 279L92 344L88 404L104 406L112 346L127 286Z"
            fill={illustration.figureSkin}
          />
          <path
            d="M288 279L298 344L302 404L286 406L278 346L263 286Z"
            fill={illustration.figureSkin}
          />
          <ellipse cx="96" cy="418" rx="9" ry="13" fill={illustration.figureSkin} />
          <ellipse cx="294" cy="418" rx="9" ry="13" fill={illustration.figureSkin} />
          <path
            d="M140 346H250L246 566H206L197 432H193L184 566H144Z"
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
        </g>
        <clipPath id="wt-torso-m">
          <path d="M180 184Q195 198 210 184L260 202L252 262L254 352Q195 358 136 352L138 262L130 202Z" />
        </clipPath>
        <clipPath id="wt-torso-l">
          <path d="M180 184Q195 198 210 184L266 202L258 262L260 366Q195 372 130 366L132 262L124 202Z" />
        </clipPath>
      </defs>

      <ellipse
        cx="238"
        cy="454"
        rx="104"
        ry="14"
        className="fill-room-wall stroke-room-line"
        strokeWidth="1.5"
      />
      <ellipse
        cx="518"
        cy="454"
        rx="104"
        ry="14"
        className="fill-room-wall stroke-room-line"
        strokeWidth="1.5"
      />

      <g transform="translate(238 452) scale(0.82) translate(-195 -588)">
        <use href="#wt-body" />
        <path
          d="M180 184Q195 198 210 184L260 202L252 262L254 352Q195 358 136 352L138 262L130 202Z"
          fill={illustration.oliveTee}
        />
        <path d="M130 202L106 274L136 282L138 262Z" fill={illustration.oliveTee} />
        <path d="M260 202L284 274L254 282L252 262Z" fill={illustration.oliveTee} />
        <g opacity="0.9">
          <g clipPath="url(#wt-torso-m)">
            <rect x="110" y="170" width="170" height="200" className="fill-map-snug" />
            <path d="M110 300Q195 284 280 300V380H110Z" className="fill-map-right" />
            <path
              d="M110 300Q195 284 280 300"
              fill="none"
              stroke={illustration.fitSeam}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />
          </g>
          <path d="M130 202L106 274L136 282L138 262Z" className="fill-map-snug" />
          <path d="M260 202L284 274L254 282L252 262Z" className="fill-map-snug" />
        </g>
        <g fill="none" className="stroke-dark-900" strokeLinecap="round" opacity="0.3">
          <path d="M180 184Q195 198 210 184" strokeWidth="3" />
          <path d="M130 202L138 262M260 202L252 262" strokeWidth="1.5" />
          <path d="M152 238q43 9 86 0M156 256q39 6 78 0" strokeWidth="1.5" />
        </g>
      </g>

      <g transform="translate(518 452) scale(0.82) translate(-195 -588)">
        <use href="#wt-body" />
        <path
          d="M180 184Q195 198 210 184L266 202L258 262L260 366Q195 372 130 366L132 262L124 202Z"
          fill={illustration.oliveTee}
        />
        <path d="M124 202L98 276L130 286L132 262Z" fill={illustration.oliveTee} />
        <path d="M266 202L292 276L260 286L258 262Z" fill={illustration.oliveTee} />
        <g opacity="0.9">
          <g clipPath="url(#wt-torso-l)">
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

      <rect
        x="214"
        y="12"
        width="48"
        height="26"
        rx="13"
        className="fill-dark-650 stroke-dark-line"
      />
      <text
        x="238"
        y="30"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        className="fill-surface-0 font-mono"
      >
        M
      </text>
      <rect x="460" y="12" width="116" height="26" rx="13" className="fill-marigold-500" />
      <text
        x="518"
        y="30"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        className="fill-ink-900"
      >
        <tspan className="font-mono" fontSize="14">
          L
        </tspan>
        <tspan className="font-sans"> · Your size</tspan>
      </text>
    </svg>
  );
}
