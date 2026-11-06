import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { AppIcon } from '@/ui/AppMark';
import { ConfidenceChip, FitChip } from '@/ui/Chips';
import { usePressable } from '@/ui/motion/usePressable';
import { IconBag, IconClose, IconCube, IconFamily } from '@/ui/icons';
import { ProductThumb } from '@/features/diditfit/ProductThumb';
import { useDemo } from '@/app/demo';
import { BackdropPage } from './BackdropPage';

/**
 * 3.1 Share-to-check — implementation.md §12.5. Also the PWA share target.
 *
 * A sheet over whatever app the link came from. It opens at its designed height and
 * drags to full; Phase 7 wires the parser, the needs-input variant and the reminder
 * toast shown before leaving for the store.
 */
export default function ShareToCheckRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const check = demo?.demoShareCheck;

  return (
    <div data-screen="3.1-share-to-check" className="relative h-dvh overflow-hidden bg-surface-0">
      <BackdropPage />
      <div aria-hidden="true" className="absolute inset-0 bg-scrim" />

      {check ? (
        <section
          aria-label="Tryitout size check"
          className="absolute inset-x-0 bottom-0 flex h-[548px] flex-col rounded-t-28 bg-surface-0 px-4 pt-[10px] pb-[22px]"
        >
          <span aria-hidden="true" className="h-1 w-10 self-center rounded-[2px] bg-line-300" />

          <div className="mt-[10px] flex items-center gap-[10px]">
            <AppIcon size={32} className="shrink-0" />
            <span className="flex flex-1 flex-col">
              <span className="text-[15px] leading-5 font-semibold">{t('app.name')}</span>
              <span className="text-[12px] leading-4 text-ink-500">{t('check.header')}</span>
            </span>
            <button
              type="button"
              aria-label={t('nav.close')}
              className="flex size-11 items-center justify-center rounded-pill border border-line-200 bg-surface-0 p-0"
            >
              <IconClose size={18} />
            </button>
          </div>

          <div className="mt-[14px] flex items-center gap-3 rounded-16 bg-surface-50 p-[10px]">
            <ProductThumb width={52} height={60} />
            <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <span className="text-[15px] font-semibold">
                {check.brand} · {check.productType}
              </span>
              <span className="text-[13px] text-ink-500">
                {t('check.sizesOnPage', { sizes: check.sizesOnPage })}
              </span>
            </span>
          </div>

          <div className="mt-4 flex items-center gap-[14px]">
            <span
              aria-hidden="true"
              className="type-numeral-tile flex size-19 shrink-0 items-center justify-center rounded-20 bg-marigold-500 text-ink-900"
            >
              {check.size}
            </span>
            <span className="flex flex-col gap-2">
              <span className="type-display-s leading-[1.1] tracking-[-0.01em]">
                {t('check.take', { size: check.size })}
              </span>
              <span className="flex gap-[6px]">
                <FitChip tag={check.fitTag} size={13} className="h-[26px] px-[10px]" />
                <ConfidenceChip label={check.confidence} className="h-[26px] px-[10px]" />
              </span>
            </span>
          </div>

          <dl className="mt-4 mb-0 flex flex-col rounded-16 border border-line-200 px-[14px] py-[2px]">
            {check.notes.map((note, index, all) => (
              <div
                key={note.label}
                className={`flex gap-3 py-[10px] ${index < all.length - 1 ? 'border-b border-line-100' : ''}`}
              >
                <dt className="w-16 shrink-0 text-[14px] text-ink-500">{note.label}</dt>
                <dd
                  className={`m-0 text-[14px] font-semibold ${note.warn ? 'text-fit-tight-fg' : ''}`}
                >
                  {note.mono ? <span className="font-mono">{note.mono}</span> : null}
                  {note.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mx-[2px] mt-2 mb-0 text-[12px] text-ink-500">{check.basis}</p>

          <div className="mt-auto flex flex-col gap-[10px]">
            <div className="grid grid-cols-2 gap-[10px]">
              <SheetButton
                as="link"
                to="/try"
                icon={<IconCube size={18} />}
                label={t('check.tryItOn')}
              />
              <SheetButton icon={<IconFamily size={18} />} label={t('check.askFamily')} />
            </div>
            <Link
              to="/did-it-fit/demo"
              viewTransition
              className="flex h-[54px] items-center justify-center gap-[10px] rounded-16 bg-ink-900 text-[17px] font-semibold text-surface-0 no-underline"
            >
              <IconBag size={20} />
              {t('check.buy', { size: check.size })}
            </Link>
            <p className="m-0 text-center text-[12px] text-ink-500">
              {t('check.buyCaption', { store: check.store, size: check.size })}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SheetButton({
  as,
  to,
  icon,
  label,
}: {
  as?: 'link';
  to?: string;
  icon: React.ReactNode;
  label: string;
}) {
  const press = usePressable('scale', {
    className:
      'flex h-12 items-center justify-center gap-2 rounded-14 border-[1.5px] border-line-300 bg-surface-0 text-[15px] font-semibold text-ink-900 no-underline',
  });
  if (as === 'link' && to) {
    return (
      <Link to={to} viewTransition {...press}>
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <button type="button" {...press}>
      {icon}
      {label}
    </button>
  );
}
