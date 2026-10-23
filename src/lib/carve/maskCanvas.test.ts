import { faker } from '@faker-js/faker';
import { describe, expect, it, vi } from 'vitest';
import { drawStroke, toCanvasPoint } from './maskCanvas';
import type { Point } from './strokes';
import { makeStroke } from './testFactories';

describe('toCanvasPoint', () => {
  it('flips v so that v = 1 is the top row of the canvas', () => {
    const size = faker.helpers.arrayElement([512, 1024]);

    const top = toCanvasPoint([0, 1], size);
    const bottom = toCanvasPoint([0, 0], size);

    expect(top).toEqual([0, 0]);
    expect(bottom).toEqual([0, size]);
  });

  it('scales u linearly with the mask size', () => {
    const size = faker.helpers.arrayElement([512, 1024]);

    const [x] = toCanvasPoint([0.25, 0.5], size);

    expect(x).toBe(size * 0.25);
  });
});

const makeCtx = () =>
  ({
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
  }) as unknown as CanvasRenderingContext2D;

const TRIANGLE: Point[] = [
  [0.3, 0.3],
  [0.7, 0.3],
  [0.5, 0.7],
];

describe('drawStroke', () => {
  it('fills and outlines a closed path for a filled stroke', () => {
    const ctx = makeCtx();
    const stroke = makeStroke({ pts: TRIANGLE, fill: true });

    drawStroke(ctx, 512, stroke);

    expect(ctx.fill).toHaveBeenCalledTimes(1);
    expect(ctx.stroke).toHaveBeenCalledTimes(2);
    expect(ctx.closePath).toHaveBeenCalledTimes(3);
  });

  it('only strokes an open path when fill is not set', () => {
    const ctx = makeCtx();
    const stroke = makeStroke({ pts: TRIANGLE });

    drawStroke(ctx, 512, stroke);

    expect(ctx.fill).not.toHaveBeenCalled();
    expect(ctx.closePath).not.toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalledTimes(2);
  });

  it('does not fill a polygon with fewer than 3 points', () => {
    const ctx = makeCtx();
    const stroke = makeStroke({ pts: TRIANGLE.slice(0, 2), fill: true });

    drawStroke(ctx, 512, stroke);

    expect(ctx.fill).not.toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalledTimes(2);
  });
});
