import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { toCanvasPoint } from './maskCanvas';

describe('toCanvasPoint', () => {
  it('flips v so that v = 1 is the top row of the canvas', () => {
    const size = faker.helpers.arrayElement([512, 1024]);

    const top = toCanvasPoint([0, 1], size);
    const bottom = toCanvasPoint([0, 0], size);

    expect(top).toEqual([0, 0]);
    expect(bottom).toEqual([0, size]);
  });

  it('scales u linearly with the mask size', () => {
    const size = faker.helpers.arrayElement([512, 1024]);

    const [x] = toCanvasPoint([0.25, 0.5], size);

    expect(x).toBe(size * 0.25);
  });
});
