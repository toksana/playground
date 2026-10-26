import type { Accent } from '@playground/shared/experiments';
import type { ReactNode } from 'react';

export const SnowflakeIcon = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
    <g
      stroke="#3f6a85"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      transform="translate(60 60)"
    >
      {[0, 60, 120].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d="M0 -50 L0 50" />
          <path d="M-9 -38 L0 -28 L9 -38" />
          <path d="M-9 38 L0 28 L9 38" />
        </g>
      ))}
    </g>
  </svg>
);

export const FireworkIcon = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
    <g stroke="#7b3d86" strokeWidth="3" strokeLinecap="round" fill="none">
      <path d="M60 14 V40" />
      <path d="M60 80 V106" />
      <path d="M14 60 H40" />
      <path d="M80 60 H106" />
      <path d="M28 28 L46 46" />
      <path d="M74 74 L92 92" />
      <path d="M92 28 L74 46" />
      <path d="M46 74 L28 92" />
    </g>
    <circle cx="60" cy="60" r="6" fill="#7b3d86" />
  </svg>
);

export const EXPERIMENT_ICONS: Record<string, () => ReactNode> = {
  christmas: SnowflakeIcon,
  'new-year': FireworkIcon,
};

export const ArrowRight = () => (
  <svg
    viewBox="0 0 16 16"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export const ArrowUpRight = () => (
  <svg
    viewBox="0 0 16 16"
    className="size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12L12 4M5 4h7v7" />
  </svg>
);

export const XIcon = () => (
  <svg
    viewBox="0 0 16 16"
    className="size-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M3 3l10 10M13 3L3 13" />
  </svg>
);

export const GithubIcon = () => (
  <svg
    viewBox="0 0 16 16"
    className="size-5"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export type { Accent };
