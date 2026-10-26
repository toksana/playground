import { AUTHOR_HANDLE, AUTHOR_URL, HUB_URL } from './links';

export const Overlay = () => (
  <>
    <a href={HUB_URL} className="pg-overlay-link pg-overlay-back">
      ← playground
    </a>
    <a
      href={AUTHOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="pg-overlay-link pg-overlay-credit"
    >
      by {AUTHOR_HANDLE}
    </a>
  </>
);
