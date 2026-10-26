import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { CARVE_EXTENT, localToCarveUV } from './projection';

describe('localToCarveUV', () => {
  it('maps the local origin to the mask centre', () => {
    const uv = localToCarveUV(0, 0);

    expect(uv).toEqual([0.5, 0.5]);
  });

  it('maps +/- extent to the mask edges', () => {
    const min = localToCarveUV(-CARVE_EXTENT, -CARVE_EXTENT);
    const max = localToCarveUV(CARVE_EXTENT, CARVE_EXTENT);

    expect(min).toEqual([0, 0]);
    expect(max).toEqual([1, 1]);
  });

  it('increases v with local y (up stays up)', () => {
    const y = faker.number.float({ min: 0.01, max: CARVE_EXTENT });

    const [, vUp] = localToCarveUV(0, y);
    const [, vDown] = localToCarveUV(0, -y);

    expect(vUp).toBeGreaterThan(vDown);
  });
});
