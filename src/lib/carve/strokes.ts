export type Point = [number, number];

// u, v in 0..1; w is the brush width as a fraction of the mask size.
export interface Stroke {
  w: number;
  pts: Point[];
}

export const MIN_POINT_DISTANCE = 0.004;
export const SIMPLIFY_TOLERANCE = 0.003;

const distance = (a: Point, b: Point): number =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);

// Appends `point` unless it is closer than MIN_POINT_DISTANCE to the last point.
export const appendPoint = (stroke: Stroke, point: Point): Stroke => {
  const last = stroke.pts[stroke.pts.length - 1];
  if (last !== undefined && distance(last, point) < MIN_POINT_DISTANCE)
    return stroke;
  return { ...stroke, pts: [...stroke.pts, point] };
};

const perpendicularDistance = (p: Point, a: Point, b: Point): number => {
  const length = distance(a, b);
  if (length === 0) return distance(p, a);
  return (
    Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) /
    length
  );
};

// Ramer–Douglas–Peucker line simplification.
export const simplifyPoints = (
  pts: Point[],
  tolerance: number = SIMPLIFY_TOLERANCE,
): Point[] => {
  if (pts.length < 3) return pts;
  const first = pts[0];
  const last = pts[pts.length - 1];

  const { index, dist } = pts.slice(1, -1).reduce(
    (max, p, i) => {
      const d = perpendicularDistance(p, first, last);
      return d > max.dist ? { index: i + 1, dist: d } : max;
    },
    { index: 0, dist: 0 },
  );

  if (dist <= tolerance) return [first, last];
  const left = simplifyPoints(pts.slice(0, index + 1), tolerance);
  const right = simplifyPoints(pts.slice(index), tolerance);
  return [...left.slice(0, -1), ...right];
};
