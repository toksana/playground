import { circle, fillPolygon, glyph, mirror, polyline, text } from './shapes';
import type { Point, Stroke } from './strokes';

export interface Template {
  id: string;
  label: string;
  strokes: Stroke[];
}

const W = 0.03;
const SMILE_W = 0.045;
const BOLD_W = 0.04;

const EYE_LEFT: Point[] = [
  [0.29, 0.56],
  [0.43, 0.56],
  [0.36, 0.68],
];
const NOSE: Point[] = [
  [0.46, 0.48],
  [0.54, 0.48],
  [0.5, 0.54],
];
const EYE_DOTS: Point[] = [
  [0.36, 0.6],
  [0.64, 0.6],
];

// Smile bowing down in the middle, from u = 0.28 to 0.72.
const smile = (lowest: number): Point[] =>
  Array.from({ length: 9 }, (_, i): Point => {
    const t = i / 8;
    return [0.28 + 0.44 * t, lowest + 0.12 * (1 - Math.sin(Math.PI * t))];
  });

// Grin: smooth upper lip, zigzag lower edge for the teeth.
const toothyMouth = (): Point[] => {
  const top = Array.from({ length: 9 }, (_, i): Point => {
    const t = i / 8;
    return [0.27 + 0.46 * t, 0.42 - 0.05 * Math.sin(Math.PI * t)];
  });
  const bottom = Array.from({ length: 9 }, (_, i): Point => {
    const t = i / 8;
    const base = 0.3 - 0.06 * Math.sin(Math.PI * t);
    return [0.27 + 0.46 * t, i % 2 === 0 ? base : base + 0.05];
  });
  return [...top, ...bottom.reverse()];
};

const dotEyes = (): Stroke[] =>
  EYE_DOTS.flatMap((c) => fillPolygon(W, circle(c, 0.055)));

const classic: Template = {
  id: 'classic',
  label: 'Classic',
  strokes: [
    ...fillPolygon(W, EYE_LEFT),
    ...fillPolygon(W, mirror(EYE_LEFT)),
    ...fillPolygon(W, NOSE),
    ...fillPolygon(W, toothyMouth()),
  ],
};

const happy: Template = {
  id: 'happy',
  label: 'Happy',
  strokes: [
    ...dotEyes(),
    ...fillPolygon(W, NOSE),
    polyline(SMILE_W, smile(0.3)),
  ],
};

const braces: Template = {
  id: 'braces',
  label: '{ }',
  strokes: [
    ...glyph('{', W, [0.28, 0.5], 0.12, 0.22),
    ...glyph('}', W, [0.6, 0.5], 0.12, 0.22),
    polyline(SMILE_W, smile(0.3)),
  ],
};

const notFound: Template = {
  id: 'not-found',
  label: '404',
  strokes: [
    ...dotEyes(),
    ...text('404', BOLD_W, [0.28, 0.28], 0.12, 0.18, 0.04),
  ],
};

const tags: Template = {
  id: 'tags',
  label: '</>',
  strokes: [
    ...glyph('<', W, [0.27, 0.5], 0.14, 0.22),
    ...glyph('/', W, [0.455, 0.5], 0.09, 0.22),
    ...glyph('>', W, [0.59, 0.5], 0.14, 0.22),
    polyline(SMILE_W, smile(0.3)),
  ],
};

export const TEMPLATES: readonly Template[] = [
  classic,
  happy,
  braces,
  notFound,
  tags,
];
