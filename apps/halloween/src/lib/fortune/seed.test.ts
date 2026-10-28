import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { CANDLES } from './candles';
import { FORTUNES } from './fortunes';
import { allSeeds, decodeSeed, encodeSeed } from './seed';

describe('seed', () => {
  it('round-trips every fortune and candle', () => {
    // Arrange
    const fortuneIndex = faker.number.int({ min: 0, max: FORTUNES.length - 1 });
    const candleIndex = faker.number.int({ min: 0, max: CANDLES.length - 1 });

    // Act
    const decoded = decodeSeed(encodeSeed({ fortuneIndex, candleIndex }));

    // Assert
    expect(decoded).toEqual({ fortuneIndex, candleIndex });
  });

  it.each([
    '',
    'abc',
    '7',
    '7-',
    '-2',
    '7-2-1',
    '07-2',
    '7-02',
    '-1-2',
    '1.5-2',
    ' 7-2',
    '7-2 ',
    `${FORTUNES.length}-0`,
    `0-${CANDLES.length}`,
    '999-9',
  ])('rejects %j', (seed) => {
    // Act
    const decoded = decodeSeed(seed);

    // Assert
    expect(decoded).toBeNull();
  });

  it('lists every combination exactly once, all decodable', () => {
    // Arrange / Act
    const seeds = allSeeds();

    // Assert
    expect(new Set(seeds).size).toBe(FORTUNES.length * CANDLES.length);
    expect(seeds.every((seed) => decodeSeed(seed) !== null)).toBe(true);
  });
});
