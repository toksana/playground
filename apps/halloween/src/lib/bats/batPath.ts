import { CatmullRomCurve3, Vector3 } from 'three';

export type Rng = () => number;
export type Vec3 = [number, number, number];

export interface BatSchedule {
  // When the current round of flights began, in clock seconds.
  cycleStart: number;
  // Pause after the last bat has gone, before the next round.
  gap: number;
}

export interface BatPose {
  position: Vec3;
  // Roll around the view axis, leaning into the direction of flight.
  tilt: number;
  // 0 while offstage, 1 in flight; eased at both ends so bats don't pop.
  scale: number;
}

export const BAT_COUNT = 3;
export const FLIGHT_SECONDS = 7;
export const STAGGER_SECONDS = 0.7;
export const MIN_GAP_SECONDS = 8;
export const MAX_GAP_SECONDS = 15;

const FADE_IN_END = 0.1;
const FADE_OUT_START = 0.88;
const MAX_TILT = 0.5;

// Each bat starts behind the pumpkin, loops through the area in front of it
// and flies off into the fog.
const FLIGHT_POINTS: Vec3[][] = [
  [
    [0.3, 0.4, -1.6],
    [1.4, 1.1, -0.5],
    [1.9, 0.5, 1.2],
    [0.6, 0.0, 2.0],
    [-0.8, 0.8, 1.6],
    [-1.8, 1.4, 0.2],
    [-2.2, 2.0, -3],
    [-2.0, 2.6, -9],
  ],
  [
    [-0.4, 0.2, -1.6],
    [-1.5, 0.8, -0.4],
    [-1.9, 0.0, 1.3],
    [-0.5, -0.4, 2.1],
    [0.9, 0.3, 1.5],
    [1.9, 0.9, 0.0],
    [2.3, 1.5, -3],
    [2.1, 2.1, -9],
  ],
  [
    [0.0, 0.9, -1.7],
    [-1.2, 1.5, -0.4],
    [-1.6, 0.9, 1.4],
    [0.0, 1.4, 2.2],
    [1.3, 1.9, 1.0],
    [2.0, 2.4, -1.0],
    [1.5, 3.0, -8],
  ],
];

const curves = FLIGHT_POINTS.map(
  (points) => new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
);

const lerp = (min: number, max: number, t: number): number =>
  min + (max - min) * t;

const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export const nextGap = (rng: Rng): number =>
  lerp(MIN_GAP_SECONDS, MAX_GAP_SECONDS, rng());

export const createSchedule = (now: number, rng: Rng): BatSchedule => ({
  cycleStart: now,
  gap: nextGap(rng),
});

const cycleEnd = ({ cycleStart, gap }: BatSchedule): number =>
  cycleStart + (BAT_COUNT - 1) * STAGGER_SECONDS + FLIGHT_SECONDS + gap;

// Starts the next round once the pause after the previous one is over.
export const advanceSchedule = (
  schedule: BatSchedule,
  now: number,
  rng: Rng,
): BatSchedule =>
  now < cycleEnd(schedule) ? schedule : createSchedule(cycleEnd(schedule), rng);

// Progress of one bat's flight in [0, 1], or null while it is offstage.
export const flightProgress = (
  now: number,
  schedule: BatSchedule,
  index: number,
): number | null => {
  const elapsed = now - schedule.cycleStart - index * STAGGER_SECONDS;
  const progress = elapsed / FLIGHT_SECONDS;
  return progress < 0 || progress > 1 ? null : progress;
};

export const batPose = (index: number, progress: number): BatPose => {
  const curve = curves[index % curves.length];
  const point = curve.getPoint(progress);
  const tangent = curve.getTangent(progress);
  return {
    position: [point.x, point.y, point.z],
    tilt: -tangent.x * MAX_TILT,
    scale:
      smoothstep(0, FADE_IN_END, progress) *
      (1 - smoothstep(FADE_OUT_START, 1, progress)),
  };
};
