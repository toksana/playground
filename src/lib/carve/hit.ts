import { FRONT_THRESHOLD, localToCarveUV } from './projection';
import type { Point } from './strokes';

// Maps a hit (local-space position + local face normal z) to mask UV.
// Faces turned away from +Z are not carvable, so the projection never cuts the back wall.
export const hitToCarveUV = (
  x: number,
  y: number,
  normalZ: number | undefined,
): Point | null =>
  normalZ !== undefined && normalZ > FRONT_THRESHOLD
    ? localToCarveUV(x, y)
    : null;
