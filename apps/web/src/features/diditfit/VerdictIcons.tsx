/** The three verdict pictures on 3.2 (§12.5): a tee pulled in, a tee with a tick, a tee pushed out. */
const SHIRT = 'M13 7L7 10 4 16l4.5 2 2-2.6V30h15V15.4l2 2.6 4.5-2-3-6-6-3q-2 3-5 3t-5-3z';

export function VerdictTooTight() {
  return (
    <Base>
      <path d={SHIRT} />
      <path d="M2 23h6M6 21l2 2-2 2M34 23h-6M30 21l-2 2 2 2" />
    </Base>
  );
}

export function VerdictPerfect() {
  return (
    <Base>
      <path d={SHIRT} />
      <path d="M14 20l3 3 5.5-6" />
    </Base>
  );
}

export function VerdictTooLoose({ selected = false }: { selected?: boolean }) {
  return (
    <Base className={selected ? 'text-fit-loose-fg' : undefined}>
      <path d={SHIRT} />
      <path d="M8 23H2M4 21l-2 2 2 2M28 23h6M32 21l2 2-2 2" />
    </Base>
  );
}

function Base({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}
