import { describe, expect, it } from 'vitest';
import { readMuted, writeMuted } from './mutePreference';

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
};

const throwingStorage = {
  getItem: (): string | null => {
    throw new Error('blocked');
  },
  setItem: (): void => {
    throw new Error('blocked');
  },
};

describe('mute preference', () => {
  it('defaults to unmuted when nothing is stored', () => {
    const muted = readMuted(memoryStorage());

    expect(muted).toBe(false);
  });

  it('round-trips the value', () => {
    const storage = memoryStorage();

    writeMuted(true, storage);

    expect(readMuted(storage)).toBe(true);
  });

  it('survives a storage that throws', () => {
    const read = () => readMuted(throwingStorage);
    const write = () => writeMuted(true, throwingStorage);

    expect(read()).toBe(false);
    expect(write).not.toThrow();
  });

  it('works without any storage', () => {
    const muted = readMuted(null);

    expect(muted).toBe(false);
  });
});
