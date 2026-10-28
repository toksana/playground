import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { makeStroke } from '@/lib/carve/testFactories';
import { CANDLES } from './candles';
import { FORTUNES } from './fortunes';
import { pickFortune } from './hashStrokes';

const makeDrawing = () =>
  faker.helpers.multiple(() => makeStroke(), { count: { min: 1, max: 6 } });

describe('pickFortune', () => {
  it('is deterministic for the same drawing', () => {
    // Arrange
    const strokes = makeDrawing();

    // Act
    const first = pickFortune(strokes);
    const second = pickFortune(structuredClone(strokes));

    // Assert
    expect(second).toEqual(first);
  });

  it('returns indices within range, including for an empty drawing', () => {
    // Arrange
    const drawings = [
      [],
      ...faker.helpers.multiple(makeDrawing, { count: 50 }),
    ];

    // Act
    const results = drawings.map(pickFortune);

    // Assert
    results.forEach(({ fortuneIndex, candleIndex }) => {
      expect(Number.isInteger(fortuneIndex)).toBe(true);
      expect(fortuneIndex).toBeGreaterThanOrEqual(0);
      expect(fortuneIndex).toBeLessThan(FORTUNES.length);
      expect(Number.isInteger(candleIndex)).toBe(true);
      expect(candleIndex).toBeGreaterThanOrEqual(0);
      expect(candleIndex).toBeLessThan(CANDLES.length);
    });
  });

  it('spreads different drawings across most fortunes and candles', () => {
    // Arrange
    const results = faker.helpers
      .multiple(makeDrawing, { count: 400 })
      .map(pickFortune);

    // Act
    const fortunes = new Set(results.map((r) => r.fortuneIndex));
    const candles = new Set(results.map((r) => r.candleIndex));

    // Assert
    expect(fortunes.size).toBeGreaterThan(FORTUNES.length * 0.8);
    expect(candles.size).toBe(CANDLES.length);
  });

  it('changes when the drawing changes noticeably', () => {
    // Arrange
    const strokes = makeDrawing();
    const moved = strokes.map((stroke) => ({
      ...stroke,
      pts: stroke.pts.map(([u, v]): [number, number] => [(u + 0.5) % 1, v]),
    }));

    // Act
    const original = pickFortune(strokes);
    const changed = pickFortune(moved);

    // Assert
    expect(changed).not.toEqual(original);
  });

  it('ignores sub-pixel jitter below the 1/255 quantization step', () => {
    // Arrange
    const strokes = [
      makeStroke({
        pts: [
          [0.5, 0.5],
          [0.25, 0.75],
        ],
      }),
    ];
    const jittered = [
      makeStroke({
        w: strokes[0].w,
        pts: [
          [0.5001, 0.5001],
          [0.2501, 0.7501],
        ],
      }),
    ];

    // Act
    const original = pickFortune(strokes);
    const result = pickFortune(jittered);

    // Assert
    expect(result).toEqual(original);
  });
});
