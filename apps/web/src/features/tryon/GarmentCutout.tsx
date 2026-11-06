import { illustration } from '@/ui/illustration';

/**
 * Placeholder art for the garment cut-out on 2.1 (§12.1): it stands in for the RGBA
 * cut-out the worker returns from /garment/analyze. The olive is illustration colour,
 * not a token, because the real texture replaces it.
 */
export function GarmentCutout({
  size = 96,
  /** 4.2 stretches the cut-out across its panel; 2.1 keeps it as a 96px thumbnail. */
  wide = false,
}: {
  size?: number;
  wide?: boolean;
}) {
  const height = wide ? 190 : Math.round((size * 112) / 96);
  return (
    <svg
      width={wide ? '100%' : size}
      height={height}
      viewBox={wide ? '-41 0 178 112' : '0 0 96 112'}
      role="img"
      aria-label={
        wide
          ? 'Your photo of the olive oversized tee, cut out from its background'
          : 'Cut-out of an olive oversized tee'
      }
      className={wide ? 'block rounded-16' : 'shrink-0 rounded-14'}
    >
      <defs>
        <pattern id="tryon-chk" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" className="fill-surface-50" />
          <rect width="6" height="6" className="fill-checker" />
          <rect x="6" y="6" width="6" height="6" className="fill-checker" />
        </pattern>
      </defs>
      <rect x="-41" y="0" width="178" height="112" fill="url(#tryon-chk)" />
      <path
        d="M33 20L16 29 7 48l14 7 6-9v50h42V46l6 9 14-7-9-19-17-9q-6 8-15 8t-15-8z"
        fill={illustration.oliveTee}
      />
      <path
        d="M33 20q6 8 15 8t15-8"
        fill="none"
        stroke={illustration.oliveTeeSeam}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
