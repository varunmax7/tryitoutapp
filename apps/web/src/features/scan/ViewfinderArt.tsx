import { illustration } from '@/ui/illustration';

/**
 * Placeholder for the live camera feed on 1.3 (§12.1): the person stands in for the
 * video, so the guide outline, the corner brackets and the overlays can still be
 * checked against the design. In the app the video replaces everything but the guide.
 */
export function ViewfinderArt() {
  return (
    <svg
      width="300"
      height="520"
      viewBox="0 0 300 520"
      role="img"
      aria-label="Camera view with a body outline guide around the person"
      className="absolute top-32 left-[45px]"
    >
      <path
        d="M14 40V14h26M260 14h26v26M286 480v26h-26M40 506H14v-26"
        fill="none"
        stroke={illustration.guide}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* The dashed marigold silhouette is product, not placeholder: it stays. */}
      <path
        d="M150 20c28 0 42 20 42 44 0 20-10 32-16 38l34 8 42 160-24 6-24-82 2 82-8 28-8 214h-80l-8-214-8-28 2-82-24 82-24-6 42-160 34-8c-6-6-16-18-16-38 0-24 14-44 42-44z"
        fill="none"
        className="stroke-marigold-500"
        strokeWidth="2.5"
        strokeDasharray="8 7"
        strokeLinejoin="round"
      />
      <line
        x1="104"
        y1="116"
        x2="64"
        y2="262"
        stroke={illustration.skin}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <line
        x1="196"
        y1="116"
        x2="236"
        y2="262"
        stroke={illustration.skin}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <line
        x1="104"
        y1="116"
        x2="86"
        y2="172"
        stroke={illustration.tee}
        strokeWidth="28"
        strokeLinecap="round"
      />
      <line
        x1="196"
        y1="116"
        x2="214"
        y2="172"
        stroke={illustration.tee}
        strokeWidth="28"
        strokeLinecap="round"
      />
      <path d="M102 270h96l-4 34-14 196h-24l-6-180-6 180h-24l-14-196z" fill={illustration.jeans} />
      <path d="M112 500h28v12h-34zM160 500h28l6 12h-34z" fill={illustration.shoes} />
      <path d="M106 106q44-10 88 0l12 46-4 120h-104l-4-120z" fill={illustration.tee} />
      <rect x="140" y="86" width="20" height="20" fill={illustration.skin} />
      <circle cx="150" cy="62" r="30" fill={illustration.skin} />
      <path d="M120 58q2-30 30-30t30 30q-10-14-30-14t-30 14z" fill={illustration.hair} />
    </svg>
  );
}
