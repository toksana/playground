'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import CustomShaderMaterial from 'three-custom-shader-material';
import type CSM from 'three-custom-shader-material/vanilla';
import { Color, MeshStandardMaterial } from 'three';
import type { CanvasTexture } from 'three';
import { CARVE_EXTENT, FRONT_THRESHOLD } from '@/lib/carve/projection';
import type { GlowRef } from '@/lib/carve/glow';
import { GLOW_COLOR } from '@/lib/carve/look';
import { carveFragmentShader, carveVertexShader } from './carveShader';
import { useGlowColor } from './useGlowColor';

interface CarveMaterialProps {
  mask: CanvasTexture;
  glow: GlowRef;
}

export const CarveMaterial = ({ mask, glow }: CarveMaterialProps) => {
  const material = useRef<CSM<typeof MeshStandardMaterial>>(null);
  const glowColor = useGlowColor();

  const uniforms = useMemo(
    () => ({
      uMask: { value: mask },
      uExtent: { value: CARVE_EXTENT },
      uFront: { value: FRONT_THRESHOLD },
      uGlow: { value: glow.current },
      uGlowColor: { value: new Color(GLOW_COLOR) },
    }),
    // Uniform values are updated in place below; only a new mask texture rebuilds them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mask],
  );

  useFrame(() => {
    if (material.current === null) return;
    material.current.uniforms.uGlow.value = glow.current;
    material.current.uniforms.uGlowColor.value.copy(glowColor);
  });

  return (
    <CustomShaderMaterial<typeof MeshStandardMaterial>
      ref={material}
      baseMaterial={MeshStandardMaterial}
      vertexShader={carveVertexShader}
      fragmentShader={carveFragmentShader}
      uniforms={uniforms}
      vertexColors
      roughness={0.55}
      metalness={0}
    />
  );
};
