import Link from 'next/link';
import { ArrowUpRight } from './icons';

const NAV_LINKS = [
  { href: '#experiments', label: 'experiments' },
  { href: 'https://github.com/toksana/playground', label: 'github' },
] as const;

export const Header = () => (
  <header className="flex items-center justify-between py-6 md:py-9">
    <Link href="/" className="flex items-baseline gap-2.5">
      <span className="text-amber font-mono text-2xl font-bold">t/</span>
      <span className="text-lg font-medium md:text-xl">playground</span>
    </Link>
    <nav className="flex items-center gap-6 md:gap-8">
      {NAV_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-muted hover:text-text hidden font-mono text-sm transition-colors md:inline"
        >
          {link.label}
        </a>
      ))}
      <a
        href="https://oksana.dev"
        className="border-line hover:border-muted inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-sm transition-colors md:px-6 md:py-3"
      >
        oksana.dev
        <span className="hidden md:inline">
          <ArrowUpRight />
        </span>
      </a>
    </nav>
  </header>
);
