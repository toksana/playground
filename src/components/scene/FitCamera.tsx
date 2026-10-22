'use client';

import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import type { PerspectiveCamera } from 'three';

// Half the widest/tallest extent to keep in frame, plus margin.
const FIT_RADIUS = 1.25;
const MIN_DISTANCE = 5;

// Pulls the camera back on narrow (portrait) viewports so the whole pumpkin stays visible.
// Temporary until the phase-based CameraRig (PLAN.md 2.2).
export const FitCamera = () => {
  useFrame(({ camera, size }) => {
    const { fov } = camera as PerspectiveCamera;
    const aspect = Math.min(1, size.width / size.height);
    const tanHalfFov = Math.tan(MathUtils.degToRad(fov / 2));
    camera.position.z = Math.max(
      MIN_DISTANCE,
      FIT_RADIUS / (tanHalfFov * aspect),
    );
  });

  return null;
};
