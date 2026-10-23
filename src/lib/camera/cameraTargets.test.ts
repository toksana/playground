import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { cameraTargetFor, fitDistance } from './cameraTargets';

describe('fitDistance', () => {
  it('pulls the camera back on portrait viewports', () => {
    const wide = fitDistance(40, 1.6);
    const portrait = fitDistance(40, 0.45);

    expect(portrait).toBeGreaterThan(wide);
  });

  it('never goes below the minimum distance', () => {
    const distance = fitDistance(faker.number.int({ min: 60, max: 120 }), 2);

    expect(distance).toBe(5);
  });
});

describe('cameraTargetFor', () => {
  const distance = faker.number.float({ min: 5, max: 12 });

  it('looks straight at the pumpkin while carving and lighting', () => {
    const carving = cameraTargetFor('carving', distance);
    const lighting = cameraTargetFor('lighting', distance);

    expect(carving).toEqual([0, 0, distance]);
    expect(lighting).toEqual(carving);
  });

  it('starts further away and higher in intro', () => {
    const [, introY, introZ] = cameraTargetFor('intro', distance);

    expect(introY).toBeGreaterThan(0);
    expect(introZ).toBeGreaterThan(distance);
  });

  it('pulls back in reveal', () => {
    const [x, y, z] = cameraTargetFor('reveal', distance);

    expect([x, y]).toEqual([0, 0]);
    expect(z).toBeGreaterThan(distance);
  });
});
