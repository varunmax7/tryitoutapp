/** Product placeholder on 3.2 and 3.1: a shirt silhouette in a photo well (§12.4). */
export function ProductThumb({ width = 52, height = 60 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 60"
      aria-hidden="true"
      className="shrink-0 rounded-10"
    >
      <rect width="52" height="60" className="fill-surface-photo" />
      <g transform="translate(3 0) scale(0.23)">
        <path
          d="M70 20L40 30L10 50L0 180L22 182L34 80V230H166V80L178 182L200 180L190 50L160 30L130 20Q100 44 70 20Z"
          className="fill-ink-300"
        />
      </g>
    </svg>
  );
}
