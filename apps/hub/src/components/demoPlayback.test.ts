import { describe, expect, it } from 'vitest';
import { playbackMode } from './demoPlayback';

describe('playbackMode', () => {
  it.each([
    { reducedMotion: false, canHover: true, expected: 'hover' },
    { reducedMotion: false, canHover: false, expected: 'visible' },
    { reducedMotion: true, canHover: true, expected: 'none' },
    { reducedMotion: true, canHover: false, expected: 'none' },
  ])(
    'reducedMotion=$reducedMotion canHover=$canHover -> $expected',
    ({ reducedMotion, canHover, expected }) => {
      const mode = playbackMode({ reducedMotion, canHover });

      expect(mode).toBe(expected);
    },
  );
});
