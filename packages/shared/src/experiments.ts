export type Accent = 'amber' | 'frost' | 'violet';

export type ExperimentStatus = 'live' | 'soon';

export interface Experiment {
  id: string;
  /** Months after the start of the season: 0 = October 2026. */
  monthIndex: number;
  tag: string;
  title: string;
  description: string;
  accent: Accent;
  status: ExperimentStatus;
  href: string;
}

export interface TimelineSlot {
  label: string;
  experiment: Experiment | null;
}

export const SEASON_LABEL = 'Season one · Oct 2026 — Sep 2027';

export const MONTH_LABELS = [
  'Oct',
  'Nov',
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
] as const;

export const EXPERIMENTS: readonly Experiment[] = [
  {
    id: 'halloween',
    monthIndex: 0,
    tag: 'Halloween 2026',
    title: 'Glowkin',
    description: 'Carve a pumpkin in 3D and watch it light up the dark.',
    accent: 'amber',
    status: 'live',
    href: '/halloween',
  },
  {
    id: 'christmas',
    monthIndex: 2,
    tag: 'Christmas 2026',
    title: '[Christmas experiment]',
    description: 'Coming in December.',
    accent: 'frost',
    status: 'soon',
    href: '/christmas',
  },
  {
    id: 'new-year',
    monthIndex: 3,
    tag: 'New Year 2027',
    title: '[New Year experiment]',
    description: 'Coming at the end of December.',
    accent: 'violet',
    status: 'soon',
    href: '/new-year',
  },
];

export const buildTimeline = (
  experiments: readonly Experiment[],
): TimelineSlot[] =>
  MONTH_LABELS.map((label, index) => ({
    label,
    experiment: experiments.find((item) => item.monthIndex === index) ?? null,
  }));
