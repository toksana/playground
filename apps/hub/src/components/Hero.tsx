import { SEASON_PARTS, SEASON_PREFIX } from '@playground/shared/experiments';
import { Fragment } from 'react';
import { ACCENT_STYLES } from './accent';

export const Hero = () => (
  <section className="pt-12 pb-10 md:pt-24 md:pb-16">
    <p className="text-muted font-mono text-xs tracking-[0.1em] uppercase md:text-sm md:tracking-[0.2em]">
      {/* On phones the prefix gets its own line and the events sit below it. */}
      <span className="block md:inline">{SEASON_PREFIX}</span>{' '}
      {SEASON_PARTS.map((part, i) => (
        <Fragment key={part.text}>
          {i > 0 && ' → '}
          <span
            className={`whitespace-nowrap ${ACCENT_STYLES[part.accent].text}`}
          >
            {part.text}
          </span>
        </Fragment>
      ))}
    </p>
    <h1 className="mt-6 text-[2.5rem] leading-[1.05] font-bold tracking-tight md:mt-8 md:text-8xl">
      A small light
      <br className="hidden md:block" /> for every season.
    </h1>
    <p className="text-muted mt-6 max-w-3xl text-lg md:mt-10 md:text-2xl md:leading-relaxed">
      Interactive 3D experiments for the web, built with Three.js and React
      Three Fiber. A new one switches on with each holiday.
    </p>
  </section>
);
