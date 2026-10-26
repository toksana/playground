import type { Point, Stroke } from './strokes';

export const CARVE_DURATION_MS = 1200;

// A zero-length stroke (a dot) still gets a sliver of time.
const MIN_STROKE_WEIGHT = 0.01;

export interface TimedStroke {
  stroke: Stroke;
  start: number;
  end: number;
}

export interface CarveFrame {
  // Strokes fully carved so far (a prefix of the template).
  doneCount: number;
  // The stroke being carved right now, cut at the knife tip. Never filled: the fill
  // lands when the stroke is committed.
  partial: Stroke | null;
}

const distance = (a: Point, b: Point): number =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

export const pathLength = (pts: Point[]): number =>
  pts.slice(1).reduce((sum, p, i) => sum + distance(pts[i], p), 0);

// Splits `durationMs` across strokes in proportion to their length, in order.
export const buildTimeline = (
  strokes: Stroke[],
  durationMs: number = CARVE_DURATION_MS,
): TimedStroke[] => {
  const weights = strokes.map((s) =>
    Math.max(pathLength(s.pts), MIN_STROKE_WEIGHT),
  );
  const total = weights.reduce((sum, w) => sum + w, 0);

  return strokes.reduce<TimedStroke[]>((timeline, stroke, i) => {
    const start = timeline[i - 1]?.end ?? 0;
    return [
      ...timeline,
      { stroke, start, end: start + (weights[i] / total) * durationMs },
    ];
  }, []);
};

// The stroke cut at `fraction` (0..1) of its length, with an interpolated tip point.
export const partialStroke = (stroke: Stroke, fraction: number): Stroke => {
  const { w, pts } = stroke;
  const target = Math.min(Math.max(fraction, 0), 1) * pathLength(pts);
  const kept: Point[] = pts.slice(0, 1);
  let walked = 0;

  for (let i = 1; i < pts.length; i += 1) {
    const segment = distance(pts[i - 1], pts[i]);
    if (walked + segment >= target) {
      const t = segment === 0 ? 0 : (target - walked) / segment;
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      kept.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
      break;
    }
    kept.push(pts[i]);
    walked += segment;
  }
  return { w, pts: kept };
};

export const sampleTimeline = (
  timeline: TimedStroke[],
  elapsedMs: number,
): CarveFrame => {
  const doneCount = timeline.filter((t) => t.end <= elapsedMs).length;
  const active = timeline[doneCount];
  if (active === undefined || elapsedMs < active.start)
    return { doneCount, partial: null };

  const fraction = (elapsedMs - active.start) / (active.end - active.start);
  return { doneCount, partial: partialStroke(active.stroke, fraction) };
};
