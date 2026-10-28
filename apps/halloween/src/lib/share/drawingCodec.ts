import { deflateSync, inflateSync } from 'fflate';
import { simplifyPoints, SIMPLIFY_TOLERANCE } from '@/lib/carve/strokes';
import type { Point, Stroke } from '@/lib/carve/strokes';
import { CANDLES } from '@/lib/fortune/candles';
import { FORTUNES } from '@/lib/fortune/fortunes';
import type { FortuneResult } from '@/lib/fortune/seed';

// Format v1 (part of every shared link, so never change it, add a v2 instead):
//   [version][fortuneIndex][candleIndex][strokeCount]
//   per stroke: [w = round(w * 1000)][flags: bit0 = fill][pointCount u16 LE][x0, y0, x1, y1, ...]
//   coordinates are round(u * 255). The whole buffer is deflated and base64url-encoded.
const VERSION = 1;
const HEADER_BYTES = 4;
const STROKE_HEADER_BYTES = 4;
const WIDTH_SCALE = 1000;
const COORD_MAX = 255;
const FILL_FLAG = 1;

export const MAX_STROKES = 64;
export const MAX_POINTS = 700;
export const MAX_CODE_LENGTH = 3000;
export const MAX_BYTES = 8192;

const MAX_TOLERANCE = 0.5;
const TOLERANCE_GROWTH = 1.5;
const BASE64URL = /^[A-Za-z0-9_-]+$/;

export interface DrawingPayload extends FortuneResult {
  strokes: Stroke[];
}

const countPoints = (strokes: Stroke[]): number =>
  strokes.reduce((total, stroke) => total + stroke.pts.length, 0);

// A closed polygon must keep at least 3 points, so a failed simplification keeps the original.
const simplifyStroke = (stroke: Stroke, tolerance: number): Stroke => {
  const pts = simplifyPoints(stroke.pts, tolerance);
  const minimum = stroke.fill === true ? 3 : 1;
  return pts.length >= minimum ? { ...stroke, pts } : stroke;
};

// Simplifies harder and harder until the drawing fits; drops trailing strokes as a last resort.
const fitToLimits = (strokes: Stroke[]): Stroke[] => {
  const usable = strokes
    .filter((stroke) => stroke.pts.length > 0)
    .slice(0, MAX_STROKES);
  const tolerances = Array.from(
    { length: 24 },
    (_, i) => SIMPLIFY_TOLERANCE * TOLERANCE_GROWTH ** (i + 1),
  ).filter((tolerance) => tolerance <= MAX_TOLERANCE);

  const fitted = tolerances.reduce(
    (current, tolerance) =>
      countPoints(current) <= MAX_POINTS
        ? current
        : usable.map((stroke) => simplifyStroke(stroke, tolerance)),
    usable,
  );

  const kept: Stroke[] = [];
  fitted.forEach((stroke) => {
    if (countPoints(kept) + stroke.pts.length <= MAX_POINTS) kept.push(stroke);
  });
  return kept;
};

const quantize = (value: number): number =>
  Math.round(Math.min(1, Math.max(0, value)) * COORD_MAX);

const strokeBytes = ({ w, pts, fill }: Stroke): number[] => [
  Math.min(255, Math.max(1, Math.round(w * WIDTH_SCALE))),
  fill === true ? FILL_FLAG : 0,
  pts.length & 0xff,
  pts.length >> 8,
  ...pts.flatMap(([u, v]) => [quantize(u), quantize(v)]),
];

const toBase64Url = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const fromBase64Url = (code: string): Uint8Array => {
  const padded = code.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, '='));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

export const encodeDrawing = (
  { fortuneIndex, candleIndex }: FortuneResult,
  strokes: Stroke[],
): string => {
  const fitted = fitToLimits(strokes);
  const bytes = Uint8Array.from([
    VERSION,
    fortuneIndex,
    candleIndex,
    fitted.length,
    ...fitted.flatMap(strokeBytes),
  ]);
  return toBase64Url(deflateSync(bytes, { level: 9 }));
};

interface ParsedStroke {
  stroke: Stroke;
  next: number;
}

const parseStroke = (
  bytes: Uint8Array,
  offset: number,
): ParsedStroke | null => {
  if (offset + STROKE_HEADER_BYTES > bytes.length) return null;
  const w = bytes[offset] / WIDTH_SCALE;
  const fill = (bytes[offset + 1] & FILL_FLAG) === FILL_FLAG;
  const count = bytes[offset + 2] | (bytes[offset + 3] << 8);
  const start = offset + STROKE_HEADER_BYTES;
  const next = start + count * 2;
  if (w <= 0 || count === 0 || next > bytes.length) return null;

  const pts = Array.from({ length: count }, (_, i): Point => [
    bytes[start + i * 2] / COORD_MAX,
    bytes[start + i * 2 + 1] / COORD_MAX,
  ]);
  return { stroke: fill ? { w, pts, fill } : { w, pts }, next };
};

const parseStrokes = (
  bytes: Uint8Array,
  strokeCount: number,
): Stroke[] | null => {
  const strokes: Stroke[] = [];
  let offset = HEADER_BYTES;
  let points = 0;

  for (let i = 0; i < strokeCount; i += 1) {
    const parsed = parseStroke(bytes, offset);
    if (parsed === null) return null;
    points += parsed.stroke.pts.length;
    if (points > MAX_POINTS) return null;
    strokes.push(parsed.stroke);
    offset = parsed.next;
  }
  return offset === bytes.length ? strokes : null;
};

const parsePayload = (bytes: Uint8Array): DrawingPayload | null => {
  if (bytes.length < HEADER_BYTES || bytes[0] !== VERSION) return null;
  const [, fortuneIndex, candleIndex, strokeCount] = bytes;
  const valid =
    fortuneIndex < FORTUNES.length &&
    candleIndex < CANDLES.length &&
    strokeCount <= MAX_STROKES;
  if (!valid) return null;

  const strokes = parseStrokes(bytes, strokeCount);
  return strokes === null ? null : { fortuneIndex, candleIndex, strokes };
};

// Anything that is not a well-formed v1 code gives null; a link must never crash the page.
export const decodeDrawing = (code: string): DrawingPayload | null => {
  if (code.length === 0 || code.length > MAX_CODE_LENGTH) return null;
  if (!BASE64URL.test(code)) return null;

  try {
    const bytes = inflateSync(fromBase64Url(code));
    return bytes.length > MAX_BYTES ? null : parsePayload(bytes);
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
};
