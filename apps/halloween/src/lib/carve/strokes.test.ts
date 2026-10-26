import { describe, expect, it } from 'vitest';
import { makePoint, makeStroke } from './testFactories';
import { MIN_POINT_DISTANCE, appendPoint, simplifyPoints } from './strokes';
import type { Point } from './strokes';

describe('appendPoint', () => {
  it('appends a point farther than the minimum distance', () => {
    const stroke = makeStroke({ pts: [[0.1, 0.1]] });
    const far: Point = [0.1 + MIN_POINT_DISTANCE * 5, 0.1];

    const result = appendPoint(stroke, far);

    expect(result.pts).toEqual([[0.1, 0.1], far]);
  });

  it('returns the same stroke for a point closer than the minimum distance', () => {
    const stroke = makeStroke({ pts: [[0.1, 0.1]] });
    const close: Point = [0.1 + MIN_POINT_DISTANCE / 2, 0.1];

    const result = appendPoint(stroke, close);

    expect(result).toBe(stroke);
  });

  it('accepts any point into an empty stroke', () => {
    const stroke = makeStroke({ pts: [] });
    const point = makePoint();

    const result = appendPoint(stroke, point);

    expect(result.pts).toEqual([point]);
  });

  it('does not mutate the original stroke', () => {
    const stroke = makeStroke({ pts: [[0.1, 0.1]] });

    appendPoint(stroke, [0.9, 0.9]);

    expect(stroke.pts).toEqual([[0.1, 0.1]]);
  });
});

describe('simplifyPoints', () => {
  it('returns short inputs unchanged', () => {
    const pts: Point[] = [makePoint(), makePoint()];

    const result = simplifyPoints(pts);

    expect(result).toEqual(pts);
  });

  it('reduces a near-straight line to its endpoints', () => {
    const pts: Point[] = Array.from({ length: 50 }, (_, i) => [
      i / 49,
      0.5 + (i % 2) * 0.0005,
    ]);

    const result = simplifyPoints(pts);

    expect(result).toEqual([pts[0], pts[49]]);
  });

  it('keeps the corner of an L-shaped path', () => {
    const pts: Point[] = [
      [0, 0],
      [0.5, 0],
      [0.5, 0.5],
    ];

    const result = simplifyPoints(pts);

    expect(result).toEqual(pts);
  });

  it('keeps endpoints and never adds points', () => {
    const pts: Point[] = Array.from({ length: 40 }, makePoint);

    const result = simplifyPoints(pts);

    expect(result[0]).toEqual(pts[0]);
    expect(result[result.length - 1]).toEqual(pts[39]);
    expect(result.length).toBeLessThanOrEqual(pts.length);
  });

  it('keeps more points with a smaller tolerance', () => {
    const pts: Point[] = Array.from({ length: 60 }, (_, i) => [
      i / 59,
      Math.sin(i / 6) * 0.1,
    ]);

    const coarse = simplifyPoints(pts, 0.05);
    const fine = simplifyPoints(pts, 0.001);

    expect(fine.length).toBeGreaterThan(coarse.length);
  });
});
