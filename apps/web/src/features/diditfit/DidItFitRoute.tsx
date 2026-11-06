import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { Verdict } from '@tryitout/shared';
import { Button, IconButton } from '@/ui/Button';
import { ReviewCard } from '@/ui/Card';
import { usePressable } from '@/ui/motion/usePressable';
import { haptic } from '@/lib/haptics';
import { IconCheck, IconClose, IconExchange } from '@/ui/icons';
import { useDemo } from '@/app/demo';
import { ProductThumb } from './ProductThumb';
import { VerdictPerfect, VerdictTooLoose, VerdictTooTight } from './VerdictIcons';

/**
 * 3.2 Did it fit? — implementation.md §12.5.
 *
 * One answer per purchase, which becomes a personal ease offset (§11.5). The region
 * pills only appear when the verdict is not "Perfect".
 */
const REGIONS = ['chest', 'waist', 'length', 'sleeves', 'shoulders'] as const;
const KEEP = ['keepingIt', 'returningIt', 'notSure'] as const;

export default function DidItFitRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const purchase = demo?.demoPurchase;

  const [verdict, setVerdict] = useState<Verdict | null>(demo ? 'too_loose' : null);
  const [regions, setRegions] = useState<string[]>(demo ? ['waist', 'length'] : []);
  const [keeping, setKeeping] = useState<string>(demo ? 'returningIt' : '');

  const size = purchase?.size ?? '';

  return (
    <div data-screen="3.2-did-it-fit" className="flex min-h-dvh flex-col px-4 pt-3 pb-5">
      <div className="flex items-center justify-between">
        <IconButton
          aria-label={t('nav.close')}
          className="border-line-200"
          onClick={() => history.back()}
        >
          <IconClose size={20} />
        </IconButton>
        <button type="button" className="h-11 px-3 text-[15px] font-semibold text-ink-700">
          {t('didItFit.askLater')}
        </button>
      </div>

      <h1 className="type-display-l mt-2 mb-0 leading-[1.1]">{t('didItFit.title')}</h1>
      <p className="mt-[6px] mb-0 text-[14px] text-ink-500">{t('didItFit.subcopy')}</p>

      {purchase ? (
        <div className="mt-[14px] flex items-center gap-3 rounded-18 bg-surface-0 p-[10px]">
          <ProductThumb />
          <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <span className="text-[12px] text-ink-500">{purchase.delivered}</span>
            <span className="text-[15px] font-semibold">
              {purchase.brand} · {purchase.product}
            </span>
            <span className="text-[13px] text-ink-700">
              {t('didItFit.bought')}{' '}
              <span className="font-mono font-semibold text-ink-900">{size}</span>{' '}
              {t('didItFit.weSaid', { fitTag: purchase.saidFit })}
            </span>
          </span>
        </div>
      ) : null}

      <span id="fit-q" className="mt-[18px] text-[16px] font-semibold">
        {t('didItFit.howDidItFit', { size })}
      </span>
      <div role="radiogroup" aria-labelledby="fit-q" className="mt-[10px] grid grid-cols-3 gap-2">
        <VerdictTile
          value="too_tight"
          selected={verdict === 'too_tight'}
          onSelect={setVerdict}
          label={t('didItFit.tooTight')}
          icon={<VerdictTooTight />}
        />
        <VerdictTile
          value="perfect"
          selected={verdict === 'perfect'}
          onSelect={setVerdict}
          label={t('didItFit.perfect')}
          icon={<VerdictPerfect />}
        />
        <VerdictTile
          value="too_loose"
          selected={verdict === 'too_loose'}
          onSelect={setVerdict}
          label={t('didItFit.tooLoose')}
          icon={<VerdictTooLoose selected={verdict === 'too_loose'} />}
          tint="bg-fit-loose-bg"
        />
      </div>

      {verdict && verdict !== 'perfect' ? (
        <>
          <span id="where-q" className="mt-[18px] text-[16px] font-semibold">
            {verdict === 'too_loose' ? t('didItFit.whereLoose') : t('didItFit.whereTight')}
          </span>
          <div role="group" aria-labelledby="where-q" className="mt-[10px] flex flex-wrap gap-2">
            {REGIONS.map((region) => {
              const on = regions.includes(region);
              return (
                <RegionPill
                  key={region}
                  on={on}
                  label={t(`didItFit.${region}`)}
                  onToggle={() =>
                    setRegions((current) =>
                      on ? current.filter((r) => r !== region) : [...current, region],
                    )
                  }
                />
              );
            })}
          </div>
        </>
      ) : null}

      <span id="keep-q" className="mt-[18px] text-[16px] font-semibold">
        {t('didItFit.keeping')}
      </span>
      <div
        role="radiogroup"
        aria-labelledby="keep-q"
        className="mt-[10px] grid grid-cols-3 gap-1 rounded-16 border border-line-200 bg-surface-0 p-1"
      >
        {KEEP.map((key) => (
          <KeepButton
            key={key}
            selected={keeping === key}
            label={t(`didItFit.${key}`)}
            onSelect={() => setKeeping(key)}
          />
        ))}
      </div>

      <div className="mt-[14px]">
        <ReviewCard
          icon={<IconExchange size={16} strokeWidth={2.2} />}
          title={t('didItFit.preview', {
            size: 'M',
            brand: purchase?.brand ?? '',
            category: 'shirts',
          })}
          body={t('didItFit.previewReturn', { size: 'M' })}
        />
      </div>

      <div className="mt-auto pt-3">
        <Button as={Link} to="/sizes" viewTransition>
          {t('didItFit.save')}
        </Button>
      </div>
    </div>
  );
}

function VerdictTile({
  value,
  selected,
  onSelect,
  label,
  icon,
  tint,
}: {
  value: Verdict;
  selected: boolean;
  onSelect: (value: Verdict) => void;
  label: string;
  icon: React.ReactNode;
  tint?: string;
}) {
  const press = usePressable('card', {
    className: [
      'relative flex h-25 flex-col items-center justify-center gap-2 rounded-16 text-[14px] font-semibold text-ink-900',
      selected
        ? `border-2 border-ink-900 ${tint ?? 'bg-surface-0'}`
        : 'border-[1.5px] border-line-200 bg-surface-0',
    ].join(' '),
  });
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => {
        haptic('selection');
        onSelect(value);
      }}
      {...press}
    >
      {selected ? (
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-pill bg-ink-900"
        >
          <IconCheck size={12} strokeWidth={3.5} className="text-surface-0" />
        </span>
      ) : null}
      {icon}
      {label}
    </button>
  );
}

function RegionPill({ on, label, onToggle }: { on: boolean; label: string; onToggle: () => void }) {
  const press = usePressable('scale', {
    className: [
      'flex h-11 items-center gap-[6px] rounded-pill border-[1.5px] text-[14px] font-semibold',
      on
        ? 'border-ink-900 bg-ink-900 pr-4 pl-3 text-surface-0'
        : 'border-line-200 bg-surface-0 px-4 text-ink-900',
    ].join(' '),
  });
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        haptic('selection');
        onToggle();
      }}
      {...press}
    >
      {on ? <IconCheck size={14} strokeWidth={3} className="text-marigold-500" /> : null}
      {label}
    </button>
  );
}

function KeepButton({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  const press = usePressable('scale', {
    className: `flex h-11 items-center justify-center rounded-12 text-[14px] font-semibold ${
      selected ? 'bg-ink-900 text-surface-0' : 'text-ink-700'
    }`,
  });
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} {...press}>
      {label}
    </button>
  );
}
