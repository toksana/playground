'use client';

import { Candle } from './Candle';
import { FitCamera } from './FitCamera';
import { Pumpkin } from './Pumpkin';

export const Scene = () => (
  <>
    <FitCamera />
    <ambientLight intensity={0.3} />
    <directionalLight position={[3, 4, 5]} intensity={2} />
    <Pumpkin />
    <Candle position={[0, -0.6, 0]} />
  </>
);
