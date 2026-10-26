import type { ComponentProps } from 'react';

type ExternalLinkProps = Omit<ComponentProps<'a'>, 'target' | 'rel'> & {
  href: string;
};

// Links that leave the site open in a new tab. `rel` stops the new page from reaching back
// through `window.opener`.
export const ExternalLink = (props: ExternalLinkProps) => (
  <a {...props} target="_blank" rel="noopener noreferrer" />
);
