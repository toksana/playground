import { TrackedLink } from './analytics/TrackedLink';
import { AUTHOR_HANDLE, AUTHOR_URL, HUB_URL } from './links';

export const Overlay = () => (
  <>
    <TrackedLink
      href={HUB_URL}
      className="pg-overlay-link pg-overlay-back"
      event={{ name: 'playground_click' }}
    >
      ← playground
    </TrackedLink>
    <TrackedLink
      href={AUTHOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="pg-overlay-link pg-overlay-credit"
      event={{ name: 'contact_click', props: { channel: 'x' } }}
    >
      by {AUTHOR_HANDLE}
    </TrackedLink>
  </>
);
