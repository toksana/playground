import type { Point } from '@/lib/carve/strokes';
import type { Phase } from '@/store/useCarveStore';

export type Layer = 'ambient' | 'crackle' | 'music';

export const CROSSFADE_MS = 1500;
export const CRACKLE_FADE_MS = 1000;

export const LAYER_FADE_MS: Record<Layer, number> = {
  ambient: CROSSFADE_MS,
  music: CROSSFADE_MS,
  crackle: CRACKLE_FADE_MS,
};

// Target volume of each looping layer per phase. Before the intro tap nothing plays:
// the director only acts on phase changes, which start after the audio unlock.
export const phaseMix = (phase: Phase): Record<Layer, number> => {
  switch (phase) {
    case 'lighting':
      return { ambient: 0.3, crackle: 0.4, music: 0 };
    case 'reveal':
      return { ambient: 0, crackle: 0.25, music: 0.5 };
    default:
      return { ambient: 0.3, crackle: 0, music: 0 };
  }
};

const MAX_SPEED = 1.5; // mask units per second that count as "fast"
const MAX_CARVE_VOLUME = 0.6;
const MIN_RATE = 0.8;
const MAX_RATE = 1.4;

const unitSpeed = (speed: number): number =>
  Math.min(1, Math.max(0, speed / MAX_SPEED));

export const carveVolume = (speed: number): number =>
  unitSpeed(speed) * MAX_CARVE_VOLUME;

export const carveRate = (speed: number): number =>
  MIN_RATE + unitSpeed(speed) * (MAX_RATE - MIN_RATE);

// Pointer speed in mask units per second between two stroke points.
export const strokeSpeed = (a: Point, b: Point, elapsedMs: number): number =>
  elapsedMs <= 0
    ? 0
    : (Math.hypot(b[0] - a[0], b[1] - a[1]) / elapsedMs) * 1000;
