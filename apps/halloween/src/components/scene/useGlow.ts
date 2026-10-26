import { useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { damp } from 'maath/easing';
import { glowTarget } from '@/lib/carve/glow';
import type { GlowRef } from '@/lib/carve/glow';
import { useCarveStore } from '@/store/useCarveStore';

const GLOW_SMOOTH_TIME = 0.6;

// Glow level eased towards the current phase's target. Read `.current` inside useFrame.
export const useGlow = (): GlowRef => {
  const [glow] = useState<GlowRef>(() => ({ current: 0 }));

  useFrame((_, delta) => {
    const target = glowTarget(useCarveStore.getState().phase);
    damp(glow, 'current', target, GLOW_SMOOTH_TIME, delta);
  });

  return glow;
};
