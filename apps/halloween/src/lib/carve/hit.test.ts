import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { hitToCarveUV } from './hit';
import { FRONT_THRESHOLD, localToCarveUV } from './projection';

describe('hitToCarveUV', () => {
  it('projects hits on front-facing faces', () => {
    const x = faker.number.float({ min: -0.5, max: 0.5 });
    const y = faker.number.float({ min: -0.5, max: 0.5 });

    const uv = hitToCarveUV(x, y, 0.9);

    expect(uv).toEqual(localToCarveUV(x, y));
  });

  it('rejects faces at or below the front threshold', () => {
    const atThreshold = hitToCarveUV(0, 0, FRONT_THRESHOLD);
    const sideways = hitToCarveUV(0, 0, 0);

    expect(atThreshold).toBeNull();
    expect(sideways).toBeNull();
  });

  it('rejects back-facing faces', () => {
    const uv = hitToCarveUV(0, 0, -0.8);

    expect(uv).toBeNull();
  });

  it('rejects hits without a face', () => {
    const uv = hitToCarveUV(0, 0, undefined);

    expect(uv).toBeNull();
  });
});
