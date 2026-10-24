'use client';

import { Candle, FLAME_OFFSET } from './Candle';
import { Effects } from './Effects';
import { CameraRig } from './CameraRig';
import { Pumpkin } from './Pumpkin';
import { Sparks } from './Sparks';
import { useGlow } from './useGlow';
import { useIgnition } from './useIgnition';

const BACKGROUND = '#05060c';
const CANDLE_POSITION: [number, number, number] = [0, -0.6, 0];
const SPARKS_POSITION: [number, number, number] = [
  CANDLE_POSITION[0] + FLAME_OFFSET[0],
  CANDLE_POSITION[1] + FLAME_OFFSET[1],
  CANDLE_POSITION[2] + FLAME_OFFSET[2],
];

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
      <Candle glow={glow} position={CANDLE_POSITION} />
      <Sparks position={SPARKS_POSITION} />
      <Effects glow={glow} />
    </>
  );
};
