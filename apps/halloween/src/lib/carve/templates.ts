import {
  arc,
  circle,
  fillPolygon,
  glyph,
  mirror,
  polyline,
  text,
} from './shapes';
import { GENERATED_STROKES } from './templates.generated';
import type { Point, Stroke } from './strokes';

export type TemplateCategoryId = 'faces' | 'shapes' | 'dev';

export interface TemplateCategory {
  id: TemplateCategoryId;
  label: string;
  glyph: string;
}

export interface Template {
  id: string;
  label: string;
  category: TemplateCategoryId;
  strokes: Stroke[];
}

export const TEMPLATE_CATEGORIES: readonly TemplateCategory[] = [
  { id: 'faces', label: 'Faces', glyph: '🎃' },
  { id: 'shapes', label: 'Shapes', glyph: '🦇' },
  { id: 'dev', label: 'Dev', glyph: '</>' },
];

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
  category: 'faces',
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
  category: 'faces',
  strokes: [
    ...dotEyes(),
    ...fillPolygon(W, NOSE),
    polyline(SMILE_W, smile(0.3)),
  ],
};

// Wide vertical oval eye and a short raised brow over it (left side).
const SCARED_EYE: Point[] = arc([0.36, 0.58], 0.055, 0.09, 0, 2 * Math.PI, 12);
const SCARED_BROW: Point[] = arc(
  [0.36, 0.64],
  0.08,
  0.09,
  0.3 * Math.PI,
  0.7 * Math.PI,
  6,
);
const SCARED_MOUTH: Point[] = arc([0.5, 0.33], 0.07, 0.09, 0, 2 * Math.PI, 12);

const scared: Template = {
  id: 'scared',
  label: 'Scared',
  category: 'faces',
  strokes: [
    ...fillPolygon(W, SCARED_EYE),
    ...fillPolygon(W, mirror(SCARED_EYE)),
    polyline(W, SCARED_BROW),
    polyline(W, mirror(SCARED_BROW)),
    ...fillPolygon(W, NOSE),
    ...fillPolygon(W, SCARED_MOUTH),
  ],
};

const braces: Template = {
  id: 'braces',
  label: '{ }',
  category: 'dev',
  strokes: [
    ...glyph('{', W, [0.28, 0.5], 0.12, 0.22),
    ...glyph('}', W, [0.6, 0.5], 0.12, 0.22),
    polyline(SMILE_W, smile(0.3)),
  ],
};

const notFound: Template = {
  id: 'not-found',
  label: '404',
  category: 'dev',
  strokes: [
    ...dotEyes(),
    ...text('404', BOLD_W, [0.28, 0.28], 0.12, 0.18, 0.04),
  ],
};

const tags: Template = {
  id: 'tags',
  label: '</>',
  category: 'dev',
  strokes: [
    ...glyph('<', W, [0.27, 0.5], 0.14, 0.22),
    ...glyph('/', W, [0.455, 0.5], 0.09, 0.22),
    ...glyph('>', W, [0.59, 0.5], 0.14, 0.22),
    polyline(SMILE_W, smile(0.3)),
  ],
};

const generatedDev = (
  id: keyof typeof GENERATED_STROKES,
  label: string,
): Template => ({
  id,
  label,
  category: 'dev',
  strokes: GENERATED_STROKES[id],
});

export const TEMPLATES: readonly Template[] = [
  classic,
  happy,
  scared,
  braces,
  notFound,
  tags,
  generatedDev('nan', 'NaN'),
  generatedDev('wq', ':wq'),
  generatedDev('binary', '0 1 _'),
  generatedDev('kaomoji-angry', '>_<'),
  generatedDev('kaomoji-happy', '^_^'),
];

export const templatesByCategory = (
  category: TemplateCategoryId,
  templates: readonly Template[] = TEMPLATES,
): Template[] => templates.filter((t) => t.category === category);

// `rng` returns a number in [0, 1); injected so the pick is testable.
export const pickRandomTemplate = (
  excludeId: string | null,
  rng: () => number = Math.random,
  templates: readonly Template[] = TEMPLATES,
): Template | null => {
  const pool = templates.filter((t) => t.id !== excludeId);
  return pool[Math.floor(rng() * pool.length)] ?? null;
};
