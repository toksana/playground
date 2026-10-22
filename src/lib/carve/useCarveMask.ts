import { useEffect, useMemo } from 'react';
import { createMask, pickMaskSize } from './maskCanvas';
import type { Mask } from './maskCanvas';
import type { Stroke } from './strokes';

// TEMPORARY (PLAN.md 1.5): a circle plus an off-centre bar to check hole, orientation and the back wall.
// Item 1.6 replaces this with the strokes from `useCarveStore`.
const TEST_STROKES: Stroke[] = [
  { w: 0.2, pts: [[0.5, 0.5]] },
  {
    w: 0.04,
    pts: [
      [0.7, 0.8],
      [0.9, 0.8],
    ],
  },
];

export const useCarveMask = (): Mask => {
  const mask = useMemo(() => createMask(pickMaskSize(), TEST_STROKES), []);

  useEffect(() => () => mask.texture.dispose(), [mask]);

  return mask;
};
