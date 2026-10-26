import { EXPERIMENTS } from '@playground/shared/experiments';
import { ExperimentCard } from '@/components/ExperimentCard';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MonthTimeline } from '@/components/MonthTimeline';

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 md:px-6">
      <Header />
      <Hero />
      <MonthTimeline />
      <main
        id="experiments"
        className="mt-10 grid scroll-mt-8 gap-4 md:mt-16 md:grid-cols-3 md:gap-6"
      >
        {EXPERIMENTS.map((experiment) => (
          <ExperimentCard key={experiment.id} experiment={experiment} />
        ))}
      </main>
      <Footer />
    </div>
  );
}
