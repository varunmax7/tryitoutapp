import type { ReactNode, SVGProps } from 'react';

/**
 * Icon set — implementation.md §12.4 "Icons".
 *
 * Built from the stroke paths in design/reference/*.html: a 24px grid, round caps and
 * joins, stroke 2 by default (the designs use 1.7 to 2.2 where a size needs it). Stroke
 * is `currentColor`, so colour always comes from a token on the parent.
 *
 * Icons are decorative and `aria-hidden` unless they are the only content of a control,
 * which then needs an `aria-label` (§12.4).
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  /** Rendered size in px. The designs use 11 to 36. */
  size?: number;
};

function IconBase({
  size = 24,
  strokeWidth = 2,
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  const labelled = rest['aria-label'] != null || rest.role === 'img';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={labelled ? undefined : true}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconTape(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="8" width="18" height="8" rx="1.5" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v2" />
    </IconBase>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 6l6 6-6 6" />
    </IconBase>
  );
}

export function IconCamera(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </IconBase>
  );
}

export function IconLock(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </IconBase>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </IconBase>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </IconBase>
  );
}

export function IconTag(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12V4h8l10 10-8 8z" />
      <circle cx="7.5" cy="8.5" r="1.5" />
    </IconBase>
  );
}

export function IconClose(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </IconBase>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </IconBase>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5" />
      <path d="M12 16v.5" />
    </IconBase>
  );
}

export function IconCameraSwitch(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 12a8 8 0 1 1-3-6.2" />
      <path d="M20 4v4h-4" />
    </IconBase>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 9l6 6 6-6" />
    </IconBase>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </IconBase>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  );
}

export function IconCube(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" />
    </IconBase>
  );
}

export function IconStore(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 9l2-5h14l2 5" />
      <path d="M4 9v11h16V9" />
      <path d="M9 20v-6h6v6" />
    </IconBase>
  );
}

export function IconPerson(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </IconBase>
  );
}

export function IconShare(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
    </IconBase>
  );
}

export function IconExternalLink(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 14v5H5V6h5" />
    </IconBase>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v4h16v-4" />
    </IconBase>
  );
}

export function IconImage(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M21 16l-5-5-9 9" />
    </IconBase>
  );
}

export function IconLink(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </IconBase>
  );
}

export function IconFitMap(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <path d="M9 13a3 3 0 0 1 5.2-2M15 13a3 3 0 0 1-5.2 2" />
      <path d="M14.4 9.4V11h-1.6M9.6 16.6V15h1.6" />
    </IconBase>
  );
}

export function IconFamily(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M16 14.2c2.8.4 5 2.8 5 5.8" />
    </IconBase>
  );
}

export function IconBag(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 8h14l-1.2 12H6.2z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </IconBase>
  );
}

export function IconExchange(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
      <path d="M4 3v5h5" />
      <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
      <path d="M20 21v-5h-5" />
    </IconBase>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4v11M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </IconBase>
  );
}

export function IconTshirt(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.5 4L4 6.5 2 11l3 1.5 1.5-2V20h11v-9.5l1.5 2 3-1.5-2-4.5L15.5 4q-1.5 2-3.5 2t-3.5-2z" />
    </IconBase>
  );
}

export function IconPolo(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 4L4 6 2.5 11l3 1 1-2.5V20h11V9.5l1 2.5 3-1L20 6l-4-2-4 4z" />
      <path d="M12 8v12" />
    </IconBase>
  );
}

export function IconJeans(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 3h12l1 18h-5l-2-11-2 11H5z" />
      <path d="M6 6.5h12" />
    </IconBase>
  );
}

export function IconTrousers(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 3h10l1.5 18H14l-2-12-2 12H5.5z" />
      <path d="M12 3v6" />
    </IconBase>
  );
}

export function IconKurta(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 3L5 5 3 10l3 1 1-2v12h10V9l1 2 3-1-2-5-4-2-3 3z" />
      <path d="M12 6v5" />
    </IconBase>
  );
}

export function IconShoe(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2 17v-6l6-1 3 3 9 2a2 2 0 0 1 2 2v1H2z" />
      <path d="M2 19.5h20" />
    </IconBase>
  );
}

export function IconSizeTag(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12.5V4a1 1 0 0 1 1-1h8.5L21 11.5 12.5 20z" />
      <circle cx="8" cy="8" r="1.6" />
    </IconBase>
  );
}

export function IconTools(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  );
}

export function IconScissors(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8.2 8.2L20 20M8.2 15.8L20 4" />
    </IconBase>
  );
}

export function IconSearchPlus(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
      <path d="M8 11h6M11 8v6" />
    </IconBase>
  );
}

export function IconLockShort(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </IconBase>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
    </IconBase>
  );
}

export function IconShield(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </IconBase>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </IconBase>
  );
}

export function IconSort(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 10l4-4 4 4M8 14l4 4 4-4" />
    </IconBase>
  );
}

export function IconSearchDesk(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </IconBase>
  );
}

export function IconPencil(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="M13.5 6.5l4 4" />
    </IconBase>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconBase>
  );
}

export function IconVideo(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="M16 10l5-3v10l-5-3" />
    </IconBase>
  );
}

export function IconRotate(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
    </IconBase>
  );
}
