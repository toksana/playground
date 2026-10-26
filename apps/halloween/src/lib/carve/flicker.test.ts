import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { flicker } from './flicker';

describe('flicker', () => {
  it('stays within [0.7, 1] for any time', () => {
    const times = faker.helpers.multiple(
      () => faker.number.float({ min: 0, max: 10_000 }),
      { count: 200 },
    );

    const values = times.map(flicker);

    expect(Math.min(...values)).toBeGreaterThanOrEqual(0.7);
    expect(Math.max(...values)).toBeLessThanOrEqual(1);
  });

  it('actually varies over time', () => {
    const values = [0, 0.1, 0.2, 0.3, 0.4].map(flicker);

    expect(new Set(values).size).toBeGreaterThan(1);
  });
});
