import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/ui/Button';
import { SizePicker } from '@/ui/Fit';
import { Switch } from '@/ui/Toggles';
import { usePressable } from '@/ui/motion/usePressable';
import { IconCamera, IconCheck, IconCube, IconImage, IconLink, IconUpload } from '@/ui/icons';
import { useDemo } from '@/app/demo';
import { GarmentCutout } from './GarmentCutout';

/**
 * 2.1 Try it on — implementation.md §12.5.
 *
 * Garment intake and the size picker. The drop zone, /garment/analyze and the daily cap
 * land in Phase 5; this is the layout, the size selection and the compare switch.
 */
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function TryItOnRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const [size, setSize] = useState('L');
  const [compare, setCompare] = useState(true);

  return (
    <div data-screen="2.1-try-it-on" className="flex min-h-dvh flex-col gap-3 px-4 pt-4">
      <div className="flex flex-col gap-[2px] px-1">
        <h1 className="type-display-m m-0">{t('try.title')}</h1>
        <p className="m-0 text-[14px] text-ink-500">{t('try.subcopy')}</p>
      </div>

      <div className="flex flex-col items-center gap-[10px] rounded-22 border-[1.5px] border-dashed border-ink-300 bg-surface-0 px-4 py-[18px] text-center">
        <span
          aria-hidden="true"
          className="flex size-[52px] items-center justify-center rounded-pill bg-marigold-500"
        >
          <IconUpload size={24} strokeWidth={1.8} />
        </span>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[16px] font-semibold">{t('try.dropTitle')}</span>
          <span className="text-[13px] text-ink-500">{t('try.dropSub')}</span>
        </div>
        <div className="mt-[2px] flex gap-2">
          <IntakeButton icon={<IconImage size={18} />} label={t('try.gallery')} />
          <IntakeButton icon={<IconLink size={18} />} label={t('try.pasteLink')} />
          <IntakeButton icon={<IconCamera size={18} />} label={t('try.camera')} />
        </div>
      </div>

      {demo ? (
        <div className="flex items-stretch gap-[14px] rounded-22 bg-surface-0 p-[14px]">
          <GarmentCutout />
          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            <span className="flex items-center gap-[6px] text-[12px] font-semibold text-fit-great-fg">
              <IconCheck size={14} strokeWidth={2.6} />
              {t('try.cutOut')}
            </span>
            <span className="text-[16px] font-semibold">{demo.demoBuild.type}</span>
            <label htmlFor="garment-brand" className="text-[12px] font-semibold text-ink-700">
              {t('try.brand')}
            </label>
            <div className="flex h-11 items-center gap-2 rounded-12 border-[1.5px] border-line-300 pr-[6px] pl-3">
              <input
                id="garment-brand"
                defaultValue={demo.demoBuild.brand}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] font-semibold text-ink-900 outline-none pointer-coarse:text-[16px]"
              />
              <span className="rounded-pill bg-surface-100 px-2 py-[3px] text-[11px] font-semibold text-ink-700">
                {t('try.detected')}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-[10px] rounded-22 bg-surface-0 p-[14px]">
        <span className="text-[15px] font-semibold">{t('try.sizeToTry')}</span>
        <SizePicker
          label={t('try.sizeToTry')}
          sizes={SIZES}
          selected={size}
          onSelect={setSize}
          caption={t('try.sizeCaption', { size: 'L', brand: demo?.demoBuild.brand ?? '' })}
        />
        <div aria-hidden="true" className="h-px bg-line-100" />
        <div className="flex min-h-11 items-center justify-between gap-3">
          <span id="compare-label" className="text-[15px]">
            {t('try.compare', { size: 'M' })}
          </span>
          <Switch checked={compare} onChange={setCompare} label={t('try.compare', { size: 'M' })} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button as={Link} to="/try/build/demo" viewTransition>
          <IconCube size={20} />
          {t('try.build')}
        </Button>
        <p className="m-0 text-center text-[12px] text-ink-500">{t('try.buildCaption')}</p>
      </div>
    </div>
  );
}

function IntakeButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  const press = usePressable('scale', {
    className:
      'flex h-11 items-center gap-[6px] rounded-pill border-[1.5px] border-line-200 bg-surface-0 px-[14px] text-[14px] font-semibold text-ink-900',
  });
  return (
    <button type="button" {...press}>
      {icon}
      {label}
    </button>
  );
}
