import { ExternalLink } from './ExternalLink';
import { GithubIcon, XIcon } from './icons';

// 44px hit area around the 20px icon.
const ICON_LINK_CLASS =
  'hover:text-text inline-flex size-11 items-center justify-center transition-colors';

export const Footer = () => (
  <footer className="border-line mt-16 flex items-center justify-between gap-4 border-t py-10 md:mt-24">
    <p className="text-muted font-mono text-sm">
      Made by{' '}
      <ExternalLink
        href="https://oksana.dev"
        className="text-text underline underline-offset-4"
      >
        toksana
      </ExternalLink>
    </p>
    <div className="text-muted -mr-3 flex items-center gap-2 font-mono text-sm">
      <ExternalLink
        href="https://x.com/toksana_dev"
        aria-label="X (opens in a new tab)"
        className={ICON_LINK_CLASS}
      >
        <XIcon />
      </ExternalLink>
      <ExternalLink
        href="https://github.com/toksana"
        aria-label="GitHub (opens in a new tab)"
        className={ICON_LINK_CLASS}
      >
        <GithubIcon />
      </ExternalLink>
    </div>
  </footer>
);
