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
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
};

const tracePath = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  closed: boolean,
): void => {
  ctx.beginPath();
  points.forEach(([x, y], i) =>
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y),
  );
  if (closed) ctx.closePath();
};

const strokeLine = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  lineWidth: number,
  alpha: number,
  closed = false,
): void => {
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineWidth;
  tracePath(ctx, points, closed);
  ctx.stroke();
};

const fillPolygonPath = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
): void => {
  ctx.globalAlpha = 1;
  tracePath(ctx, points, true);
  ctx.fill();
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
  // `lighten` keeps the max of overlapping marks, so segments drawn one by one (incremental)
  // look identical to the same stroke drawn as one path, with no alpha build-up at the joints.
  ctx.globalCompositeOperation = 'lighten';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (stroke.fill === true && points.length >= 3) {
    fillPolygonPath(ctx, points);
    strokeLine(ctx, points, width * SOFT_EDGE_SCALE, SOFT_EDGE_ALPHA, true);
    strokeLine(ctx, points, width, 1, true);
  } else if (points.length === 1) {
    fillDot(ctx, points[0], width * SOFT_EDGE_SCALE, SOFT_EDGE_ALPHA);
    fillDot(ctx, points[0], width, 1);
  } else if (points.length > 1) {
    strokeLine(ctx, points, width * SOFT_EDGE_SCALE, SOFT_EDGE_ALPHA);
    strokeLine(ctx, points, width, 1);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
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
