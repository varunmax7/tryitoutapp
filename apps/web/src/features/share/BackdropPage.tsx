import { illustration } from '@/ui/illustration';

/**
 * The neutral shopping page behind 3.1's sheet. It is a placeholder for whatever app
 * the link was shared from, so it is drawn as blocks rather than any real brand's UI.
 */
export function BackdropPage() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="size-8 rounded-pill bg-line-100" />
        <span className="h-3 w-30 rounded-[6px] bg-line-200" />
        <span className="flex gap-[10px]">
          <span className="size-8 rounded-pill bg-line-100" />
          <span className="size-8 rounded-pill bg-line-100" />
        </span>
      </div>
      <svg width="390" height="380" viewBox="0 0 390 380" className="block">
        <rect width="390" height="380" className="fill-surface-photo" />
        <g transform="translate(95 70)">
          <path
            d="M70 20L40 30L10 50L0 180L22 182L34 80V230H166V80L178 182L200 180L190 50L160 30L130 20Q100 34 70 20Z"
            fill={illustration.oxfordShirt}
            stroke={illustration.oxfordShirtSeam}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M70 20L100 44L84 52ZM130 20L100 44L116 52Z"
            fill={illustration.oxfordShirtCollar}
            stroke={illustration.oxfordShirtSeam}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M100 44V230" stroke={illustration.oxfordShirtSeam} strokeWidth="2" />
          <g fill={illustration.oxfordShirtButton}>
            {[70, 104, 138, 172, 206].map((cy) => (
              <circle key={cy} cx="106" cy={cy} r="3" />
            ))}
          </g>
        </g>
      </svg>
      <div className="flex flex-col gap-[10px] p-4">
        <span className="h-[14px] w-[70px] rounded-[7px] bg-line-300" />
        <span className="h-3 w-[220px] rounded-[6px] bg-line-200" />
        <span className="h-4 w-[90px] rounded-8 bg-line-300" />
        <span className="mt-[6px] flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-10 w-13 rounded-8 border border-line-300" />
          ))}
        </span>
      </div>
    </div>
  );
}
