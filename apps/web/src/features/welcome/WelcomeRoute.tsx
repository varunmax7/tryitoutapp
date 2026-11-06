import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { AppMark } from '@/ui/AppMark';
import { TextLink } from '@/ui/Button';
import { usePressable } from '@/ui/motion/usePressable';
import { IconCamera, IconChevronRight, IconLock, IconTape } from '@/ui/icons';
import { isOn } from '@/app/flags';
import { TapeArt } from './TapeArt';

/**
 * 1.1 Welcome — implementation.md §12.5.
 *
 * The ink hero is 452px tall and the white sheet overlaps it by 28px. The first tap on
 * either option opens the consent sheet (N1) once per install, and a returning user with
 * measurements goes straight to /sizes — both land in Phase 3, which owns the flow.
 */
export default function WelcomeRoute() {
  const { t } = useTranslation();

  return (
    <div data-screen="1.1-welcome" className="flex min-h-dvh flex-col bg-surface-0">
      <header className="relative flex h-[452px] shrink-0 flex-col gap-8 overflow-hidden bg-ink-900 px-6 pt-8 text-surface-0">
        <div className="flex items-center gap-[10px]">
          <AppMark />
          <span className="type-title-l">{t('app.name')}</span>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="type-display-hero m-0 leading-[1.02] text-balance text-surface-0">
            {t('welcome.headline')}
          </h1>
          <p className="max-w-[320px] text-[16px] leading-[1.5] text-pretty text-on-ink-subtle">
            {t('welcome.subcopy')}
          </p>
        </div>
        <TapeArt />
      </header>

      <div className="relative -mt-7 flex flex-1 flex-col gap-[14px] rounded-t-28 bg-surface-0 px-5 py-7">
        <h2 className="type-title-l m-0 mb-1">{t('welcome.sheetTitle')}</h2>

        <OptionCard
          to="/measure"
          icon={<IconTape size={24} strokeWidth={1.8} />}
          iconTone="neutral"
          title={t('welcome.typeTitle')}
          sub={t('welcome.typeSub')}
        />
        <OptionCard
          to="/scan"
          icon={<IconCamera size={24} strokeWidth={1.8} />}
          iconTone="marigold"
          title={t('welcome.scanTitle')}
          sub={t('welcome.scanSub')}
          badge={isOn('scanMostAccurate') ? t('welcome.mostAccurate') : undefined}
          emphasised
        />

        <TextLink as={Link} to="/measure" className="min-h-12 justify-center gap-2 text-center">
          {t('welcome.brandSizeLink')}
        </TextLink>

        <p className="mt-auto mb-0 flex items-center justify-center gap-2 text-center text-[13px] text-ink-500">
          <IconLock size={16} className="shrink-0" />
          {t('welcome.lockLine')}
        </p>
      </div>
    </div>
  );
}

function OptionCard({
  to,
  icon,
  iconTone,
  title,
  sub,
  badge,
  emphasised = false,
}: {
  to: string;
  icon: React.ReactNode;
  iconTone: 'neutral' | 'marigold';
  title: string;
  sub: string;
  badge?: string | undefined;
  /** "Scan me" is the recommended path, so it carries an ink border. */
  emphasised?: boolean;
}) {
  const press = usePressable('card', {
    className: [
      'flex min-h-[78px] items-center gap-[14px] rounded-18 border-[1.5px] bg-surface-0 px-4 py-[14px] text-ink-900 no-underline',
      emphasised ? 'border-ink-900' : 'border-line-200',
    ].join(' '),
  });
  return (
    <Link to={to} viewTransition {...press}>
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-14 ${
          iconTone === 'marigold' ? 'bg-marigold-500' : 'bg-surface-100'
        }`}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="flex items-center gap-2">
          <span className="text-[17px] font-semibold">{title}</span>
          {badge ? (
            <span className="rounded-pill bg-ink-900 px-2 py-[3px] text-[11px] font-semibold tracking-[0.04em] text-surface-0 uppercase">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="text-[14px] leading-[1.35] text-ink-500">{sub}</span>
      </span>
      <IconChevronRight size={20} className="shrink-0 text-ink-500" />
    </Link>
  );
}
