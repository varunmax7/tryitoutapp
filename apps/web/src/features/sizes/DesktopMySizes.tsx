import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { FitChip } from '@/ui/Chips';
import { usePressable } from '@/ui/motion/usePressable';
import {
  IconArrowRight,
  IconCube,
  IconPencil,
  IconPlus,
  IconSearchDesk,
  IconSort,
} from '@/ui/icons';
import { RecentThumb } from './RecentThumb';
import { useDemo } from '@/app/demo';
import { DesktopSidebar } from './DesktopSidebar';

/** 4.1 Web: My sizes — implementation.md §12.5, the desktop dashboard at 1024px and up. */
export function DesktopMySizes() {
  const { t } = useTranslation();
  const demo = useDemo();
  const data = demo?.demoDesktop;
  const profile = demo?.demoProfile;

  if (!data || !profile) {
    return (
      <div data-screen="4.1-web-my-sizes" className="flex min-h-dvh bg-surface-50">
        <DesktopSidebar />
      </div>
    );
  }

  const measurements = [
    { label: 'Chest', value: profile.measurements.chest },
    { label: 'Waist', value: profile.measurements.waist },
    { label: 'Hip', value: profile.measurements.hip },
    { label: 'Shoulder', value: profile.measurements.shoulder },
    { label: 'Inseam', value: 79 },
  ];

  return (
    <div data-screen="4.1-web-my-sizes" className="flex min-h-dvh bg-surface-50">
      <DesktopSidebar name={profile.firstName} />

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-10 pt-8 pb-10">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="type-display-xl m-0">{t('sizes.title')}</h1>
            <p className="mt-1 mb-0 text-[15px] text-ink-500">{data.greeting}</p>
          </div>
          <div className="flex items-center gap-3" style={{ flex: '0 1 600px' }}>
            <label htmlFor="web-brand-search" className="sr-only">
              Search any brand
            </label>
            <div className="flex h-12 min-w-0 flex-1 items-center gap-[10px] rounded-14 border-[1.5px] border-line-300 bg-surface-0 px-[14px]">
              <IconSearchDesk size={20} className="text-ink-500" />
              <input
                id="web-brand-search"
                placeholder={data.searchPlaceholder}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] text-ink-900 outline-none"
              />
            </div>
            <Link
              to="/measure"
              viewTransition
              className="flex h-12 shrink-0 items-center gap-2 rounded-14 bg-ink-900 px-[18px] text-[15px] font-semibold text-surface-0 no-underline"
            >
              <IconPencil size={18} />
              {data.measureAgain}
            </Link>
          </div>
        </header>

        <div className="flex flex-wrap gap-6">
          <section
            aria-labelledby="meas-h"
            className="relative min-w-0 overflow-hidden rounded-24 bg-marigold-500 px-6 pt-5 pb-[38px]"
            style={{ flex: '2 1 500px' }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex flex-col gap-[2px]">
                <h2 id="meas-h" className="m-0 text-[16px] font-semibold">
                  {t('sizes.measurementsTitle')}
                </h2>
                <span className="text-[13px]">{data.measurementsNote}</span>
              </span>
              <Link
                to="/measure"
                className="flex h-11 items-center gap-[6px] rounded-12 bg-ink-900/8 px-[14px] text-[14px] font-semibold no-underline"
              >
                <IconPencil size={16} />
                {t('sizes.edit')}
              </Link>
            </div>
            <dl className="mt-4 mb-0 grid grid-cols-5 gap-3">
              {measurements.map((m) => (
                <div key={m.label} className="flex flex-col-reverse gap-[2px]">
                  <dt className="text-[13px]">{m.label}</dt>
                  <dd className="type-numeral-l m-0">{m.value}</dd>
                </div>
              ))}
            </dl>
            <TapeRuler />
          </section>

          <section
            aria-labelledby="usual-h"
            className="min-w-0 rounded-24 border border-line-200 bg-surface-0 px-6 py-5"
            style={{ flex: '1 1 260px' }}
          >
            <h2 id="usual-h" className="m-0 text-[16px] font-semibold">
              {t('sizes.usualSizes')}
            </h2>
            <dl className="mt-3 mb-0 flex flex-col">
              {data.usualSizes.map((item, index, all) => (
                <div
                  key={item.label}
                  className={`flex justify-between py-2 ${index < all.length - 1 ? 'border-b border-line-100' : ''}`}
                >
                  <dt className="text-[14px] text-ink-700">{item.label}</dt>
                  <dd className="type-numeral m-0 text-[15px]">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-labelledby="wait-h"
            className="flex min-w-0 flex-col gap-2 rounded-24 border border-line-200 bg-surface-0 px-6 py-5"
            style={{ flex: '1 1 260px' }}
          >
            <span className="inline-flex h-6 items-center self-start rounded-pill border border-marigold-200 bg-marigold-100 px-[10px] text-[12px] font-semibold">
              {data.review.badge}
            </span>
            <h2 id="wait-h" className="m-0 text-[16px] font-semibold">
              {data.review.title}
            </h2>
            <p className="m-0 text-[14px] text-ink-700">{data.review.body}</p>
            <Link
              to="/did-it-fit/demo"
              viewTransition
              className="mt-auto flex h-11 items-center self-start rounded-12 border-[1.5px] border-line-300 px-4 text-[14px] font-semibold no-underline"
            >
              {data.review.cta}
            </Link>
          </section>
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <section
            aria-labelledby="fit-h"
            className="min-w-0 rounded-24 border border-line-200 bg-surface-0 p-6"
            style={{ flex: '1 1 720px' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="flex flex-col gap-[2px]">
                <h2 id="fit-h" className="type-title-l m-0 tracking-normal">
                  {data.fitTitle}
                </h2>
                <span className="text-[13px] text-ink-500">{data.fitSub}</span>
              </span>
              <span className="flex gap-2">
                <TableButton label={data.greatFitOnly} />
                <TableButton label={data.sort} icon={<IconSort size={16} />} />
              </span>
            </div>

            <div
              role="group"
              aria-label={t('sizes.category')}
              className="mt-4 flex flex-wrap gap-2"
            >
              {data.categories.map((name, index) => (
                <CategoryPill key={name} label={name} active={index === 0} />
              ))}
            </div>

            <div className="mt-4 overflow-x-auto">
              <table
                aria-label="Your size by brand, tops"
                className="w-full min-w-[700px] border-collapse text-[14px]"
              >
                <thead>
                  <tr>
                    {['Brand', 'Your size', 'Fit', 'Why', 'Confidence', ''].map((head, i) => (
                      <th
                        key={head || 'action'}
                        scope="col"
                        className={`type-micro border-b border-line-200 py-[10px] text-left text-[12px] text-ink-500 ${
                          i === 0 ? 'pr-3' : i === 5 ? 'pl-3' : 'px-3'
                        }`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row) => (
                    <tr key={row.brand}>
                      <td className="border-b border-line-100 py-[10px] pr-3">
                        <span className="flex items-center gap-[10px]">
                          <span
                            aria-hidden="true"
                            className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-line-100 text-[13px] font-semibold"
                          >
                            {row.monogram}
                          </span>
                          <span className="text-[15px] font-semibold">{row.brand}</span>
                        </span>
                      </td>
                      <td className="border-b border-line-100 px-3 py-[10px]">
                        <span className="type-numeral inline-flex h-8 min-w-9 items-center justify-center rounded-9 border-[1.5px] border-line-300 px-2 align-middle text-[15px]">
                          {row.size}
                        </span>
                      </td>
                      <td className="border-b border-line-100 px-3 py-[10px]">
                        <FitChip
                          tag={row.fitTag}
                          size={13}
                          className="h-[26px] px-[10px] align-middle whitespace-nowrap"
                        />
                      </td>
                      <td className="border-b border-line-100 px-3 py-[10px] text-ink-700">
                        {row.note}
                      </td>
                      <td className="border-b border-line-100 px-3 py-[10px]">
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="h-[6px] w-14 overflow-hidden rounded-3 bg-line-100"
                          >
                            <span
                              className="block h-full origin-left bg-ink-900"
                              style={{
                                width: '100%',
                                transform: `scaleX(${row.confidence / 100})`,
                              }}
                            />
                          </span>
                          <span className="type-numeral text-[13px]">{row.confidence}%</span>
                        </span>
                      </td>
                      <td className="border-b border-line-100 py-[10px] pl-3 text-right">
                        <Link
                          to="/try/studio/demo"
                          viewTransition
                          aria-label={`Try on ${row.brand} in ${row.size}`}
                          className="inline-flex h-11 items-center rounded-12 border-[1.5px] border-line-300 px-[14px] align-middle text-[14px] font-semibold whitespace-nowrap no-underline"
                        >
                          Try on
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex min-w-[280px] flex-col gap-6" style={{ flex: '0 1 320px' }}>
            <section
              aria-labelledby="recent-h"
              className="rounded-24 border border-line-200 bg-surface-0 p-5"
            >
              <h2 id="recent-h" className="m-0 text-[16px] font-semibold">
                {t('sizes.recentlyChecked')}
              </h2>
              <ul className="m-0 mt-3 flex list-none flex-col gap-1 p-0">
                {data.recent.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.to}
                      viewTransition
                      className="-mx-2 flex items-center gap-3 rounded-14 p-2 no-underline"
                    >
                      <RecentThumb kind={item.kind} />
                      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                        <span className="text-[14px] font-semibold">{item.title}</span>
                        <span className="text-[12px] text-ink-500">{item.sub}</span>
                      </span>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-12 bg-marigold-500 font-display text-[18px] font-bold">
                        {item.size}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="studio-h"
              data-on-dark
              className="flex flex-col gap-2 rounded-24 bg-ink-900 p-[22px] text-surface-0"
            >
              <IconCube size={36} strokeWidth={1.8} className="text-marigold-500" />
              <h2 id="studio-h" className="type-title-m m-0 tracking-normal">
                {data.promo.title}
              </h2>
              <p className="m-0 text-[14px] leading-[1.5] text-on-dark-300">{data.promo.body}</p>
              <Link
                to="/try/studio/demo"
                viewTransition
                className="mt-2 flex h-11 items-center gap-2 self-start rounded-12 bg-marigold-500 px-4 text-[14px] font-semibold text-ink-900 no-underline"
              >
                {data.promo.cta}
                <IconArrowRight size={16} strokeWidth={2.2} />
              </Link>
            </section>

            <RequestButton label={t('sizes.requestBrand')} />
          </div>
        </div>
      </main>
    </div>
  );
}

function TapeRuler() {
  const ticks: string[] = [];
  for (let x = 9, i = 0; x < 900; x += 9, i += 1) {
    ticks.push(`M${x} 16v-${(i + 1) % 5 === 0 ? 12 : 7}`);
  }
  return (
    <svg
      width="900"
      height="16"
      viewBox="0 0 900 16"
      aria-hidden="true"
      className="absolute bottom-0 left-0"
    >
      <path d={ticks.join('')} className="stroke-ink-900" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

function TableButton({ label, icon }: { label: string; icon?: React.ReactNode }) {
  const press = usePressable('scale', {
    className:
      'flex h-11 items-center gap-[6px] rounded-12 border-[1.5px] border-line-200 bg-surface-0 px-[14px] text-[14px] font-semibold text-ink-900',
  });
  return (
    <button type="button" {...press}>
      {label}
      {icon}
    </button>
  );
}

function CategoryPill({ label, active }: { label: string; active: boolean }) {
  const press = usePressable('scale', {
    className: `flex h-11 items-center rounded-pill border-[1.5px] px-[18px] text-[14px] font-semibold ${
      active
        ? 'border-ink-900 bg-ink-900 text-surface-0'
        : 'border-line-200 bg-surface-0 text-ink-900'
    }`,
  });
  return (
    <button type="button" aria-pressed={active} {...press}>
      {label}
    </button>
  );
}

function RequestButton({ label }: { label: string }) {
  const press = usePressable('scale', {
    className:
      'flex h-14 items-center justify-center gap-2 rounded-18 border-[1.5px] border-dashed border-ink-300 bg-transparent text-[14px] font-semibold text-ink-700',
  });
  return (
    <button type="button" {...press}>
      <IconPlus size={18} />
      {label}
    </button>
  );
}
