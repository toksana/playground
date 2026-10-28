import type { Stroke } from '@/lib/carve/strokes';
import { CANDLES } from './candles';
import { FORTUNES } from './fortunes';
import type { FortuneResult } from './seed';

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;
const CANDLE_SALT = 0x9e3779b9;

// Feeds a 16-bit value into FNV-1a, low byte first.
const mix = (hash: number, value: number): number => {
  const low = Math.imul(hash ^ (value & 0xff), FNV_PRIME);
  return Math.imul(low ^ ((value >>> 8) & 0xff), FNV_PRIME);
};

const quantize = (value: number): number =>
  Math.round(Math.min(1, Math.max(0, value)) * 255);

const hashStrokes = (strokes: Stroke[], salt: number): number => {
  const seeded = mix(mix(FNV_OFFSET, salt & 0xffff), salt >>> 16);
  const hash = strokes.reduce((acc, stroke) => {
    const head = [
      Math.round(stroke.w * 1000),
      stroke.fill === true ? 1 : 0,
      stroke.pts.length,
    ];
    const withHead = head.reduce(mix, acc);
    return stroke.pts.reduce(
      (h, [u, v]) => mix(mix(h, quantize(u)), quantize(v)),
      withHead,
    );
  }, seeded);
  return hash >>> 0;
};

// The same drawing always tells the same fortune under the same candle.
export const pickFortune = (strokes: Stroke[]): FortuneResult => ({
  fortuneIndex: hashStrokes(strokes, 0) % FORTUNES.length,
  candleIndex: hashStrokes(strokes, CANDLE_SALT) % CANDLES.length,
});
