'use client';

import { useGLTF } from '@react-three/drei';
import type { ComponentProps } from 'react';
import type { Material, Mesh } from 'three';

const PUMPKIN_URL = '/models/pumpkin.glb';

interface PumpkinGLTF {
  nodes: { PumpkinShell: Mesh; Stem: Mesh };
  materials: { PumpkinSkin: Material; Stem: Material };
}

export const Pumpkin = (props: ComponentProps<'group'>) => {
  const { nodes, materials } = useGLTF(PUMPKIN_URL) as unknown as PumpkinGLTF;

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.PumpkinShell.geometry}
        material={materials.PumpkinSkin}
      />
      <mesh geometry={nodes.Stem.geometry} material={materials.Stem} />
    </group>
  );
};

useGLTF.preload(PUMPKIN_URL);
