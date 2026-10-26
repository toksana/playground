// Candle flame brightness over time: a mix of three sines, always within [0.7, 1].
export const flicker = (t: number): number =>
  0.85 +
  0.15 *
    (0.5 * Math.sin(t * 8.3) +
      0.3 * Math.sin(t * 13.7 + 1.3) +
      0.2 * Math.sin(t * 21.1 + 2.9));
