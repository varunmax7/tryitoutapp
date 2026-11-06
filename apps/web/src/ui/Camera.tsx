import type { ReactNode } from 'react';

/**
 * Camera and 3D overlays — implementation.md §12.4.
 * Everything here sits on the dark UI, over the live feed or the three.js stage, so the
 * colours come from the overlay and on-dark tokens rather than the light palette.
 */

export type CameraCheck = { label: string; passed: boolean; warning?: boolean };

/** Checklist chips, step pill and shutter for 1.3 and 2.3. */
export function CameraOverlay({
  step,
  checks,
  children,
}: {
  step?: ReactNode;
  checks?: CameraCheck[];
  children?: ReactNode;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col" data-on-dark>
      {step ? (
        <div className="flex justify-center pt-3">
          <span className="rounded-pill bg-overlay-72 px-3 py-[6px] text-[13px] font-semibold text-on-dark-100">
            {step}
          </span>
        </div>
      ) : null}
      {checks?.length ? (
        <div className="mt-auto flex flex-col items-center gap-[6px] pb-4">
          {checks.map((check) => (
            <span
              key={check.label}
              className={`flex items-center gap-2 rounded-pill px-3 py-[6px] text-[13px] ${
                check.warning ? 'bg-marigold-100 text-marigold-ink' : 'bg-glass-10 text-on-dark-100'
              }`}
            >
              <CheckDot passed={check.passed} />
              {check.label}
            </span>
          ))}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function CheckDot({ passed }: { passed: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`size-[14px] rounded-pill ${passed ? 'bg-on-dark-success' : 'bg-glass-12'}`}
    />
  );
}

/** The shutter: a 64 to 78px white ring that fills marigold once every check passes. */
export function Shutter({
  armed,
  onCapture,
  size = 78,
  label = 'Take photo',
}: {
  armed: boolean;
  onCapture: () => void;
  size?: number;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!armed}
      onClick={onCapture}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`pointer-events-auto flex items-center justify-center rounded-pill border-4 ${
        armed ? 'border-marigold-500' : 'border-surface-0/60'
      }`}
    >
      <span
        aria-hidden="true"
        className={`block rounded-pill ${armed ? 'bg-marigold-500' : 'bg-surface-0'}`}
        style={{ width: `${size - 18}px`, height: `${size - 18}px` }}
      />
    </button>
  );
}

export type MapStatus = 'snug' | 'right' | 'roomy';

const MAP_BORDER: Record<MapStatus, string> = {
  snug: 'border-l-map-snug',
  right: 'border-l-map-right',
  roomy: 'border-l-map-roomy',
};

/** FitCallout — overlay-86 with a 3px left border in the fit-map colour. */
export function FitCallout({
  status,
  title,
  detail,
}: {
  status: MapStatus;
  title: string;
  detail: string;
}) {
  return (
    <div
      className={`rounded-10 border border-dark-line border-l-[3px] bg-overlay-86 px-3 py-2 ${MAP_BORDER[status]}`}
    >
      <p className="m-0 text-[13px] font-semibold text-surface-0">{title}</p>
      <p className="m-0 text-[12px] text-on-dark-300">{detail}</p>
    </div>
  );
}

/** FitLegend — overlay-82 card with 12px swatches. */
export function FitLegend({
  items = [
    { status: 'snug' as const, label: 'Snug' },
    { status: 'right' as const, label: 'Just right' },
    { status: 'roomy' as const, label: 'Roomy' },
  ],
}: {
  items?: { status: MapStatus; label: string }[];
}) {
  const swatch: Record<MapStatus, string> = {
    snug: 'bg-map-snug',
    right: 'bg-map-right',
    roomy: 'bg-map-roomy',
  };
  return (
    <div className="rounded-12 bg-overlay-82 p-3">
      <p className="type-micro m-0 text-on-dark-400">Fit map</p>
      <ul className="m-0 mt-2 flex list-none flex-col gap-[6px] p-0">
        {items.map((item) => (
          <li key={item.status} className="flex items-center gap-2 text-[12px] text-on-dark-300">
            <span aria-hidden="true" className={`size-3 rounded-3 ${swatch[item.status]}`} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
