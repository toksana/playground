import Link from 'next/link';
import { TrackedLink } from '@playground/shared/TrackedLink';
import { ExternalLink } from './ExternalLink';
import { ArrowUpRight } from './icons';

const LINK_CLASS =
  'text-muted hover:text-text hidden font-mono text-sm transition-colors md:inline';

export const Header = () => (
  <header className="flex items-center justify-between py-6 md:py-9">
    <Link href="/" className="flex items-baseline gap-2.5">
      <span className="text-amber font-mono text-2xl font-bold">t/</span>
      <span className="text-lg font-medium md:text-xl">playground</span>
    </Link>
    <nav className="flex items-center gap-6 md:gap-8">
      <TrackedLink
        href="#experiments"
        className={LINK_CLASS}
        event={{ name: 'nav_click', props: { target: 'experiments' } }}
      >
        experiments
      </TrackedLink>
      <ExternalLink
        href="https://github.com/toksana/playground"
        className={LINK_CLASS}
        event={{ name: 'contact_click', props: { channel: 'github' } }}
      >
        github
      </ExternalLink>
      <ExternalLink
        href="https://oksana.dev"
        event={{ name: 'contact_click', props: { channel: 'portfolio' } }}
        className="border-line hover:border-muted inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-sm transition-colors md:px-6 md:py-3"
      >
        oksana.dev
        <span className="hidden md:inline">
          <ArrowUpRight />
        </span>
      </ExternalLink>
    </nav>
  </header>
);
