import { CanvasTexture } from 'three';
import type { Point, Stroke } from './strokes';

export const MASK_SIZE_DESKTOP = 1024;
export const MASK_SIZE_MOBILE = 512;

// Wider, translucent pass under the core stroke: a soft edge without `ctx.filter`
// (which iOS Safari lacks). The shader discards above 0.55, so this rim stays as lit "flesh".
const SOFT_EDGE_SCALE = 1.25;
const SOFT_EDGE_ALPHA = 0.4;

export interface Mask {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: CanvasTexture;
  size: number;
}

export const pickMaskSize = (): number =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches
    ? MASK_SIZE_MOBILE
    : MASK_SIZE_DESKTOP;

// CanvasTexture.flipY is true, so canvas y = (1 - v) * size.
export const toCanvasPoint = ([u, v]: Point, size: number): Point => [
  u * size,
  (1 - v) * size,
];

const fillBackground = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
};

const strokeLine = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  lineWidth: number,
  alpha: number,
): void => {
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  points.forEach(([x, y], i) =>
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y),
  );
  ctx.stroke();
};

const fillDot = (
  ctx: CanvasRenderingContext2D,
  [x, y]: Point,
  diameter: number,
  alpha: number,
) => {
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(x, y, diameter / 2, 0, Math.PI * 2);
  ctx.fill();
};

export const drawStroke = (
  ctx: CanvasRenderingContext2D,
  size: number,
  stroke: Stroke,
): void => {
  const points = stroke.pts.map((p) => toCanvasPoint(p, size));
  const width = stroke.w * size;
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (points.length === 1) {
    fillDot(ctx, points[0], width * SOFT_EDGE_SCALE, SOFT_EDGE_ALPHA);
    fillDot(ctx, points[0], width, 1);
  } else if (points.length > 1) {
    strokeLine(ctx, points, width * SOFT_EDGE_SCALE, SOFT_EDGE_ALPHA);
    strokeLine(ctx, points, width, 1);
  }
  ctx.globalAlpha = 1;
};

// Full redraw: use on undo / clear / load. Incremental drawing calls `drawStroke` directly.
export const renderStrokes = (
  ctx: CanvasRenderingContext2D,
  size: number,
  strokes: Stroke[],
): void => {
  fillBackground(ctx, size);
  strokes.forEach((stroke) => drawStroke(ctx, size, stroke));
};

export const createMask = (size: number, strokes: Stroke[] = []): Mask => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx === null) throw new Error('2D canvas is not available');

  renderStrokes(ctx, size, strokes);
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return { canvas, ctx, texture, size };
};
