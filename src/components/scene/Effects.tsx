'use client';

import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils } from 'three';
import type { BloomEffect } from 'postprocessing';
import type { GlowRef } from '@/lib/carve/glow';

const BLOOM_IDLE = 0.8;
const BLOOM_LIT = 2.0;

export const Effects = ({ glow }: { glow: GlowRef }) => {
  const bloom = useRef<BloomEffect>(null);

  useFrame(() => {
    if (bloom.current !== null)
      bloom.current.intensity = MathUtils.lerp(
        BLOOM_IDLE,
        BLOOM_LIT,
        glow.current,
      );
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        ref={bloom}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.2}
        intensity={BLOOM_IDLE}
        mipmapBlur
      />
      <Vignette offset={0.3} darkness={0.85} />
    </EffectComposer>
  );
};
