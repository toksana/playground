import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import {
  advanceSchedule,
  BAT_COUNT,
  batPose,
  createSchedule,
  FLIGHT_SECONDS,
  flightProgress,
  MAX_GAP_SECONDS,
  MIN_GAP_SECONDS,
  nextGap,
  STAGGER_SECONDS,
} from './batPath';

const rng = () => faker.number.float({ min: 0, max: 1 });
const indices = Array.from({ length: BAT_COUNT }, (_, i) => i);

describe('nextGap', () => {
  it('stays within 8-15 seconds', () => {
    const gaps = faker.helpers.multiple(() => nextGap(rng), { count: 200 });

    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(MIN_GAP_SECONDS);
    expect(Math.max(...gaps)).toBeLessThanOrEqual(MAX_GAP_SECONDS);
  });
});

describe('flightProgress', () => {
  it('is 0 at the start of the first bat and 1 at the end of its flight', () => {
    const start = faker.number.float({ min: 0, max: 1000 });
    const schedule = createSchedule(start, rng);

    expect(flightProgress(start, schedule, 0)).toBe(0);
    expect(flightProgress(start + FLIGHT_SECONDS, schedule, 0)).toBe(1);
  });

  it('is null before takeoff and after landing', () => {
    const schedule = createSchedule(10, rng);

    expect(flightProgress(9, schedule, 0)).toBeNull();
    expect(flightProgress(10 + FLIGHT_SECONDS + 0.1, schedule, 0)).toBeNull();
  });

  it('staggers the bats', () => {
    const schedule = createSchedule(0, rng);

    const justAfterStart = indices.map((i) =>
      flightProgress(STAGGER_SECONDS / 2, schedule, i),
    );

    expect(justAfterStart[0]).not.toBeNull();
    expect(justAfterStart[1]).toBeNull();
  });
});

describe('advanceSchedule', () => {
  it('keeps the schedule until the pause after the last bat is over', () => {
    const schedule = createSchedule(0, rng);
    const lastLanding = (BAT_COUNT - 1) * STAGGER_SECONDS + FLIGHT_SECONDS;

    const advanced = advanceSchedule(schedule, lastLanding + 1, rng);

    expect(advanced).toBe(schedule);
  });

  it('starts a new round after the gap', () => {
    const schedule = createSchedule(0, rng);
    const cycleEnd =
      (BAT_COUNT - 1) * STAGGER_SECONDS + FLIGHT_SECONDS + schedule.gap;

    const advanced = advanceSchedule(schedule, cycleEnd + 0.01, rng);

    expect(advanced.cycleStart).toBeCloseTo(cycleEnd, 6);
    expect(flightProgress(cycleEnd + 0.01, advanced, 0)).not.toBeNull();
  });
});

describe('batPose', () => {
  it.each(indices)('bat %i emerges from behind the pumpkin', (index) => {
    const { position } = batPose(index, 0);

    expect(position[2]).toBeLessThan(-1);
  });

  it.each(indices)('bat %i loops in front of the pumpkin', (index) => {
    const zs = Array.from(
      { length: 50 },
      (_, i) => batPose(index, i / 49).position[2],
    );

    expect(Math.max(...zs)).toBeGreaterThan(1);
  });

  it.each(indices)('bat %i ends far away in the fog', (index) => {
    const { position } = batPose(index, 1);

    expect(position[2]).toBeLessThan(-7);
  });

  it.each(indices)('bat %i fades in and out', (index) => {
    const start = batPose(index, 0).scale;
    const middle = batPose(index, 0.5).scale;
    const end = batPose(index, 1).scale;

    expect(start).toBe(0);
    expect(middle).toBe(1);
    expect(end).toBe(0);
  });

  it('keeps the visible part of every flight inside the frame', () => {
    const progresses = Array.from({ length: 40 }, (_, i) => (i / 39) * 0.8);

    const xs = indices.flatMap((index) =>
      progresses.map((p) => Math.abs(batPose(index, p).position[0])),
    );

    expect(Math.max(...xs)).toBeLessThan(2.6);
  });
});
