'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

export const Scene = () => {
  const cube = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!cube.current) return;
    cube.current.rotation.x += delta * 0.4;
    cube.current.rotation.y += delta * 0.6;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <mesh ref={cube}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#ff7a1a" />
      </mesh>
    </>
  );
};
