'use client';

import { useGLTF } from '@react-three/drei';
import type { ComponentProps } from 'react';
import type { Material, Mesh } from 'three';

const CANDLE_URL = '/models/candle.glb';

// Position of the `FlameAnchor` node in candle.glb, for the flame mesh and pointLight.
export const FLAME_OFFSET: [number, number, number] = [0.006, 0.405, 0];

interface CandleGLTF {
  nodes: { CandleBody: Mesh; Wick: Mesh };
  materials: { Wax: Material; Wick: Material };
}

export const Candle = (props: ComponentProps<'group'>) => {
  const { nodes, materials } = useGLTF(CANDLE_URL) as unknown as CandleGLTF;

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.CandleBody.geometry} material={materials.Wax} />
      <mesh geometry={nodes.Wick.geometry} material={materials.Wick} />
    </group>
  );
};

useGLTF.preload(CANDLE_URL);
