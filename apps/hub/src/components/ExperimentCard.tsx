import type { Experiment } from '@playground/shared/experiments';
import { ACCENT_STYLES } from './accent';
import { ArrowRight, EXPERIMENT_ICONS } from './icons';

const TagPill = ({ experiment }: { experiment: Experiment }) => {
  const style = ACCENT_STYLES[experiment.accent];
  return (
    <span
      className={`rounded-full border px-3 py-1.5 font-mono text-xs tracking-[0.12em] uppercase ${style.text} ${style.border}`}
    >
      {experiment.tag}
    </span>
  );
};

const CardIcon = ({ experiment }: { experiment: Experiment }) => {
  const Icon = EXPERIMENT_ICONS[experiment.id];
  return Icon === undefined ? null : <Icon />;
};

const LiveCard = ({ experiment }: { experiment: Experiment }) => (
  <article className="border-amber/30 bg-tile flex flex-col overflow-hidden rounded-3xl border shadow-[0_0_60px_-10px_rgb(245_158_11/0.25)]">
    <div className="relative grid h-64 place-items-center bg-[radial-gradient(circle_at_center,rgb(245_158_11/0.25),transparent_65%)] md:h-[22rem]">
      <div className="absolute top-6 left-6">
        <TagPill experiment={experiment} />
      </div>
      <span className="bg-amber text-night absolute top-6 right-6 rounded-full px-3 py-1.5 font-mono text-xs font-bold">
        WIP
      </span>
      <div className="h-40 w-36 md:h-52 md:w-44">
        <CardIcon experiment={experiment} />
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <h2 className="text-3xl font-bold">{experiment.title}</h2>
      <p className="text-muted text-lg">{experiment.description}</p>
      <a
        href={experiment.href}
        className="bg-amber text-night mt-auto inline-flex w-full items-center justify-center gap-2 self-start rounded-full px-7 py-4 font-medium transition-opacity hover:opacity-90 md:w-auto"
      >
        Play <ArrowRight />
      </a>
    </div>
  </article>
);

const SoonCard = ({ experiment }: { experiment: Experiment }) => {
  const style = ACCENT_STYLES[experiment.accent];
  return (
    <article className="border-line bg-tile/60 flex flex-row overflow-hidden rounded-3xl border border-dashed md:flex-col">
      <div className="bg-tile relative grid w-28 shrink-0 place-items-center p-5 md:h-[22rem] md:w-auto md:p-0">
        <div className="absolute top-6 left-6 hidden md:block">
          <TagPill experiment={experiment} />
        </div>
        <div className="size-14 md:size-32">
          <CardIcon experiment={experiment} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 md:gap-4 md:p-8">
        <span
          className={`font-mono text-xs tracking-[0.12em] uppercase md:hidden ${style.text}`}
        >
          {experiment.tag}
        </span>
        <h2 className="text-muted text-xl font-bold md:text-3xl">
          {experiment.title}
        </h2>
        <p className="text-muted/80 md:text-lg">{experiment.description}</p>
        <p className={`mt-auto hidden font-mono md:block ${style.text}`}>
          Coming soon
        </p>
      </div>
    </article>
  );
};

export const ExperimentCard = ({ experiment }: { experiment: Experiment }) =>
  experiment.status === 'live' ? (
    <LiveCard experiment={experiment} />
  ) : (
    <SoonCard experiment={experiment} />
  );
