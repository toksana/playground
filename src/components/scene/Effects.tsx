'use client';

import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

export const Effects = () => (
  <EffectComposer multisampling={0}>
    <Bloom
      luminanceThreshold={0.6}
      luminanceSmoothing={0.2}
      intensity={0.8}
      mipmapBlur
    />
    <Vignette offset={0.3} darkness={0.85} />
  </EffectComposer>
);
