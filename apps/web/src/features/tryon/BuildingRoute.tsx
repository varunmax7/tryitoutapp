import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button, IconButton } from '@/ui/Button';
import { ProgressBar } from '@/ui/Fields';
import { IconCheck, IconClose, IconVideo } from '@/ui/icons';
import { useDemo } from '@/app/demo';
import { PatternArt } from './PatternArt';

/**
 * 2.2 Building your 3D try-on — implementation.md §12.5.
 *
 * The step list is bound to Realtime `garment_builds.step/progress` in Phase 5. Progress
 * only ever moves forward (§12.8.8).
 */
export default function BuildingRoute() {
  const { t } = useTranslation();
  const demo = useDemo();
  const build = demo?.demoBuild;

  return (
    <div data-screen="2.2-building-3d-try-on" className="flex min-h-dvh flex-col px-4 pt-3 pb-5">
      <div className="flex items-center">
        <IconButton
          aria-label="Cancel and go back"
          className="border-line-200"
          onClick={() => history.back()}
        >
          <IconClose size={20} />
        </IconButton>
      </div>

      <h1 className="type-display-s mt-[10px] mb-0 leading-[1.15]">{t('build.title')}</h1>
      {build ? (
        <p className="mt-1 mb-0 text-[14px] text-ink-500">
          {t('build.subtitle', { brand: build.brand, type: build.type, size: build.size })}
        </p>
      ) : null}

      <div
        className="mt-[14px] flex flex-col gap-3 rounded-22 bg-ink-900 px-4 pt-3 pb-[14px]"
        data-on-dark
      >
        <PatternArt />
        <div className="grid grid-cols-3 gap-2 border-t border-dark-line-2 pt-3">
          {(build?.stats ?? []).map((stat) => {
            const [value, unit] = stat.value.split(' ');
            return (
              <div key={stat.label} className="flex flex-col gap-[2px]">
                <span className="text-[12px] text-on-dark-500">{stat.label}</span>
                <span className="font-mono text-[16px] font-semibold text-surface-0">
                  {value} <span className="text-[12px] font-medium text-on-dark-500">{unit}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ol
        aria-label="Build steps"
        className="m-0 mt-3 list-none rounded-22 bg-surface-0 px-[14px] py-1"
      >
        {(build?.steps ?? []).map((step, index, all) => (
          <li
            key={step.label}
            className={`flex gap-3 py-2 ${step.state === 'running' ? 'items-start' : 'items-center'} ${
              index < all.length - 1 ? 'border-b border-line-100' : ''
            }`}
          >
            {step.state === 'done' ? (
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-fit-great-bg text-fit-great-fg"
              >
                <IconCheck size={15} strokeWidth={2.4} />
              </span>
            ) : step.state === 'running' ? (
              <span
                aria-hidden="true"
                className="size-7 shrink-0 rounded-pill border-2 border-marigold-500"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-pill border-[1.5px] border-line-300 font-mono text-[12px] font-semibold text-ink-500"
              >
                {index + 1}
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <span className="flex flex-col">
                <span
                  className={`text-[15px] leading-5 font-semibold ${step.state === 'pending' ? 'text-ink-700' : ''}`}
                >
                  {step.label}
                </span>
                <span className="text-[13px] leading-[17px] text-ink-500">{step.sub}</span>
              </span>
              {step.state === 'running' && step.progress != null ? (
                <ProgressBar value={step.progress} label="Draping progress" />
              ) : null}
            </span>
            {step.state === 'done' ? (
              <span className="text-[12px] font-semibold text-fit-great-fg">{t('build.done')}</span>
            ) : step.state === 'running' && step.progress != null ? (
              <span className="font-mono text-[13px] leading-5 font-semibold">
                {Math.round(step.progress * 100)}%
              </span>
            ) : (
              <span className="text-[12px] font-semibold text-ink-500">{t('build.next')}</span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-auto flex flex-col gap-2 pt-3">
        <Button as={Link} to="/try/live/demo" viewTransition>
          <IconVideo size={20} />
          {t('build.open')}
        </Button>
        <p className="m-0 text-center text-[12px] text-ink-500">{t('build.openCaption')}</p>
      </div>
    </div>
  );
}
