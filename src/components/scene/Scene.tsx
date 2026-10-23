'use client';

import { Candle } from './Candle';
import { Effects } from './Effects';
import { CameraRig } from './CameraRig';
import { Pumpkin } from './Pumpkin';
import { useGlow } from './useGlow';
import { useIgnition } from './useIgnition';

const BACKGROUND = '#05060c';

export const Scene = () => {
  useIgnition();
  const glow = useGlow();

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <fogExp2 attach="fog" args={[BACKGROUND, 0.06]} />
      <CameraRig />
      <ambientLight intensity={0.15} color="#5a6a9a" />
      <directionalLight position={[-3, 4, 3]} intensity={0.9} color="#8fa8ff" />
      <Pumpkin glow={glow} />
      <Candle glow={glow} position={[0, -0.6, 0]} />
      <Effects glow={glow} />
    </>
  );
};
