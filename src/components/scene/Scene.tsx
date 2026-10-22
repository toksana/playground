'use client';

import { Candle } from './Candle';
import { Effects } from './Effects';
import { FitCamera } from './FitCamera';
import { Pumpkin } from './Pumpkin';

const BACKGROUND = '#05060c';

export const Scene = () => (
  <>
    <color attach="background" args={[BACKGROUND]} />
    <fogExp2 attach="fog" args={[BACKGROUND, 0.06]} />
    <FitCamera />
    <ambientLight intensity={0.15} color="#5a6a9a" />
    <directionalLight position={[-3, 4, 3]} intensity={0.9} color="#8fa8ff" />
    <Pumpkin />
    <Candle position={[0, -0.6, 0]} />
    <Effects />
  </>
);
