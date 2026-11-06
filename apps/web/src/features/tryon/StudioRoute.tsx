import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Switch } from '@/ui/Toggles';
import { usePressable } from '@/ui/motion/usePressable';
import { haptic } from '@/lib/haptics';
import {
  IconBag,
  IconCamera,
  IconCheck,
  IconCube,
  IconFamily,
  IconImage,
  IconRotate,
  IconVideo,
} from '@/ui/icons';
import { DesktopSidebar } from '@/features/sizes/DesktopSidebar';
import { useDemo } from '@/app/demo';
import { GarmentCutout } from './GarmentCutout';
import { StudioStage } from './StudioStage';

/**
 * 4.2 Web: Try-on studio — implementation.md §12.5, the desktop try-on at 1024px and up.
 *
 * Two sizes on the body side by side, which is the thing a phone cannot show well.
 * The orbit, the webcam view and the real GLB arrive in Phase 6 and Phase 10.
 */
const TONES = {
  great: 'bg-fit-great-bg text-fit-great-fg',
  tight: 'bg-fit-tight-bg text-fit-tight-fg',
} as const;

export default function StudioRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const data = demo?.demoStudio;
  const profile = demo?.demoProfile;
  const [fitMap, setFitMap] = useState(true);
  const [sideBySide, setSideBySide] = useState(true);
  const [angle, setAngle] = useState('Front');

  if (!data) {
    return (
      <div data-screen="4.2-web-try-on-studio" className="flex min-h-dvh bg-surface-50">
        <DesktopSidebar />
      </div>
    );
  }

  return (
    <div data-screen="4.2-web-try-on-studio" className="flex min-h-dvh bg-surface-50">
      <DesktopSidebar {...(profile ? { name: profile.firstName } : {})} />

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-10 pt-8 pb-10">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="type-display-xl m-0">Try-on studio</h1>
            <p className="mt-1 mb-0 text-[15px] text-ink-500">{data.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <HeaderButton icon={<IconFamily size={18} />} label={t('live.askFamily')} />
            <HeaderButton icon={<IconImage size={18} />} label="Save snapshot" />
            <Link
              to="/check"
              viewTransition
              className="flex h-12 items-center gap-2 rounded-14 bg-ink-900 px-[18px] text-[15px] font-semibold text-surface-0 no-underline"
            >
              <IconBag size={18} />
              Shop {data.brand} in {data.selected}
            </Link>
          </div>
        </header>

        <div className="flex flex-wrap items-start gap-6">
          <section
            aria-labelledby="garment-h"
            className="flex min-w-[300px] flex-col gap-4 rounded-24 border border-line-200 bg-surface-0 p-5"
            style={{ flex: '0 1 340px' }}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="garment-h" className="m-0 text-[16px] font-semibold">
                Garment
              </h2>
              <HeaderButton icon={<IconCamera size={16} />} label="Replace photo" small />
            </div>
            <GarmentCutout wide />
            <p className="m-0 -mt-[6px] flex items-center gap-[6px] text-[13px] font-semibold text-fit-great-fg">
              <IconCheck size={14} strokeWidth={2.6} />
              Cut out and sewing pattern read
            </p>
            <div className="grid grid-cols-2 gap-[10px]">
              <StudioField id="wt-brand" label={t('try.brand')} value={data.brand} />
              <StudioField id="wt-style" label="Style" value={data.style} />
            </div>

            <div className="flex flex-col gap-2">
              <span id="wt-size-label" className="text-[14px] font-semibold">
                Sizes on your body
              </span>
              <div
                role="group"
                aria-labelledby="wt-size-label"
                className="grid grid-cols-6 gap-[6px]"
              >
                {data.sizes.map((size) => (
                  <StudioSize
                    key={size}
                    size={size}
                    state={
                      size === data.selected
                        ? 'selected'
                        : size === data.compare
                          ? 'compare'
                          : 'default'
                    }
                  />
                ))}
              </div>
              <p className="m-0 flex items-center gap-[6px] text-[13px] text-ink-700">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-pill bg-marigold-500" />
                {data.sizeCaption}
              </p>
            </div>

            <div className="flex min-h-11 items-center justify-between gap-3 border-t border-line-100 pt-1">
              <span id="wt-compare-label" className="text-[15px]">
                Side-by-side compare
              </span>
              <Switch checked={sideBySide} onChange={setSideBySide} label="Side-by-side compare" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold">{data.chartTitle}</span>
              <dl className="m-0 grid grid-cols-3 gap-2">
                {data.chart.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col-reverse gap-[2px] rounded-12 bg-surface-50 px-3 py-[10px]"
                  >
                    <dt className="text-[12px] text-ink-500">{item.label}</dt>
                    <dd className="type-numeral m-0 text-[18px]">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <span className="text-[12px] text-ink-500">All in cm</span>
            </div>
          </section>

          <div className="flex min-w-0 flex-col gap-4" style={{ flex: '1 1 560px' }}>
            <section
              aria-label="3D try-on"
              data-on-dark
              className="flex flex-col gap-2 rounded-24 bg-dark-900 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="group"
                  aria-label="View"
                  className="flex gap-[2px] rounded-[15px] border border-dark-line bg-dark-800 p-[3px]"
                >
                  <span className="flex h-11 items-center gap-2 rounded-12 bg-marigold-500 px-4 text-[14px] font-semibold text-ink-900">
                    <IconCube size={18} />
                    3D view
                  </span>
                  <Link
                    to="/try/live/demo"
                    viewTransition
                    className="flex h-11 items-center gap-2 rounded-12 px-4 text-[14px] font-semibold text-on-dark-100 no-underline"
                  >
                    <IconVideo size={18} />
                    Live camera
                  </Link>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span id="wt-fitmap-label" className="text-[14px] font-semibold text-on-dark-100">
                    {t('live.fitMap')}
                  </span>
                  <Switch checked={fitMap} onChange={setFitMap} label={t('live.fitMap')} onDark />
                </div>
              </div>

              <StudioStage />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-[14px]">
                  <LegendItem className="bg-map-snug" label={t('live.snug')} />
                  <LegendItem className="bg-map-right" label={t('live.justRight')} />
                  <LegendItem className="bg-map-roomy" label={t('live.roomy')} />
                  <span className="flex items-center gap-[6px] text-[13px] text-on-dark-300">
                    <IconRotate size={16} />
                    Drag to turn
                  </span>
                </div>
                <div
                  role="group"
                  aria-label="Angle"
                  className="flex gap-[2px] rounded-[15px] border border-dark-line bg-dark-800 p-[3px]"
                >
                  {['Front', 'Side', 'Back'].map((name) => (
                    <AngleButton
                      key={name}
                      label={name}
                      active={angle === name}
                      onSelect={() => setAngle(name)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3 rounded-18 border border-line-200 bg-surface-0 px-[18px] py-[14px]">
              <span className="inline-flex h-7 shrink-0 items-center gap-[6px] rounded-pill bg-fit-great-bg px-3 text-[13px] font-semibold text-fit-great-fg">
                <IconCheck size={14} strokeWidth={2.6} />
                {data.verdict.chip}
              </span>
              <span className="text-[15px]">{data.verdict.line}</span>
            </div>

            <div className="flex flex-wrap gap-4">
              {data.notes.map((note) => (
                <section
                  key={note.region}
                  aria-labelledby={`n-${note.region.toLowerCase()}`}
                  className="min-w-0 rounded-18 border border-line-200 bg-surface-0 px-4 py-[14px]"
                  style={{ flex: '1 1 200px' }}
                >
                  <h3
                    id={`n-${note.region.toLowerCase()}`}
                    className="m-0 text-[14px] font-semibold text-ink-700"
                  >
                    {note.region}
                  </h3>
                  <dl className="mt-[10px] mb-0 flex flex-col gap-2">
                    {note.rows.map((row) => (
                      <div key={row.size} className="flex items-center gap-[10px]">
                        <dt
                          className={`type-numeral flex size-7 shrink-0 items-center justify-center rounded-8 text-[13px] ${
                            row.size === data.selected
                              ? 'bg-marigold-500'
                              : 'border-[1.5px] border-line-300'
                          }`}
                        >
                          {row.size}
                        </dt>
                        <dd className="m-0 flex flex-1 items-center justify-between gap-2">
                          <span className="type-numeral text-[14px]">{row.value}</span>
                          <span
                            className={`inline-flex h-6 items-center rounded-pill px-[9px] text-[12px] font-semibold ${TONES[row.tone]}`}
                          >
                            {row.tag}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function HeaderButton({
  icon,
  label,
  small = false,
}: {
  icon: React.ReactNode;
  label: string;
  small?: boolean;
}) {
  const press = usePressable('scale', {
    className: small
      ? 'flex h-11 items-center gap-[6px] rounded-12 border-[1.5px] border-line-200 bg-surface-0 px-[14px] text-[14px] font-semibold text-ink-900'
      : 'flex h-12 items-center gap-2 rounded-14 border-[1.5px] border-line-300 bg-surface-0 px-4 text-[15px] font-semibold text-ink-900',
  });
  return (
    <button type="button" {...press}>
      {icon}
      {label}
    </button>
  );
}

function StudioField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="text-[12px] font-semibold text-ink-700">
        {label}
      </label>
      <div className="flex h-11 items-center rounded-12 border-[1.5px] border-line-300 px-3">
        <input
          id={id}
          defaultValue={value}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] font-semibold text-ink-900 outline-none"
        />
      </div>
    </div>
  );
}

function StudioSize({ size, state }: { size: string; state: 'default' | 'selected' | 'compare' }) {
  const press = usePressable('scale', {
    className: [
      'type-numeral flex h-11 items-center justify-center rounded-12 p-0 text-[14px]',
      state === 'selected'
        ? 'border-2 border-ink-900 bg-ink-900 text-surface-0'
        : state === 'compare'
          ? 'border-[1.5px] border-ink-900 bg-marigold-100 text-ink-900'
          : 'border-[1.5px] border-line-200 bg-surface-0 text-ink-700',
    ].join(' '),
  });
  return (
    <button type="button" aria-pressed={state !== 'default'} {...press}>
      {size}
    </button>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-[7px] text-[13px] text-on-dark-100">
      <span aria-hidden="true" className={`size-3 rounded-3 ${className}`} />
      {label}
    </span>
  );
}

function AngleButton({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  const press = usePressable('scale', {
    className: `flex h-11 items-center rounded-12 px-[14px] text-[14px] font-semibold ${
      active ? 'bg-dark-600 text-surface-0' : 'text-on-dark-300'
    }`,
  });
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        haptic('selection');
        onSelect();
      }}
      {...press}
    >
      {label}
    </button>
  );
}
