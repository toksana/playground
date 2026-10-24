import { describe, expect, it } from 'vitest';
import { batOutline, batShape } from './batShape';

const key = (x: number, y: number): string => `${x.toFixed(4)},${y.toFixed(4)}`;

describe('batOutline', () => {
  it('is mirror-symmetric around the body axis', () => {
    const outline = batOutline();

    const keys = new Set(outline.map(([x, y]) => key(x, y)));

    expect(outline.every(([x, y]) => keys.has(key(-x, y)))).toBe(true);
  });

  it('has a wingspan of 1 and no duplicated points', () => {
    const outline = batOutline();

    const xs = outline.map(([x]) => x);
    const unique = new Set(outline.map(([x, y]) => key(x, y)));

    expect(Math.max(...xs)).toBeCloseTo(0.5, 6);
    expect(Math.min(...xs)).toBeCloseTo(-0.5, 6);
    expect(unique.size).toBe(outline.length);
  });

  it('has scalloped wings: the lower edge goes up and down more than once', () => {
    const rightWing = batOutline().filter(([x, y]) => x > 0.1 && y < 0.03);

    const ys = rightWing.map(([, y]) => y);
    const reversals = ys
      .slice(2)
      .filter((y, i) => (y - ys[i + 1]) * (ys[i + 1] - ys[i]) < 0);

    expect(reversals.length).toBeGreaterThanOrEqual(2);
  });
});

describe('batShape', () => {
  it('is a closed shape with at least as many points as the outline', () => {
    const outline = batOutline();

    const points = batShape().getPoints();

    expect(points.length).toBeGreaterThanOrEqual(outline.length);
  });
});
