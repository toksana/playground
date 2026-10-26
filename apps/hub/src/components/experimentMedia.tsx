import type { ReactNode } from 'react';
import { DemoVideo } from './DemoVideo';

// Experiments with a recorded demo show it in the card instead of an icon.
export const EXPERIMENT_MEDIA: Record<string, () => ReactNode> = {
  halloween: () => (
    <DemoVideo
      webm="/demos/glowkin.webm"
      mp4="/demos/glowkin.mp4"
      poster="/demos/glowkin-poster.jpg"
      width={606}
      height={1316}
    />
  ),
};
