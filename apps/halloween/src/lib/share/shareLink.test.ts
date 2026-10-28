import { describe, expect, it } from 'vitest';
import { makeStroke } from '@/lib/carve/testFactories';
import { encodeDrawing } from './drawingCodec';
import { parseShareParam } from './shareLink';

describe('parseShareParam', () => {
  it('reads an old seed as a link without a drawing', () => {
    // Act
    const data = parseShareParam('7-2');

    // Assert
    expect(data).toEqual({ fortuneIndex: 7, candleIndex: 2, strokes: null });
  });

  it('reads a drawing code', () => {
    // Arrange
    const strokes = [
      makeStroke(),
      makeStroke({
        fill: true,
        pts: [
          [0.1, 0.1],
          [0.5, 0.1],
          [0.3, 0.5],
        ],
      }),
    ];
    const code = encodeDrawing({ fortuneIndex: 4, candleIndex: 1 }, strokes);

    // Act
    const data = parseShareParam(code);

    // Assert
    expect(data?.fortuneIndex).toBe(4);
    expect(data?.candleIndex).toBe(1);
    expect(data?.strokes).toHaveLength(2);
  });

  it.each(['', 'zzz', '07-2', '99-0', '0-9', '7-2-1'])(
    'rejects %j',
    (param) => {
      // Act
      const data = parseShareParam(param);

      // Assert
      expect(data).toBeNull();
    },
  );
});
