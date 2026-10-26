import type { ComponentProps } from 'react';
import { TrackedLink } from '@playground/shared/TrackedLink';
import type { TrackedEvent } from '@playground/shared/analytics';

type ExternalLinkProps = Omit<ComponentProps<'a'>, 'target' | 'rel'> & {
  href: string;
  event?: TrackedEvent;
};

// Links that leave the site open in a new tab. `rel` stops the new page from reaching back
// through `window.opener`.
export const ExternalLink = (props: ExternalLinkProps) => (
  <TrackedLink {...props} target="_blank" rel="noopener noreferrer" />
);
