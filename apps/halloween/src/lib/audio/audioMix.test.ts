import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { carveRate, carveVolume, phaseMix, strokeSpeed } from './audioMix';

describe('phaseMix', () => {
  it('plays ambient and no music while carving', () => {
    const mix = phaseMix('carving');

    expect(mix.ambient).toBeGreaterThan(0);
    expect(mix.music).toBe(0);
    expect(mix.crackle).toBe(0);
  });

  it('crossfades ambient out and music in on reveal', () => {
    const mix = phaseMix('reveal');

    expect(mix.ambient).toBe(0);
    expect(mix.music).toBeGreaterThan(0);
    expect(mix.crackle).toBeGreaterThan(0);
  });

  it('starts the crackle on lighting while ambient is still there', () => {
    const mix = phaseMix('lighting');

    expect(mix.crackle).toBeGreaterThan(0);
    expect(mix.ambient).toBeGreaterThan(0);
  });
});

describe('carve voice', () => {
  it('is silent when the pointer stands still', () => {
    const volume = carveVolume(0);

    expect(volume).toBe(0);
  });

  it('gets louder and faster with pointer speed, and saturates', () => {
    const slow = faker.number.float({ min: 0.05, max: 0.3 });
    const fast = faker.number.float({ min: 0.8, max: 1.4 });

    expect(carveVolume(fast)).toBeGreaterThan(carveVolume(slow));
    expect(carveRate(fast)).toBeGreaterThan(carveRate(slow));
    expect(carveVolume(1000)).toBe(carveVolume(2000));
    expect(carveVolume(1000)).toBe(0.3);
    expect(carveRate(1000)).toBe(1.4);
  });
});

describe('strokeSpeed', () => {
  it('is distance over time in seconds', () => {
    const speed = strokeSpeed([0, 0], [0.3, 0.4], 500);

    expect(speed).toBeCloseTo(1, 10);
  });

  it('is 0 when no time has passed', () => {
    const speed = strokeSpeed([0, 0], [0.3, 0.4], 0);

    expect(speed).toBe(0);
  });
});
