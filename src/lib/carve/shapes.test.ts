import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import {
  SUPPORTED_GLYPHS,
  arc,
  circle,
  fillPolygon,
  glyph,
  mirror,
  text,
} from './shapes';
import type { Point } from './strokes';

describe('arc', () => {
  it('starts and ends on the requested angles', () => {
    const [start, , end] = arc([0.5, 0.5], 0.2, 0.1, 0, Math.PI, 2);

    expect(start).toEqual([0.7, 0.5]);
    expect(end[0]).toBeCloseTo(0.3, 10);
    expect(end[1]).toBeCloseTo(0.5, 10);
  });
});

describe('mirror', () => {
  it('reflects across u = 0.5 and keeps v', () => {
    const u = faker.number.float({ min: 0, max: 1 });
    const v = faker.number.float({ min: 0, max: 1 });

    const [point] = mirror([[u, v]]);

    expect(point[0]).toBeCloseTo(1 - u, 10);
    expect(point[1]).toBe(v);
  });
});

describe('fillPolygon', () => {
  const square: Point[] = [
    [0.4, 0.4],
    [0.6, 0.4],
    [0.6, 0.6],
    [0.4, 0.6],
  ];

  it('returns a closed outline first', () => {
    const [outline] = fillPolygon(0.03, square);

    expect(outline.pts[0]).toEqual(outline.pts[outline.pts.length - 1]);
  });

  it('hatches the inside with horizontal lines spanning the polygon', () => {
    const [, ...hatch] = fillPolygon(0.03, square);

    expect(hatch.length).toBeGreaterThan(3);
    hatch.forEach(({ pts: [a, b] }) => {
      expect(a[1]).toBe(b[1]);
      expect(a[0]).toBeCloseTo(0.4, 10);
      expect(b[0]).toBeCloseTo(0.6, 10);
    });
  });

  it('leaves gaps in a concave shape instead of bridging them', () => {
    const u: Point[] = [
      [0.3, 0.3],
      [0.7, 0.3],
      [0.7, 0.7],
      [0.6, 0.7],
      [0.6, 0.4],
      [0.4, 0.4],
      [0.4, 0.7],
      [0.3, 0.7],
    ];

    const [, ...hatch] = fillPolygon(0.03, u);

    const upperRows = hatch.filter(({ pts }) => pts[0][1] > 0.45);
    expect(upperRows.every(({ pts }) => pts[1][0] - pts[0][0] < 0.15)).toBe(
      true,
    );
  });
});

describe('glyphs', () => {
  it('supports every character the templates use', () => {
    expect(SUPPORTED_GLYPHS).toEqual(
      expect.arrayContaining(['4', '0', '<', '>', '/', '{', '}']),
    );
  });

  it('scales a glyph into its box', () => {
    const strokes = glyph('/', 0.03, [0.2, 0.3], 0.1, 0.2);

    const pts = strokes.flatMap((s) => s.pts);
    pts.forEach(([x, y]) => {
      expect(x).toBeGreaterThanOrEqual(0.2);
      expect(x).toBeLessThanOrEqual(0.3);
      expect(y).toBeGreaterThanOrEqual(0.3);
      expect(y).toBeLessThanOrEqual(0.5);
    });
  });

  it('lays characters out left to right', () => {
    const strokes = text('44', 0.03, [0.2, 0.3], 0.1, 0.2, 0.05);

    const minUs = strokes.map((s) => Math.min(...s.pts.map((p) => p[0])));
    expect(Math.max(...minUs)).toBeGreaterThanOrEqual(0.35);
  });

  it('draws nothing for an unknown character', () => {
    const strokes = glyph('~', 0.03, [0, 0], 0.1, 0.1);

    expect(strokes).toEqual([]);
  });
});

describe('circle', () => {
  it('stays within its radius of the centre', () => {
    const pts = circle([0.5, 0.5], 0.05);

    pts.forEach(([x, y]) =>
      expect(Math.hypot(x - 0.5, y - 0.5)).toBeCloseTo(0.05, 10),
    );
  });
});
