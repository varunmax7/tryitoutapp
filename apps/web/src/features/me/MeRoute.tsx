import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { usePressable } from '@/ui/motion/usePressable';
import {
  IconExchange,
  IconGlobe,
  IconLockShort,
  IconPlus,
  IconScissors,
  IconSearchPlus,
  IconShield,
  IconShoe,
  IconKurta,
} from '@/ui/icons';
import { useDemo } from '@/app/demo';
import { isOn } from '@/app/flags';

/**
 * 3.4 Me — implementation.md §12.5.
 *
 * V1 shows the sizes card and the privacy card. The family switcher and the tools grid
 * are V2 and sit behind their flags; the visual test runs with every flag on, because
 * the design shows the full product (§17.4).
 */
export default function MeRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const profile = demo?.demoProfile;
  const family = demo?.demoFamily ?? [];
  const showFamily = isOn('familyProfiles');
  const showTools = isOn('tools');

  return (
    <div data-screen="3.4-me-family-tools" className="flex min-h-dvh flex-col px-4 pt-4">
      <h1 className="type-display-m mx-1 my-0">
        {showFamily || showTools ? t('me.title') : t('me.titleV1')}
      </h1>

      {showFamily && family.length > 0 ? (
        <>
          <span id="who-q" className="mx-1 mt-[14px] text-[14px] font-semibold text-ink-700">
            {t('me.whoseSizes')}
          </span>
          <div role="radiogroup" aria-labelledby="who-q" className="mt-[10px] flex justify-between">
            {family.map((person, index) => (
              <PersonButton key={person.name} person={person} selected={index === 0} />
            ))}
            <AddPersonButton />
          </div>
        </>
      ) : null}

      {profile ? (
        <div className="mt-[14px] flex items-center gap-3 rounded-18 bg-surface-0 py-3 pr-3 pl-[14px]">
          <span className="flex flex-1 flex-col gap-[2px]">
            <span className="text-[15px] font-semibold">
              {t('me.sizesCard', { name: profile.firstName })}
            </span>
            <span className="text-[13px] text-ink-500">
              {t('me.fromScan')}{' '}
              <span className="font-mono font-semibold text-ink-900">
                {profile.measurements.chest}
              </span>{' '}
              {t('me.cm')}
            </span>
          </span>
          <Link
            to="/scan"
            viewTransition
            className="flex h-11 items-center gap-[6px] rounded-12 border-[1.5px] border-line-300 px-[14px] text-[14px] font-semibold no-underline"
          >
            <IconExchange size={16} />
            {t('me.rescan')}
          </Link>
        </div>
      ) : null}

      {showTools ? (
        <>
          <h2 className="mx-1 mt-[18px] mb-0 text-[14px] font-semibold text-ink-700">
            {t('me.tools')}
          </h2>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Tool
              icon={<IconShoe size={28} />}
              title={t('me.shoeSize')}
              sub={t('me.shoeSizeSub')}
            />
            <Tool
              icon={<IconScissors size={28} />}
              title={t('me.tailorCard')}
              sub={t('me.tailorCardSub')}
            />
            <Tool
              icon={<IconSearchPlus size={28} />}
              title={t('me.findInSize')}
              sub={t('me.findInSizeSub')}
            />
            <Tool icon={<IconKurta size={28} />} title={t('me.ethnic')} sub={t('me.ethnicSub')} />
            <Tool
              icon={<IconLockShort size={28} />}
              title={t('me.lingerie')}
              sub={t('me.lingerieSub')}
            />
            <Tool
              icon={<IconGlobe size={28} />}
              title={t('me.language')}
              sub={
                <span className="flex gap-[6px]">
                  <span lang="hi" className="font-deva">
                    हिन्दी
                  </span>
                  ·
                  <span lang="te" className="font-telu">
                    తెలుగు
                  </span>
                  ·
                  <span lang="ta" className="font-taml">
                    தமிழ்
                  </span>
                </span>
              }
            />
          </div>
        </>
      ) : null}

      <div className="mt-[14px] flex flex-col gap-3 rounded-18 bg-surface-0 p-[14px]">
        <div className="flex items-start gap-[10px]">
          <IconShield size={22} strokeWidth={1.8} className="shrink-0" />
          <span className="flex flex-col gap-[2px]">
            <span className="text-[15px] font-semibold">{t('me.privacy')}</span>
            <span className="text-[13px] text-ink-700">{t('me.privacyBody')}</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <PrivacyButton label={t('me.download')} />
          <PrivacyButton label={t('me.deleteAll')} danger />
        </div>
      </div>
    </div>
  );
}

const TONES = {
  ink: 'bg-ink-900 text-marigold-500',
  tight: 'bg-fit-tight-bg text-fit-tight-fg',
  loose: 'bg-fit-loose-bg text-fit-loose-fg',
  great: 'bg-fit-great-bg text-fit-great-fg',
} as const;

function PersonButton({
  person,
  selected,
}: {
  person: { initial: string; name: string; note: string; tone: keyof typeof TONES };
  selected: boolean;
}) {
  const press = usePressable('scale', {
    className: 'flex w-[66px] flex-col items-center gap-1 bg-transparent p-0 text-ink-900',
  });
  return (
    <button type="button" role="radio" aria-checked={selected} {...press}>
      <span
        aria-hidden="true"
        className={`flex size-[58px] rounded-pill ${selected ? 'border-[3px] border-marigold-500 p-[2px]' : 'p-[5px]'}`}
      >
        <span
          className={`flex flex-1 items-center justify-center rounded-pill font-display text-[20px] font-bold ${TONES[person.tone]}`}
        >
          {person.initial}
        </span>
      </span>
      <span className="text-[13px] font-semibold">{person.name}</span>
      <span className="-mt-[3px] text-[11px] text-ink-500">{person.note}</span>
    </button>
  );
}

function AddPersonButton() {
  const { t } = useTranslation();
  const press = usePressable('scale', {
    className: 'flex w-[66px] flex-col items-center gap-1 bg-transparent p-0 text-ink-900',
  });
  return (
    <button type="button" {...press}>
      <span aria-hidden="true" className="flex size-[58px] rounded-pill p-[5px]">
        <span className="flex flex-1 items-center justify-center rounded-pill border-[1.5px] border-dashed border-ink-300 bg-surface-0">
          <IconPlus size={20} />
        </span>
      </span>
      <span className="text-[13px] font-semibold">{t('me.add')}</span>
      <span className="-mt-[3px] text-[11px] text-ink-500">{t('me.person')}</span>
    </button>
  );
}

function Tool({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: React.ReactNode;
}) {
  const press = usePressable('card', {
    className:
      'flex h-24 flex-col items-start rounded-18 border border-line-200 bg-surface-0 p-3 text-left text-ink-900',
  });
  return (
    <button type="button" {...press}>
      {icon}
      <span className="mt-2 text-[15px] font-semibold">{title}</span>
      <span className="text-[12px] text-ink-500">{sub}</span>
    </button>
  );
}

function PrivacyButton({ label, danger = false }: { label: string; danger?: boolean }) {
  const press = usePressable('scale', {
    className: `flex h-11 items-center justify-center rounded-12 border-[1.5px] bg-surface-0 text-[14px] font-semibold ${
      danger ? 'border-danger-line text-danger' : 'border-line-300 text-ink-900'
    }`,
  });
  return (
    <button type="button" {...press}>
      {label}
    </button>
  );
}
