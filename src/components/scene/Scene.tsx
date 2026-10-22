'use client';

import { useEffect } from 'react';
import { useCarveStore } from '@/store/useCarveStore';
import { Candle } from './Candle';
import { Effects } from './Effects';
import { FitCamera } from './FitCamera';
import { Pumpkin } from './Pumpkin';
import { useGlow } from './useGlow';
import { useIgnition } from './useIgnition';

const BACKGROUND = '#05060c';

// TEMPORARY (PLAN.md 1.6): there is no intro screen until 2.2, so start carving right away.
const useStartCarving = (): void =>
  useEffect(() => useCarveStore.getState().setPhase('carving'), []);

export const Scene = () => {
  useStartCarving();
  useIgnition();
  const glow = useGlow();

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <fogExp2 attach="fog" args={[BACKGROUND, 0.06]} />
      <FitCamera />
      <ambientLight intensity={0.15} color="#5a6a9a" />
      <directionalLight position={[-3, 4, 3]} intensity={0.9} color="#8fa8ff" />
      <Pumpkin glow={glow} />
      <Candle glow={glow} position={[0, -0.6, 0]} />
      <Effects glow={glow} />
    </>
  );
};
