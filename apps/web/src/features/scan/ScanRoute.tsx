import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { IconAlert, IconCameraSwitch, IconCheck, IconClose } from '@/ui/icons';
import { ViewfinderArt } from './ViewfinderArt';

/**
 * 1.3 Scan me — implementation.md §12.5.
 *
 * The camera runs entirely on the phone and the frames never leave it (§1). Capture, the
 * on-device checks and the upload land in Phase 4; this is the viewfinder chrome, which
 * is what the design fixes.
 *
 * Photos are processed in memory only. Nothing here writes a frame anywhere.
 */
export default function ScanRoute() {
  const { t } = useTranslation();

  return (
    <div
      data-screen="1.3-scan-me"
      className="relative h-dvh overflow-hidden bg-dark-900 text-surface-0"
    >
      <div className="absolute top-2 right-3 left-3 flex h-[52px] items-center justify-between">
        <Link
          to="/"
          viewTransition
          aria-label="Close scan"
          className="flex size-11 items-center justify-center rounded-pill bg-glass-12 text-surface-0"
        >
          <IconClose size={20} />
        </Link>
        <div className="flex items-center gap-[6px] rounded-pill bg-glass-12 px-[14px] py-2 text-[14px] font-semibold">
          <span aria-hidden="true" className="size-2 rounded-pill bg-marigold-500" />
          {t('scan.stepFront')}
        </div>
        <button
          type="button"
          aria-label={t('scan.tips')}
          className="flex size-11 items-center justify-center rounded-pill bg-glass-12"
        >
          <IconAlert size={20} />
        </button>
      </div>

      <div className="absolute top-[70px] right-0 left-0 flex justify-center">
        <div className="flex items-center gap-[10px] rounded-pill bg-surface-0 py-[6px] pr-[6px] pl-[14px] text-[14px] text-ink-900">
          <span>{t('scan.yourHeight')}</span>
          <span className="font-mono font-semibold">175 cm</span>
          <button
            type="button"
            className="h-8 rounded-pill bg-surface-100 px-3 text-[13px] font-semibold text-ink-900"
          >
            {t('scan.edit')}
          </button>
        </div>
      </div>

      <ViewfinderArt />

      <div className="absolute top-[664px] right-4 left-4 flex flex-wrap justify-center gap-2">
        <CheckChip passed label={t('scan.checkFullBody')} />
        <CheckChip passed label={t('scan.checkLight')} />
        <CheckChip label={t('scan.checkArms')} warning />
      </div>

      <div className="absolute top-[726px] right-0 left-0 flex items-center justify-between px-10">
        <div
          className="flex w-14 flex-col items-center gap-1"
          aria-label="Step 1 of 2: front photo"
        >
          <span aria-hidden="true" className="flex gap-[6px]">
            <span className="h-[6px] w-[18px] rounded-3 bg-marigold-500" />
            <span className="size-[6px] rounded-3 bg-surface-0/40" />
          </span>
          <span className="text-[12px] text-on-dark-400">{t('scan.order')}</span>
        </div>
        <button
          type="button"
          aria-label={t('scan.shutter')}
          className="flex size-[78px] items-center justify-center rounded-pill border-4 border-surface-0 bg-transparent p-0"
        >
          <span aria-hidden="true" className="size-[60px] rounded-pill bg-surface-0" />
        </button>
        <button
          type="button"
          aria-label={t('scan.switchCamera')}
          className="flex size-14 items-center justify-center rounded-pill bg-glass-12"
        >
          <IconCameraSwitch size={22} />
        </button>
      </div>

      <p className="absolute right-6 bottom-[14px] left-6 m-0 text-center text-[12px] text-on-dark-400">
        {t('scan.footer')}
      </p>
    </div>
  );
}

function CheckChip({
  label,
  passed = false,
  warning = false,
}: {
  label: string;
  passed?: boolean;
  warning?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-[6px] rounded-pill px-3 py-[6px] text-[13px] ${
        warning ? 'bg-marigold-500/16 text-marigold-text-dark' : 'bg-glass-10'
      }`}
    >
      {passed ? (
        <IconCheck size={14} strokeWidth={2.6} className="text-on-dark-success" />
      ) : (
        <IconAlert size={14} strokeWidth={2.2} className="text-marigold-500" />
      )}
      {label}
    </span>
  );
}
