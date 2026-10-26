export type PlaybackMode = 'none' | 'hover' | 'visible';

interface PlaybackInput {
  reducedMotion: boolean;
  // A mouse is the primary pointer, so hover is a reliable signal.
  canHover: boolean;
}

// When the card video plays: never with reduced motion (poster only), on hover with a mouse,
// while on screen on touch devices where hover does not exist.
export const playbackMode = ({
  reducedMotion,
  canHover,
}: PlaybackInput): PlaybackMode => {
  if (reducedMotion) return 'none';
  return canHover ? 'hover' : 'visible';
};
