import { describe, expect, it } from 'vitest';
import { CANDLES } from './candles';
import { FORTUNES } from './fortunes';
import { buildShareText } from './shareUrl';

// X counts any URL as 23 characters; the tweet limit is 280.
const X_LIMIT = 280;
const X_URL_LENGTH = 23;

describe('FORTUNES', () => {
  it('has 25-30 entries', () => {
    // Arrange / Act
    const count = FORTUNES.length;

    // Assert
    expect(count).toBeGreaterThanOrEqual(25);
    expect(count).toBeLessThanOrEqual(30);
  });

  it('has no duplicates or blank entries', () => {
    // Arrange / Act
    const unique = new Set(FORTUNES.map((text) => text.trim()));

    // Assert
    expect(unique.size).toBe(FORTUNES.length);
    expect(FORTUNES.every((text) => text.trim().length > 0)).toBe(true);
  });

  it('fits in a tweet together with the link', () => {
    // Arrange
    const lengths = FORTUNES.map(
      (_, fortuneIndex) =>
        buildShareText({ fortuneIndex, candleIndex: 0 }).length +
        X_URL_LENGTH +
        1,
    );

    // Act
    const longest = Math.max(...lengths);

    // Assert
    expect(longest).toBeLessThanOrEqual(X_LIMIT);
  });
});

describe('CANDLES', () => {
  it('has 5-6 candles with unique ids and hex colors', () => {
    // Arrange
    const ids = new Set(CANDLES.map((candle) => candle.id));

    // Assert
    expect(CANDLES.length).toBeGreaterThanOrEqual(5);
    expect(CANDLES.length).toBeLessThanOrEqual(6);
    expect(ids.size).toBe(CANDLES.length);
    CANDLES.forEach((candle) => expect(candle.color).toMatch(/^#[0-9a-f]{6}$/));
  });
});
