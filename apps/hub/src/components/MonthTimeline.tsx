import { EXPERIMENTS, buildTimeline } from '@playground/shared/experiments';
import type { TimelineSlot } from '@playground/shared/experiments';
import { ACCENT_STYLES } from './accent';

const slots = buildTimeline(EXPERIMENTS);

const MonthDot = ({ slot }: { slot: TimelineSlot }) => {
  const { experiment } = slot;
  if (experiment === null) {
    return <span className="border-line size-4 rounded-full border" />;
  }
  const style = ACCENT_STYLES[experiment.accent];
  if (experiment.status === 'live') {
    return (
      <span
        className={`size-4 rounded-full ${style.bg} shadow-[0_0_14px_var(--pg-amber)]`}
      />
    );
  }
  return (
    <span
      className={`size-4 rounded-full border border-dashed ${style.dashedBorder}`}
    />
  );
};

const MonthItem = ({ slot }: { slot: TimelineSlot }) => {
  const { experiment } = slot;
  const labelColor =
    experiment === null ? 'text-muted' : ACCENT_STYLES[experiment.accent].text;

  return (
    <li className="flex flex-col gap-3">
      <span
        className={`font-mono text-sm tracking-[0.18em] uppercase ${labelColor}`}
      >
        {slot.label}
      </span>
      <MonthDot slot={slot} />
      <span className="hidden min-h-5 font-mono text-sm md:block">
        {experiment === null
          ? ''
          : experiment.title.replace(/^\[|\]$/g, '').replace(' experiment', '')}
      </span>
    </li>
  );
};

export const MonthTimeline = () => (
  <nav
    aria-label="Season timeline"
    className="border-line border-y py-8 md:py-10"
  >
    <ol className="grid grid-cols-6 gap-x-2 gap-y-8 md:grid-cols-12 md:gap-y-0">
      {slots.map((slot) => (
        <MonthItem key={slot.label} slot={slot} />
      ))}
    </ol>
  </nav>
);
