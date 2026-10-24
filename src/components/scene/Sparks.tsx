'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { ComponentProps } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  ShaderMaterial,
  Vector3,
} from 'three';
import type { PerspectiveCamera } from 'three';
import { GLOW_COLOR } from '@/lib/carve/look';
import {
  createSparkAttributes,
  SPARK_COUNT,
  SPARK_GRAVITY,
} from '@/lib/sparks/sparks';
import type { Phase } from '@/store/useCarveStore';
import { useCarveStore } from '@/store/useCarveStore';
import { sparksFragmentShader, sparksVertexShader } from './sparksShader';

const FLAME_COLOR = '#ffd27a';
// Until the first burst, `uStart` is far in the future so every spark is "not born yet".
const NOT_STARTED = 1e9;

const buildGeometry = (): BufferGeometry => {
  const { origin, velocity, delay, lifetime, size } = createSparkAttributes(
    SPARK_COUNT,
    Math.random,
  );
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(SPARK_COUNT * 3), 3),
  );
  geometry.setAttribute('aOrigin', new BufferAttribute(origin, 3));
  geometry.setAttribute('aVelocity', new BufferAttribute(velocity, 3));
  geometry.setAttribute('aDelay', new BufferAttribute(delay, 1));
  geometry.setAttribute('aLifetime', new BufferAttribute(lifetime, 1));
  geometry.setAttribute('aSize', new BufferAttribute(size, 1));
  return geometry;
};

const buildUniforms = () => ({
  uTime: { value: 0 },
  uStart: { value: NOT_STARTED },
  uScale: { value: 1 },
  uGravity: { value: new Vector3(...SPARK_GRAVITY) },
  uColorHot: { value: new Color(FLAME_COLOR) },
  uColorCool: { value: new Color(GLOW_COLOR) },
});

// One-shot burst of sparks from the flame when the candle gets lit.
export const Sparks = (props: ComponentProps<'points'>) => {
  const material = useRef<ShaderMaterial>(null);
  const lastPhase = useRef<Phase | null>(null);
  const geometry = useMemo(() => buildGeometry(), []);
  const uniforms = useMemo(() => buildUniforms(), []);

  useFrame(({ clock, camera, size, gl }) => {
    if (material.current === null) return;
    const { phase } = useCarveStore.getState();
    const current = material.current.uniforms;

    if (phase !== lastPhase.current) {
      if (phase === 'lighting') current.uStart.value = clock.elapsedTime;
      lastPhase.current = phase;
    }

    const { fov } = camera as PerspectiveCamera;
    const halfTan = Math.tan((fov * Math.PI) / 360);
    current.uTime.value = clock.elapsedTime;
    current.uScale.value = (size.height * gl.getPixelRatio()) / (2 * halfTan);
  });

  return (
    <points {...props} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={sparksVertexShader}
        fragmentShader={sparksFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
};
