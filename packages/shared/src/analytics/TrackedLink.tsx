'use client';

import type { ComponentProps } from 'react';
import { trackTrackedEvent } from './events';
import type { TrackedEvent } from './events';

type TrackedLinkProps = ComponentProps<'a'> & { event?: TrackedEvent };

// An anchor that reports `event` on click. Usable from server components.
export const TrackedLink = ({ event, onClick, ...props }: TrackedLinkProps) => (
  <a
    {...props}
    onClick={(e) => {
      onClick?.(e);
      if (event !== undefined) trackTrackedEvent(event);
    }}
  />
);
