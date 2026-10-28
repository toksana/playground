'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { ComponentProps } from 'react';
import type { Material, Mesh, PointLight } from 'three';
import { assetPath } from '@/lib/basePath';
import { flicker } from '@/lib/carve/flicker';
import type { GlowRef } from '@/lib/carve/glow';
import { useGlowColor } from './useGlowColor';

const CANDLE_URL = assetPath('/models/candle.glb');

// Position of the `FlameAnchor` node in candle.glb, for the flame mesh and pointLight.
export const FLAME_OFFSET: [number, number, number] = [0.006, 0.405, 0];

const LIGHT_INTENSITY = 6;
const LIGHT_DISTANCE = 4;
const FLAME_SIZE = 0.035;

interface CandleGLTF {
  nodes: { CandleBody: Mesh; Wick: Mesh };
  materials: { Wax: Material; Wick: Material };
}

interface CandleProps extends ComponentProps<'group'> {
  glow: GlowRef;
}

export const Candle = ({ glow, ...props }: CandleProps) => {
  const { nodes, materials } = useGLTF(CANDLE_URL) as unknown as CandleGLTF;
  const flame = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const glowColor = useGlowColor();

  useFrame(({ clock }) => {
    const level = glow.current * flicker(clock.elapsedTime);
    flame.current?.scale.set(level, level * 1.8, level);
    if (light.current !== null)
      light.current.intensity = LIGHT_INTENSITY * level;
  });

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.CandleBody.geometry} material={materials.Wax} />
      <mesh geometry={nodes.Wick.geometry} material={materials.Wick} />
      <mesh ref={flame} position={FLAME_OFFSET} scale={0}>
        <sphereGeometry args={[FLAME_SIZE, 16, 12]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </mesh>
      <pointLight
        ref={light}
        position={FLAME_OFFSET}
        color={glowColor}
        intensity={0}
        distance={LIGHT_DISTANCE}
      />
    </group>
  );
};

useGLTF.preload(CANDLE_URL);
