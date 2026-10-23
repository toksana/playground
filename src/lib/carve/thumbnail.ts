import type { Point } from './strokes';

// Thumbnail space is 0..100 on both axes. The viewBox crops to the face area
// (u, v in 0.2..0.8) plus a margin, so a template fills its circle.
export const THUMB_SCALE = 100;
export const THUMB_VIEW_BOX = '16 16 68 68';
export const THUMB_CENTER = 50;
export const THUMB_RADIUS = 34;

const round1 = (n: number): number => Math.round(n * 10) / 10;

// SVG y points down, UV v points up, hence `1 - v`.
export const toThumbPoints = (pts: Point[]): string =>
  pts
    .map(
      ([u, v]) => `${round1(u * THUMB_SCALE)},${round1((1 - v) * THUMB_SCALE)}`,
    )
    .join(' ');
