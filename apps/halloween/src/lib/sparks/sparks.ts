export type Rng = () => number;
export type Vec3 = [number, number, number];

export interface SparkAttributes {
  origin: Float32Array;
  velocity: Float32Array;
  delay: Float32Array;
  lifetime: Float32Array;
  size: Float32Array;
}

export const SPARK_COUNT = 120;
export const SPARK_GRAVITY: Vec3 = [0, -0.9, 0];

// Share of sparks that escape through the top of the pumpkin instead of the carved holes.
export const ESCAPE_FRACTION = 0.35;
// Top of the pumpkin relative to the flame, and the radius of the ring they leave from.
export const ESCAPE_ORIGIN_Y = 0.95;
const ESCAPE_RING_RADIUS = 0.18;
const MIN_ESCAPE_DELAY = 0.1;
const MAX_ESCAPE_DELAY = 0.5;
const ESCAPE_SPEED_SCALE = 0.8;

const MIN_SPEED = 0.4;
const MAX_SPEED = 1.4;
const MIN_LIFETIME = 0.7;
const MAX_LIFETIME = 1.8;
const MIN_SIZE = 0.012;
const MAX_SIZE = 0.03;
// Fraction of the sphere (measured from +Y) that sparks can fly into.
const CONE_SPREAD = 0.75;

const lerp = (min: number, max: number, t: number): number =>
  min + (max - min) * t;

// Random direction in a cone around +Y (sparks rise from the flame).
const randomDirection = (rng: Rng): Vec3 => {
  const cosTheta = 1 - rng() * CONE_SPREAD;
  const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
  const phi = rng() * Math.PI * 2;
  return [sinTheta * Math.cos(phi), cosTheta, sinTheta * Math.sin(phi)];
};

export const createSparkAttributes = (
  count: number,
  rng: Rng,
): SparkAttributes => {
  const origin = new Float32Array(count * 3);
  const velocity = new Float32Array(count * 3);
  const delay = new Float32Array(count);
  const lifetime = new Float32Array(count);
  const size = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const escapes = rng() < ESCAPE_FRACTION;
    const speed = lerp(MIN_SPEED, MAX_SPEED, rng());
    const [dx, dy, dz] = randomDirection(rng);
    const scale = escapes ? speed * ESCAPE_SPEED_SCALE : speed;
    velocity.set([dx * scale, dy * scale, dz * scale], i * 3);
    lifetime[i] = lerp(MIN_LIFETIME, MAX_LIFETIME, rng());
    size[i] = lerp(MIN_SIZE, MAX_SIZE, rng());

    if (!escapes) continue;
    const angle = rng() * Math.PI * 2;
    const radius = Math.sqrt(rng()) * ESCAPE_RING_RADIUS;
    origin.set(
      [Math.cos(angle) * radius, ESCAPE_ORIGIN_Y, Math.sin(angle) * radius],
      i * 3,
    );
    delay[i] = lerp(MIN_ESCAPE_DELAY, MAX_ESCAPE_DELAY, rng());
  }

  return { origin, velocity, delay, lifetime, size };
};

// CPU mirror of the vertex shader formula: p = v*t + g*t²/2 (relative to the flame).
export const sparkPosition = (
  velocity: Vec3,
  t: number,
  gravity: Vec3 = SPARK_GRAVITY,
): Vec3 => [
  velocity[0] * t + 0.5 * gravity[0] * t * t,
  velocity[1] * t + 0.5 * gravity[1] * t * t,
  velocity[2] * t + 0.5 * gravity[2] * t * t,
];

// 1 at birth, 0 at the end of life; 0 outside [0, lifetime] (not born or already dead).
export const sparkFade = (t: number, lifetime: number): number => {
  if (t < 0 || t > lifetime) return 0;
  const remaining = 1 - t / lifetime;
  return remaining * remaining;
};
