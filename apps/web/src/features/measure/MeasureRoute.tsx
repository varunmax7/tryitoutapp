import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { TopBar } from '@/ui/Nav';
import { ProgressBar, TextField } from '@/ui/Fields';
import { PillToggle, Segmented } from '@/ui/Toggles';
import { RadioTile } from '@/ui/Fields';
import { Button } from '@/ui/Button';
import { IconTag } from '@/ui/icons';
import { useDemo } from '@/app/demo';
import { ShapeIcon, type ShapeKey } from './ShapeIcons';

/**
 * 1.2 Type my details — implementation.md §12.5, step 1 of 2.
 *
 * Validation, brand autocomplete and the POST to /body-estimate land in Phase 3; this is
 * the form, its states and its motion, with the fixtures filled in under demo mode.
 */
const SHAPES: ShapeKey[] = ['slim', 'athletic', 'regular', 'broad'];
const FIT_PREFS = ['slim', 'regular', 'relaxed'] as const;

export default function MeasureRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const profile = demo?.demoProfile;

  const [gender, setGender] = useState('man');
  const [shape, setShape] = useState<ShapeKey>(profile?.shape ?? 'regular');
  const [fitPref, setFitPref] = useState<string>(profile?.fitPref ?? 'regular');

  return (
    <div data-screen="1.2-type-my-details" className="flex min-h-dvh flex-col">
      <TopBar backTo="/" title={t('measure.step')} variant="step" />
      <ProgressBar value={0.5} label={t('measure.step')} className="mx-5 shrink-0" />

      <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 pt-4">
        <div className="flex flex-col gap-1 px-1">
          <h1 className="type-display-m m-0">{t('measure.title')}</h1>
          <p className="m-0 text-[14px] text-ink-500">{t('measure.subcopy')}</p>
        </div>

        <section className="flex flex-col gap-[14px] rounded-20 bg-surface-0 p-4">
          <div className="grid grid-cols-3 gap-[10px]">
            <TextField
              label={t('measure.height')}
              unit={t('measure.cm')}
              inputMode="decimal"
              defaultValue={profile?.heightCm ?? ''}
            />
            <TextField
              label={t('measure.weight')}
              unit={t('measure.kg')}
              inputMode="decimal"
              defaultValue={profile?.weightKg ?? ''}
            />
            <TextField
              label={t('measure.age')}
              unit={t('measure.yrs')}
              inputMode="numeric"
              defaultValue={profile?.ageYears ?? ''}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[13px] font-semibold text-ink-700">{t('measure.gender')}</span>
            <Segmented
              label={t('measure.gender')}
              radius={12}
              value={gender}
              onChange={setGender}
              items={[
                { value: 'man', label: t('measure.man') },
                { value: 'woman', label: t('measure.woman') },
                { value: 'other', label: t('measure.other') },
              ]}
            />
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-20 bg-surface-0 p-4">
          <span id="shape-label" className="text-[15px] font-semibold">
            {t('measure.shapeQuestion')}
          </span>
          <div role="radiogroup" aria-labelledby="shape-label" className="grid grid-cols-4 gap-2">
            {SHAPES.map((key) => (
              <RadioTile
                key={key}
                name="shape"
                selected={shape === key}
                onSelect={() => setShape(key)}
                label={t(`measure.shape${key[0]!.toUpperCase()}${key.slice(1)}`)}
                icon={<ShapeIcon shape={key} selected={shape === key} />}
              />
            ))}
          </div>

          <span id="pref-label" className="mt-1 text-[15px] font-semibold">
            {t('measure.fitQuestion')}
          </span>
          <div role="group" aria-labelledby="pref-label" className="flex gap-2">
            {FIT_PREFS.map((key) => (
              <PillToggle
                key={key}
                fill
                outlined
                pressed={fitPref === key}
                onPress={() => setFitPref(key)}
              >
                {t(`measure.fit${key[0]!.toUpperCase()}${key.slice(1)}`)}
              </PillToggle>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[10px] rounded-20 bg-surface-0 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[15px] font-semibold">
              <span
                aria-hidden="true"
                className="flex size-[26px] items-center justify-center rounded-8 bg-marigold-500"
              >
                <IconTag size={15} strokeWidth={2} />
              </span>
              {t('measure.boost')}
            </span>
            <Link
              to="/scan/size-tag"
              className="flex min-h-11 items-center text-[14px] font-semibold underline underline-offset-[3px]"
            >
              {t('measure.scanSizeTag')}
            </Link>
          </div>
          <p className="m-0 text-[14px] text-ink-500">{t('measure.boostSub')}</p>
          <div className="grid gap-[10px]" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <TextField
              label={t('measure.brand')}
              mono={false}
              defaultValue={profile?.anchor.brand ?? ''}
              className="[&_input]:text-[16px]"
            />
            <TextField label={t('measure.size')} defaultValue={profile?.anchor.size ?? ''} />
          </div>
        </section>
      </div>

      {/* Pinned, not fixed: the document still scrolls natively (§12.8.1), and at rest
          the button sits where the design puts it with the form running behind it. */}
      <div className="sticky bottom-0 z-10 shrink-0 bg-surface-50 px-4 pt-3 pb-5">
        <Button as={Link} to="/measure/numbers" viewTransition>
          {t('measure.submit')}
        </Button>
      </div>
    </div>
  );
}
