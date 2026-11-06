import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { TopBar } from '@/ui/Nav';
import { Button, IconButton } from '@/ui/Button';
import { FitChip, ConfidenceChip } from '@/ui/Chips';
import { Segmented } from '@/ui/Toggles';
import { FitBar } from '@/ui/Fit';
import { IconCube, IconExternalLink, IconShare } from '@/ui/icons';
import { useDemo } from '@/app/demo';

/**
 * 1.5 Brand fit detail — implementation.md §12.5.
 *
 * The hero tile, the S/M/L compare and the per-region fit bars. Conversions appear only
 * when the brand publishes them; they are never invented (§11.3 step 10).
 */
export default function BrandFitDetailRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const detail = demo?.demoBrandDetail;
  const [size, setSize] = useState(detail?.size ?? 'M');

  if (!detail) {
    return (
      <div data-screen="1.5-brand-fit-detail" className="flex min-h-dvh flex-col">
        <TopBar backTo="/sizes" title="" />
      </div>
    );
  }

  return (
    <div data-screen="1.5-brand-fit-detail" className="flex min-h-dvh flex-col">
      <TopBar
        backTo="/sizes"
        title={`${detail.brand} · ${detail.category}`}
        action={
          <IconButton aria-label={t('brand.share')} className="border-0 bg-transparent">
            <IconShare size={22} />
          </IconButton>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pt-[10px]">
        <section className="flex flex-col gap-3 rounded-22 bg-surface-0 p-4">
          <div className="flex items-center gap-4">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-20 bg-marigold-500">
              <span className="type-numeral-hero">{detail.size}</span>
            </div>
            <div className="flex min-w-0 flex-col gap-[6px]">
              <span className="text-[13px] text-ink-500">
                {t('brand.yourSizeAt', { brand: detail.brand })}
              </span>
              <span className="type-title-l">
                {t('brand.categoryFit', { category: detail.category, fit: detail.fitLine })}
              </span>
              <span className="flex flex-wrap gap-[6px]">
                <FitChip tag={detail.fitTag} size={12} className="px-[10px] py-[3px]" />
                <ConfidenceChip label={detail.confidence} className="px-[10px] py-[3px]" />
              </span>
            </div>
          </div>
          <p className="m-0 text-[13px] leading-[1.45] text-ink-500">{detail.basis}</p>
        </section>

        <Segmented
          label={t('brand.compareSizes')}
          track="surface-150"
          tall
          value={size}
          onChange={setSize}
          items={detail.alternatives.map((alt) => ({
            value: alt.size,
            label: <span className="type-numeral text-[16px]">{alt.size}</span>,
            sub: alt.word,
          }))}
        />

        <section className="flex flex-col gap-[14px] rounded-22 bg-surface-0 p-4">
          <h2 className="m-0 text-[16px] font-semibold">{t('brand.howItFits', { size })}</h2>
          {detail.regions.map((region, index) => (
            <div key={region.name} className="flex flex-col gap-2">
              <div className="flex justify-between text-[14px]">
                <span className="font-semibold">{region.name}</span>
                <span className="text-ink-700">
                  <span className="font-mono">{region.ease}</span> {t('brand.room')}
                </span>
              </div>
              <FitBar
                value={region.value}
                labels={
                  index === 0 ? [t('brand.tight'), t('brand.good'), t('brand.loose')] : undefined
                }
              />
            </div>
          ))}
          <div aria-hidden="true" className="h-px bg-line-100" />
          <div className="grid grid-cols-2 gap-3">
            {detail.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-[2px]">
                <span className="text-[12px] text-ink-500">{fact.label}</span>
                <span
                  className={`text-[14px] font-semibold ${fact.label === 'Same size elsewhere' ? 'font-mono' : ''}`}
                >
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-10 flex shrink-0 flex-col gap-[10px] bg-surface-50 px-4 pt-3 pb-5">
        <Button as={Link} to="/try" viewTransition>
          <IconCube size={20} />
          {t('brand.tryItOn', { size })}
        </Button>
        <Button as={Link} to="/check" variant="secondary" className="h-12 rounded-16 border-dash">
          {t('brand.shop', { brand: detail.brand, size })}
          <IconExternalLink size={18} />
        </Button>
      </div>
    </div>
  );
}
