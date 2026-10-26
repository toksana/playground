import { SEASON_LABEL } from '@playground/shared/experiments';

export const Hero = () => (
  <section className="pt-12 pb-10 md:pt-24 md:pb-16">
    <p className="text-muted font-mono text-xs tracking-[0.1em] text-balance uppercase md:text-sm md:tracking-[0.2em]">
      {SEASON_LABEL}
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
