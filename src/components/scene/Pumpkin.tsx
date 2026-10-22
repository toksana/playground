'use client';

import { useGLTF } from '@react-three/drei';
import type { ComponentProps } from 'react';
import { BackSide } from 'three';
import type { Material, Mesh } from 'three';
import {
  INNER_SHELL_COLOR,
  INNER_SHELL_SCALE,
  GLOW_COLOR,
} from '@/lib/carve/look';
import { useCarveMask } from '@/lib/carve/useCarveMask';
import { CarveMaterial } from './CarveMaterial';

const PUMPKIN_URL = '/models/pumpkin.glb';

interface PumpkinGLTF {
  nodes: { PumpkinShell: Mesh; Stem: Mesh };
  materials: { PumpkinSkin: Material; Stem: Material };
}

interface PumpkinProps extends ComponentProps<'group'> {
  glow?: number;
}

export const Pumpkin = ({ glow = 0, ...props }: PumpkinProps) => {
  const { nodes, materials } = useGLTF(PUMPKIN_URL) as unknown as PumpkinGLTF;
  const mask = useCarveMask();

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.PumpkinShell.geometry}>
        <CarveMaterial mask={mask.texture} glow={glow} />
      </mesh>
      <mesh geometry={nodes.PumpkinShell.geometry} scale={INNER_SHELL_SCALE}>
        <meshStandardMaterial
          side={BackSide}
          color={INNER_SHELL_COLOR}
          emissive={GLOW_COLOR}
          emissiveIntensity={glow * 2}
        />
      </mesh>
      <mesh geometry={nodes.Stem.geometry} material={materials.Stem} />
    </group>
  );
};

useGLTF.preload(PUMPKIN_URL);
