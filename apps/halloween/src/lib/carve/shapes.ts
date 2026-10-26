import type { Point, Stroke } from './strokes';

const mirrorX = (p: Point): Point => [1 - p[0], p[1]];

export const polyline = (w: number, pts: Point[]): Stroke => ({ w, pts });

// Points of an elliptical arc; angles in radians, counter-clockwise from +u.
export const arc = (
  [cx, cy]: Point,
  rx: number,
  ry: number,
  from: number,
  to: number,
  steps: number,
): Point[] =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / steps;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });

export const circle = (center: Point, r: number, steps = 12): Point[] =>
  arc(center, r, r, 0, 2 * Math.PI, steps);

// Reflects a shape across the vertical centre line of the mask.
export const mirror = (pts: Point[]): Point[] => pts.map(mirrorX);

// u of the polygon's edges crossing the horizontal line at `v`, sorted.
const crossings = (pts: Point[], v: number): number[] =>
  pts
    .map((a, i) => [a, pts[(i + 1) % pts.length]] as const)
    .filter(([a, b]) => (a[1] <= v && v < b[1]) || (b[1] <= v && v < a[1]))
    .map(([a, b]) => a[0] + ((v - a[1]) * (b[0] - a[0])) / (b[1] - a[1]))
    .sort((x, y) => x - y);

// A polygon filled with the brush: its closed outline plus horizontal hatch lines.
export const fillPolygon = (w: number, pts: Point[]): Stroke[] => {
  const spacing = w * 0.8;
  const vs = pts.map((p) => p[1]);
  const lines: Stroke[] = [];
  for (
    let v = Math.min(...vs) + spacing / 2;
    v < Math.max(...vs);
    v += spacing
  ) {
    const xs = crossings(pts, v);
    for (let i = 0; i + 1 < xs.length; i += 2)
      lines.push(
        polyline(w, [
          [xs[i], v],
          [xs[i + 1], v],
        ]),
      );
  }
  return [polyline(w, [...pts, pts[0]]), ...lines];
};

// Glyph outlines in a unit box (u right, v up), drawn with one brush stroke each.
const GLYPHS: Record<string, Point[][]> = {
  '4': [
    [
      [0.65, 1],
      [0, 0.3],
      [1, 0.3],
    ],
    [
      [0.65, 1],
      [0.65, 0],
    ],
  ],
  '0': [arc([0.5, 0.5], 0.42, 0.5, 0, 2 * Math.PI, 16)],
  '<': [
    [
      [0.9, 0.95],
      [0.1, 0.5],
      [0.9, 0.05],
    ],
  ],
  '>': [
    [
      [0.1, 0.95],
      [0.9, 0.5],
      [0.1, 0.05],
    ],
  ],
  '/': [
    [
      [0.15, 0.02],
      [0.85, 0.98],
    ],
  ],
  '{': [
    [
      [0.85, 1],
      [0.6, 0.95],
      [0.5, 0.78],
      [0.5, 0.62],
      [0.2, 0.5],
      [0.5, 0.38],
      [0.5, 0.22],
      [0.6, 0.05],
      [0.85, 0],
    ],
  ],
  '}': [
    [
      [0.15, 1],
      [0.4, 0.95],
      [0.5, 0.78],
      [0.5, 0.62],
      [0.8, 0.5],
      [0.5, 0.38],
      [0.5, 0.22],
      [0.4, 0.05],
      [0.15, 0],
    ],
  ],
};

export const SUPPORTED_GLYPHS = Object.keys(GLYPHS);

// One glyph scaled into the box whose bottom-left corner is `origin`.
export const glyph = (
  char: string,
  w: number,
  origin: Point,
  width: number,
  height: number,
): Stroke[] =>
  (GLYPHS[char] ?? []).map((pts) =>
    polyline(
      w,
      pts.map(([x, y]) => [origin[0] + x * width, origin[1] + y * height]),
    ),
  );

// A row of glyphs with `gap` between boxes, left edge at `origin`.
export const text = (
  chars: string,
  w: number,
  origin: Point,
  width: number,
  height: number,
  gap: number,
): Stroke[] =>
  [...chars].flatMap((char, i) =>
    glyph(char, w, [origin[0] + i * (width + gap), origin[1]], width, height),
  );
