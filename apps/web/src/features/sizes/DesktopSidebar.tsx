import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { AppIcon } from '@/ui/AppMark';
import { usePressable } from '@/ui/motion/usePressable';
import {
  IconChevronDown,
  IconCube,
  IconExchange,
  IconFamily,
  IconStore,
  IconTape,
} from '@/ui/icons';
import { isOn } from '@/app/flags';

/**
 * Desktop sidebar — implementation.md §12.4 and §12.5 (4.1).
 * It stays still while content moves between routes, hence its own view-transition name.
 */
const ITEMS = [
  { to: '/sizes', label: 'My sizes', Icon: IconTape },
  { to: '/try/studio/demo', label: 'Try-on studio', Icon: IconCube },
  { to: '/store', label: 'Store mode', Icon: IconStore, flag: 'storeMode' as const },
  { to: '/me', label: 'Family', Icon: IconFamily, flag: 'familyProfiles' as const },
  { to: '/did-it-fit/demo', label: 'Did it fit?', Icon: IconExchange, count: 1 },
];

export function DesktopSidebar({ name }: { name?: string | undefined }) {
  const { t } = useTranslation();
  const press = usePressable('row', {
    className:
      'flex items-center gap-[10px] rounded-14 border border-dark-line-2 bg-dark-700 p-[10px] text-left text-surface-0',
  });

  return (
    <aside
      data-on-dark
      className="flex w-60 shrink-0 flex-col gap-7 bg-ink-900 px-4 py-6"
      style={{ viewTransitionName: 'sidebar' }}
    >
      <div className="flex items-center gap-[10px] px-2">
        <AppIcon size={32} />
        <span className="font-display text-[21px] font-bold tracking-[-0.01em] text-surface-0">
          {t('app.name')}
        </span>
      </div>

      <nav aria-label={t('nav.main')}>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {ITEMS.filter((item) => !item.flag || isOn(item.flag)).map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                viewTransition
                end={item.to === '/sizes'}
                className="relative flex h-11 items-center gap-3 rounded-12 px-3 text-[15px] no-underline"
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-[11px] bottom-[11px] left-0 w-[3px] rounded-[2px] bg-marigold-500"
                      />
                    ) : null}
                    <item.Icon
                      size={20}
                      className={isActive ? 'text-marigold-500' : 'text-on-dark-300'}
                    />
                    <span
                      className={
                        isActive ? 'font-semibold text-surface-0' : 'font-medium text-on-dark-300'
                      }
                    >
                      {item.label}
                    </span>
                    {item.count ? (
                      <span className="ml-auto inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[11px] bg-marigold-500 px-[7px] font-mono text-[12px] font-semibold text-ink-900">
                        {item.count}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-[14px]">
        <p className="mx-2 my-0 text-[12px] leading-[1.5] text-on-dark-500">
          {t('me.privacyBody').split('.')[0]}.
        </p>
        <button type="button" {...press}>
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-marigold-500 font-display text-[16px] font-bold text-ink-900"
          >
            {name?.[0] ?? ''}
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-[14px] font-semibold">{name ?? ''}</span>
            <span className="text-[12px] text-on-dark-300">Switch profile</span>
          </span>
          <IconChevronDown size={18} className="text-on-dark-300" />
        </button>
      </div>
    </aside>
  );
}
