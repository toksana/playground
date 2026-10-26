import { MathUtils } from 'three';
import type { Phase } from '@/store/useCarveStore';

export type Vec3 = [number, number, number];

// Half the widest/tallest extent to keep in frame, plus margin.
const FIT_RADIUS = 1.25;
const MIN_DISTANCE = 5;

const INTRO_DISTANCE_FACTOR = 1.5;
const INTRO_HEIGHT_FACTOR = 0.25;
const REVEAL_DISTANCE_FACTOR = 1.18;

// Distance at which the whole pumpkin fits; narrow (portrait) viewports need more.
export const fitDistance = (fovDegrees: number, aspect: number): number => {
  const tanHalfFov = Math.tan(MathUtils.degToRad(fovDegrees / 2));
  return Math.max(
    MIN_DISTANCE,
    FIT_RADIUS / (tanHalfFov * Math.min(1, aspect)),
  );
};

// Where the camera should sit in each phase; it always looks at the origin.
export const cameraTargetFor = (phase: Phase, distance: number): Vec3 => {
  switch (phase) {
    case 'intro':
      return [
        0,
        distance * INTRO_HEIGHT_FACTOR,
        distance * INTRO_DISTANCE_FACTOR,
      ];
    case 'reveal':
      return [0, 0, distance * REVEAL_DISTANCE_FACTOR];
    default:
      return [0, 0, distance];
  }
};
