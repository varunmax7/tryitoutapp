import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { LargeTitleHeader } from '@/ui/Nav';
import { TapeCard } from '@/ui/Card';
import { SearchField } from '@/ui/Fields';
import { PillToggle } from '@/ui/Toggles';
import { BrandRow, BrandRowDivider } from '@/ui/Fit';
import { usePressable } from '@/ui/motion/usePressable';
import { IconChevronDown, IconPlus } from '@/ui/icons';
import { useDemo } from '@/app/demo';
import { isOn } from '@/app/flags';

/**
 * 1.4 My sizes — implementation.md §12.5.
 *
 * The mobile dashboard. Categories without data are disabled with "Coming soon"; the
 * rows, the measurements and the review banner are wired to the API in Phase 3, so this
 * reads from demo fixtures and shows the empty state otherwise.
 */
const CATEGORIES = ['tops', 'jeans', 'kurtas', 'shoes'] as const;

export default function MySizesRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('tops');

  const profile = demo?.demoProfile;
  const brands = demo?.demoBrands ?? [];

  return (
    <div data-screen="1.4-my-sizes" className="flex min-h-dvh flex-col gap-[10px] px-4 pt-[14px]">
      <LargeTitleHeader
        greeting={profile ? t('sizes.greeting', { name: profile.firstName }) : undefined}
        title={t('sizes.title')}
        action={
          profile ? <ProfileButton initial={profile.initial} name={profile.firstName} /> : null
        }
      />

      {profile ? (
        <TapeCard
          title={t('sizes.measurementsTitle')}
          action={
            <Link
              to="/measure"
              className="flex min-h-8 items-center text-[13px] font-semibold underline underline-offset-[3px]"
            >
              {t('sizes.edit')}
            </Link>
          }
          values={[
            { label: t('sizes.chest'), value: profile.measurements.chest },
            { label: t('sizes.waist'), value: profile.measurements.waist },
            { label: t('sizes.hip'), value: profile.measurements.hip },
            { label: t('sizes.shoulder'), value: profile.measurements.shoulder },
          ]}
        />
      ) : null}

      <SearchField
        label={t('sizes.searchLabel')}
        placeholder={t('sizes.searchPlaceholder')}
        className="mt-[2px]"
      />

      <div role="group" aria-label={t('sizes.category')} className="flex shrink-0 gap-2">
        {CATEGORIES.map((key) => (
          <PillToggle key={key} pressed={category === key} onPress={() => setCategory(key)}>
            {t(`sizes.${key}`)}
          </PillToggle>
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-between px-1 pt-1">
        <h2 className="m-0 text-[15px] font-semibold">{t('sizes.bestFit')}</h2>
        <span className="text-[13px] text-ink-500">{t('sizes.sortedByFit')}</span>
      </div>

      {brands.length > 0 ? (
        <div className="flex shrink-0 flex-col rounded-18 bg-surface-0 py-1">
          {brands.map((brand, index) => (
            <div key={brand.slug}>
              {index > 0 ? <BrandRowDivider /> : null}
              <BrandRow
                to={`/sizes/${brand.slug}/tshirt`}
                monogram={brand.monogram}
                name={brand.name}
                note={brand.note}
                size={brand.size}
                fitTag={brand.fitTag}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <RequestBrandButton label={t('sizes.requestBrand')} />

      {isOn('familyProfiles') ? null : null}
    </div>
  );
}

function ProfileButton({ initial, name }: { initial: string; name: string }) {
  const press = usePressable('scale', {
    className:
      'flex h-11 items-center gap-[6px] rounded-pill border-[1.5px] border-line-200 bg-surface-0 pr-[10px] pl-1',
  });
  return (
    <button type="button" aria-label={`Switch profile, current: ${name}`} {...press}>
      <span
        aria-hidden="true"
        className="flex size-[34px] items-center justify-center rounded-pill bg-ink-900 text-[15px] font-semibold text-surface-0"
      >
        {initial}
      </span>
      <IconChevronDown size={16} />
    </button>
  );
}

function RequestBrandButton({ label }: { label: string }) {
  const press = usePressable('scale', {
    className:
      'flex h-11 shrink-0 items-center justify-center gap-2 rounded-14 border-[1.5px] border-dashed border-dash bg-transparent text-[14px] font-semibold text-ink-900',
  });
  return (
    <button type="button" {...press}>
      <IconPlus size={18} />
      {label}
    </button>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex shrink-0 flex-col items-start gap-2 rounded-18 bg-surface-0 p-4">
      <p className="m-0 text-[16px] font-semibold">{t('sizes.emptyTitle')}</p>
      <p className="m-0 text-[14px] leading-[1.45] text-ink-500">{t('sizes.emptyBody')}</p>
      <Link
        to="/measure"
        viewTransition
        className="mt-1 flex h-11 items-center rounded-14 bg-ink-900 px-4 text-[15px] font-semibold text-surface-0 no-underline"
      >
        {t('sizes.emptyCta')}
      </Link>
    </div>
  );
}
