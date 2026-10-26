import { ExternalLink } from './ExternalLink';
import { GithubIcon, XIcon } from './icons';

export const Footer = () => (
  <footer className="border-line mt-16 flex flex-col gap-4 border-t py-10 md:mt-24 md:flex-row md:items-center md:justify-between">
    <p className="text-muted font-mono text-sm">
      Made by{' '}
      <ExternalLink
        href="https://oksana.dev"
        className="text-text underline underline-offset-4"
      >
        toksana
      </ExternalLink>
    </p>
    <div className="text-muted flex items-center gap-6 font-mono text-sm">
      <ExternalLink
        href="https://x.com/toksana_dev"
        aria-label="X (opens in a new tab)"
        className="hover:text-text transition-colors"
      >
        <span className="hidden md:inline">
          <XIcon />
        </span>
        <span className="underline underline-offset-4 md:hidden">X</span>
      </ExternalLink>
      <ExternalLink
        href="https://github.com/toksana"
        aria-label="GitHub (opens in a new tab)"
        className="hover:text-text transition-colors"
      >
        <span className="hidden md:inline">
          <GithubIcon />
        </span>
        <span className="underline underline-offset-4 md:hidden">GitHub</span>
      </ExternalLink>
    </div>
  </footer>
);
