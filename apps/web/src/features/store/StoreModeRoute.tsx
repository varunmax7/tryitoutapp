import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { FitChip } from '@/ui/Chips';
import { usePressable } from '@/ui/motion/usePressable';
import { haptic } from '@/lib/haptics';
import {
  IconCheck,
  IconChevronRight,
  IconDownload,
  IconJeans,
  IconKurta,
  IconPolo,
  IconShoe,
  IconSizeTag,
  IconTrousers,
  IconTshirt,
} from '@/ui/icons';
import { useDemo } from '@/app/demo';

/**
 * 3.3 Store mode — implementation.md §12.5. V2, behind the `storeMode` flag.
 *
 * Works offline: the size engine runs on the device against cached charts, which is why
 * the answer card can appear with no network at all.
 */
const CATEGORY_ICONS: Record<string, typeof IconTshirt> = {
  'T-shirts': IconTshirt,
  Shirts: IconPolo,
  Jeans: IconJeans,
  Trousers: IconTrousers,
  Kurtas: IconKurta,
  Shoes: IconShoe,
};

export default function StoreModeRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const data = demo?.demoStore;
  const [store, setStore] = useState(data?.store ?? '');
  const [category, setCategory] = useState(data?.category ?? '');

  return (
    <div data-screen="3.3-store-mode" className="flex min-h-dvh flex-col px-4 pt-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <h1 className="type-display-m m-0">{t('store.title')}</h1>
        <span className="inline-flex h-7 items-center gap-[6px] rounded-pill bg-fit-great-bg px-[10px] text-[13px] font-semibold text-fit-great-fg">
          <IconDownload size={14} strokeWidth={2.2} />
          {t('store.offline')}
        </span>
      </div>
      <p className="mx-1 mt-1 mb-0 text-[14px] text-ink-500">{t('store.subcopy')}</p>

      <span id="store-q" className="mx-1 mt-4 text-[14px] font-semibold text-ink-700">
        {t('store.whichStore')}
      </span>
      <div role="radiogroup" aria-labelledby="store-q" className="hrow mt-2 -mr-4 flex gap-2 pr-4">
        {(data?.stores ?? []).map((name) => (
          <StorePill
            key={name}
            name={name}
            selected={store === name}
            onSelect={() => setStore(name)}
          />
        ))}
      </div>

      <span id="cat-q" className="mx-1 mt-4 text-[14px] font-semibold text-ink-700">
        {t('store.whatPicking')}
      </span>
      <div role="radiogroup" aria-labelledby="cat-q" className="mt-2 grid grid-cols-3 gap-2">
        {(data?.categories ?? []).map((name) => (
          <CategoryTile
            key={name}
            name={name}
            selected={category === name}
            onSelect={() => setCategory(name)}
          />
        ))}
      </div>

      {data ? (
        <div
          aria-live="polite"
          className="relative mt-4 overflow-hidden rounded-22 bg-marigold-500 px-[18px] pt-4 pb-[26px]"
        >
          <span className="text-[13px] font-semibold">
            {t('store.at', { store, category, fit: data.fitLine })}
          </span>
          <div className="mt-[2px] flex items-baseline justify-between gap-3">
            <span className="type-numeral-store leading-[1.05]">
              {t('store.grab', { size: data.size })}
            </span>
            <FitChip tag={data.fitTag} size={13} className="h-7 shrink-0 px-[10px]" />
          </div>
          <p className="mt-[6px] mb-0 text-[14px]">{data.note}</p>
          <TapeRuler />
        </div>
      ) : null}

      <Link
        to="/scan/size-tag"
        viewTransition
        className="mt-3 flex min-h-16 items-center gap-3 rounded-18 border border-line-200 bg-surface-0 px-[14px] py-[10px] text-left no-underline"
      >
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-12 bg-surface-100"
        >
          <IconSizeTag size={20} />
        </span>
        <span className="flex flex-1 flex-col gap-[2px]">
          <span className="text-[15px] font-semibold">{t('store.scanTag')}</span>
          <span className="text-[13px] text-ink-500">{t('store.scanTagSub')}</span>
        </span>
        <IconChevronRight size={20} className="text-ink-500" />
      </Link>
    </div>
  );
}

/** The marigold answer card carries the same tick ruler as the TapeCard (§12.4). */
function TapeRuler() {
  const ticks: string[] = [];
  for (let x = 7, i = 0; x < 350; x += 7, i += 1) {
    ticks.push(`M${x} 12v-${(i + 1) % 5 === 0 ? 9 : 5}`);
  }
  return (
    <svg
      width="358"
      height="12"
      viewBox="0 0 350 12"
      aria-hidden="true"
      className="absolute bottom-0 left-0"
    >
      <path d={ticks.join('')} className="stroke-ink-900" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

function StorePill({
  name,
  selected,
  onSelect,
}: {
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const press = usePressable('scale', {
    className: [
      'flex h-11 shrink-0 items-center gap-[6px] rounded-pill border-[1.5px] text-[14px] font-semibold',
      selected
        ? 'border-ink-900 bg-ink-900 pr-4 pl-3 text-surface-0'
        : 'border-line-200 bg-surface-0 px-4 text-ink-900',
    ].join(' '),
  });
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => {
        haptic('selection');
        onSelect();
      }}
      {...press}
    >
      {selected ? <IconCheck size={14} strokeWidth={3} className="text-marigold-500" /> : null}
      {name}
    </button>
  );
}

function CategoryTile({
  name,
  selected,
  onSelect,
}: {
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = CATEGORY_ICONS[name] ?? IconTshirt;
  const press = usePressable('card', {
    className: [
      'relative flex h-20 flex-col items-center justify-center gap-[6px] rounded-16 text-[14px] font-semibold',
      selected
        ? 'border-2 border-ink-900 bg-ink-900 text-surface-0'
        : 'border-[1.5px] border-line-200 bg-surface-0 text-ink-900',
    ].join(' '),
  });
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => {
        haptic('selection');
        onSelect();
      }}
      {...press}
    >
      {selected ? (
        <span
          aria-hidden="true"
          className="absolute top-[7px] right-[7px] flex size-[18px] items-center justify-center rounded-pill bg-marigold-500"
        >
          <IconCheck size={11} strokeWidth={3} className="text-ink-900" />
        </span>
      ) : null}
      <Icon size={24} strokeWidth={1.8} />
      {name}
    </button>
  );
}
