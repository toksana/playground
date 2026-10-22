'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { ComponentProps } from 'react';
import { BackSide } from 'three';
import type { Material, Mesh, MeshStandardMaterial } from 'three';
import type { GlowRef } from '@/lib/carve/glow';
import {
  INNER_SHELL_COLOR,
  INNER_SHELL_SCALE,
  GLOW_COLOR,
} from '@/lib/carve/look';
import { useCarveMask } from '@/lib/carve/useCarveMask';
import { CarveMaterial } from './CarveMaterial';
import { useCarveDrawing } from './useCarveDrawing';

const PUMPKIN_URL = '/models/pumpkin.glb';

interface PumpkinGLTF {
  nodes: { PumpkinShell: Mesh; Stem: Mesh };
  materials: { PumpkinSkin: Material; Stem: Material };
}

interface PumpkinProps extends ComponentProps<'group'> {
  glow: GlowRef;
}

export const Pumpkin = ({ glow, ...props }: PumpkinProps) => {
  const { nodes, materials } = useGLTF(PUMPKIN_URL) as unknown as PumpkinGLTF;
  const mask = useCarveMask();
  const drawing = useCarveDrawing();
  const inner = useRef<MeshStandardMaterial>(null);

  useFrame(() => {
    if (inner.current !== null)
      inner.current.emissiveIntensity = glow.current * 2;
  });

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.PumpkinShell.geometry} {...drawing}>
        <CarveMaterial mask={mask.texture} glow={glow} />
      </mesh>
      <mesh geometry={nodes.PumpkinShell.geometry} scale={INNER_SHELL_SCALE}>
        <meshStandardMaterial
          ref={inner}
          side={BackSide}
          color={INNER_SHELL_COLOR}
          emissive={GLOW_COLOR}
        />
      </mesh>
      <mesh geometry={nodes.Stem.geometry} material={materials.Stem} />
    </group>
  );
};

useGLTF.preload(PUMPKIN_URL);
