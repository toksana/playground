import type { Accent } from '@playground/shared/experiments';

interface AccentStyle {
  text: string;
  border: string;
  dashedBorder: string;
  bg: string;
}

export const ACCENT_STYLES: Record<Accent, AccentStyle> = {
  amber: {
    text: 'text-amber',
    border: 'border-amber/60',
    dashedBorder: 'border-amber',
    bg: 'bg-amber',
  },
  frost: {
    text: 'text-frost',
    border: 'border-frost/60',
    dashedBorder: 'border-frost',
    bg: 'bg-frost',
  },
  violet: {
    text: 'text-violet',
    border: 'border-violet/60',
    dashedBorder: 'border-violet',
    bg: 'bg-violet',
  },
};
