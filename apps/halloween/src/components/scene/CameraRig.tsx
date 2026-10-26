'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { damp3 } from 'maath/easing';
import { Vector3 } from 'three';
import type { PerspectiveCamera } from 'three';
import { cameraTargetFor, fitDistance } from '@/lib/camera/cameraTargets';
import type { Phase } from '@/store/useCarveStore';
import { useCarveStore } from '@/store/useCarveStore';

const SMOOTH_TIME = 0.25;
const SETTLED_DISTANCE = 0.02;
const POLAR_RANGE = 0.35;
const AZIMUTH_RANGE = 0.9;

const target = new Vector3();
const origin = new Vector3();

// Moves the camera to each phase's position. In reveal, hands over to OrbitControls once
// it has arrived (two controllers moving the same camera would fight).
export const CameraRig = () => {
  const [orbit, setOrbit] = useState(false);
  const lastPhase = useRef<Phase | null>(null);

  useFrame(({ camera, size }, delta) => {
    const { phase } = useCarveStore.getState();
    if (phase !== lastPhase.current) {
      lastPhase.current = phase;
      setOrbit(false);
    }
    if (phase === 'reveal' && orbit) return;

    const { fov } = camera as PerspectiveCamera;
    const distance = fitDistance(fov, size.width / size.height);
    target.set(...cameraTargetFor(phase, distance));
    damp3(camera.position, target, SMOOTH_TIME, delta);
    camera.lookAt(origin);

    if (
      phase === 'reveal' &&
      camera.position.distanceTo(target) < SETTLED_DISTANCE
    )
      setOrbit(true);
  });

  if (!orbit) return null;
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      enableDamping
      minPolarAngle={Math.PI / 2 - POLAR_RANGE}
      maxPolarAngle={Math.PI / 2 + POLAR_RANGE}
      minAzimuthAngle={-AZIMUTH_RANGE}
      maxAzimuthAngle={AZIMUTH_RANGE}
    />
  );
};
