import { describe, expect, it } from 'vitest';
import { toThumbPoints } from './thumbnail';

describe('toThumbPoints', () => {
  it('flips v so that v = 1 is the top of the thumbnail', () => {
    const top = toThumbPoints([[0.5, 1]]);
    const bottom = toThumbPoints([[0.5, 0]]);

    expect(top).toBe('50,0');
    expect(bottom).toBe('50,100');
  });

  it('joins points with spaces in order', () => {
    const pts: [number, number][] = [
      [0.2, 0.8],
      [0.8, 0.2],
    ];

    const result = toThumbPoints(pts);

    expect(result).toBe('20,20 80,80');
  });

  it('rounds coordinates to one decimal', () => {
    const result = toThumbPoints([[0.12345, 0.6789]]);

    expect(result).toBe('12.3,32.1');
  });
});
