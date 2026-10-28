import { faker } from '@faker-js/faker';
import { deflateSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { TEMPLATES } from '@/lib/carve/templates';
import type { Stroke } from '@/lib/carve/strokes';
import { makePoint, makeStroke } from '@/lib/carve/testFactories';
import {
  decodeDrawing,
  encodeDrawing,
  MAX_CODE_LENGTH,
  MAX_POINTS,
  MAX_STROKES,
} from './drawingCodec';

const COORD_STEP = 1 / 255;
const fortune = { fortuneIndex: 5, candleIndex: 3 };

const makeLongStroke = (count: number): Stroke =>
  makeStroke({ pts: Array.from({ length: count }, makePoint) });

const toCode = (bytes: number[] | Uint8Array): string =>
  Buffer.from(deflateSync(Uint8Array.from(bytes))).toString('base64url');

const countPoints = (strokes: Stroke[]): number =>
  strokes.reduce((total, stroke) => total + stroke.pts.length, 0);

describe('drawing codec', () => {
  it('round-trips strokes within the quantization step', () => {
    // Arrange
    const strokes = faker.helpers.multiple(() => makeLongStroke(8), {
      count: { min: 2, max: 6 },
    });

    // Act
    const decoded = decodeDrawing(encodeDrawing(fortune, strokes));

    // Assert
    expect(decoded?.fortuneIndex).toBe(fortune.fortuneIndex);
    expect(decoded?.candleIndex).toBe(fortune.candleIndex);
    expect(decoded?.strokes).toHaveLength(strokes.length);
    decoded?.strokes.forEach((stroke, i) => {
      expect(stroke.w).toBeCloseTo(strokes[i].w, 6);
      expect(stroke.pts).toHaveLength(strokes[i].pts.length);
      stroke.pts.forEach(([u, v], j) => {
        expect(Math.abs(u - strokes[i].pts[j][0])).toBeLessThanOrEqual(
          COORD_STEP / 2 + 1e-9,
        );
        expect(Math.abs(v - strokes[i].pts[j][1])).toBeLessThanOrEqual(
          COORD_STEP / 2 + 1e-9,
        );
      });
    });
  });

  it('keeps filled polygons and single-point dots', () => {
    // Arrange
    const polygon = makeStroke({
      fill: true,
      pts: [makePoint(), makePoint(), makePoint()],
    });
    const dot = makeStroke({ pts: [makePoint()] });

    // Act
    const decoded = decodeDrawing(encodeDrawing(fortune, [polygon, dot]));

    // Assert
    expect(decoded?.strokes[0].fill).toBe(true);
    expect(decoded?.strokes[0].pts).toHaveLength(3);
    expect(decoded?.strokes[1].fill).toBeUndefined();
    expect(decoded?.strokes[1].pts).toHaveLength(1);
  });

  it('clamps coordinates outside 0..1', () => {
    // Arrange
    const stroke = makeStroke({
      pts: [
        [-0.2, 1.5],
        [0.5, 0.5],
      ],
    });

    // Act
    const decoded = decodeDrawing(encodeDrawing(fortune, [stroke]));

    // Assert
    expect(decoded?.strokes[0].pts[0]).toEqual([0, 1]);
  });

  it('encodes an empty drawing', () => {
    // Act
    const decoded = decodeDrawing(encodeDrawing(fortune, []));

    // Assert
    expect(decoded).toEqual({ ...fortune, strokes: [] });
  });

  it.each(TEMPLATES.map((template) => [template.id, template] as const))(
    'fits the template %s into a short link',
    (_id, template) => {
      // Act
      const code = encodeDrawing(fortune, template.strokes);
      const decoded = decodeDrawing(code);

      // Assert
      expect(code.length).toBeLessThanOrEqual(1500);
      expect(decoded?.strokes).toHaveLength(template.strokes.length);
    },
  );

  it('simplifies a drawing with too many points to fit the limit', () => {
    // Arrange
    const wave: Stroke = makeStroke({
      pts: Array.from({ length: 2000 }, (_, i): [number, number] => [
        i / 2000,
        0.5 + 0.3 * Math.sin(i / 25),
      ]),
    });

    // Act
    const decoded = decodeDrawing(encodeDrawing(fortune, [wave]));

    // Assert
    expect(decoded).not.toBeNull();
    expect(countPoints(decoded?.strokes ?? [])).toBeLessThanOrEqual(MAX_POINTS);
    expect(decoded?.strokes[0].pts.length).toBeGreaterThan(10);
  });

  it('drops strokes beyond the limit when simplifying is not enough', () => {
    // Arrange
    const strokes = Array.from({ length: MAX_STROKES + 10 }, () =>
      makeLongStroke(2),
    );

    // Act
    const decoded = decodeDrawing(encodeDrawing(fortune, strokes));

    // Assert
    expect(decoded?.strokes).toHaveLength(MAX_STROKES);
  });

  it.each([
    ['an empty string', ''],
    ['characters outside base64url', 'abc+/=!'],
    ['valid base64 that is not deflate', 'AAAAAAAA'],
    ['a code that is too long', 'a'.repeat(MAX_CODE_LENGTH + 1)],
  ])('rejects %s', (_label, code) => {
    // Act
    const decoded = decodeDrawing(code);

    // Assert
    expect(decoded).toBeNull();
  });

  it('rejects a truncated code', () => {
    // Arrange
    const code = encodeDrawing(fortune, [makeLongStroke(40)]);

    // Act
    const decoded = decodeDrawing(code.slice(0, code.length - 6));

    // Assert
    expect(decoded).toBeNull();
  });

  it.each([
    ['an unknown version', [2, 0, 0, 0]],
    ['a fortune index out of range', [1, 250, 0, 0]],
    ['a candle index out of range', [1, 0, 250, 0]],
    ['too many strokes', [1, 0, 0, MAX_STROKES + 1]],
    ['a missing stroke', [1, 0, 0, 1]],
    ['a stroke with no points', [1, 0, 0, 1, 30, 0, 0, 0]],
    ['a stroke with zero width', [1, 0, 0, 1, 0, 0, 1, 0, 10, 10]],
    ['a stroke longer than its data', [1, 0, 0, 1, 30, 0, 5, 0, 10, 10]],
    ['trailing bytes', [1, 0, 0, 1, 30, 0, 1, 0, 10, 10, 99]],
  ])('rejects a payload with %s', (_label, bytes) => {
    // Act
    const decoded = decodeDrawing(toCode(bytes));

    // Assert
    expect(decoded).toBeNull();
  });

  it('rejects a payload that inflates far beyond the size limit', () => {
    // Arrange
    const bomb = new Uint8Array(200_000);
    bomb[0] = 1;

    // Act
    const decoded = decodeDrawing(toCode(bomb));

    // Assert
    expect(decoded).toBeNull();
  });
});
