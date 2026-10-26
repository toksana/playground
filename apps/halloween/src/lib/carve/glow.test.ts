import { describe, expect, it } from 'vitest';
import { glowTarget } from './glow';

describe('glowTarget', () => {
  it.each(['intro', 'carving'] as const)('is 0 in %s', (phase) => {
    const target = glowTarget(phase);

    expect(target).toBe(0);
  });

  it.each(['lighting', 'reveal'] as const)('is 1 in %s', (phase) => {
    const target = glowTarget(phase);

    expect(target).toBe(1);
  });
});
