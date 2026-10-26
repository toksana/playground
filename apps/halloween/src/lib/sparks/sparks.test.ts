import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import {
  createSparkAttributes,
  sparkFade,
  sparkPosition,
  ESCAPE_ORIGIN_Y,
  SPARK_GRAVITY,
} from './sparks';
import type { Vec3 } from './sparks';

const seededRng = (seed: number) => {
  faker.seed(seed);
  return () => faker.number.float({ min: 0, max: 1 });
};

describe('createSparkAttributes', () => {
  it('allocates one entry per spark', () => {
    const count = faker.number.int({ min: 1, max: 200 });

    const { velocity, lifetime, size } = createSparkAttributes(
      count,
      seededRng(1),
    );

    expect(velocity).toHaveLength(count * 3);
    expect(lifetime).toHaveLength(count);
    expect(size).toHaveLength(count);
  });

  it('is deterministic for the same seed', () => {
    const seed = faker.number.int({ min: 1, max: 10_000 });

    const a = createSparkAttributes(50, seededRng(seed));
    const b = createSparkAttributes(50, seededRng(seed));

    expect(Array.from(a.velocity)).toEqual(Array.from(b.velocity));
    expect(Array.from(a.lifetime)).toEqual(Array.from(b.lifetime));
  });

  it('launches every spark upwards with a positive lifetime and size', () => {
    const { velocity, lifetime, size } = createSparkAttributes(
      200,
      seededRng(2),
    );

    const upward = Array.from({ length: 200 }, (_, i) => velocity[i * 3 + 1]);

    expect(Math.min(...upward)).toBeGreaterThan(0);
    expect(Math.min(...lifetime)).toBeGreaterThan(0);
    expect(Math.min(...size)).toBeGreaterThan(0);
  });
});

describe('escaping sparks', () => {
  it('starts a share of sparks at the top of the pumpkin, with a delay', () => {
    const count = 400;

    const { origin, delay } = createSparkAttributes(count, seededRng(3));

    const escaping = Array.from({ length: count }, (_, i) => i).filter(
      (i) => origin[i * 3 + 1] === Math.fround(ESCAPE_ORIGIN_Y),
    );
    expect(escaping.length / count).toBeGreaterThan(0.2);
    expect(escaping.length / count).toBeLessThan(0.5);
    expect(escaping.every((i) => delay[i] > 0)).toBe(true);
  });

  it('keeps the remaining sparks at the flame without delay', () => {
    const count = 400;

    const { origin, delay } = createSparkAttributes(count, seededRng(4));

    const inside = Array.from({ length: count }, (_, i) => i).filter(
      (i) => origin[i * 3 + 1] === 0,
    );
    expect(inside.length).toBeGreaterThan(0);
    expect(inside.every((i) => delay[i] === 0)).toBe(true);
  });
});

describe('sparkPosition', () => {
  it('starts at the flame', () => {
    const velocity: Vec3 = [
      faker.number.float({ min: -1, max: 1 }),
      faker.number.float({ min: 0.1, max: 1 }),
      faker.number.float({ min: -1, max: 1 }),
    ];

    const position = sparkPosition(velocity, 0);

    expect(position).toEqual([0, 0, 0]);
  });

  it('applies gravity on top of the linear motion', () => {
    const velocity: Vec3 = [0, 1, 0];
    const t = faker.number.float({ min: 0.1, max: 2 });

    const [, y] = sparkPosition(velocity, t);

    expect(y).toBeCloseTo(t + 0.5 * SPARK_GRAVITY[1] * t * t, 6);
  });
});

describe('sparkFade', () => {
  it('is 0 before birth and after death', () => {
    const lifetime = faker.number.float({ min: 0.5, max: 2 });

    expect(sparkFade(-0.1, lifetime)).toBe(0);
    expect(sparkFade(lifetime + 0.1, lifetime)).toBe(0);
  });

  it('is 1 at birth and decreases monotonically', () => {
    const lifetime = 1.5;

    const samples = [0, 0.3, 0.6, 0.9, 1.2, 1.5].map((t) =>
      sparkFade(t, lifetime),
    );

    expect(samples[0]).toBe(1);
    expect(samples).toEqual([...samples].sort((a, b) => b - a));
  });
});
