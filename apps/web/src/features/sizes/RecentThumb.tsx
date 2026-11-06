import { illustration } from '@/ui/illustration';

/**
 * The 44x48 product thumbnails in 4.1's "Recently checked" list. Placeholder art that
 * the real product image replaces once a share-check or build has one (§12.1).
 */
export type RecentKind = 'oxford' | 'tee' | 'linen';

export function RecentThumb({ kind }: { kind: RecentKind }) {
  if (kind === 'tee') {
    return (
      <svg
        width="44"
        height="48"
        viewBox="0 6 96 104"
        aria-hidden="true"
        className="shrink-0 rounded-10 bg-surface-photo"
      >
        <path
          d="M33 20L16 29 7 48l14 7 6-9v50h42V46l6 9 14-7-9-19-17-9q-6 8-15 8t-15-8z"
          fill={illustration.oliveTee}
        />
      </svg>
    );
  }
  const body = kind === 'oxford' ? illustration.oxfordShirt : illustration.linenShirt;
  const seam = kind === 'oxford' ? illustration.oxfordShirtSeam : illustration.linenShirtSeam;
  const collar = kind === 'oxford' ? illustration.oxfordShirtCollar : illustration.linenShirtCollar;
  return (
    <svg
      width="44"
      height="48"
      viewBox="-10 5 220 240"
      aria-hidden="true"
      className="shrink-0 rounded-10 bg-surface-photo"
    >
      <path
        d="M70 20L40 30L10 50L0 180L22 182L34 80V230H166V80L178 182L200 180L190 50L160 30L130 20Q100 34 70 20Z"
        fill={body}
        stroke={seam}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M70 20L100 44L84 52ZM130 20L100 44L116 52Z"
        fill={collar}
        stroke={seam}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
