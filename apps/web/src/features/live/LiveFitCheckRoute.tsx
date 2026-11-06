import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { FitChip } from '@/ui/Chips';
import { Switch } from '@/ui/Toggles';
import { FitCallout, FitLegend } from '@/ui/Camera';
import { usePressable } from '@/ui/motion/usePressable';
import { haptic } from '@/lib/haptics';
import { IconCameraSwitch, IconClose, IconCube, IconFamily } from '@/ui/icons';
import { useDemo } from '@/app/demo';
import { StageArt } from './StageArt';

/**
 * 2.3 Live fit check — implementation.md §12.5.
 *
 * The camera and the three.js layer both run on the device; the feed never leaves it.
 * Fit-map colours come from fitmap.json and are applied as a shader uniform in the
 * render loop, not React state (§12.8.8) — Phase 6 wires that.
 */
export default function LiveFitCheckRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const [size, setSize] = useState('L');
  const [fitMap, setFitMap] = useState(true);
  const brand = demo?.demoBuild.brand ?? '';

  return (
    <div
      data-screen="2.3-live-fit-check"
      className="relative h-dvh overflow-hidden bg-dark-900 text-surface-0"
    >
      <StageArt />

      <div className="absolute top-3 right-4 left-4 flex h-11 items-center justify-between">
        <Link
          to="/try"
          viewTransition
          aria-label="Close live fit check"
          className="flex size-11 items-center justify-center rounded-pill border border-dark-line bg-overlay-72 text-surface-0"
        >
          <IconClose size={20} />
        </Link>
        <span className="flex h-9 items-center gap-2 rounded-pill border border-dark-line bg-overlay-72 px-[14px] text-[13px] font-semibold">
          <span aria-hidden="true" className="size-2 rounded-pill bg-marigold-500" />
          {t('live.pill', { brand, size })}
        </span>
        <button
          type="button"
          aria-label={t('scan.switchCamera')}
          className="flex size-11 items-center justify-center rounded-pill border border-dark-line bg-overlay-72 p-0"
        >
          <IconCameraSwitch size={20} />
        </button>
      </div>

      {fitMap ? (
        <>
          <div className="absolute top-[68px] left-3">
            <FitLegend
              items={[
                { status: 'snug', label: t('live.snug') },
                { status: 'right', label: t('live.justRight') },
                { status: 'roomy', label: t('live.roomy') },
              ]}
            />
          </div>
          <div className="absolute top-[178px] left-[238px]">
            <FitCallout status="right" title={t('live.justRight')} detail="Shoulders & chest" />
          </div>
          <div className="absolute top-[280px] left-2">
            <FitCallout status="snug" title={t('live.snug')} detail="Biceps +2 cm" />
          </div>
          <div className="absolute top-[462px] left-[252px]">
            <FitCallout status="roomy" title={t('live.roomy')} detail="Waist, by design" />
          </div>
        </>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex h-[220px] flex-col gap-3 rounded-t-24 border-t border-dark-line-2 bg-dark-800 px-4 pt-[14px] pb-[18px]">
        <div className="flex items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Size shown"
            className="flex gap-[2px] rounded-[15px] border border-dark-line bg-dark-900 p-[3px]"
          >
            <SizeTab active={size === 'M'} onSelect={() => setSize('M')}>
              <span className="font-mono text-[15px]">M</span>
            </SizeTab>
            <SizeTab active={size === 'L'} onSelect={() => setSize('L')}>
              <span className="font-mono text-[15px]">L</span>
              {size === 'L' ? t('live.yourSize') : null}
            </SizeTab>
          </div>
          <div className="flex items-center gap-[10px]">
            <span id="fitmap-label" className="text-[14px] font-semibold text-on-dark-100">
              {t('live.fitMap')}
            </span>
            <Switch checked={fitMap} onChange={setFitMap} label={t('live.fitMap')} onDark />
          </div>
        </div>

        <div className="flex items-center gap-[10px]">
          <FitChip tag="good" size={13} className="h-[26px] shrink-0 gap-[5px] px-[10px]" />
          <span className="text-[14px] text-on-dark-300">L fits well and ends at your hip.</span>
        </div>

        <div
          className="mt-auto grid items-start"
          style={{ gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)' }}
        >
          <ActionButton icon={<IconFamily size={22} />} label={t('live.askFamily')} />
          <ShutterButton label={t('live.snap')} />
          <ActionButton icon={<IconCube size={22} />} label={t('live.view3d')} />
        </div>
      </div>
    </div>
  );
}

function SizeTab({
  active,
  onSelect,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  const press = usePressable('scale', {
    className: `flex h-11 items-center justify-center gap-[6px] rounded-12 px-[14px] text-[14px] font-semibold ${
      active ? 'bg-marigold-500 text-ink-900' : 'min-w-14 text-on-dark-100'
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
      {children}
    </button>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  const press = usePressable('scale', {
    className:
      'flex flex-col items-center gap-[6px] justify-self-center bg-transparent p-0 text-[12px] font-semibold text-on-dark-100',
  });
  return (
    <button type="button" {...press}>
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-pill border border-dark-line bg-dark-650"
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function ShutterButton({ label }: { label: string }) {
  const press = usePressable('scale', {
    className:
      'flex flex-col items-center gap-1 bg-transparent p-0 text-[12px] font-semibold text-on-dark-100',
  });
  return (
    <button type="button" {...press}>
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-pill border-4 border-surface-0"
      >
        <span className="size-12 rounded-pill bg-surface-0" />
      </span>
      {label}
    </button>
  );
}
